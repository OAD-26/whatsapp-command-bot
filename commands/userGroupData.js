const fs = require('fs');
const filePath = './data/userGroupData.json';

module.exports = {
    name: 'usergroupdata',
    description: 'Check or update user group data',
    execute: async (sock, msg, text) => {
        let data = JSON.parse(fs.readFileSync(filePath));
        const jid = msg.key.remoteJid;

        if (!data[jid]) data[jid] = { users: {} };

        await sock.sendMessage(jid, { text: `📄 User group data for this chat:\n${JSON.stringify(data[jid], null, 2)}` }, { quoted: msg });

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
};
