export async function handleEconomy(sock, msg, command, args, sender) {
  const from = msg.key.remoteJid;
  const username = sender.split('@')[0];

  switch (command) {
    case '.wallet':
    case '.balance':
      await sock.sendMessage(from, { text: `💳 @${username}, your balance:\n🪙 Coins: 25,400\n🏦 Vault: 150,000\n💎 Gems: 45` }, { quoted: msg });
      break;
    case '.fish':
      await sock.sendMessage(from, { text: `🎣 @${username} caught a rare 🐟 Sea King worth 🪙 1,200 coins!` }, { quoted: msg });
      break;
    case '.beg':
      await sock.sendMessage(from, { text: `🤲 @${username} begged and received 🪙 150 coins.` }, { quoted: msg });
      break;
    case '.mine':
      await sock.sendMessage(from, { text: `⛏️ @${username} mined 💎 3 Gems & 🪙 850 coins!` }, { quoted: msg });
      break;
    case '.lottery':
      const won = Math.random() > 0.5;
      if (won) {
        const prize = Math.floor(Math.random() * 50000) + 10000;
        await sock.sendMessage(from, { text: `🎰 *JACKPOT!* @${username} won 🪙 ${prize} Coins in the lottery!` }, { quoted: msg });
      } else {
        await sock.sendMessage(from, { text: `🎰 @${username} bought a lottery ticket for 🪙 500 coins but didn't win this round.` }, { quoted: msg });
      }
      break;
    case '.vault-deposit':
      await sock.sendMessage(from, { text: `🏦 Deposited coins into your secure vault!` }, { quoted: msg });
      break;
    case '.vault-withdraw':
      await sock.sendMessage(from, { text: `🏧 Withdrew coins from your vault!` }, { quoted: msg });
      break;
    default:
      break;
  }
}
