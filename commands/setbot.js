const fs = require("fs");
const path = require("path");

async function setBotAvatar(sock) {
    try {
        const filePath = path.join(__dirname, "..", "assets", "bot_avatar.jpeg");

        if (!fs.existsSync(filePath)) {
            console.log("❌ Bot avatar not found:", filePath);
            return;
        }

        const image = fs.readFileSync(filePath);
        await sock.updateProfilePicture(sock.user.id, image);

        console.log("✅ Bot avatar updated successfully");
    } catch (err) {
        console.error("❌ Failed to set bot avatar:", err);
    }
}

module.exports = setBotAvatar;
