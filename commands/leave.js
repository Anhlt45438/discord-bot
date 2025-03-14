const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'leave',
    description: 'Bot thoát khỏi voice.',
    execute(message) {
        const connection = getVoiceConnection(message.guild.id);
        if (connection) {
            connection.destroy();
            message.reply('👋 Đã rời khỏi kênh thoại.');
        } else {
            message.reply('❌ Bot hiện không ở trong voice.');
        }
    }
};
