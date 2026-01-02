const axios = require('axios');

module.exports = {
    name: 'gpt',
    description: 'Ask AI questions',
    execute: async (sock, msg, text) => {
        const jid = msg.key.remoteJid;
        if (!text) return sock.sendMessage(jid, { text: '❌ Usage: !gpt <question>' });

        try {
            const res = await axios.get(`https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(text)}`);
            const reply = res.data?.result || '❌ No response from AI';
            await sock.sendMessage(jid, { text: reply }, { quoted: msg });
        } catch (err) {
            console.error(err);
            await sock.sendMessage(jid, { text: '❌ AI error, try again later.' });
        }
    }
};
