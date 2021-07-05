#!/usr/local/bin/node

const fs = require("fs");
const child_process = require("child_process");

function getConfigs() {
    let data = fs.readFileSync("configs.json");
    return JSON.parse(data);
}

function log(extensionName, content) {
    fs.mkdirSync("logs", { recursive: true });
    fs.writeFile(
        `logs/${extensionName}.log`,
        content,
        { flag: "a+" },
        (_) => {}
    );
}

function extractStreamString(stream) {
    let chunks = [];
    let chunk = null;
    while ((chunk = stream.read()) !== null) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

(() => {
    if (process.argv.length < 3) {
        console.error("Error: must be called by a browser extension!");
        process.exit(1);
    }
    // Get extension info
    let origin = process.argv[2];
    let extensionConfig = getConfigs()[origin];
    let extensionName = extensionConfig.name;
    let originalApp = extensionConfig.originalApp;
    // Spawn redirect script process
    let p = child_process.spawn(originalApp);
    // Start logging
    let i = 0;
    process.stdin.on("readable", () => {
        let input = extractStreamString(process.stdin);
        log(extensionName, `[${++i}] → (EXTENSION): ${input}\n\n`);
        p.stdin.write(input);
    });
    p.stdout.on("readable", () => {
        let output = extractStreamString(p.stdout);
        log(extensionName, `[${++i}] ← (APP): ${output}\n\n`);
        process.stdout.write(output);
    });
})();
