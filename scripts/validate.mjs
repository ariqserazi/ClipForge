import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"

const root = path.resolve(process.cwd())
const requiredFiles = [
  "AGENTS.md",
  ".debug",
  ".gitignore",
  "CSXS/manifest.xml",
  "assets/icons/icon-dark.svg",
  "assets/icons/icon-light.svg",
  "index.html",
  "jsx/clipforge-host.jsx",
  "lib/CSInterface.js",
  "package.json",
  "README.md",
  "LICENSE",
  "scripts/validate.mjs",
  "src/main.js",
  "src/styles.css"
]

for (const relativeFile of requiredFiles) {
  const absoluteFile = path.join(root, relativeFile)
  if (!fs.existsSync(absoluteFile)) {
    throw new Error(`Missing required file: ${relativeFile}`)
  }
}

JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"))

const manifestXml = fs.readFileSync(path.join(root, "CSXS/manifest.xml"), "utf8")
if (!manifestXml.includes("ClipForge")) {
  throw new Error("manifest.xml must contain the ClipForge extension name.")
}

if (!manifestXml.includes("--enable-nodejs")) {
  throw new Error("manifest.xml must enable Node with --enable-nodejs.")
}

const mainJs = fs.readFileSync(path.join(root, "src/main.js"), "utf8")
if (!mainJs.includes("child_process")) {
  throw new Error("src/main.js must use Node child_process.")
}

const hostJsx = fs.readFileSync(path.join(root, "jsx/clipforge-host.jsx"), "utf8")
if (!hostJsx.includes("importFiles")) {
  throw new Error("jsx/clipforge-host.jsx must contain an importFiles function.")
}

for (const file of [
  "scripts/validate.mjs",
  "scripts/zip.mjs",
  "lib/CSInterface.js",
  "src/main.js"
]) {
  const result = spawnSync(process.execPath, ["--check", path.join(root, file)], {
    encoding: "utf8"
  })

  if (result.status !== 0) {
    throw new Error(`Syntax check failed for ${file}\n${result.stderr}`)
  }
}

console.log("ClipForge validation passed.")
