if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Discord Bot đang chạy!'));
app.listen(PORT, () => console.log(`🚀 Server chạy tại cổng ${PORT}`));

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const { getAudioUrl } = require('google-tts-api');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
});

const player = createAudioPlayer();
let autoRead = false;  // mặc định tắt auto đọc tin nhắn

client.once('ready', () => {
    console.log(`✅ Bot đã online: ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content.startsWith(process.env.PREFIX)) {
        const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        if (!client.commands.has(command)) return;

        try {
            client.commands.get(command).execute(message, args, player, client, () => autoRead, (val) => autoRead = val);
        } catch (error) {
            console.error(error);
            message.reply('❌ Có lỗi khi thực hiện lệnh này!');
        }
    } else if (autoRead) {
        const connection = getVoiceConnection(message.guild.id);
        if (connection) {
            const cleanText = message.content.replace(/<@!?(\d+)>|<a?:.+?:\d+>|:[^:\s]*(?:::[^:\s]*)*:|https?:\/\/\S+|\n|\d+/g, '').trim();
            if (!cleanText) return;

            try {
                const url = getAudioUrl(cleanText, { lang: 'vi', slow: false, host: 'https://translate.google.com' });
                const resource = createAudioResource(url);
                player.play(resource);
                connection.subscribe(player);
            } catch (error) {
                console.error(error);
            }
        }
    }
});

client.login(process.env.TOKEN);
