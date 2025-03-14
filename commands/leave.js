const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'leave',
    description: 'Rời khỏi voice.',
    execute(message, args, player, client, getAutoRead, setAutoRead) {
        const connection = getVoiceConnection(message.guild.id);
        if (connection) {
            connection.destroy();
            setAutoRead(false); // Tắt auto đọc khi rời khỏi voice
            message.reply('👋 Đã thoát khỏi voice.');
        } else {
            message.reply('❌ Bot chưa vào voice.');
        }
    }
};
