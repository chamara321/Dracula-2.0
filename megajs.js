const Mega = require('megajs');

const email = process.env.MEGA_EMAIL || 'chamarasadakalum68@gmail.com';
const password = process.env.MEGA_PASSWORD || '0724551791';

function loginMega() {
  return new Promise((resolve, reject) => {
    const storage = new Mega.Storage({
      email: email,
      password: password
    });

    storage.once('ready', () => {
      console.log('MEGA සාර්ථකව සම්බන්ධ විය');
      resolve(storage);
    });

    storage.once('error', (err) => {
      console.error('MEGA සම්බන්ධතාව දෝෂයක්:', err);
      reject(err);
    });
  });
}

module.exports = { loginMega };
