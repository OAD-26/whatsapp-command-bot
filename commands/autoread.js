const fs = require('fs');
const filePath = './data/autoread.json';

module.exports = {
    name: 'autoread',
    description: 'Turn auto-read on/off (owner only)',
    ownerOnly: true,
    execute: async (sock, msg, text) => {
        const jid = msg.key.remoteJid;
        if (!text || !['on','off'].includes(text.toLowerCase()))
            return sock.sendMessage(jid, { text: '❌ Usage: .autoread <on/off>' }, { quoted: msg });

        const data = { enabled: text.toLowerCase() === 'on' };
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        await sock.sendMessage(jid, { text: `✅ Auto-read turned ${data.enabled ? 'ON' : 'OFF'}` }, { quoted: msg });
    }
};
