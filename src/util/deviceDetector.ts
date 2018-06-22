let dims: string = ''+window.screen.width+'x'+window.screen.height;
let deviceName: string;

if (dims === '1024x600') {
  deviceName = 'student';
} else if (dims === '800x1280') {
  deviceName = 'teacher';
} else {
  deviceName = 'web';
}

export class DeviceDetector {
  static get dimensions(): string {
    return dims;
  }
  static get device(): string {
    return deviceName;
  }
}
