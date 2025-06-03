const { QemuInstance, VncStreamer } = require('../index');
const path = require('path');
const fs = require('fs');
//android-x86_64-9.0-r2.iso
//Bliss-Zenith-v16.9.6-x86_64-OFFICIAL-gapps-20240715.iso
//Bliss-v16.9.6-x86_64-OFFICIAL-gapps-20240715.iso
const isoPath = path.join(__dirname, 'Bliss-Zenith-v16.9.6-x86_64-OFFICIAL-gapps-20240715.iso');
const biosPath = path.join(__dirname, 'OVMF_X64.fd');
// Skip download and proceed directly with QEMU initialization

const qemu = new QemuInstance({
    headless: false,
    extraArgs: [
        '-m', '2048',  // Increase memory to 4GB
        '-smp', '4',   // Use 4 CPU cores
        '-cpu', 'max',  // Use maximum available CPU features
        '-machine', 'q35,accel=tcg',  // Use TCG software acceleration with Q35 machine type
        '-bios', biosPath,
        '-device', 'qemu-xhci,id=xhci',  // Add USB 3.0 controller
        '--cdrom', isoPath,  // Use the specified ISO file
    ]
});
qemu.start();

/*const vnc = new VncStreamer({ host: 'localhost', port: 5901 });
vnc.connect((frame) => {
    console.log('Received frame:', frame);
});*/

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
