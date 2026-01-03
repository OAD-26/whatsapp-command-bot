// commands/guessnumber.js
module.exports = {
    name: "guessnumber",
    description: "Play a guess-the-number game",
    async execute(sock, msg, text) {
        const jid = msg.key.remoteJid;

        if (!text) {
            return await sock.sendMessage(jid, {
                text: "❌ Usage: .guessnumber <your guess (1-10)>"
            }, { quoted: msg });
        }

        const guess = parseInt(text);
        if (isNaN(guess) || guess < 1 || guess > 10) {
            return await sock.sendMessage(jid, {
                text: "❌ Please enter a number between 1 and 10."
            }, { quoted: msg });
        }

        const answer = Math.floor(Math.random() * 10) + 1;

        if (guess === answer) {
            await sock.sendMessage(jid, {
                text: `🎉 Congratulations! You guessed it right. The number was ${answer}.`
            }, { quoted: msg });
        } else {
            await sock.sendMessage(jid, {
                text: `❌ Wrong guess! I was thinking of ${answer}. Try again!`
            }, { quoted: msg });
        }
    }
};
