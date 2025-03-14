const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    name: 'stop',
    description: 'Dừng nhạc hiện tại.',
    execute(message, args, player) {
        if (player.state.status === AudioPlayerStatus.Playing) {
            player.stop();
            message.reply('⏹️ Đã dừng phát nhạc.');
        } else {
            message.reply('❌ Không có nhạc nào đang phát.');
        }
    }
};
