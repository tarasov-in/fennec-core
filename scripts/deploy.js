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
  console.log('Bumped version to', newVersion)
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

/** Удаляет блоки <think>...</think> из ответа модели, оставляя только финальный ответ */
function stripThinkBlocks(text) {
  if (typeof text !== 'string') return text
  return text
    .replace(/\s*<think>[\s\S]*?<\/think>\s*/gi, ' ')
    .trim()
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
  raw = stripThinkBlocks(raw)
  return sanitizeCommitMessage(raw)
}

async function main() {
  console.log('Running npm run build...')
  run('npm run build', { stdio: 'inherit' })

  const diffForMessage = getWorkingDiff()

  bumpPatchVersion()

  console.log('Running git add .')
  run('git add .')

  const staged = getStagedDiff()
  if (!staged || !staged.trim()) {
    console.log('No staged changes. Nothing to commit.')
    process.exit(0)
  }

  console.log('Generating commit message via Ollama...')
  let message
  try {
    message = diffForMessage.trim()
      ? await generateCommitMessage(diffForMessage)
      : 'Bump patch version'
  } catch (err) {
    console.error('Ollama error:', err.message)
    process.exit(1)
  }

  console.log('Commit message:', message)
  const escaped = message.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  run(`git commit -m "${escaped}"`, { stdio: 'inherit' })

  console.log('Running git push...')
  run('git push', { stdio: 'inherit' })

  console.log('Deploy done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
