const fs = require('fs');
const filePath = './data/autoStatus.json';

module.exports = {
    name: 'autostatus',
    description: 'Turn auto-status update on/off (owner only)',
    ownerOnly: true,
    execute: async (sock, msg, text) => {
        const jid = msg.key.remoteJid;
        if (!text || !['on','off'].includes(text.toLowerCase()))
            return sock.sendMessage(jid, { text: '❌ Usage: .autostatus <on/off>' }, { quoted: msg });

        const data = { enabled: text.toLowerCase() === 'on' };
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        await sock.sendMessage(jid, { text: `✅ Auto-status turned ${data.enabled ? 'ON' : 'OFF'}` }, { quoted: msg });
    }
};
