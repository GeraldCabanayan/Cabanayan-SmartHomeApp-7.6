**Smart Home App**

A React Native (Expo) smart home application for monitoring sensors and controlling IoT devices. It is backed by a Node.js/Express REST API and a SQLite database, so device states and sensor readings are saved and persist after the app is closed.
****


**Overview**

The app provides a user interface for interacting with smart home devices and viewing sensor information. The frontend uses React Native with Expo, drawer navigation, and the React Context API for state management. A service layer sends HTTP requests to the backend, which reads and writes data in a SQLite database.

****

**Features**
  - Dashboard for smart home information
  - IoT device management (list devices and turn them on or off)
  - Device status saved in the database
  - Gateway connection status
  - Sensor monitoring (temperature, humidity, light level)
  - Sensor data refresh
  - Loading indicators and error handling
  - React Context API for IoT state management
  - Service layer connecting the app to the backend API
  - Drawer/navigation-based application structure
  - REST API built with Express
  - SQLite database created automatically on first run



****
**Steps for my project to work:**
1. Install dependencies
  - npm install
2. Start the backend (Terminal 1)
  - npm run server

    You should see:

      Connected to SQLite database.
      API running on http://localhost:3000

      On the first run, the database file database/smarthome.db is created automatically with the tables 
      (database/schema.sql) and sample data (database/seed.sql).

3. Start the app (Terminal 2)
  - npx expo start

  Should keep both terminals running while using the app.

****


**My Project Structure.**
├── App.tsx
├── server.js                 # Express server entry point
├── server/
│   ├── config/db.js          # SQLite connection, schema, seed
│   └── routes/
│       ├── devices.js        # /api/devices
│       └── sensors.js        # /api/sensors
├── database/
│   ├── schema.sql            # Table definitions
│   └── seed.sql              # Sample data
└── src/
    ├── config/api.ts         # API base URL
    ├── context/IoTContext.tsx
    ├── model/IoTModels.ts
    ├── services/IoTService.ts
    └── navigation/           # Drawer navigation and screens


    
