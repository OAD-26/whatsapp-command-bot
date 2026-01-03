const fs = require('fs');
const filePath = './data/owner.json';

module.exports = {
    name: 'owner',
    description: 'Add or remove bot owners (current owner only)',
    ownerOnly: true,
    execute: async (sock, msg, text) => {
        const jid = msg.key.remoteJid;
        if (!text) return sock.sendMessage(jid, { text: '❌ Usage: .owner <add/remove> <number>' }, { quoted: msg });

        const [action, number] = text.split(' ');
        if (!action || !number || !['add','remove'].includes(action.toLowerCase()))
            return sock.sendMessage(jid, { text: '❌ Usage: .owner <add/remove> <number>' }, { quoted: msg });

        let data = JSON.parse(fs.readFileSync(filePath));
        if (action.toLowerCase() === 'add') data[number] = true;
        else delete data[number];

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        await sock.sendMessage(jid, { text: `✅ Owner ${action.toLowerCase()}ed: ${number}` }, { quoted: msg });
    }
};
