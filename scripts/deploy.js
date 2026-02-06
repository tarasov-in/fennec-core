#!/usr/bin/env node
/**
 * Deploy: build → git add → commit (message from LLM) → push.
 * Сообщение коммита формируется локальной Ollama (qwen3:4b) по diff.
 */
const { execSync } = require('child_process')
const fs = require('fs')
const http = require('http')
const path = require('path')

// --- Конфигурация (переменные вверху скрипта) ---
const OLLAMA_MODEL = 'qwen3:4b'
const OLLAMA_BASE_URL = 'http://localhost:11434'
const OLLAMA_SYSTEM_PROMPT = `Ты помощник для формирования сообщений коммита. По переданному diff сформируй одно короткое сообщение для git commit на английском. Сообщение должно быть не длиннее 15 слов. Выведи только текст сообщения, без кавычек и пояснений.`

/** Максимальная длина diff в символах (отсечение при переполнении контекста модели) */
const MAX_DIFF_CHARS = 20000

const root = path.join(__dirname, '..')

const Reset = "\x1b[0m"
const Bright = "\x1b[1m"
const Dim = "\x1b[2m"
const Underscore = "\x1b[4m"
const Blink = "\x1b[5m"
const Reverse = "\x1b[7m"
const Hidden = "\x1b[8m"

const FgBlack = "\x1b[30m"
const FgRed = "\x1b[31m"
const FgGreen = "\x1b[32m"
const FgYellow = "\x1b[33m"
const FgBlue = "\x1b[34m"
const FgMagenta = "\x1b[35m"
const FgCyan = "\x1b[36m"
const FgWhite = "\x1b[37m"
const FgGray = "\x1b[90m"

const BgBlack = "\x1b[40m"
const BgRed = "\x1b[41m"
const BgGreen = "\x1b[42m"
const BgYellow = "\x1b[43m"
const BgBlue = "\x1b[44m"
const BgMagenta = "\x1b[45m"
const BgCyan = "\x1b[46m"
const BgWhite = "\x1b[47m"
const BgGray = "\x1b[100m"

function color(color, text) {
  return `${color}${text}${Reset}`
}
// console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan
// console.log('\x1b[33m%s\x1b[0m', stringToMakeYellow);  //yellow

function run(cmd, options = {}) {
  return execSync(cmd, { encoding: 'utf8', cwd: root, ...options })
}

/** Инкрементирует номер патча в package.json (например 2.3.0 → 2.3.1) */
function bumpPatchVersion() {
  const pkgPath = path.join(root, 'package.json')
  const raw = fs.readFileSync(pkgPath, 'utf8')
  const versionMatch = raw.match(/"version":\s*"([^"]+)"/)
  if (!versionMatch) return
  const parts = versionMatch[1].split('.')
  const patch = parseInt(parts[parts.length - 1], 10) || 0
  parts[parts.length - 1] = String(patch + 1)
  const newVersion = parts.join('.')
  const newRaw = raw.replace(/"version":\s*"[^"]+"/, `"version": "${newVersion}"`)
  fs.writeFileSync(pkgPath, newRaw, 'utf8')
  console.log('Bumped version to', color(FgCyan, newVersion))
}

/** Diff до любых операций скрипта (рабочая копия + индекс), для сообщения коммита */
function getWorkingDiff() {
  try {
    const staged = run('git diff --cached')
    const unstaged = run('git diff')
    return (staged + '\n' + unstaged).trim()
  } catch (e) {
    return ''
  }
}

function getStagedDiff() {
  try {
    return run('git diff --cached')
  } catch (e) {
    return ''
  }
}

function truncate(str, maxChars) {
  if (typeof str !== 'string' || str.length <= maxChars) return str
  return str.slice(0, maxChars) + '\n\n... [truncated]\n'
}

/**
 * Утилиты для работы с блоками размышлений (thinking blocks).
 * Поддерживает удаление различных форматов:
 * - <think>...</think> (Qwen, Claude)
 * - <thinking>...</thinking>
 * - <reasoning>...</reasoning>
 * - [thinking]...[/thinking]
 * - <thought>...</thought>
 * - <internal_reasoning>...</internal_reasoning>
 */
const THINKING_BLOCK_PATTERNS = [
  /<think>[\s\S]*?<\/think>/gi,
  /<thinking>[\s\S]*?<\/thinking>/gi,
  /<reasoning>[\s\S]*?<\/reasoning>/gi,
  /\[thinking][\s\S]*?\[\/thinking]/gi,
  /<thought>[\s\S]*?<\/thought>/gi,
  /<internal_reasoning>[\s\S]*?<\/internal_reasoning>/gi
]

function removeThinkingBlocks(text) {
  if (text == null) return ''
  if (typeof text !== 'string') text = String(text)
  if (!text) return ''
  let result = text
  for (const pattern of THINKING_BLOCK_PATTERNS) {
    result = result.replace(pattern, ' ')
  }
  return result.replace(/\s+/g, ' ').trim()
}

function hasThinkingBlocks(text) {
  if (text == null) return false
  if (typeof text !== 'string') text = String(text)
  if (!text) return false
  return /<think>|<thinking>|<reasoning>|\[thinking]|<thought>|<internal_reasoning>/i.test(text)
}

function sanitizeCommitMessage(msg) {
  if (typeof msg !== 'string') return 'Update'
  return msg.replace(/\r?\n/g, ' ').trim().slice(0, 200) || 'Update'
}

function ollamaGenerate(body) {
  const url = new URL(`${OLLAMA_BASE_URL}/api/generate`)
  const payload = JSON.stringify(body)
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port || 80,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      },
      (res) => {
        let data = ''
        res.on('data', (ch) => { data += ch })
        res.on('end', () => {
          try {
            resolve(JSON.parse(data))
          } catch (e) {
            reject(new Error('Invalid Ollama response'))
          }
        })
      }
    )
    req.on('error', reject)
    req.write(payload)
    req.end()
  })
}

async function generateCommitMessage(diff) {
  const truncatedDiff = truncate(diff, MAX_DIFF_CHARS)
  const prompt = `Diff изменений для коммита:\n\n${truncatedDiff}`

  const data = await ollamaGenerate({
    model: OLLAMA_MODEL,
    prompt,
    system: OLLAMA_SYSTEM_PROMPT,
    stream: false
  })

  let raw = (data.response || '').trim()
  raw = removeThinkingBlocks(raw)
  return sanitizeCommitMessage(raw)
}

async function main() {
  console.log(color(FgGray,'Running npm run build...'))
  run('npm run build', { stdio: 'inherit' })

  const diffForMessage = getWorkingDiff()

  bumpPatchVersion()

  console.log(color(FgGray,'Running git add .'))
  run('git add .')

  const staged = getStagedDiff()
  if (!staged || !staged.trim()) {
    console.log('No staged changes. Nothing to commit.')
    process.exit(0)
  }

  console.log(color(FgGray,'Generating commit message via Ollama...'))
  let message
  try {
    message = diffForMessage.trim()
      ? await generateCommitMessage(diffForMessage)
      : 'Bump patch version'
  } catch (err) {
    console.error('Ollama error:', err.message)
    process.exit(1)
  }

  console.log('Commit message:', color(FgCyan, message))
  const escaped = message.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  run(`git commit -m "${escaped}"`, { stdio: 'inherit' })

  console.log(color(FgGray,'Running git push...'))
  run('git push', { stdio: 'inherit' })

  console.log(color(FgGreen,'Deploy done.'))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
