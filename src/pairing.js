export async function handlePairing(sock, msg, command, args, sender) {
  const from = msg.key.remoteJid;
  if (command === '.pair') {
    let phoneNumber = args[1];
    if (!phoneNumber) return await sock.sendMessage(from, { text: '⚠️ Provide phone number!\n*Example:* `.pair 2348000000000`' }, { quoted: msg });
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    await sock.sendMessage(from, { text: `🔄 Requesting sub-bot pairing code for +${phoneNumber}...` }, { quoted: msg });
    try {
      const code = await sock.requestPairingCode(phoneNumber);
      await sock.sendMessage(from, { text: `⚡ *VORTEX SUB-BOT LINKING CODE* ⚡\n\n📱 Phone: *+${phoneNumber}*\n🔑 Pairing Code: *${code}*` }, { quoted: msg });
    } catch (err) {
      await sock.sendMessage(from, { text: `❌ Could not generate pairing code: ${err.message}` }, { quoted: msg });
    }
  }
}
