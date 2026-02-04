#!/usr/bin/env node
/**
 * Сборка подпутей (core/crud, core/query, ...) в отдельные чанки в dist.
 * Результат: минифицированные файлы в dist/core/*.js и dist/adapters/*.js,
 * без необходимости класть src в npm-пакет.
 */
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const distCore = path.join(root, 'dist', 'core')
const distAdapters = path.join(root, 'dist', 'adapters')

const entries = [
  { input: 'src/core/crud/index.js', output: 'dist/core/crud' },
  { input: 'src/core/utils/index.js', output: 'dist/core/utils' },
  { input: 'src/core/query/index.js', output: 'dist/core/query' },
  { input: 'src/core/meta/index.js', output: 'dist/core/meta' },
  { input: 'src/core/error/index.js', output: 'dist/core/error' },
  { input: 'src/core/pubsub/index.js', output: 'dist/core/pubsub' },
  { input: 'src/core/validation/index.js', output: 'dist/core/validation' },
  { input: 'src/core/roles/index.js', output: 'dist/core/roles' },
  { input: 'src/adapters/antd/index.js', output: 'dist/adapters/antd', external: 'antd,@ant-design/icons,@ant-design' },
  { input: 'src/adapters/antd-mobile/index.js', output: 'dist/adapters/antd-mobile', external: 'antd-mobile' },
  { input: 'src/adapters/material-ui/index.js', output: 'dist/adapters/material-ui' },
  { input: 'src/adapters/chakra-ui/index.js', output: 'dist/adapters/chakra-ui' },
  { input: 'src/adapters/tailwind-ui/index.js', output: 'dist/adapters/tailwind-ui' },
  { input: 'src/adapters/UIContext.js', output: 'dist/adapters/UIContext' },
  { input: 'src/adapters/UIAdapter.js', output: 'dist/adapters/UIAdapter' }
]

function mkdirSyncRecursive(dir) {
  const parts = path.relative(root, dir).split(path.sep)
  let current = root
  for (const p of parts) {
    current = path.join(current, p)
    try {
      fs.mkdirSync(current, { recursive: true })
    } catch (err) {
      if (err.code !== 'EEXIST') throw err
    }
  }
}

mkdirSyncRecursive(distCore)
mkdirSyncRecursive(distAdapters)

const baseArgs = '--no-css-modules --format modern,cjs'
const pkgName = 'fennec-core' // microbundle всегда использует имя пакета из package.json

for (const { input, output, external } of entries) {
  const inputPath = path.join(root, input)
  const outputPath = path.join(root, output)
  const outputDir = path.join(root, output)
  const outputParent = path.dirname(outputDir)
  const baseName = path.basename(outputDir)

  const externalArg = external ? `--external "${external}"` : ''
  console.log(`Building ${input} -> ${baseName}.js / ${baseName}.modern.js`)
  try {
    execSync(
      `npx microbundle-crl -i "${inputPath}" -o "${outputPath}" ${baseArgs} ${externalArg}`,
      { stdio: 'inherit', cwd: root, shell: true }
    )

    // microbundle создаёт файлы с именем пакета (fennec-core.js); переименовываем в baseName
    const builtDir = outputDir
    const cjsSrc = path.join(builtDir, `${pkgName}.js`)
    const modernSrc = path.join(builtDir, `${pkgName}.modern.js`)
    const cjsDest = path.join(outputParent, `${baseName}.js`)
    const modernDest = path.join(outputParent, `${baseName}.modern.js`)

    if (fs.existsSync(cjsSrc)) fs.renameSync(cjsSrc, cjsDest)
    if (fs.existsSync(modernSrc)) fs.renameSync(modernSrc, modernDest)

    // Остальные файлы (например .map) — переименовать pkgName -> baseName и переместить
    if (fs.existsSync(builtDir)) {
      const remaining = fs.readdirSync(builtDir)
      remaining.forEach(f => {
        const full = path.join(builtDir, f)
        if (!fs.statSync(full).isFile()) return
        const newName = f.replace(new RegExp(`^${pkgName}\\.`), `${baseName}.`)
        fs.renameSync(full, path.join(outputParent, newName))
      })
      fs.rmdirSync(builtDir, { recursive: true })
    }
  } catch (err) {
    console.error(`Failed: ${input}`)
    process.exit(1)
  }
}

console.log('Subpath build done.')
