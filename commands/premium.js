const fs = require('fs');
const filePath = './data/premium.json';

module.exports = {
    name: 'premium',
    description: 'Add or remove premium users (owner only)',
    ownerOnly: true,
    execute: async (sock, msg, text) => {
        const jid = msg.key.remoteJid;
        if (!text) return sock.sendMessage(jid, { text: '❌ Usage: .premium <add/remove> <number>' }, { quoted: msg });

        const [action, number] = text.split(' ');
        if (!action || !number || !['add','remove'].includes(action.toLowerCase()))
            return sock.sendMessage(jid, { text: '❌ Usage: .premium <add/remove> <number>' }, { quoted: msg });

        let data = JSON.parse(fs.readFileSync(filePath));
        if (action.toLowerCase() === 'add') {
            if (!data[number]) data[number] = true;
        } else {
            delete data[number];
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        await sock.sendMessage(jid, { text: `✅ Premium ${action.toLowerCase()}ed for ${number}` }, { quoted: msg });
    }
};
