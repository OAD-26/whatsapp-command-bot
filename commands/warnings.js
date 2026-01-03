const fs = require('fs');
const filePath = './data/warnings.json';

module.exports = {
    name: 'warnings',
    description: 'Add or reset warnings for a user (owner only)',
    ownerOnly: true,
    execute: async (sock, msg, text) => {
        const jid = msg.key.remoteJid;
        if (!text) return sock.sendMessage(jid, { text: '❌ Usage: .warnings <add/reset> <number>' }, { quoted: msg });

        const [action, number] = text.split(' ');
        if (!action || !number || !['add','reset'].includes(action.toLowerCase()))
            return sock.sendMessage(jid, { text: '❌ Usage: .warnings <add/reset> <number>' }, { quoted: msg });

        let data = JSON.parse(fs.readFileSync(filePath));
        if (action.toLowerCase() === 'add') {
            data[number] = (data[number] || 0) + 1;
        } else {
            data[number] = 0;
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        await sock.sendMessage(jid, { text: `✅ Warnings ${action.toLowerCase()}ed for ${number}` }, { quoted: msg });
    }
};
