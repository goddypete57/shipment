# Shipment Tracking App

A React Native mobile application for tracking shipments. This app allows users to create, view, and manage shipments with offline support and automatic synchronization.

## Features

- Create and view shipments
- Offline support with local storage
- Automatic synchronization when network connection is restored and sending the response to the server(mock api --> [jsonPlaceholder](https://jsonplaceholder.typicode.com/posts))
- Real-time list updates without manual refresh
- Chronological sorting of shipments (newest first)

## Prerequisites

- Node.js (v14 or newer)
- npm or Yarn
- React Native development environment set up ([React Native Environment Setup Guide](https://reactnative.dev/docs/environment-setup))
- For iOS: 
  - Mac computer
  - Xcode (latest version)
  - CocoaPods
- For Android:
  - Android Studio
  - Android SDK
  - Java Development Kit (JDK)

## Installation

1. Clone the repository:
```sh
git clone https://github.com/goddypete57/shipment.git
cd shipment
```

2. Install dependencies:
```sh
# Using npm
npm install

```

3. iOS specific setup:
```sh
cd ios
bundle install
bundle exec pod install
cd ..
```

## Running the App

### Start Metro Bundler:
```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

### Run on iOS:
```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

### Run on Android:
```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── screens/          # Screen components
├── services/         # API and storage services
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Key Features Implementation

### Offline Support
- The app uses AsyncStorage for local data persistence
- New shipments are stored locally when offline
- Automatic synchronization when network connection is restored

### Real-time Updates
- Shipment list automatically updates when:
  - Adding new shipments
  - Returning to the list screen
  - Network connection is restored

### Data Sorting
- Shipments are automatically sorted by creation date (newest first)


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React Native Community
- AsyncStorage for offline data persistence
- NetInfo for network connectivity detection
