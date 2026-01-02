const yts = require("yt-search");
const ytdl = require("ytdl-core");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);

module.exports = {
  name: "play",
  async execute(sock, msg, text) {
    if (!text) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Usage: !play <song name or link>"
      }, { quoted: msg });
    }

    try {
      let videoUrl = text;

      // If not a URL, search YouTube
      if (!text.startsWith("http")) {
        const search = await yts(text);
        const video = search.videos[0];
        if (!video) {
          return sock.sendMessage(msg.key.remoteJid, {
            text: "❌ No results found."
          }, { quoted: msg });
        }
        videoUrl = video.url;
      }

      const info = await ytdl.getInfo(videoUrl);
      const title = info.videoDetails.title;
      const filePath = `./tmp/${info.videoDetails.videoId}.mp3`;

      await sock.sendMessage(msg.key.remoteJid, {
        text: `🎵 Downloading: *${title}*`
      }, { quoted: msg });

      // Download and convert audio
      ffmpeg(ytdl(videoUrl, { quality: "highestaudio" }))
        .audioBitrate(128)
        .save(filePath)
        .on("end", async () => {
          await sock.sendMessage(msg.key.remoteJid, {
            audio: fs.readFileSync(filePath),
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`
          }, { quoted: msg });

          fs.unlinkSync(filePath); // remove temp file
        })
        .on("error", async (err) => {
          console.error(err);
          await sock.sendMessage(msg.key.remoteJid, {
            text: "❌ Error downloading song."
          }, { quoted: msg });
        });

    } catch (err) {
      console.error(err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Failed to process your request."
      }, { quoted: msg });
    }
  }
};
