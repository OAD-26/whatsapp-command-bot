const ownerNumber = '2349138385352@s.whatsapp.net';
let mentionOn = false;

module.exports = {
    name: 'mention',
    description: 'Enable/disable bot mentions (owner only)',
    execute: async (sock, msg, text) => {
        const jid = msg.key.remoteJid;
        if (msg.key.participant !== ownerNumber) return sock.sendMessage(jid, { text: '❌ Only owner can use this!' });

        if (!text || !['on','off'].includes(text.toLowerCase()))
            return sock.sendMessage(jid, { text: '❌ Usage: !mention on|off' });

        mentionOn = text.toLowerCase() === 'on';
        await sock.sendMessage(jid, { text: `✅ Mentions turned *${text.toLowerCase()}*` });
    }
};
