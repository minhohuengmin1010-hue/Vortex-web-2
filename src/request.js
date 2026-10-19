export async function handleRequestBot(sock, msg, command, args, sender) {
  const from = msg.key.remoteJid;
  const inviteLink = args[1];
  if (!inviteLink || !inviteLink.includes('chat.whatsapp.com')) {
    return await sock.sendMessage(from, { text: '⚠️ Provide a valid WhatsApp group link!\n*Example:* `.request-bot https://chat.whatsapp.com/...`' }, { quoted: msg });
  }
  await sock.sendMessage(from, { text: '📨 Group request submitted successfully to the bot owner!' }, { quoted: msg });
}
