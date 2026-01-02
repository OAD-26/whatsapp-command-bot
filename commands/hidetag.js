module.exports = {
    name: 'hidetag',
    description: 'Send a message to all group members without showing mentions',
    execute: async (sock, msg, text) => {
        const jid = msg.key.remoteJid;

        // Make sure it's in a group
        if (!msg.key.participant) {
            return sock.sendMessage(jid, { text: '❌ This command only works in groups!' });
        }

        if (!text) {
            return sock.sendMessage(jid, { text: '❌ Usage: !hidetag <message>' });
        }

        // Get all participants in the group
        const groupMetadata = await sock.groupMetadata(jid);
        const participants = groupMetadata.participants.map(p => p.id);

        // Send message with mentions hidden
        await sock.sendMessage(jid, {
            text: text,
            mentions: participants
        });
    }
};
