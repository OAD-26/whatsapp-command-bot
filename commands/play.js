// commands/play.js
const yts = require("yt-search");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

// Use system ffmpeg from Termux
ffmpeg.setFfmpegPath("/data/data/com.termux/files/usr/bin/ffmpeg");

module.exports = {
  name: "play",
  description: "Download and send a song from YouTube",
  async execute(sock, msg, text) {
    const jid = msg.key.remoteJid;

    if (!text) {
      return sock.sendMessage(jid, {
        text: "❌ Usage: .play <song name>"
      }, { quoted: msg });
    }

    try {
      // Search YouTube
      const search = await yts(text);
      const video = search.videos[0];
      if (!video) {
        return sock.sendMessage(jid, { text: "❌ No results found." }, { quoted: msg });
      }

      const tmpDir = path.join(__dirname, "..", "tmp");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

      const filePath = path.join(tmpDir, `${video.videoId}.mp3`);

      await sock.sendMessage(jid, { text: `🎵 Downloading: ${video.title}` }, { quoted: msg });

      // Download and convert to mp3
      ffmpeg(ytdl(video.url, { quality: "highestaudio" }))
        .audioBitrate(128)
        .save(filePath)
        .on("end", async () => {
          await sock.sendMessage(jid, {
            audio: fs.readFileSync(filePath),
            mimetype: "audio/mpeg",
            fileName: `${video.title}.mp3`
          }, { quoted: msg });

          fs.unlinkSync(filePath); // Delete temp file
        })
        .on("error", async (err) => {
          console.error(err);
          await sock.sendMessage(jid, { text: "❌ Error downloading song." }, { quoted: msg });
        });

    } catch (err) {
      console.error(err);
      await sock.sendMessage(jid, { text: "❌ Failed to process your request." }, { quoted: msg });
    }
  }
};
