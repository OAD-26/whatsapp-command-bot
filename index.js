const fs = require('fs');
const path = require('path');

const commands = new Map();

// Load all command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
}
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs'); // to read files from your computer

console.log(new Date().toISOString(), "Bot starting...");

// Function to send intro sticker
async function sendIntroSticker(jid) {
    try {
        const stickerBuffer = fs.readFileSync('./assets/stickintro.webp'); // your sticker path
        await sock.sendMessage(jid, { sticker: stickerBuffer }); // send the sticker
        console.log('Intro sticker sent!');
    } catch (err) {
        console.error('Error sending sticker:', err);
    }
}

// Make the WhatsApp socket
const sock = makeWASocket({
    printQRInTerminal: true
});

// Event listener for incoming messages
sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0]; // take the first message

    if (!msg.message || msg.key.fromMe) return; // ignore empty or self-sent messages

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    const sender = msg.key.remoteJid; // the person who sent the message

    if (!text) return;

    // Check if the message is your command
    if (text.toLowerCase() === '!intro') {
        sendIntroSticker(sender); // call the function to send sticker
    }
});
