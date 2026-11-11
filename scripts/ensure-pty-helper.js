const fs = require("fs");
const path = require("path");

const prebuilds = path.join(__dirname, "..", "node_modules", "node-pty", "prebuilds");
if (!fs.existsSync(prebuilds)) {
    process.exit(0);
}

for (const entry of fs.readdirSync(prebuilds)) {
    const helper = path.join(prebuilds, entry, "spawn-helper");
    if (fs.existsSync(helper)) {
        fs.chmodSync(helper, 0o755);
    }
}
