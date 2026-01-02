// index.js
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
<<<<<<< HEAD
const qrcode = require('qrcode-terminal'); // for QR code display
=

// ----------------------------
// Configurable prefix
// ----------------------------
const prefix = '.'; // Change this to whatever prefix you want later>>>>>>> 876ad078e591cdeb113ca7bec35fd0543dd8be27
876ad078e591cdeb113ca7bec35fd0543dd8be27
// ----------------------------
// Load Commands
// ----------------------------
const commands = new Map();
if (fs.existsSync('./commands')) {
HEAD
    const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
876ad078e591cdeb113ca7bec35fd0543dd8be27
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.set(command.name, command);
        console.log(`Loaded command: ${command.name}`);
    }
}

// ----------------------------
HEAD
// Create WhatsApp Socket
// WhatsApp Socket
876ad078e591cdeb113ca7bec35fd0543dd8be27
// ----------------------------
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
       HEAD
        browser: ['MyBot', 'Chrome', '1.0.0']
    });

    // Save credentials automatically
    sock.ev.on('creds.update', saveCreds);

    // ----------------------------
    // Connection Updates
    // ----------------------------
    sock.ev.on('connection.update', (update) => {
        console.log(update);

        if (update.connection === 'close') {
            console.log('❌ Connection closed, try restarting bot');
        } else if (update.connection === 'open') {
            console.log('✅ Bot is connected to WhatsApp!');
        }

        if (!state.creds.registered && update.qr) {
            console.log('📱 Scan this QR code with WhatsApp:');
            qrcode.generate(update.qr, { small: true });
        }
    });

    // ----------------------------
    // Listen for Messages
    // ------------------------------

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
876ad078e591cdeb113ca7bec35fd0543dd8be27
    sock.ev.on('messages.upsert', async (m) => {
        try {
            const msg = m.messages[0];
            if (!msg.message || msg.key.fromMe) return;

            const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
            if (!text) return;

            const sender = msg.key.remoteJid;
            const args = text.trim().split(/ +/);
            HEAD
            const commandName = args.shift().toLowerCase().slice(1); // remove "!" or "." prefix

            if ((text.startsWith('!') || text.startsWith('.')) && commands.has(commandName)) {

            const commandName = args.shift().toLowerCase().slice(prefix.length); // remove prefix

            if (text.startsWith(prefix) && commands.has(commandName)) {
            876ad078e591cdeb113ca7bec35fd0543dd8be27>>>>>>> 876ad078e591cdeb113ca7bec35fd0543dd8be27

                await commands.get(commandName).execute(sock, msg, args.join(' '));
            }
        } catch (err) {
            console.error('Error processing message:', err);
        }
    });

    return sock;
}

// ----------------------------
HEAD
// Start the bot

// Start Bot
876ad078e591cdeb113ca7bec35fd0543dd8be27
// ----------------------------
startBot().catch(err => console.error('❌ Failed to start bot:', err));
