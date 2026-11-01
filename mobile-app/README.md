# 🐾 PetLink Mobile Application

Comprehensive cross-platform mobile application for **PetLink Pakistan**, built with **React Native** and **Expo**. Designed to match the exact aesthetic, features, and brand styling of the PetLink Web Platform.

---

## 📱 Features

- **🐾 Splash Screen:** Animated branded launch matching web splash with "Get Started" prompt.
- **🔐 Authentication:** 
  - Login & Registration with Pakistani mobile validation (`03xx-xxxxxxx`).
  - Role selection (`User`, `Shelter Provider`, `Administrator`).
  - Forgot Password OTP dispatch & verification.
  - Persistent session storage with `@react-native-async-storage/async-storage`.
- **🏠 Dashboard:**
  - Hero banner with quick stats & actions.
  - Essential service quick shortcuts.
  - Featured pets & store supply carousels with pull-to-refresh.
- **🐶 Marketplace:**
  - Full catalog of pets for free adoption & sale.
  - Search by breed, name, city.
  - Filters for Species (Dogs, Cats, Birds, etc.) and Listing Type (Adoption / Sale).
  - List Pet form with image picker and health status checkboxes.
- **🛍️ Pet Store & Cart:**
  - Product catalog categorized by Food, Healthcare, Toys, Accessories.
  - Product details with quantity selector & delivery info.
  - Cart management (item counter, price summary, delivery address, Cash on Delivery / Card options).
- **🏥 Veterinary Clinics:**
  - Directory of verified veterinary clinics in Lahore, Karachi, Islamabad.
  - Direct Phone Call & WhatsApp appointment booking.
- **❤️ Animal Shelters:**
  - Verified animal rescue centers and foster shelters across Pakistan with direct emergency call and donation details.
- **📋 My Pets & Health Tracker:**
  - User's registered pets with rabies and core vaccination status alerts.
- **⚙️ Dynamic Server Config:**
  - Built-in In-App Server Settings modal to test backend connectivity and switch between local Wi-Fi IP (`192.168.1.12:5000`), Android Emulator (`10.0.2.2:5000`), or custom production URL on the fly.

---

## 🚀 How to Run the Mobile App

### 1. Start the Backend Server (if not already running)
```bash
cd server/backend
npm start
```
*Backend runs on port `5000`.*

### 2. Run the Mobile App
Open a terminal in the `mobile-app` directory:
```bash
cd mobile-app
npm start
```

### 3. Open on your Device
- **Physical Phone (Android/iOS):** Install the free **Expo Go** app from Google Play Store or Apple App Store. Scan the QR code displayed in your terminal. Ensure your phone and PC are connected to the same Wi-Fi.
- **Android Emulator:** Press `a` in the terminal.
- **Web Preview:** Press `w` in the terminal.
