const { menu } = require('./menu');

module.exports = async (sock, m, text) => {
    if (text === '.menu' || text === '.help') {
        await sock.sendMessage(
            m.key.remoteJid,
            { text: menu },
            { quoted: m }
        );
    }
};
