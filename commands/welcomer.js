const fs = require("fs");
const path = require("path");

const welcomerDataFile = path.join(__dirname, "..", "data", "welcomer.json");
let welcomerData = {};
if (fs.existsSync(welcomerDataFile)) {
    welcomerData = JSON.parse(fs.readFileSync(welcomerDataFile));
}

module.exports = {
    name: "welcomer",
    description: "Enable/disable welcome/goodbye messages & check status (group only)",
    async execute(sock, msg, text) {
        const jid = msg.key.remoteJid;

        // Ensure command is used in a group
        if (!jid.endsWith("@g.us")) {
            return await sock.sendMessage(jid, { text: "❌ This command is only for groups." }, { quoted: msg });
        }

        // Check if sender is group admin
        const groupMetadata = await sock.groupMetadata(jid);
        const participants = groupMetadata.participants;
        const sender = msg.key.participant;
        const isAdmin = participants.find(p => p.id === sender)?.admin !== null;

        if (!isAdmin) {
            return await sock.sendMessage(jid, { text: "❌ Only group admins can use this command." }, { quoted: msg });
        }

        // Initialize group data if not exist
        if (!welcomerData[jid]) welcomerData[jid] = { welcome: false, goodbye: false };

        const cmd = text?.trim()?.toLowerCase();

        // Show status
        if (cmd === "status") {
            return await sock.sendMessage(jid, {
                text: `📊 Welcome & Goodbye settings for *${groupMetadata.subject}*:\n\n✅ Welcome: ${welcomerData[jid].welcome}\n✅ Goodbye: ${welcomerData[jid].goodbye}`
            }, { quoted: msg });
        }

        // Toggle welcome/goodbye
        if (!["welcome-on","welcome-off","goodbye-on","goodbye-off"].includes(cmd)) {
            return await sock.sendMessage(jid, {
                text: "❌ Usage:\n.welcomer welcome-on\n.welcomer welcome-off\n.welcomer goodbye-on\n.welcomer goodbye-off\n.welcomer status"
            }, { quoted: msg });
        }

        switch (cmd) {
            case "welcome-on":
                welcomerData[jid].welcome = true;
                break;
            case "welcome-off":
                welcomerData[jid].welcome = false;
                break;
            case "goodbye-on":
                welcomerData[jid].goodbye = true;
                break;
            case "goodbye-off":
                welcomerData[jid].goodbye = false;
                break;
        }

        fs.writeFileSync(welcomerDataFile, JSON.stringify(welcomerData, null, 2));

        await sock.sendMessage(jid, {
            text: `✅ Updated settings for *${groupMetadata.subject}*:\nWelcome: ${welcomerData[jid].welcome}\nGoodbye: ${welcomerData[jid].goodbye}`
        }, { quoted: msg });
    }
};
