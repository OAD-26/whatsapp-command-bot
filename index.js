// index.js
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

// ----------------------------
// Configurable prefix
// ----------------------------
const prefix = '.'; // Change this to whatever prefix you want later

// ----------------------------
// Load Commands
// ----------------------------
const commands = new Map();
if (fs.existsSync('./commands')) {
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.set(command.name, command);
        console.log(`Loaded command: ${command.name}`);
    }
}

// ----------------------------
// WhatsApp Socket
// ----------------------------
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: ['OAD BOT', 'Chrome', '1.0.0']
    });

    // Auto save credentials
    sock.ev.on('creds.update', saveCreds);

    // Connection updates
    sock.ev.on('connection.update', (update) => {
        console.log(update);
        if (update.connection === 'close') console.log('❌ Connection closed. Reconnect manually or restart bot.');
        if (update.connection === 'open') console.log('✅ Bot is connected to WhatsApp!');
        if (!state.creds.registered && update.qr) {
            console.log('📱 Scan this QR code with WhatsApp:');
            console.log(update.qr);
        }
    });

    // Listen for messages
    sock.ev.on('messages.upsert', async (m) => {
        try {
            const msg = m.messages[0];
            if (!msg.message || msg.key.fromMe) return;

            const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
            if (!text) return;

            const sender = msg.key.remoteJid;
            const args = text.trim().split(/ +/);
            const commandName = args.shift().toLowerCase().slice(prefix.length); // remove prefix

            if (text.startsWith(prefix) && commands.has(commandName)) {
                await commands.get(commandName).execute(sock, msg, args.join(' '));
            }
        } catch (err) {
            console.error('Error processing message:', err);
        }
    });

    return sock;
}

// ----------------------------
// Start Bot
// ----------------------------
startBot().catch(err => console.error('❌ Failed to start bot:', err));
