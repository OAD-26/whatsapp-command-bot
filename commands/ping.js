module.exports = {
    name: 'ping',
    description: 'Responds with Pong!',
    execute: async (sock, msg, text) => {
        const jid = msg.key.remoteJid;
        await sock.sendMessage(jid, { text: 'Pong!' });
    }
};
