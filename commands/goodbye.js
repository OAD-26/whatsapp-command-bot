// commands/goodbye.js

const fs = require("fs");
const path = require("path");

module.exports = {
    name: "goodbye",
    description: "Enable or disable goodbye messages in a group (owner only)",
    ownerOnly: true,
    execute: async (sock, msg, text) => {
        const jid = msg.key.remoteJid;

        // Only work in groups
        if (!jid.endsWith("@g.us")) {
            return await sock.sendMessage(jid, { text: "❌ This command is for groups only." }, { quoted: msg });
        }

        // Validate input
        if (!text || !["on", "off"].includes(text.toLowerCase())) {
            return await sock.sendMessage(jid, { text: "❌ Usage: .goodbye on/off" }, { quoted: msg });
        }

        const dataFile = path.join(__dirname, "..", "data", "welcomer.json");
        let welcomerData = {};
        if (fs.existsSync(dataFile)) {
            welcomerData = JSON.parse(fs.readFileSync(dataFile));
        }

        if (text.toLowerCase() === "on") {
            welcomerData[jid] = welcomerData[jid] || {};
            welcomerData[jid].goodbye = true;
            await sock.sendMessage(jid, { text: "✅ Goodbye messages enabled!" }, { quoted: msg });
        } else {
            if (welcomerData[jid]) welcomerData[jid].goodbye = false;
            await sock.sendMessage(jid, { text: "✅ Goodbye messages disabled!" }, { quoted: msg });
        }

        fs.writeFileSync(dataFile, JSON.stringify(welcomerData, null, 2));
    }
};
