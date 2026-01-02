module.exports = {
    name: 'antilink',
    description: 'Turn on/off anti-link',
    execute: async (sock, msg, text) => {
        const jid = msg.key.remoteJid;
        const status = text.trim().toLowerCase();
        if (!['on', 'off'].includes(status)) return sock.sendMessage(jid, { text: '❌ Usage: !antilink <on/off>' });

        await sock.sendMessage(jid, { text: `✅ Anti-link is now ${status.toUpperCase()}! (simulated)` });
    }
};
