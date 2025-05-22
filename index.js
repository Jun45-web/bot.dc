const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Pola pesan mencurigakan (link scam, nitro palsu, steam palsu, dll)
const suspiciousPatterns = [
    /discord\.gg\/[a-zA-Z0-9]+/i,
    /discord\.com\/invite\/[a-zA-Z0-9]+/i,
    /free\s*nitro/i,
    /nitro\s*gift/i,
    /claim\s*nitro/i,
    /discordapp\.com\/gift/i,
    /steam.*gift/i,
    /steamcommunity\.com\/gift-card/i,
    /@everyone/i,
    /gift.*card/i,
    /airdrop/i,
    /crypto/i,
    /https?:\/\/[^\s]*\.ru/i,
    /https?:\/\/[^\s]*\.tk/i,
];

client.on('ready', () => {
    console.log(`Bot aktif sebagai ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(content));

    if (isSuspicious) {
        try {
            await message.delete();
            console.log(`Pesan mencurigakan dari ${message.author.tag} dihapus.`);

            // Kirim pemberitahuan ke channel tempat pesan dihapus
            await message.channel.send({
                content: `Pesan dari ${message.author} telah dihapus karena mengandung link mencurigakan.`,
                allowedMentions: { users: [] }
            });

            // Kirim log ke channel #log jika ada
            const logChannel = message.guild.channels.cache.find(c => c.name === "log");
            if (logChannel) {
                logChannel.send(`**[AUTO DELETE]** Pesan dari ${message.author.tag} di #${message.channel.name}:\n${message.content}`);
            }

        } catch (err) {
            console.error('Gagal menghapus pesan:', err);
        }
    }
});

client.login(process.env.TOKEN);
