module.exports = {
    name: 'stopread',
    description: 'Tắt tự động đọc tin nhắn.',
    execute(message, args, player, client, getAutoRead, setAutoRead) {
        setAutoRead(false);
        message.reply('⏹️ Đã tắt tự động đọc tin nhắn.');
    }
};
