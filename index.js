const ffmpeg = require('@ffmpeg-installer/ffmpeg');
process.env.FFMPEG_PATH = ffmpeg.path;

if (!process.env.TOKEN || !process.env.PREFIX) {
    console.error("❌ Thiếu biến môi trường. Vui lòng kiểm tra lại trên Railway.");
    process.exit(1); // Ngăn chặn bot chạy nếu thiếu token
}

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080; // Chỉnh sửa PORT để phù hợp với Railway

app.get('/', (req, res) => res.send('Discord Bot đang chạy!'));
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server chạy tại cổng ${PORT}`));

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

// Bắt lỗi để tránh bot bị crash
client.on('error', error => {
    console.error("⚠️ Lỗi Discord Client:", error);
});
client.on('shardError', error => {
    console.error("⚠️ Lỗi Shard:", error);
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
                console.error("❌ Lỗi khi tạo audio từ Google TTS:", error);
            }
        }
    }
});

try {
    client.login(process.env.TOKEN);
} catch (error) {
    console.error("❌ Lỗi khi đăng nhập bot:", error);
    process.exit(1);
}
