module.exports = {
    name: 'read',
    description: 'Bật tự động đọc tin nhắn.',
    execute(message, args, player, client, getAutoRead, setAutoRead) {
        setAutoRead(true);
        message.reply('✅ Đã bật tự động đọc tin nhắn.');
    }
};
