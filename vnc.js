const rfb = require('rfb2');

class VncStreamer {
  constructor({ host = 'localhost', port = 5900, password = '' }) {
    this.host = host;
    this.port = port;
    this.password = password;
    this.rfb = null;
  }

  connect(onFrame) {
    this.rfb = rfb.createConnection({
      host: this.host,
      port: this.port,
      password: this.password
    });
    this.rfb.on('connect', () => {
      console.log('VNC connected');
    });
    this.rfb.on('rect', (rect) => {
      if (onFrame) onFrame(rect);
    });
    this.rfb.on('error', (err) => {
      console.error('VNC error:', err);
    });
    this.rfb.on('end', () => {
      console.log('VNC disconnected');
    });
  }

  sendPointer(x, y, buttonMask = 0) {
    if (this.rfb) {
      this.rfb.pointerEvent(x, y, buttonMask);
    }
  }

  sendKey(keysym, down = true) {
    if (this.rfb) {
      this.rfb.keyEvent(keysym, down);
    }
  }

  disconnect() {
    if (this.rfb) {
      this.rfb.end();
    }
  }
}

module.exports = VncStreamer;
