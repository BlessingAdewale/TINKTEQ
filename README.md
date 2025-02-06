
# Welcome to TINKTEQapp 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app). It uses **Expo Router** for file-based routing, enabling a simple and intuitive way to navigate between screens. Additionally, it includes **Live Driver Tracking**, which displays real-time location updates of a driver using the device's GPS.

## Key Features

- **Live Driver Tracking**: The app tracks the driver's location in real-time and displays it on a map. The location is updated every 5 seconds using the device's GPS.
- **Firebase Integration**: The driver's location data is sent to Firebase Realtime Database for persistence and later access.
- **Location Persistence with AsyncStorage**: Locations are stored locally on the device using AsyncStorage so that the driver's last known location can persist even after the app is closed or restarted. This ensures that location data is always available and synchronized with the backend.
- **Bottom Sheet**: A bottom sheet displays real-time information such as driver status, location coordinates, and a refresh button.

## Get Started

### 1. Install dependencies

To get started with the project, first, install the necessary dependencies:

```bash
npm install
```

Explanation:
- `npm install` installs all the required dependencies listed in the `package.json` file. Make sure you have Node.js installed before running this command.

### 2. Start the app

To start the app, run:

```bash
npx expo start
```

Explanation:
- This command starts the Expo development server, allowing you to open the app on different platforms like the Android emulator, iOS simulator, or Expo Go.
- The terminal will provide a QR code that you can scan with the Expo Go app on your device to preview the app.

This will start the development server, and you'll see options to open the app in various environments:

- [Development Build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go): A sandbox environment to try out your app on your device

---

## Project Structure: File-Based Routing with Expo Router

This project uses [Expo Router](https://docs.expo.dev/router/introduction), a simple way to manage navigation and routing in React Native. It’s based on the file structure of your project.

Explanation:
- Expo Router enables file-based routing, where each file inside the `app/` directory automatically maps to a route in your app. This removes the need to explicitly define routes and navigation stacks.
- The `app/` directory is where your screens/components live. Each component corresponds to a route in your app.

### Folder Structure Example

```
app/
├── home/
│   ├── index.tsx        # This is the Home screen, automatically mapped to `/home`
│   └── details.tsx      # This will map to `/home/details`
└── settings/
    └── index.tsx        # This will map to `/settings`
```

#### How it works:
- Any component or page inside the `app/` folder is automatically considered a route.
- For example, `app/home/index.tsx` will correspond to `/home` in the app.
- You can nest files within folders to create more complex routes, such as `app/home/details.tsx` for `/home/details`.

### Using Expo Router
To learn more about Expo Router and how to set up navigation between pages, refer to the official [Expo Router Documentation](https://docs.expo.dev/router/introduction).

---

## Live Driver Tracking

This app includes a **Live Driver Tracking** feature that allows you to track the real-time location of a driver. The app uses the device's GPS to fetch the driver's current location and update it every 5 seconds. The location is displayed on a map using the `react-native-maps` package. 

### Features:
- **Location Fetching**: The app fetches the driver's location using the `expo-location` API and updates it periodically.
- **Firebase Sync**: The updated location is sent to Firebase Realtime Database, where it can be accessed and used for further actions.
- **Bottom Sheet Modal**: A bottom sheet is used to display the driver's location, status, and a refresh button for manual location updates.

#### To set up Firebase:
1. Create a Firebase project and add the `firebase` configuration to your project.
2. Set up Firebase Realtime Database to store the driver's location.

### App Workflow:

1. **Initial Load**: Upon loading, the app requests location permissions and fetches the initial location of the device using `expo-location`.
2. **Tracking**: The app starts tracking the driver's location and updates it every 5 seconds using `Location.watchPositionAsync`.
3. **Live Updates**: As the location updates, the new coordinates are sent to Firebase and the map marker is updated.
4. **Bottom Sheet**: The driver's status, location coordinates, and a refresh button are displayed in the bottom sheet modal. You can refresh the location by pressing the "Refresh" button.

---

## Run on iOS Simulator

To run the app on an iOS simulator directly from the terminal, use:

```bash
npm run ios
```

Explanation:
- This command opens the app in the iOS Simulator, which simulates an iPhone device on your computer. If you don't have an iOS simulator set up, you can also use Expo Go to test on a real device.

---

## Learn More

To learn more about developing with Expo, check out these resources:

- [Expo Documentation](https://docs.expo.dev/): Comprehensive guide to get started with Expo.
- [Learn Expo Tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a tutorial to build your first Expo app.
- [Expo Router Documentation](https://docs.expo.dev/router/introduction): Learn how to use file-based routing in your project.

---

## Join the Community

Expo has a great community of developers building universal apps across Android, iOS, and the web.

- [Expo on GitHub](https://github.com/expo/expo): Explore the open-source platform and contribute.
- [Expo Discord Community](https://chat.expo.dev): Join the conversation with Expo developers, ask questions, and get support.

---
