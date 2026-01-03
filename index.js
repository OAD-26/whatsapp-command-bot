// ===============================
// REQUIRED MODULES
// ===============================
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const fs = require("fs");
const path = require("path");
const pino = require("pino");

// ===============================
// DATA FOLDER
// ===============================
const dataPath = path.join(__dirname, "data");
if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);

// ===============================
// OWNER NUMBERS
// ===============================
const OWNER_NUMBERS = [
  "2349138385352@s.whatsapp.net",
  "2349110495140@s.whatsapp.net"
];

// ===============================
// SET BOT AVATAR FUNCTION
// ===============================
async function setBotAvatar(sock) {
  try {
    const avatarPath = "./assets/bot_avatar.jpeg";
    if (!fs.existsSync(avatarPath)) {
      console.log("⚠️ Bot avatar not found");
      return;
    }
    const image = fs.readFileSync(avatarPath);
    await sock.updateProfilePicture(sock.user.id, image);
    console.log("✅ Bot avatar set successfully");
  } catch (err) {
    console.error("❌ Failed to set bot avatar:", err.message);
  }
}

// ===============================
// LOAD USERS DATA
// ===============================
const userDataFile = path.join(dataPath, "user.json");
let users = {};
if (fs.existsSync(userDataFile)) {
  users = JSON.parse(fs.readFileSync(userDataFile));
}

// ===============================
// LOAD COMMANDS
// ===============================
const commands = new Map();
const commandsPath = path.join(__dirname, "commands");

for (const file of fs.readdirSync(commandsPath)) {
  if (file.endsWith(".js")) {
    const cmd = require(path.join(commandsPath, file));
    commands.set(cmd.name, cmd);
  }
}

// ===============================
// START BOT
// ===============================
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state
  });

  // ===============================
  // CONNECTION UPDATE
  // ===============================
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ OAD BOT connected to WhatsApp");
      await setBotAvatar(sock);
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;

      console.log("❌ Connection closed. Reconnecting:", shouldReconnect);
      if (shouldReconnect) startBot();
    }
  });

  sock.ev.on("creds.update", saveCreds);

  // ===============================
  // MESSAGE HANDLER
  // ===============================
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.key || !msg.message || msg.key.fromMe) return;

    // ===============================
    // RUN GROUP PROTECTIONS FIRST
    // ===============================
    const antigroupCmd = commands.get("antigroup");
    if (antigroupCmd && await antigroupCmd.checkMessage(sock, msg)) return;

    // ===============================
    // NORMAL COMMANDS
    // ===============================
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (!text || !text.startsWith(".")) return;

    const args = text.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = commands.get(commandName);
    if (!command) return;

    // OWNER CHECK (for owner-only commands)
    if (command.ownerOnly) {
      const sender = msg.key.participant || msg.key.remoteJid;
      if (!OWNER_NUMBERS.includes(sender)) {
        return await sock.sendMessage(
          msg.key.remoteJid,
          { text: "❌ Owner only command." },
          { quoted: msg }
        );
      }
    }

    // EXECUTE COMMAND
    try {
      await command.execute(sock, msg, args.join(" "));
    } catch (err) {
      console.error(err);
      await sock.sendMessage(
        msg.key.remoteJid,
        { text: "❌ Command error." },
        { quoted: msg }
      );
    }
  });
}

// ===============================
// RUN BOT
// ===============================
startBot();





