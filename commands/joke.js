module.exports = {
    name: 'joke',  // the command name
    description: 'Tells a random joke',
    execute: async (sock, msg, text) => {
        const jokes = [
            'Why did the chicken cross the road? To get to the other side!',
            'I told my computer I needed a break, and it said "No problem, I’ll go to sleep."',
            'Why do programmers prefer dark mode? Because light attracts bugs!'
        ];
        const reply = jokes[Math.floor(Math.random() * jokes.length)];
        await sock.sendMessage(msg.key.remoteJid, { text: reply });
    }
};
