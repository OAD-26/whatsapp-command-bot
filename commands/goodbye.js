module.exports = {
    name: 'goodbye',
    description: 'Send goodbye message when someone leaves',
    execute: async (sock, msg, text) => {
        const jid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const textMsg = `👋 Goodbye @${sender.split('@')[0]}! We will miss you in the group.`;
        await sock.sendMessage(jid, { text: textMsg, mentions: [sender] });
    }
};
