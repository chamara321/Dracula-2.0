
// lib/sticker.js

module.exports = {
  name: 'sticker',
  description: 'Convert image or short video to sticker',
  adminOnly: false,
  execute: async (message, client) => {
    try {
      // Check if message has media (image or video)
      if (!message.hasMedia) {
        await client.sendMessage(message.from, 'ස්ටිකර් එකක් හදා ගැනීමට, කරුණාකර රූපයක් හෝ කෙටි වීඩියෝවක් යවන්න.');
        return;
      }

      const media = await message.downloadMedia();

      if (!media || !media.mimetype) {
        await client.sendMessage(message.from, 'සමාවෙන්න, මීඩියා ලබා ගැනීමට නොහැක.');
        return;
      }

      // Only allow images or short videos (e.g. <10 seconds)
      if (!media.mimetype.startsWith('image/') && !media.mimetype.startsWith('video/')) {
        await client.sendMessage(message.from, 'කරුණාකර රූපයක් හෝ කෙටි වීඩියෝවක් යවන්න.');
        return;
      }

      // Send sticker
      await client.sendMessage(message.from, media, { sticker: true });
    } catch (error) {
      console.error('Sticker command error:', error);
      await client.sendMessage(message.from, 'ස්ටිකර් සාදනදී දෝෂයක් සිදු විය. කරුණාකර නැවත උත්සාහ කරන්න.');
    }
  }
};
