export async function handleFun(sock, msg, command, args, sender) {
  const from = msg.key.remoteJid;
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || sender;

  const gifs = {
    '.slap': 'https://cdn.otakugifs.xyz/gifs/slap/001.gif',
    '.hug': 'https://cdn.otakugifs.xyz/gifs/hug/001.gif',
    '.kiss': 'https://cdn.otakugifs.xyz/gifs/kiss/001.gif',
    '.punch': 'https://cdn.otakugifs.xyz/gifs/punch/001.gif',
    '.brick': 'https://media.giphy.com/media/10fS07X5DSX0Y8/giphy.gif'
  };

  if (gifs[command]) {
    const actionName = command.replace('.', '').toUpperCase();
    await sock.sendMessage(from, { video: { url: gifs[command] }, gifPlayback: true, caption: `💥 @${sender.split('@')[0]} used **${actionName}** on @${mentioned.split('@')[0]}!`, mentions: [sender, mentioned] }, { quoted: msg });
  } else if (command === '.truth') {
    const truths = ["What's your biggest secret?", "Who is your anime crush?"];
    await sock.sendMessage(from, { text: `❓ *TRUTH:* "${truths[Math.floor(Math.random() * truths.length)]}"` }, { quoted: msg });
  }
}
