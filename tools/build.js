const fs = require("node:fs/promises");

const strict = "\"use strict\";";

async function mergeFiles(input, output, comment) {
    const arr = comment ? [`// ${comment}`] : [];
    arr.push(strict);
    const encoding = { encoding: "utf8" };
    for (let i = 0; i < input.length; i++) {
        let item = await fs.readFile(input[i], encoding);
        if (!item) continue;
        if (typeof item === "string" && item.indexOf(strict) === 0) item = item.replace(strict, "");
        arr.push(item);
    }

    const s = arr.join("\n");
    if (typeof output === "string") output = [output];
    for (let i = 0; i < output.length; i++) {
        await fs.writeFile(output[i], s, encoding);
    }
}

mergeFiles(["./dist/index.js", "./dist/mdblogs.js"], "./docs/js/mdblogs.js", "Hje + MdBlogs");
