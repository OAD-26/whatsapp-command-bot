const fs = require('fs');
const filePath = './data/messageCount.json';

module.exports = {
    name: 'messagecount',
    description: 'Check message count for a user',
    execute: async (sock, msg, text) => {
        const data = JSON.parse(fs.readFileSync(filePath));
        const jid = text || msg.key.participant || msg.key.remoteJid;
        const count = data[jid] || 0;

        await sock.sendMessage(msg.key.remoteJid, { text: `📊 Message count for ${jid} is ${count}` }, { quoted: msg });
    }
};
