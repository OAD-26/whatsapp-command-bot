module.exports = {
    name: 'tagall',
    description: 'Tag all group members',
    execute: async (sock, msg, text) => {
        const jid = msg.key.remoteJid;
        if (!msg.key.participant) return sock.sendMessage(jid, { text: '❌ This command is for groups only.' });

        const participants = msg.participants || [];
        const mentions = participants.map(p => p.id);
        await sock.sendMessage(jid, { text: text || '👋 Attention all!', mentions });
    }
};
