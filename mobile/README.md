# Madinti Mobile App 📱

React Native app for citizens to report infrastructure issues in Sidi Slimane.

## Features

✅ View all reported issues  
✅ Report new problems with photo  
✅ Auto-detect GPS location  
✅ Category selection (8 types)  
✅ Bilingual interface (Arabic/French)  
✅ Real-time API integration  

## Tech Stack

- **React Native** via Expo
- **TypeScript**
- **React Navigation** (screens)
- **Expo Location** (GPS)
- **Expo Camera & Image Picker** (photos)
- **Axios** (API calls)

## Setup

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Run on Device/Simulator

**iOS Simulator:**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

**Expo Go App:**
1. Install **Expo Go** on your phone
2. Scan QR code from terminal

## Project Structure

```
mobile/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx      # Report list
│   │   └── ReportScreen.tsx    # Create report
│   ├── navigation/
│   │   └── AppNavigator.tsx    # Navigation setup
│   ├── services/
│   │   └── api.ts              # Backend API calls
│   ├── config/
│   │   └── constants.ts        # Colors, categories
│   └── components/             # Shared components (TBD)
├── App.tsx                     # Root component
└── package.json
```

## Screens

### Home Screen
- Lists all reports from backend
- Floating Action Button to create report
- Pull to refresh
- Report status badges

### Report Screen
- 📷 Camera/Gallery photo picker
- 📍 Auto GPS location
- 🏷️ Category grid (bilingual)
- 📝 Optional description
- ✅ Submit to backend

## API Integration

Backend URL configured in `src/config/constants.ts`:
```typescript
export const API_BASE_URL = 'http://localhost:3000/api';
```

**For physical device testing**, change to your computer's IP:
```typescript
export const API_BASE_URL = 'http://192.168.1.XXX:3000/api';
```

## Permissions

App requests:
- 📍 **Location** - To capture report GPS coordinates
- 📷 **Camera** - To take photos of issues
- 🖼️ **Gallery** - To select existing photos

## Development Tips

### Hot Reload
Shake device or press **Cmd+D** (iOS) / **Cmd+M** (Android) to open dev menu.

### Clear Cache
```bash
npm start -- --clear
```

## Next Steps (TODO)

- [ ] Implement actual report submission API
- [ ] Add photo upload to MinIO
- [ ] Map view with report markers
- [ ] User authentication
- [ ] Report detail screen
- [ ] Upvote functionality
- [ ] Push notifications
- [ ] Offline mode
- [ ] i18n (proper Arabic/French translation)

## Troubleshooting

**Metro bundler not starting:**
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

**Expo CLI issues:**
```bash
npm install -g expo-cli@latest
```

**Backend not connecting:**
- Make sure backend is running on `localhost:3000`
- For physical device, use computer's local IP
- Check firewall settings

## Screenshots

(Add screenshots here once app is running)

---

Built for **Hack ton Futur 2026** 🇲🇦
