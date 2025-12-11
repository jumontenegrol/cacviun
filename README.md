# CACVIUN - Violence Reporting System

A web application for reporting and visualizing violence incidents at Universidad Nacional de Colombia. This project provides an interactive platform with heatmaps, statistics, and incident tracking capabilities.

**Original Repository:** This project is based on [VIPIngeSoftII](https://github.com/juserranor/VIPIngeSoftII.git)

## 🚀 Technology Stack

### Frontend Framework
- **React** `19.2.0` - Modern UI library for building interactive interfaces
- **React Router DOM** `7.9.5` - Client-side routing for Single Page Application
- **TypeScript** - Static typing for enhanced code quality and maintainability
- **Create React App** - Build tooling with Webpack and Babel

### State Management
- **Zustand** `5.0.8` - Lightweight state management with localStorage persistence

### Data Visualization
- **Recharts** `3.5.1` - Interactive charts library
  - Pie charts for category distribution
  - Bar charts for age range analysis
  - Line charts for temporal trends
  - Area charts for monthly patterns

### Maps & Geolocation
- **Leaflet** `1.9.4` - Open-source interactive maps library
- **React Leaflet** `5.0.0` - React components for Leaflet integration
- **Leaflet.heat** `0.2.0` - Heatmap layer for density visualization
- **Turf.js** `7.2.0` - Geospatial analysis (point-in-polygon, distance calculations)

### UI Components
- **React Toastify** `11.0.5` - Toast notifications for user feedback
- **@fontsource/inria-sans** `5.2.8` - Custom typography
- **Custom CSS modules** - Component-specific styling

### Testing
- **Jest** - Testing framework (included in react-scripts)
- **React Testing Library** `16.3.0` - Component testing utilities
- **@testing-library/jest-dom** `6.9.1` - Custom DOM matchers
- **@testing-library/user-event** `13.5.0` - User interaction simulation

### Deployment
- **GitHub Pages** - Static site hosting
- **gh-pages** - Automated deployment script

### Backend Integration
- REST API hosted at `https://cacviun-backend.onrender.com`
- Endpoints: `/report/*`, `/dashboard/*`

## 📁 Project Structure

```
cacviun/
├── public/                 # Static assets
│   ├── index.html         # HTML template
│   ├── manifest.json      # PWA manifest
│   ├── robots.txt         # SEO configuration
│   └── assets/            # Public images and resources
│
├── src/
│   ├── assets/            # Application assets
│   │   └── map.json       # GeoJSON data for campus zones
│   │
│   ├── components/        # Reusable React components
│   │   ├── ConfirmCode.jsx
│   │   ├── DeleteReport.jsx
│   │   ├── EditReport.jsx
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   └── Logo.jsx
│   │
│   ├── context/           # React Context providers
│   │   ├── context.jsx
│   │   └── role_management.js
│   │
│   ├── session/           # Session management
│   │   └── sessionStore.ts  # Zustand store with persistence
│   │
│   ├── styles/            # Component styles
│   │   ├── App.css
│   │   ├── ConfirmCode.css
│   │   ├── Dashboard.css
│   │   ├── DeleteReport.css
│   │   ├── EditReport.css
│   │   ├── Header.css
│   │   ├── Report.css
│   │   └── Statistics.css
│   │
│   ├── vistas/            # Page-level components (views)
│   │   ├── AdminHistory.jsx      # Admin report history
│   │   ├── CreateAccount.jsx     # User registration
│   │   ├── DefineAdmin.jsx       # Admin role assignment
│   │   ├── ForgotPassword.jsx    # Password recovery
│   │   ├── Login.jsx             # Authentication
│   │   ├── PersonalHistory.jsx   # User's report history
│   │   ├── Report.jsx            # Create new report
│   │   └── Statistics.jsx        # Heatmap and statistics dashboard
│   │
│   ├── App.jsx            # Main app component with routing
│   ├── index.jsx          # React app entry point
│   └── index.css          # Global styles
│
├── build/                 # Production build output
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🛠️ Available Scripts

### Development

```bash
npm start
```
Runs the app in development mode at [http://localhost:3000](http://localhost:3000). The page reloads automatically when you make changes.

### Testing

```bash
npm test
```
Launches the test runner in interactive watch mode.

### Production Build

```bash
npm run build
```
Builds the app for production to the `build` folder. Optimizes React for best performance with minification and hashed filenames.

### Deployment

```bash
npm run deploy
```
Builds and deploys the app to GitHub Pages. Automatically runs `predeploy` script before deployment.

## 🌐 Key Features

### Interactive Heatmap
- Real-time violence incident visualization
- Geospatial density analysis using Leaflet.heat
- Fixed map view for desktop, interactive for mobile
- Recent incidents displayed with markers

### Statistics Dashboard
- Category distribution (Pie chart)
- Age group analysis (Bar chart)
- Temporal trends (Line chart)
- Monthly patterns by category (Area chart)
- Stacked bar charts for multi-dimensional analysis

### Report Management
- Create, edit, and delete reports
- Location selection with interactive map
- Real-time validation and feedback
- User authentication and authorization

### Session Management
- Persistent sessions using Zustand + localStorage
- Role-based access control (Admin/User)
- Secure authentication flow

## 🔧 Configuration

### Environment
- Backend API: `https://cacviun-backend.onrender.com`
- GitHub Pages: `https://jumontenegrol.github.io/cacviun/`

### Map Boundaries
The map is constrained to UNAL campus coordinates:
- Center: `[4.638193, -74.084046]`
- Bounds: `[4.6325, -74.0875]` to `[4.6440, -74.0805]`

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/cacviun.git

# Navigate to project directory
cd cacviun

# Install dependencies
npm install

# Start development server
npm start
```

## 🤝 Contributing

This project follows standard React best practices. When contributing:
1. Create feature branches from `main`
2. Write tests for new components
3. Follow existing code style and naming conventions
4. Update documentation as needed

## 📄 License

This project is part of an academic Software Engineering II course at Universidad Nacional de Colombia.

## 🙏 Acknowledgments

- Original codebase: [VIPIngeSoftII](https://github.com/juserranor/VIPIngeSoftII.git)
- Universidad Nacional de Colombia
- OpenStreetMap for map tiles
- All contributors and maintainers
