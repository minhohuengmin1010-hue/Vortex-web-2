import { default as makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import pino from 'pino';
import readline from 'readline';
import fs from 'fs';

import { handlePairing } from './commands/pairing.js';
import { handleAudio } from './commands/audio.js';
import { handleEconomy } from './commands/economy.js';
import { handleAnime } from './commands/anime.js';
import { handleFun } from './commands/fun.js';
import { handleAdminControls } from './commands/admin.js';
import { handleRequestBot } from './commands/request.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

const MENU_TEXT = `╭━━━〔 ⚡ 𝐕𝐎𝐑𝐓𝐄𝐗 𝐎𝐌𝐍𝐈-𝐂𝐎𝐑𝐄 v22.0 ⚡ 〕━━━╮
│ 👤 User: @user          │ 🔋 Engine: ONLINE 
│ 🛡️ Rank: Shadow Tier     │ 🪙 Coins: 25,400
│ 🎴 Cards: Multi-Verse   │ 🌐 Mode: Global
╰──────────────────────────────────────╯

┌───〔 🪙 1. 𝐄𝐂𝐎𝐍𝐎𝐌𝐘 & 𝐕𝐀𝐔🇱𝐓 〕
│ .wallet | .balance | .vault-deposit | .vault-withdraw
│ .fish | .beg | .mine | .lottery | .steal | .rob | .crime
└──────────────────────────────────────┈

┌───〔 🖼️ 2. 𝙂𝙍𝙊𝙐𝙋 𝙒𝙀𝙇𝘾𝙊𝙈🇪 & 𝘽𝘼𝙉𝙉𝙀𝙍𝙎 〕
│ .welcome | .goodbye | .setwelcome | .setgoodbye
└──────────────────────────────────────┈

┌───〔 🎭 3. 𝐅𝐔𝐍 & 𝐒𝐎🇨🇮𝐀🇱 𝐀𝐂𝐓🇮𝐎𝐍𝐒 (OtakuGIFs) 〕
│ .slap | .hug | .kiss | .punch | .brick | .truth
└──────────────────────────────────────┈

┌───〔 🎴 4. 𝐕𝐎𝐑𝐓𝐄𝐗 𝐂𝐀𝐑𝐃 & 𝐌𝐔𝐋𝐓𝐈-𝐕𝐄𝐑𝐒𝐄 𝐙𝐎🇳🇪 〕
│ .summon (PokéAPI & Imgur) | .auction | .bid | .gene-splice | .inventory
└──────────────────────────────────────┈

┌───〔 ⚔️ 5. M️U️L️T️I️-️U️N️I️V️E️R️S️E️ B️A️T️T️L️E️S️ (OtakuGIFs) 〕
│ .naruto-battle | .db-battle | .demon-battle | .solo-battle
│ .mha-battle | .rezero-battle | .ben10-battle | .poke-battle | .card-duel
└──────────────────────────────────────┈

┌───〔 🌐 6. 𝐁𝐎𝐓 𝐆𝐑𝐎𝐔🇵 𝐑🇪𝐐𝐔🇪𝐒𝐓 〕
│ .request-bot <group_link>
└──────────────────────────────────────┈

┌───〔 👑 7. 𝐎𝐖🇳🇪🇷 𝐂𝐎🇳𝐓𝐑𝐎🇱🇸 〕
│ .pair <phone> | .unlimited-coins | .unlimited-gems
│ .add-coins @user | .remove-coins @user | .kick @user | .ban @user | .unban @user
│ .make-staff @user | .unmake-staff @user | .make-mod @user | .unmake-mod @user
│ .broadcast <msg>
└──────────────────────────────────────┈

┌───〔 🛡️ 8. 🇲𝐎🇩 𝐂𝐎🇳𝐓𝐑𝐎🇱🇸 〕
│ .unlimited-coins | .add-coins @user | .remove-coins @user
│ .kick @user | .ban @user | .unban @user | .broadcast <msg>
└──────────────────────────────────────┈

┌───〔 ⚙️ 9. 𝐀🇩🇲🇮🇳 𝐂𝐎🇳𝐓🇷𝐎🇱🇸 〕
│ .promote @user | .demote @user | .kick @user
└──────────────────────────────────────┈

┌───〔 🛠️ 10. 𝐒𝐘🇸𝐓🇪🇲 & 𝐓𝐎𝐎🇱🇸 〕
│ .profile | .leaderboard | .settings | .anti-raid | .menu | .help
└──────────────────────────────────────┈

   ╭────────────────────────────╮
   │    ⚡ Vortex Core v22.0 ⚡  │
   │   Type .menu to display    │
   ╰────────────────────────────╯`;

async function startVortexBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');

  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    auth: state
  });

  if (!sock.authState.creds.registered) {
    const phoneNumber = await question('📱 Enter your WhatsApp Phone Number (with country code): ');
    const code = await sock.requestPairingCode(phoneNumber.trim());
    console.log(`\n🔑 Your Primary Pairing Code is: ${code}\n`);
  }

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) startVortexBot();
    } else if (connection === 'open') {
      console.log('⚡ Vortex Bot is online and connected!');
    }
  });

  // Welcome Listener
  sock.ev.on('group-participants.update', async (anu) => {
    try {
      const { id, participants, action } = anu;
      if (action === 'add') {
        for (const num of participants) {
          const caption = `⚡ *WELCOME TO VORTEX ARENA* ⚡\n\nHello @${num.split('@')[0]}!\nType \`.menu\` to check available commands!`;
          const bannerPath = './media/welcome-banner.jpg';
          if (fs.existsSync(bannerPath)) {
            await sock.sendMessage(id, { image: fs.readFileSync(bannerPath), caption, mentions: [num] });
          } else {
            await sock.sendMessage(id, { image: { url: 'https://i.imgur.com/3Z5VjQh.jpg' }, caption, mentions: [num] });
          }
        }
      }
    } catch (err) {}
  });

  // Message Command Router
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const msg = messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

    if (!body.startsWith('.')) return;
    const args = body.trim().split(/ +/);
    const command = args[0].toLowerCase();

    if (command === '.menu' || command === '.help') {
      await sock.sendMessage(from, { text: MENU_TEXT }, { quoted: msg });
    } else if (command === '.pair') {
      await handlePairing(sock, msg, command, args, sender);
    } else if (command === '.request-bot') {
      await handleRequestBot(sock, msg, command, args, sender);
    } else if (['.slap', '.hug', '.kiss', '.punch', '.brick', '.truth'].includes(command)) {
      await handleFun(sock, msg, command, args, sender);
    } else if (['.tt-audio', '.voice-morph'].includes(command)) {
      await handleAudio(sock, msg, command, args, sender);
    } else if (['.wallet', '.balance', '.fish', '.beg', '.mine', '.lottery', '.vault-deposit', '.vault-withdraw'].includes(command)) {
      await handleEconomy(sock, msg, command, args, sender);
    } else if (['.summon', '.auction', '.bid', '.gene-splice', '.inventory', '.naruto-battle', '.db-battle', '.demon-battle', '.solo-battle', '.mha-battle', '.rezero-battle', '.ben10-battle', '.poke-battle', '.card-duel'].includes(command)) {
      await handleAnime(sock, msg, command, args, sender);
    } else if (['.promote', '.demote', '.kick', '.ban', '.unban', '.add-coins', '.remove-coins', '.unlimited-coins', '.unlimited-gems', '.broadcast', '.make-mod', '.unmake-mod'].includes(command)) {
      await handleAdminControls(sock, msg, command, args, sender);
    }
  });
}

startVortexBot();
