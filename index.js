// index.js
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

// ----------------------------
// Load Commands
// ----------------------------
const commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
    console.log(`Loaded command: ${command.name}`);
}

// ----------------------------
// Create WhatsApp Socket
// ----------------------------
const sock = makeWASocket({
    printQRInTerminal: true
});

console.log(new Date().toISOString(), "Bot starting...");

// ----------------------------
// Listen for Messages
// ----------------------------
sock.ev.on('messages.upsert', async (m) => {
    try {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return; // Ignore empty or self-sent messages

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (!text) return;

        const sender = msg.key.remoteJid;
        const args = text.trim().split(/ +/);
        const commandName = args.shift().toLowerCase().slice(1); // remove "!" prefix

        if (text.startsWith('!') && commands.has(commandName)) {
            await commands.get(commandName).execute(sock, msg, args.join(' '));
        }
    } catch (err) {
        console.error('Error processing message:', err);
    }
});
