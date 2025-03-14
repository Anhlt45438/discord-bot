const { joinVoiceChannel, createAudioResource } = require('@discordjs/voice');
const playdl = require('play-dl');

module.exports = {
    name: 'play',
    description: 'Phát nhạc YouTube.',
    async execute(message, args, player) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('❌ Hãy vào voice trước!');

        const url = args[0];
        if (!url || !playdl.yt_validate(url)) return message.reply('❌ Link YouTube không hợp lệ.');

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            });

            const stream = await playdl.stream(url, { quality: 2 });
            const resource = createAudioResource(stream.stream, { inputType: stream.type });

            player.play(resource);
            connection.subscribe(player);

            message.reply(`🎶 Đang phát: ${url}`);
        } catch (error) {
            console.error(error);
            message.reply('❌ Không phát được nhạc.');
        }
    }
};
