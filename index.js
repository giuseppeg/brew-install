#!/usr/bin/env node
const exec = require('child_process').execSync
const fetch = require('isomorphic-fetch')

const getPkgInfo = pkgName => fetch(`https://api.github.com/repos/Homebrew/homebrew-core/commits?path=Formula/${pkgName}.rb`)
const getFormulaUrl = (sha, pkgName) => `https://raw.githubusercontent.com/Homebrew/homebrew-core/${sha}/Formula/${pkgName}.rb`

const args = process.argv.slice(2)
const isLs = args[0] === '--ls'
const [pkgName, version] = isLs ? [args[1],] : args[0] ? args[0].split('@') : []

if (isLs && !pkgName) {
  console.error(`Called: brew-install --ls without providing a package name.`)
  console.error(`brew-install --ls nodejs`)
  process.exit(1)
} else {
  if (!pkgName) {
    console.error(`Called: brew-install without providing a package name.`)
    console.error(`brew-install node`)
    console.error(`brew-install node@10.0.0`)
    process.exit(1)
  }
}

(async function () {

const response = await getPkgInfo(pkgName)

if (!response.ok) {
  console.error(`Something went wrong: ${response.status} ${response.statusText}`)
  process.exit(1)
}

const history = await response.json()

if (isLs) {
  console.log(`Listing versions for: ${pkgName}`)

  const versions = history.map(entry => {
    const m = entry.commit.message.match(/update\s*([^\s]+)\s*bottle/)
    return m && m[1]
  }).filter(Boolean)

  console.log(versions.join("\n"))
  process.exit(0)
}

console.log(`Installing ${pkgName} ${version||''}`)

if (!version) {
  try {
    exec(`brew install ${pkgName}`, { stdio: 'inherit' })
  } catch (error) {
    console.log(error.message)
  }
  process.exit(0)
}

const formula = history.find(entry => {
  return entry.commit.message.includes(`update ${version} bottle`)
})

if (!formula) {
  console.error(`Couldn't find a Formula for ${pkgName}@${version}`)
  process.exit(1)
}

try {
  exec(`brew install ${getFormulaUrl(formula.sha, pkgName)}`, { stdio: 'inherit' })
} catch (error) {
  console.log(error.message)
}
process.exit(0)

}())

