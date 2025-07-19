# Personal Dashboard Raycast Extension

A powerful Raycast extension that serves as your personal dashboard, providing quick access to daily essentials like weather updates, personalized greetings, inspirational quotes, and task management.

## Features

### 🌤️ Weather Information
- Real-time weather updates based on your location
- Detailed weather metrics including:
  - Temperature
  - Humidity
  - Heat index
  - Weather conditions
  - Personalized weather advice

### 👋 Personal Greetings
- Time-aware greetings that change throughout the day
- Personalized with your first name

### 💭 Daily Quotes
- Inspirational quotes to start your day
- Refreshes with each visit

### ✅ Task Management
- Create and manage to-do items
- Smart date parsing for reminders:
  - Natural language support ("tomorrow", "tonight", "day after tomorrow")
  - Specific date/time formats
- Mark tasks as complete
- Delete tasks
- User-specific storage for multi-user support
- Context-aware notifications for reminders

### 🚗 Commute Information
- Quick access to your work commute details
- Integration with maps for route information

## Prerequisites

Before installing the extension, make sure you have:

- [Raycast](https://raycast.com/) installed on your machine
- Node.js (v16 or later)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/asasin235/my-raycast-app.git
   cd my-raycast-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the backend:
   ```bash
   cd backend
   npm install
   npm run migration:run
   npm start
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Configuration

1. Open Raycast Settings
2. Navigate to Extensions
3. Find "Personal Dashboard"
4. Configure the following settings:
   - First Name (for personalized greetings)
   - Work Address (for commute information)

## Development

### Project Structure

```
raycast-first-ext/
├── src/
│   ├── show-my-name.tsx    # Main dashboard view
│   ├── weather.ts          # Weather service
│   ├── quotes.ts          # Quotes service
│   ├── time.ts           # Time-based greeting service
│   └── time-parser.ts    # Natural language date parser
├── backend/
│   ├── src/
│   │   ├── index.ts      # Express server
│   │   ├── data-source.ts # Database configuration
│   │   └── entity/
│   │       └── Note.ts   # Note entity
│   └── migrations/       # Database migrations
```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the extension
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Backend API

The backend server runs on `http://localhost:3000` and provides:
- Note storage and retrieval
- User-specific data management
- Data persistence using SQLite

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m "Add some AmazingFeature"`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Raycast](https://raycast.com/) for the amazing extension platform
- [Open-Meteo](https://open-meteo.com/) for weather data
- All contributors who have helped shape this project
