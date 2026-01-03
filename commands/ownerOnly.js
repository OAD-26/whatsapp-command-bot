// ownerOnly.js
const ownerNumbers = [
    "2349138385352@s.whatsapp.net",
    "2349110495140@s.whatsapp.net"
];

module.exports = {
    isOwner: (msg) => {
        const sender = msg.key.participant || msg.key.remoteJid;
        return msg.key.fromMe || ownerNumbers.includes(sender);
    }
};
