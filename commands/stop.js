const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    name: 'stop',
    description: 'Dừng phát nhạc.',
    execute(message, args, player) {
        if (player.state.status !== AudioPlayerStatus.Playing)
            return message.reply('❌ Không có nhạc nào đang phát.');

        player.stop();
        message.reply('⏹️ Đã dừng phát nhạc.');
    }
};
