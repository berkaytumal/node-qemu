const { QemuInstance, VncStreamer } = require('../index');
const path = require('path');
const fs = require('fs');
const https = require('https');

const isoUrl = 'https://distro.ibiblio.org/puppylinux/puppy-bookwormpup/BookwormPup64/10.0.11/BookwormPup64_10.0.11.iso';
const isoPath = path.join(__dirname, 'BookwormPup64_10.0.11.iso');

function downloadIso(url, dest, cb) {
  if (fs.existsSync(dest)) return cb();
  console.log('Downloading Puppy Linux ISO...');
  https.get(url, (response) => {
    if (response.statusCode !== 200) return cb(new Error('Failed to download ISO'));
    const total = parseInt(response.headers['content-length'], 10);
    let downloaded = 0;
    const file = fs.createWriteStream(dest);
    response.on('data', (chunk) => {
      downloaded += chunk.length;
      if (total) {
        const percent = ((downloaded / total) * 100).toFixed(2);
        process.stdout.write(`\rDownloading: ${percent}%`);
      }
    });
    response.pipe(file);
    file.on('finish', () => {
      process.stdout.write('\n');
      file.close(cb);
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => cb(err));
  });
}

downloadIso(isoUrl, isoPath, (err) => {
  if (err) throw err;
  console.log('ISO ready:', isoPath);
  const qemu = new QemuInstance({
    headless: false,
    //vnc: ':1',
    qmp: '/tmp/qmp-sock',
    extraArgs: [
     // '-vnc', ':1',
      '-monitor', 'none',
      '-qmp', 'unix:/tmp/qmp-sock,server,nowait',
      '-cdrom', isoPath,
      '-boot', 'd',
      '-m', '1024'
    ]
  });
  qemu.start();

  const vnc = new VncStreamer({ host: 'localhost', port: 5901 });
  vnc.connect((frame) => {
    console.log('Received frame:', frame);
  });

  setTimeout(() => {
   // qemu.sendKey('ctrl-alt-delete');
  }, 5000);

  setTimeout(() => {
   // vnc.sendPointer(100, 100, 1);
    //vnc.sendPointer(100, 100, 0);
  }, 7000);

  setTimeout(() => {
    //qemu.stop();
    //vnc.disconnect();
  }, 60000);
});
