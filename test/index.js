const Test = require("./dist/core");

if (!Test) console.error("Failed to load.");
else console.info("Run test succeeded.");

module.exports = Test;
