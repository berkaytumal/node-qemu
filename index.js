const { spawn } = require('child_process');
const QMP = require('qemu-qmp');

class QemuInstance {
  constructor(options = {}) {
    this.options = options;
    this.process = null;
    this.qmp = null;
  }

  start() {
    const path = require('path');
    const biosDir = path.join(__dirname, 'bin', 'qemu-8.2.2', 'pc-bios');
    const args = [
      ...(this.options.headless ? ['-nographic'] : []),
      ...(this.options.vnc ? [`-vnc`, this.options.vnc] : []),
      '-L', biosDir,
      ...(this.options.extraArgs || [])
    ];
    this.process = spawn(
      process.env.QEMU_BIN || require('path').join(__dirname, 'bin', 'qemu-system-x86_64'),
      args,
      { stdio: 'inherit' }
    );
    // Optionally, connect QMP after QEMU starts
    if (this.options.qmp) {
      this.qmp = new QMP();
      this.qmp.connect(this.options.qmp, () => {
        console.log('QMP connected');
      });
    }
  }

  sendKey(key) {
    if (this.qmp) {
      this.qmp.execute('send-key', { keys: [key] });
    }
  }

  stop() {
    if (this.process) {
      this.process.kill();
    }
    if (this.qmp && typeof this.qmp.disconnect === 'function') {
      this.qmp.disconnect();
    }
  }
}

module.exports = QemuInstance;
