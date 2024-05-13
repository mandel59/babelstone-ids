import process from "node:process"
import fs from "node:fs/promises"

async function main() {
    const re = /^(?:(U\+[0-9A-F]{4,5})\t(.)\t(.*)|#.*|\s*)$/u
    const reIds = /^\^([^()]+)\$\((UCS2003|(?:\[[A-Z]*\])|[A-Z])*\)$/u
    let errorCount = 0
    for (const arg of process.argv.slice(2)) {
        const txtFile = await fs.readFile(arg, "utf8")
        txtFile.split(/\r?\n/).forEach((line, index) => {
            const lineNumber = index + 1
            const m = line.match(re)
            if (!m) {
                console.error(`${arg}:${lineNumber} not match`)
                errorCount++
                return
            }
            if (!m[1]) {
                // skip comment
                return
            }
            const idsList = m[3].split("\t")
            idsList.forEach((ids, idsIndex) => {
                if (ids[0] === "*") {
                    // skip comment
                    return
                }
                const mIds = ids.match(reIds)
                if (!mIds) {
                    console.error(`${arg}:${lineNumber} IDS ${idsIndex} not match: ${reIds} ${JSON.stringify(ids)}`)
                    errorCount++
                    return
                }
            })
        })
    }
    if (errorCount > 0) {
        process.exit(1)
    }
}

await main()
 