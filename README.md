# node-qemu

This module allows you to:
- Launch and manage QEMU instances (headless or windowed)
- Send input events (touch, mouse, key) to the QEMU guest
- Stream the display using VNC

## Getting Started

1. Install dependencies: `npm install`
2. Add this module to your project:
   - From GitHub:
     ```sh
     npm install berkaytumal/node-qemu
     ```
3. Use the API to launch QEMU, send input, and stream display.

Example usage:
```js
const qemu = require('node-qemu');
// Use qemu API to launch instances, send input, and stream display
```

## Features
- QEMU process management
- Input event injection (via QMP or VNC)
- Display streaming (via VNC)

## Requirements
- QEMU installed on your system
- Node.js 18+

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request when your code is ready.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or feedback, feel free to reach out!

<a href="https://www.buymeacoffee.com/berkaytumal" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>