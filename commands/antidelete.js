const fs = require("fs");
const path = require("path");

const ownerNumber = "2349138385352@s.whatsapp.net"; // Your number here

// Data file to store anti-delete status per group
const dataFile = path.join(__dirname, "..", "data", "antidelete.json");
let antiDeleteData = {};
if (fs.existsSync(dataFile)) {
  antiDeleteData = JSON.parse(fs.readFileSync(dataFile));
}

module.exports = {
  name: "antidelete",
  description: "Turn anti-delete on/off in the group (owner only)",
  ownerOnly: true,
  execute: async (sock, msg, text) => {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant;

    if (sender !== ownerNumber) {
      return await sock.sendMessage(jid, { text: "❌ Owner only command." }, { quoted: msg });
    }

    if (!text || !["on", "off"].includes(text.toLowerCase())) {
      return await sock.sendMessage(jid, { text: "❌ Usage: .antidelete on/off" }, { quoted: msg });
    }

    const status = text.toLowerCase() === "on";
    antiDeleteData[jid] = status;

    fs.writeFileSync(dataFile, JSON.stringify(antiDeleteData, null, 2));
    await sock.sendMessage(jid, { text: `✅ Anti-delete is now ${status ? "ON" : "OFF"}` }, { quoted: msg });
  }
};

// ===============================
// Live check deleted messages
// ===============================
module.exports.checkDeleted = async function(sock, msg) {
  const jid = msg.key.remoteJid;

  // Only run if anti-delete is ON for this group
  if (!antiDeleteData[jid]) return false;

  // Only proceed if the message was actually deleted
  if (!msg.message) return false;

  const originalMessage = msg.message;
  const type = Object.keys(originalMessage)[0];

  await sock.sendMessage(jid, {
    text: `⚠️ A message was deleted!\n\nType: ${type}\nContent: ${
      originalMessage[type]?.text || JSON.stringify(originalMessage[type])
    }`
  });

  return true; // message was handled
};
