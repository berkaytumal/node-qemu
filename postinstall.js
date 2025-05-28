// This script downloads and extracts QEMU for macOS x86_64 or arm64
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const QEMU_VERSION = '8.2.2';
const BIN_DIR = path.join(__dirname, 'bin');
const QEMU_BIN = path.join(BIN_DIR, 'qemu-system-x86_64');

function download(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    if (response.statusCode !== 200) return cb(new Error('Failed to download: ' + url));
    response.pipe(file);
    file.on('finish', () => file.close(cb));
  }).on('error', (err) => {
    fs.unlink(dest, () => cb(err));
  });
}

function extract(tarPath, dest, cb) {
  try {
    execSync(`tar -xzf ${tarPath} -C ${dest} --strip-components=1`);
    cb();
  } catch (e) {
    cb(e);
  }
}

function extractAndBuildQemu(tarPath, dest, cb) {
  try {
    execSync(`tar -xf ${tarPath} -C ${dest}`);
    const extractedDir = fs.readdirSync(dest).find(f => f.startsWith('qemu-') && fs.statSync(path.join(dest, f)).isDirectory());
    if (!extractedDir) return cb(new Error('Extracted QEMU source directory not found.'));
    const srcDir = path.join(dest, extractedDir);
    try {
      console.log('Configuring QEMU (this may take a while)...');
      execSync('./configure --target-list=x86_64-softmmu', { cwd: srcDir, stdio: 'inherit' });
      console.log('Building QEMU (this may take several minutes)...');
      execSync('make -j2', { cwd: srcDir, stdio: 'inherit' });
      const builtBin = path.join(srcDir, 'build', 'x86_64-softmmu', 'qemu-system-x86_64');
      if (!fs.existsSync(builtBin)) {
        // Try alternate path
        const altBin = path.join(srcDir, 'x86_64-softmmu', 'qemu-system-x86_64');
        if (fs.existsSync(altBin)) {
          fs.copyFileSync(altBin, QEMU_BIN);
        } else {
          return cb(new Error('Built QEMU binary not found.'));
        }
      } else {
        fs.copyFileSync(builtBin, QEMU_BIN);
      }
      fs.chmodSync(QEMU_BIN, 0o755);
      cb();
    } catch (e) {
      cb(e);
    }
  } catch (e) {
    cb(e);
  }
}

function checkAndInstallDeps() {
  try {
    execSync('ninja --version', { stdio: 'ignore' });
  } catch {
    console.log('Installing build dependencies with Homebrew...');
    execSync('brew install ninja pkg-config gettext glib pixman meson sphinx-doc', { stdio: 'inherit' });
  }
}

function ensureQemu(cb) {
  if (fs.existsSync(QEMU_BIN)) return cb();
  fs.mkdirSync(BIN_DIR, { recursive: true });
  checkAndInstallDeps();
  const arch = os.arch() === 'arm64' ? 'arm64' : 'x86_64';
  const url = `https://download.qemu.org/qemu-${QEMU_VERSION}.tar.xz`;
  const tarPath = path.join(BIN_DIR, 'qemu.tar.xz');
  console.log('Downloading QEMU source...');
  download(url, tarPath, (err) => {
    if (err) return cb(err);
    console.log('Extracting and building QEMU (this will take several minutes)...');
    extractAndBuildQemu(tarPath, BIN_DIR, (err2) => {
      if (err2) return cb(err2);
      fs.unlinkSync(tarPath);
      cb();
    });
  });
}

ensureQemu((err) => {
  if (err) {
    console.error('QEMU download failed:', err);
    process.exit(1);
  } else {
    console.log('QEMU ready.');
  }
});
