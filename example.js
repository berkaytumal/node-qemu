const QemuInstance = require('./index');
const VncStreamer = require('./vnc');

// Example: Start QEMU headless with VNC and QMP
const qemu = new QemuInstance({
  headless: true,
  vnc: ':1', // QEMU VNC on :1 (port 5901)
  qmp: '/tmp/qmp-sock', // QMP unix socket
  extraArgs: ['-monitor', 'none', '-qmp', 'unix:/tmp/qmp-sock,server,nowait']
});
qemu.start();

// Example: Connect to VNC and log frames
const vnc = new VncStreamer({ host: 'localhost', port: 5901 });
vnc.connect((frame) => {
  console.log('Received frame:', frame);
});

// Example: Send a key after 5 seconds
setTimeout(() => {
  qemu.sendKey('ctrl-alt-delete');
}, 5000);

// Example: Send a mouse click at (100, 100) after 7 seconds
setTimeout(() => {
  vnc.sendPointer(100, 100, 1); // left button down
  vnc.sendPointer(100, 100, 0); // left button up
}, 7000);

// Stop after 20 seconds
setTimeout(() => {
  qemu.stop();
  vnc.disconnect();
}, 20000);
