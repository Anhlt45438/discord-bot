const { createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const playdl = require('play-dl');

module.exports = {
    name: 'play',
    description: 'Phát nhạc và tạm dừng đọc tin nhắn.',
    async execute(message, args, player, client, getAutoRead, setAutoRead) {
        const connection = getVoiceConnection(message.guild.id);
        if (!connection) return message.reply('❌ Bot chưa tham gia voice.');

        const url = args[0];
        if (!url || !playdl.yt_validate(url)) return message.reply('❌ Link YouTube không hợp lệ.');

        try {
            setAutoRead(false); // Tạm dừng đọc tin nhắn

            const stream = await playdl.stream(url, { quality: 2 });
            const resource = createAudioResource(stream.stream, { inputType: stream.type });

            player.play(resource);
            connection.subscribe(player);

            message.reply(`🎶 Đang phát nhạc: ${url}`);
        } catch (error) {
            console.error(error);
            message.reply('❌ Không thể phát nhạc.');
        }
    }
};
