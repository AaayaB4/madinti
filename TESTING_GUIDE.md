# 🚀 Quick Start Guide - Testing Madinti

## Step 1: Start the Backend

```bash
# Terminal 1: Start Docker services
cd ~/madinti
docker compose up -d postgres redis

# Terminal 2: Start backend API
cd backend
npm run dev
```

Backend should be running on **http://localhost:3000**

Test it:
```bash
curl http://localhost:3000/api/health
```

## Step 2: Run Mobile App

```bash
# Terminal 3: Start Expo
cd mobile
npm start
```

This will:
- Start Metro bundler
- Show QR code
- Give you options to run on iOS/Android/Web

### Option A: Run on iOS Simulator (Mac only)
Press **`i`** in the terminal

### Option B: Run on Android Emulator
Press **`a`** in the terminal (requires Android Studio setup)

### Option C: Run on Your Phone
1. Install **Expo Go** app from App Store/Play Store
2. Scan the QR code
3. App will load on your device

### Option D: Run in Web Browser
Press **`w`** in the terminal

## Step 3: Test the App

### Test 1: View Reports
- App should load the Home screen
- See a message "No reports yet" (if database is empty)
- Or see any existing reports

### Test 2: Create Report
1. Tap the green **+** button (bottom right)
2. Allow camera and location permissions
3. Take a photo or select from gallery
4. Select a category (e.g., 🛣️ Road)
5. (Optional) Add description
6. Check that GPS location is detected
7. Tap "Submit Report"

**Expected**: Success message, then returns to home screen

### Test 3: Backend API
Check backend terminal - you should see:
```
POST /api/reports
GET /api/reports
```

## Troubleshooting

### Backend not connecting?
**If running on a physical device**, update the API URL:

Edit `mobile/src/config/constants.ts`:
```typescript
// Change from:
export const API_BASE_URL = 'http://localhost:3000/api';

// To your computer's IP:
export const API_BASE_URL = 'http://192.168.1.XXX:3000/api';
```

Find your IP:
```bash
# Mac
ifconfig | grep "inet " | grep -v 127.0.0.1

# The IP will be something like 192.168.1.X
```

### Metro bundler errors?
```bash
cd mobile
rm -rf node_modules
npm install
npm start -- --clear
```

### Expo permissions not working?
- Make sure you're running on a real device or simulator (not web)
- Allow permissions when prompted

## What to Look For

✅ Home screen loads  
✅ Backend API connection works  
✅ Camera opens when tapping photo button  
✅ GPS location is captured  
✅ Categories can be selected  
✅ Submit shows success message  

---

Once everything works, we'll commit! 🎉
