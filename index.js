-// ===============================
// IMPORTS / REQUIRED MODULES
// ===============================
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@adiwajshing/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");

// ===============================
// BOT CONFIGURATION
// ===============================
const ownerNumbers = ["123456789@s.whatsapp.net"]; // Add your WhatsApp ID(s)
const dataPath = path.join(__dirname, "data");

// Ensure data folder exists
if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);

// Data files
const userDataFile = path.join(dataPath, "user.json");
const welcomerDataFile = path.join(dataPath, "welcomer.json");
const antilinkDataFile = path.join(dataPath, "antilink.json");

// Load data or initialize empty objects
let users = fs.existsSync(userDataFile) ? JSON.parse(fs.readFileSync(userDataFile)) : {};
let welcomerData = fs.existsSync(welcomerDataFile) ? JSON.parse(fs.readFileSync(welcomerDataFile)) : {};
let antilinkData = fs.existsSync(antilinkDataFile) ? JSON.parse(fs.readFileSync(antilinkDataFile)) : {};

// ===============================
// FONT REGISTER (OPTIONAL)
// ===============================
if (fs.existsSync("./assets/fonts/CustomFont.ttf")) {
    GlobalFonts.registerFromPath("./assets/fonts/CustomFont.ttf", "CustomFont");
}

// ===============================
// WELCOME / GOODBYE CARDS
// ===============================
async function createWelcomeCard(username, groupname) {
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    const bg = await loadImage("./assets/welcome_bg.jpg").catch(() => null);
    if (bg) ctx.drawImage(bg, 0, 0, 700, 250);

    ctx.font = "40px CustomFont";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`Welcome ${username}!`, 50, 150);
    ctx.font = "30px CustomFont";
    ctx.fillText(`to ${groupname}`, 50, 200);

    return canvas.toBuffer("image/png");
}

async function createGoodbyeCard(username, groupname) {
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    const bg = await loadImage("./assets/goodbye_bg.jpg").catch(() => null);
    if (bg) ctx.drawImage(bg, 0, 0, 700, 250);

    ctx.font = "40px CustomFont";
    ctx.fillStyle = "#ff5555";
    ctx.fillText(`Goodbye ${username} 👋`, 50, 150);
    ctx.font = "30px CustomFont";
    ctx.fillText(`You'll be missed by ${groupname}`, 50, 200);

    return canvas.toBuffer("image/png");
}

// ===============================
// ANTI-LINK SYSTEM
// ===============================
async function antiLinkCheck(sock, msg) {
    const jid = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    if (antilinkData[jid] && /(https?:\/\/|wa\.me\/|chat\.whatsapp\.com\/)/i.test(text)) {
        await sock.sendMessage(jid, { text: "❌ Links are not allowed!" }, { quoted: msg });
        try { await sock.sendMessage(jid, { delete: msg.key }); } catch {}
        return true;
    }
    return false;
}

// ===============================
// START BOT
// ===============================
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth");
    const sock = makeWASocket({
        logger: pino({ level: "silent" }),
        auth: state
    });

    sock.ev.on("creds.update", saveCreds);

    console.log("✅ Bot started!");

    // ===============================
    // GROUP PARTICIPANTS UPDATE
    // ===============================
    sock.ev.on("group-participants.update", async (update) => {
        const { id: groupId, participants, action } = update;
        if (!welcomerData[groupId]) return;

        for (const user of participants) {
            const username = user.split("@")[0];
            const groupname = "My Group"; // You can dynamically fetch group metadata
            let buffer, caption;

            if (action === "add") {
                buffer = await createWelcomeCard(username, groupname);
                caption = `👋 Welcome ${username} to ${groupname}!`;
            } else if (action === "remove") {
                buffer = await createGoodbyeCard(username, groupname);
                caption = `😢 Goodbye ${username}! You'll be missed by ${groupname}`;
            }

            await sock.sendMessage(groupId, { image: buffer, caption });
        }
    });

    // ===============================
    // MESSAGE HANDLER
    // ===============================
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const jid = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

        // Anti-link
        if (await antiLinkCheck(sock, msg)) return;

        // ====== COMMANDS ======
        // Ping
        if (text.startsWith("!ping")) {
            await sock.sendMessage(jid, { text: "🏓 Pong!" });
        }

        // Guess Number Game
        if (text.startsWith("!guess")) {
            const number = parseInt(text.split(" ")[1]);
            if (!users[jid]) users[jid] = {};
            const target = Math.floor(Math.random() * 10) + 1;
            if (number === target) {
                await sock.sendMessage(jid, { text: `🎉 Correct! The number was ${target}` });
            } else {
                await sock.sendMessage(jid, { text: `❌ Wrong! Try again. The number was ${target}` });
            }
        }

        // Joke Command
        if (text.startsWith("!joke")) {
            const jokes = [
                "Why did the chicken cross the road? To get to the other side! 🐔",
                "I told my computer I needed a break, and it said no problem — it will go to sleep. 💻",
                "Why don’t skeletons fight each other? They don’t have the guts. 💀"
            ];
            const joke = jokes[Math.floor(Math.random() * jokes.length)];
            await sock.sendMessage(jid, { text: joke });
        }

        // Group-only command
        if (text.startsWith("!grouponly")) {
            if (!jid.endsWith("@g.us")) {
                await sock.sendMessage(jid, { text: "❌ This command is only allowed in groups!" });
                return;
            }
            await sock.sendMessage(jid, { text: "✅ You are in a group! Command executed." });
        }

        // Owner-only command
        if (text.startsWith("!owner")) {
            if (!ownerNumbers.includes(msg.key.participant)) {
                await sock.sendMessage(jid, { text: "❌ This command is owner-only!" });
                return;
            }
            await sock.sendMessage(jid, { text: "✅ Owner command executed!" });
        }

        // Premium command
        if (text.startsWith("!premium")) {
            if (!users[jid]?.premium) {
                await sock.sendMessage(jid, { text: "❌ You need premium to use this command!" });
                return;
            }
            await sock.sendMessage(jid, { text: "✅ Premium command executed!" });
        }

        // Save user data
        fs.writeFileSync(userDataFile, JSON.stringify(users, null, 2));
    });

    // Handle disconnects & auto-reconnect
    sock.ev.on("connection.update", (update) => {
        if (update.connection === "close") {
            const reason = update.lastDisconnect?.error?.output?.statusCode;
            console.log("⚠️ Connection closed:", reason, "Reconnecting...");
            startBot();
        } else if (update.connection === "open") {
            console.log("✅ Bot connected!");
        }
    });
}

// ===============================
// START THE BOT
// ===============================
startBot();
