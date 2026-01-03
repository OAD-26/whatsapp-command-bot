const fs = require("fs");
const path = require("path");

// File to store group settings
const dataFile = path.join(__dirname, "..", "data", "antilink.json");

// Load existing data or initialize empty object
let antilinkData = {};
if (fs.existsSync(dataFile)) {
    antilinkData = JSON.parse(fs.readFileSync(dataFile));
}

module.exports = {
    name: "antilink",
    description: "Turn anti-link on/off in a group (owner only)",
    ownerOnly: true, // Only owners can toggle
    execute: async (sock, msg, text) => {
        const jid = msg.key.remoteJid;

        if (!text || !["on", "off"].includes(text.toLowerCase()))
            return sock.sendMessage(jid, { text: "❌ Usage: .antilink <on/off>" }, { quoted: msg });

        const status = text.toLowerCase() === "on";
        antilinkData[jid] = status;

        fs.writeFileSync(dataFile, JSON.stringify(antilinkData, null, 2));

        await sock.sendMessage(jid, { text: `✅ Anti-link is now ${status ? "ON" : "OFF"}` }, { quoted: msg });
    }
};
