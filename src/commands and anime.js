export async function handleAnime(sock, msg, command, args, sender) {
  const from = msg.key.remoteJid;
  const username = sender.split('@')[0];

  // 1. Pokémon & Anime Card Summon (Integrating PokéAPI & Imgur)
  if (command === '.summon') {
    const isPokemon = Math.random() > 0.5;
    
    if (isPokemon) {
      // Fetch dynamic Pokémon from PokéAPI
      const pokeId = Math.floor(Math.random() * 150) + 1;
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`);
        const data = await res.json();
        const pokeName = data.name.toUpperCase();
        const pokeImg = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
        const power = data.base_experience * 35;

        const caption = `🎴 *POKÉMON TCG SUMMON* 🎴\n\n👤 Summoner: @${username}\n✨ Pokémon: **${pokeName}**\n📺 Universe: *Pokémon Card Arena*\n⭐ Rarity: SSR\n💪 Power Level: ${power}`;
        await sock.sendMessage(from, { image: { url: pokeImg }, caption, mentions: [sender] }, { quoted: msg });
        return;
      } catch (e) {
        // Fallback Imgur card
      }
    }

    // Custom multi-universe Imgur fallback cards
    const customCards = [
      { name: "Sung Jin-Woo (Shadow Monarch)", anime: "Solo Leveling", power: "9,950", rarity: "SSR+", img: "https://i.imgur.com/3Z5VjQh.jpg" },
      { name: "Uzumaki Naruto (Six Paths Sage)", anime: "Naruto Shippuden", power: "9,700", rarity: "SSR", img: "https://i.imgur.com/3Z5VjQh.jpg" },
      { name: "Son Goku (Ultra Instinct)", anime: "Dragon Ball Super", power: "10,000", rarity: "UR", img: "https://i.imgur.com/3Z5VjQh.jpg" },
      { name: "Alien X (Celestial Sapiens)", anime: "Ben 10", power: "10,500", rarity: "UR+", img: "https://i.imgur.com/3Z5VjQh.jpg" }
    ];
    const card = customCards[Math.floor(Math.random() * customCards.length)];
    const caption = `🎴 *VORTEX CARD SUMMON* 🎴\n\n👤 Summoner: @${username}\n✨ Character: **${card.name}**\n📺 Universe: *${card.anime}*\n⭐ Rarity: ${card.rarity}\n💪 Power Level: ${card.power}`;
    await sock.sendMessage(from, { image: { url: card.img }, caption, mentions: [sender] }, { quoted: msg });
    return;
  }

  if (command === '.auction') {
    await sock.sendMessage(from, { image: { url: 'https://i.imgur.com/3Z5VjQh.jpg' }, caption: `🏷️ *CARD AUCTION HOUSE* 🏷️\n\n🎴 Item: **[SSR] Legendary Artifact**\n💰 Starting Bid: 🪙 5,000 Coins\n\nType \`.bid <amount>\` to place your offer!` }, { quoted: msg });
    return;
  }

  if (command === '.bid') {
    const bidAmount = args[1] || '5500';
    await sock.sendMessage(from, { text: `💰 @${username} placed a bid of 🪙 ${bidAmount} Coins!`, mentions: [sender] }, { quoted: msg });
    return;
  }

  if (command === '.gene-splice') {
    await sock.sendMessage(from, { text: `🧬 @${username} spliced two cards and generated an **[UR] Mutated Shadow Card**!`, mentions: [sender] }, { quoted: msg });
    return;
  }

  if (command === '.inventory') {
    await sock.sendMessage(from, { text: `📦 *CARD INVENTORY FOR @${username}:*\n\n1. [UR] Son Goku\n2. [SSR] Sung Jin-Woo\n3. [SSR] Charizard`, mentions: [sender] }, { quoted: msg });
    return;
  }

  // 2. Dynamic Anime Battle GIFs from OtakuGIFs API (`https://api.otakugifs.xyz`)
  const battleTitles = {
    '.naruto-battle': '🌀 NARUTO NINJA SHIPPUDEN CLASH',
    '.db-battle': '💥 DRAGON BALL SUPER KI BATTLE',
    '.demon-battle': '🗡️ DEMON SLAYER BREATHING ASSAULT',
    '.solo-battle': '👑 SOLO LEVELING SHADOW MONARCH DUEL',
    '.mha-battle': '🦸 MY HERO ACADEMIA QUIRK SMASH',
    '.rezero-battle': '❄️ RE:ZERO ICE BRAND & ONI FURY',
    '.ben10-battle': '⌚ BEN 10 OMNITRIX TRANSFORMATION',
    '.poke-battle': '⚡ POKÉMON ARENA CHAMPIONSHIP SHOWDOWN',
    '.card-duel': '🎴 VORTEX CROSS-UNIVERSE CARD DUEL'
  };

  if (battleTitles[command]) {
    let gifUrl = 'https://cdn.otakugifs.xyz/gifs/fight/001.gif'; // fallback
    try {
      const res = await fetch('https://api.otakugifs.xyz/gif?reaction=fight&format=gif');
      const data = await res.json();
      if (data && data.url) gifUrl = data.url;
    } catch (err) {}

    await sock.sendMessage(from, { 
      video: { url: gifUrl }, 
      gifPlayback: true, 
      caption: `⚔️ *${battleTitles[command]}* ⚔️\n\n🔥 Epic battle sequence triggered by @${username}!`, 
      mentions: [sender] 
    }, { quoted: msg });
  }
}
