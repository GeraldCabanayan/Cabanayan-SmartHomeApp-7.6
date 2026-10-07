import { Platform } from 'react-native';

// Where the Node/Express API (server.js) is running.
// - Android emulator: 10.0.2.2 points to your computer's localhost
// - iOS simulator / web: localhost works
// - Physical phone: use your computer's LAN IP, e.g. 'http://192.168.1.10:3000'
const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_URL = `http://${HOST}:3000/api`;
