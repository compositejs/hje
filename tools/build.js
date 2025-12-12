const fs = require("node:fs/promises");

async function mergeFiles(input, output, comment) {
    const arr = comment ? [`// ${comment}`] : [];
    const encoding = { encoding: "utf8" };
    for (let i = 0; i < input.length; i++) {
        const item = await fs.readFile(input[i], encoding);
        arr.push(item);
    }

    const s = arr.join("\n");
    if (typeof output === "string") output = [output];
    for (let i = 0; i < output.length; i++) {
        await fs.writeFile(output[i], s, encoding);
    }
}

mergeFiles(["./dist/index.js", "./dist/mdblogs.js"], "./docs/js/mdblogs.js", "Hje + MdBlogs");
