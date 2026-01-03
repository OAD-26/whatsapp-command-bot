const fs = require("fs");
const path = require("path");

// ===============================
// Files to store per-group settings
// ===============================
const antiDeleteFile = path.join(__dirname, "..", "data", "antidelete.json");
const antiLinkFile   = path.join(__dirname, "..", "data", "antilink.json");
const antiSpamFile   = path.join(__dirname, "..", "data", "antispam.json");
const badwordsFile   = path.join(__dirname, "..", "data", "badwords.json");

// Load existing settings
let antiDeleteData = fs.existsSync(antiDeleteFile) ? JSON.parse(fs.readFileSync(antiDeleteFile)) : {};
let antiLinkData   = fs.existsSync(antiLinkFile) ? JSON.parse(fs.readFileSync(antiLinkFile)) : {};
let antiSpamData   = fs.existsSync(antiSpamFile) ? JSON.parse(fs.readFileSync(antiSpamFile)) : {};
let badwordsData   = fs.existsSync(badwordsFile) ? JSON.parse(fs.readFileSync(badwordsFile)) : {};

// In-memory spam tracker
let spamTracker = {};

// ===============================
// Owner numbers
// ===============================
const OWNER_NUMBERS = ["2349138385352@s.whatsapp.net", "2349110495140@s.whatsapp.net"];

module.exports = {
  name: "antigroup",
  description: "Manage all group protections: anti-link, anti-delete, anti-spam, badwords",
  ownerOnly: true,

  // ===============================
  // COMMAND TO TOGGLE FEATURES
  // ===============================
  execute: async (sock, msg, text) => {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant;

    if (!OWNER_NUMBERS.includes(sender)) {
      return await sock.sendMessage(jid, { text: "❌ Owner only command." }, { quoted: msg });
    }

    if (!text) {
      return await sock.sendMessage(jid, { text: "❌ Usage: .antigroup <feature> <on/off>\nFeatures: antidelete, antilink, antispam, badwords" }, { quoted: msg });
    }

    const [feature, statusText] = text.split(" ");
    const status = statusText?.toLowerCase() === "on";

    switch (feature?.toLowerCase()) {
      case "antidelete":
        antiDeleteData[jid] = status;
        fs.writeFileSync(antiDeleteFile, JSON.stringify(antiDeleteData, null, 2));
        await sock.sendMessage(jid, { text: `✅ Anti-delete is now ${status ? "ON" : "OFF"}` }, { quoted: msg });
        break;

      case "antilink":
        antiLinkData[jid] = status;
        fs.writeFileSync(antiLinkFile, JSON.stringify(antiLinkData, null, 2));
        await sock.sendMessage(jid, { text: `✅ Anti-link is now ${status ? "ON" : "OFF"}` }, { quoted: msg });
        break;

      case "antispam":
        antiSpamData[jid] = status;
        fs.writeFileSync(antiSpamFile, JSON.stringify(antiSpamData, null, 2));
        await sock.sendMessage(jid, { text: `✅ Anti-spam is now ${status ? "ON" : "OFF"}` }, { quoted: msg });
        break;

      case "badwords":
        badwordsData[jid] = status;
        fs.writeFileSync(badwordsFile, JSON.stringify(badwordsData, null, 2));
        await sock.sendMessage(jid, { text: `✅ Badwords filter is now ${status ? "ON" : "OFF"}` }, { quoted: msg });
        break;

      default:
        await sock.sendMessage(jid, { text: "❌ Unknown feature. Use: antidelete, antilink, antispam, badwords" }, { quoted: msg });
    }
  },

  // ===============================
  // LIVE CHECK MESSAGE
  // ===============================
  checkMessage: async (sock, msg) => {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant;
    const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
    if (!messageText) return false;

    // 1️⃣ Anti-link
    if (antiLinkData[jid] && /(https?:\/\/|wa\.me\/|chat\.whatsapp\.com\/)/i.test(messageText)) {
      await sock.sendMessage(jid, { text: "❌ Links are not allowed!" }, { quoted: msg });
      try { await sock.sendMessage(jid, { delete: msg.key }); } catch (e) { console.error(e.message); }
      return true;
    }

    // 2️⃣ Anti-delete
    if (msg.message?.protocolMessage?.type === 0 && antiDeleteData[jid]) {
      const originalMessage = msg.message.protocolMessage;
      await sock.sendMessage(jid, {
        text: `⚠️ A message was deleted!\n\nContent: ${originalMessage?.text || JSON.stringify(originalMessage)}`
      });
      return true;
    }

    // 3️⃣ Anti-spam
    if (antiSpamData[jid]) {
      spamTracker[jid] = spamTracker[jid] || {};
      spamTracker[jid][sender] = spamTracker[jid][sender] || [];
      spamTracker[jid][sender].push(Date.now());

      // Remove old messages beyond 5 seconds
      spamTracker[jid][sender] = spamTracker[jid][sender].filter(ts => Date.now() - ts < 5000);

      if (spamTracker[jid][sender].length > 5) { // more than 5 messages in 5 sec
        await sock.sendMessage(jid, { text: `⚠️ ${sender.split("@")[0]} is spamming!` });
        return true;
      }
    }

    // 4️⃣ Badwords filter
    if (badwordsData[jid]) {
      const badwords = ["badword1","badword2","badword3"]; // add your list
      const found = badwords.find(word => messageText.toLowerCase().includes(word));
      if (found) {
        await sock.sendMessage(jid, { text: `❌ Bad language is not allowed!` }, { quoted: msg });
        try { await sock.sendMessage(jid, { delete: msg.key }); } catch (e) { console.error(e.message); }
        return true;
      }
    }

    return false; // message is okay
  }
};
