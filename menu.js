// menu.js

const menu = `
╔═══════════════════╗
  *🤖 O.A.D*  
  Version: 3.0.5
  Release: 2026-01-02
  by Professor O.A.DAVID
╚═══════════════════╝

*Available Commands:*

╔═══════════════════╗
🌐 *General Commands*:
║ ➤ .help / .menu → shows this menu
║ ➤ .ping → check bot latency
║ ➤ .alive → check if bot is online
║ ➤ .tts <text> → convert text to speech
║ ➤ .owner → show bot owner
║ ➤ .joke → get a random joke
║ ➤ .quote → get a random quote
║ ➤ .fact → get a random fact
║ ➤ .weather <city> → shows the current weather for the specified city
║ ➤ .news → get the latest news
║ ➤ .attp <text> → convert text to sticker
║ ➤ .lyrics <song_title> → get song lyrics
║ ➤ .8ball <question> → magic 8-ball answers
║ ➤ .groupinfo → show group information
║ ➤ .staff / .admins → list group admins
║ ➤ .vv → unknown / custom command
║ ➤ .trt <text> <lang> → translate text
║ ➤ .ss <link> → take a screenshot of a webpage
║ ➤ .jid → get WhatsApp JID
║ ➤ .url → shorten a URL
╚═══════════════════╝

╔═══════════════════╗
👮‍♂️ *Admin Commands*:
║ ➤ .ban @user → ban a user from group
║ ➤ .promote @user → promote a user to admin
║ ➤ .demote @user → demote an admin
║ ➤ .mute <minutes> → mute a user
║ ➤ .unmute → unmute a user
║ ➤ .delete / .del → delete a message
║ ➤ .kick @user → remove a user from group
║ ➤ .warnings @user → check user warnings
║ ➤ .warn @user → issue a warning
║ ➤ .antilink → block links
║ ➤ .antibadword → block bad words
║ ➤ .clear → clear messages
║ ➤ .tag <message> → tag a user
║ ➤ .tagall → tag everyone
║ ➤ .tagnotadmin → tag non-admins
║ ➤ .hidetag <message> → hide the tag
║ ➤ .chatbot → toggle group chatbot
║ ➤ .resetlink → reset group invite link
║ ➤ .antitag <on/off> → enable/disable antitag
║ ➤ .welcome <on/off> → enable/disable welcome
║ ➤ .goodbye <on/off> → enable/disable goodbye
║ ➤ .setgdesc <description> → set group description
║ ➤ .setgname <new name> → set group name
║ ➤ .setgpp (reply to image) → set group profile picture
╚═══════════════════╝

╔═══════════════════╗
🔒 *Owner Commands*:
║ ➤ .mode <public/private> → set bot mode
║ ➤ .clearsession → clear bot session
║ ➤ .antidelete → prevent message deletion
║ ➤ .cleartmp → clear temporary files
║ ➤ .update → update bot
║ ➤ .settings → show bot settings
║ ➤ .setpp <reply to image> → set bot profile picture
║ ➤ .autoreact <on/off> → auto react to messages
║ ➤ .autostatus <on/off> → auto status
║ ➤ .autostatus react <on/off> → auto status reaction
║ ➤ .autotyping <on/off> → auto typing indicator
║ ➤ .autoread <on/off> → auto read messages
║ ➤ .anticall <on/off> → block calls
║ ➤ .pmblocker <on/off/status> → enable/disable PM blocker
║ ➤ .pmblocker setmsg <text> → set PM blocker message
║ ➤ .setmention <reply to msg> → set mention
║ ➤ .mention <on/off> → enable/disable mention
╚═══════════════════╝

╔═══════════════════╗
🎨 *Image/Sticker Commands*:
║ ➤ .blur <image> → blur an image
║ ➤ .simage <reply to sticker> → sticker to image
║ ➤ .sticker <reply to image> → create sticker
║ ➤ .removebg → remove background from image
║ ➤ .remini → enhance image quality
║ ➤ .crop <reply to image> → crop image
║ ➤ .tgsticker <link> → create TG sticker
║ ➤ .meme → random meme
║ ➤ .take <packname> → take sticker pack
║ ➤ .emojimix <emj1>+<emj2> → mix emojis
║ ➤ .igs <insta link> → download IG story
║ ➤ .igsc <insta link> → download IG content
╚═══════════════════╝  

╔═══════════════════╗
🖼️ *Pies Commands*:
║ ➤ .pies <country> → get country flag
║ ➤ .china → China flag/sticker
║ ➤ .indonesia → Indonesia flag/sticker
║ ➤ .japan → Japan flag/sticker
║ ➤ .korea → Korea flag/sticker
║ ➤ .hijab → Hijab style sticker
╚═══════════════════╝

╔═══════════════════╗
🎮 *Game Commands*:
║ ➤ .tictactoe @user → play TicTacToe
║ ➤ .hangman → play Hangman
║ ➤ .guess <letter> → guess letter
║ ➤ .trivia → trivia game
║ ➤ .answer <answer> → answer trivia
║ ➤ .truth → truth game
║ ➤ .dare → dare game
╚═══════════════════╝

╔═══════════════════╗
🤖 *AI Commands*:
║ ➤ .gpt <question> → AI chat
║ ➤ .gemini <question> → Gemini AI chat
║ ➤ .imagine <prompt> → AI image generation
║ ➤ .flux <prompt> → AI image generation
║ ➤ .sora <prompt> → AI image generation
╚═══════════════════╝

╔═══════════════════╗
🎯 *Fun Commands*:
║ ➤ .compliment @user → compliment a user
║ ➤ .insult @user → insult a user
║ ➤ .flirt → send flirt messages
║ ➤ .shayari → random shayari
║ ➤ .goodnight → goodnight message
║ ➤ .roseday → rose day message
║ ➤ .character @user → show character
║ ➤ .wasted @user → wasted effect
║ ➤ .ship @user → ship users
║ ➤ .simp @user → simp effect
║ ➤ .stupid @user [text] → insult text
╚═══════════════════╝

╔═══════════════════╗
🔤 *Textmaker*:
║ ➤ .metallic <text>
║ ➤ .ice <text>
║ ➤ .snow <text>
║ ➤ .impressive <text>
║ ➤ .matrix <text>
║ ➤ .light <text>
║ ➤ .neon <text>
║ ➤ .devil <text>
║ ➤ .purple <text>
║ ➤ .thunder <text>
║ ➤ .leaves <text>
║ ➤ .1917 <text>
║ ➤ .arena <text>
║ ➤ .hacker <text>
║ ➤ .sand <text>
║ ➤ .blackpink <text>
║ ➤ .glitch <text>
║ ➤ .fire <text>
╚═══════════════════╝

╔═══════════════════╗
📥 *Downloader*:
║ ➤ .play <song_name>
║ ➤ .song <song_name>
║ ➤ .spotify <query>
║ ➤ .instagram <link>
║ ➤ .facebook <link>
║ ➤ .tiktok <link>
║ ➤ .video <song_name>
║ ➤ .ytmp4 <link>
╚═══════════════════╝

╔═══════════════════╗
🧩 *MISC*:
║ ➤ .heart
║ ➤ .horny
║ ➤ .circle
║ ➤ .lgbt
║ ➤ .lolice
║ ➤ .its-so-stupid
║ ➤ .namecard
║ ➤ .oogway
║ ➤ .tweet
║ ➤ .ytcomment
║ ➤ .comrade
║ ➤ .gay
║ ➤ .glass
║ ➤ .jail
║ ➤ .passed
║ ➤ .triggered
╚═══════════════════╝

╔═══════════════════╗
🖼️ *ANIME*:
║ ➤ .nom
║ ➤ .poke
║ ➤ .cry
║ ➤ .kiss
║ ➤ .pat
║ ➤ .hug
║ ➤ .wink
║ ➤ .facepalm
╚═══════════════════╝

╔═══════════════════╗
💻 *GitHub Commands*:
║ ➤ .git
║ ➤ .github
║ ➤ .sc
║ ➤ .script
║ ➤ .repo
╚═══════════════════╝
`;

module.exports = { menu };
