const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()  // session save කරගන්න
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Scan the QR code above with your WhatsApp.');
});

client.on('ready', () => {
    console.log('WhatsApp client is ready!');
});

client.on('message', async message => {
    // Group messages පමණක් process කරන්න
    if (!message.from.endsWith('@g.us')) return;

    const chat = await message.getChat();

    if (!chat.isGroup) return;

    const sender = message.author || message.from;  // group message sender id

    // group admins ලැයිස්තුව ගන්න
    const admins = chat.participants.filter(p => p.isAdmin).map(p => p.id._serialized);

    // sender admin ද?
    const isSenderAdmin = admins.includes(sender);

    if (!isSenderAdmin) {
        await client.sendMessage(message.from, 'මෙම command භාවිතා කිරීමට ඔබ admin විය යුතුය.');
        return;
    }

    const msg = message.body.trim().toLowerCase();

    if (msg === '!tagall') {
        // හැමෝම ටැග් කරන්න
        const mentions = chat.participants.map(p => p.id);
        await chat.sendMessage('හැමෝම මේක බලන්න:', { mentions });
    } else if (msg.startsWith('!kick ')) {
        // Kick command - number එක extract කරන්න
        const parts = message.body.split(' ');
        if (parts.length < 2) {
            await client.sendMessage(message.from, 'Kick කරන්න ඕනෙ number එක ටයිප් කරන්න! උදා: !kick 9477xxxxxxx');
            return;
        }
        const numberToKick = parts[1].replace(/\D/g, '') + '@c.us';

        if (admins.includes(numberToKick)) {
            await client.sendMessage(message.from, 'Admin කෙනෙක් Kick කරන්න බැහැ!');
            return;
        }

        try {
            await chat.removeParticipants([numberToKick]);
            await client.sendMessage(message.from, `User ${numberToKick} කණ්ඩායමෙන් ඉවත් කරන ලදී!`);
        } catch (err) {
            await client.sendMessage(message.from, 'Kick කිරීමේදී දෝෂයක් ඇතිවිය.');
        }
    } else if (msg === '!leave') {
        await chat.leave();
    }
});

client.initialize();
