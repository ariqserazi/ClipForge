import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"

const root = path.resolve(process.cwd())
const parent = path.dirname(root)
const projectName = path.basename(root)
const distDir = path.join(root, "dist")
const zipPath = path.join(distDir, `${projectName}.zip`)

fs.mkdirSync(distDir, { recursive: true })

if (fs.existsSync(zipPath)) {
  fs.rmSync(zipPath, { force: true })
}

const result = spawnSync("ditto", [
  "-c",
  "-k",
  "--sequesterRsrc",
  "--keepParent",
  projectName,
  zipPath
], {
  cwd: parent,
  encoding: "utf8"
})

if (result.status !== 0) {
  throw new Error(result.stderr || result.stdout || "Could not create distributable zip with ditto.")
}

console.log(`Created ${zipPath}`)
