// Import menu text and config
const { menu } = require('./menu');
const { prefix } = require('./config');

// Export the command handler
module.exports = async (sock, m, text) => {
    // Check if the message matches the menu command
    if (text === `${prefix}menu` || text === `${prefix}help`) {
        try {
            // Send the menu as a reply
            await sock.sendMessage(
                m.key.remoteJid,
                { text: menu },
                { quoted: m }
            );
        } catch (err) {
            console.error('Failed to send menu:', err);
        }
    }
};
