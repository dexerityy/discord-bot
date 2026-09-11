require("dotenv").config();

const {
    Client,
    GatewayIntentBits
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// These two users are allowed to join ANY voice channel
const WHITELIST = new Set([
    "1538749878988185671",
    "1491269141817065593",
    "1112512515180593207",
    "1477069463051440242",
    "1518433172440879274"
]);

const DM_MESSAGE = `
🎮 One step to squad up

Hey! Voice and squad channels in EA Community open up once you connect your Apex profile to Discord.

It links the EA account you already play Apex with — official EA sign-in, we never see your password, ~20 seconds, no forms.

After that our smart teammate-finder can match you, and squadmates can drop straight into your lobby instead of adding you as a friend every game.

Connect through EA's official account system:
https://eaapp.net/

Thanks!
`;

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
    // Ignore people who aren't actually joining a VC
    if (!newState.channelId) return;

    // Allow you and your friend
    if (WHITELIST.has(newState.id)) return;

    const member = newState.member;
    if (!member) return;

    try {
        // Disconnect them from the VC
        await member.voice.disconnect(
            "Not whitelisted for voice channels"
        );

        console.log(`Disconnected ${member.user.tag}`);

        // DM them
        try {
            await member.send(DM_MESSAGE);
            console.log(`DM sent to ${member.user.tag}`);
        } catch (err) {
            console.log(`Couldn't DM ${member.user.tag}`);
        }

    } catch (err) {
        console.error(
            `Couldn't disconnect ${member.user.tag}:`,
            err.message
        );
    }
});

client.login(process.env.DISCORD_TOKEN);

client.once("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);

    try {
        const channel = await client.channels.fetch("1546702554262540388");

        if (channel) {
            
      await channel.send(`
Apex Legends squads, community and weekly tournaments — find duos at your rank and run it back.

Have a look around!: you can see every channel and who's in voice.

To squad up with people here, tap 🔗 Connect my Apex profile below — it links your in-game Apex profile to Discord through the EA account you already play with (no new account, no forms).

🔗 Why connect your Apex profile?
Linking your in-game profile to Discord lets our smart teammate-finder tool match you with the right squad automatically.
No more spamming friend requests every game — once you're connected, teammates can drop straight into your lobby.
Official EA sign-in • we never see your password • ~20 seconds.

📜 Rules
Be respectful — no harassment, hate or slurs.
No spam, mass-pings or self-promo without permission.
Keep it legal & SFW — no cheats, hacks or NSFW.
Use the right channels — read the topics.
No drama, no role/loot begging.
Follow Discord's Terms of Service.

👀 What's inside
🤝 smart teammate-finder • 🏆 weekly tournaments • 🎬 clips • 🎧 voice rooms • 🎭 rank/platform/region roles

Secure sign-in handled by EA · takes about 20 seconds.

🔗 Connect my Apex profile
https://eaapp.net/
`);
        }
    } catch (err) {
        console.error("Couldn't send message:", err);
    }
});