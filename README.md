# Anime Content App

A Vue.js Single Page Application (SPA) for displaying dynamic anime content with authentication and responsive design.

## 🚀 Features

- **Dynamic Content Loading**: Fetches random anime content from API
- **Authentication**: Email-based token authentication
- **Responsive Design**: Optimized for mobile and desktop
- **State Management**: Centralized state with Pinia
- **Error Handling**: Comprehensive error handling and user feedback
- **Unit Testing**: Complete test coverage with Vitest
- **Modern UI**: Clean, modern interface with Tailwind CSS

## 📋 Requirements

- Node.js 16+ 
- npm or yarn
- Modern web browser

## 🛠️ Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd anime-content-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for production**
   \`\`\`bash
   npm run build
   \`\`\`

## 🧪 Testing

Run unit tests:
\`\`\`bash
npm run test
\`\`\`

Run tests with UI:
\`\`\`bash
npm run test:ui
\`\`\`

## 📱 Usage

1. **Login**: Enter your email address to authenticate
2. **Browse Content**: View anime content in card format
3. **View Details**: Click on content card to see full details
4. **Refresh**: Use refresh button to load new content
5. **Navigate**: Use back button to return to card view

## 🏗️ Architecture

### Project Structure
\`\`\`
src/
├── components/          # Reusable UI components
├── views/              # Page components
├── stores/             # Pinia state management
├── services/           # API and external services
├── router/             # Vue Router configuration
├── tests/              # Unit tests
└── styles/             # Global styles
\`\`\`

### Key Components

- **LoginView**: Handles user authentication
- **CardView**: Displays content in card format
- **DetailView**: Shows detailed content view
- **ContentStore**: Manages application state
- **ApiService**: Handles API communication

### State Management

The application uses Pinia for state management with the following stores:

- **ContentStore**: Manages authentication, content data, and UI state

### API Integration

The app integrates with two endpoints:
- **Authentication**: `POST /generateToken`
- **Content**: `GET /getContent`

## 🎨 Design Decisions

### Technology Choices

1. **Vue 3 Composition API**: Modern, reactive, and maintainable
2. **Pinia**: Lightweight state management with TypeScript support
3. **Vue Router**: Client-side routing for SPA functionality
4. **Tailwind CSS**: Utility-first CSS for rapid UI development
5. **Axios**: Robust HTTP client with interceptors
6. **Vitest**: Fast unit testing framework

### Code Quality

- **ESLint**: Code linting and formatting
- **Component-based Architecture**: Reusable and maintainable components
- **Error Boundaries**: Comprehensive error handling
- **Loading States**: User feedback during async operations
- **Responsive Design**: Mobile-first approach

## 🔧 Configuration

### Environment Variables

The app uses localStorage for token persistence and doesn't require additional environment variables.

### API Configuration

API endpoints are configured in `src/services/api.js`:
- Base URL for authentication
- Base URL for content fetching
- Request/response interceptors

## 📊 Performance Optimizations

- **Lazy Loading**: Route-based code splitting
- **Image Optimization**: Error handling and fallbacks
- **Caching**: Token persistence in localStorage
- **Minimal Dependencies**: Lightweight bundle size

## 🐛 Error Handling

The application implements comprehensive error handling:

- **API Errors**: Network and server error handling
- **Authentication Errors**: Token validation and refresh
- **Image Loading Errors**: Fallback images
- **User Feedback**: Toast notifications for errors

## 🧪 Testing Strategy

### Unit Tests Coverage

- **Store Logic**: State management and actions
- **API Service**: HTTP requests and error handling
- **Component Logic**: User interactions and data flow
- **Utility Functions**: Helper functions and formatters

### Test Structure

\`\`\`
src/tests/
├── stores/             # Store unit tests
├── services/           # Service unit tests
├── components/         # Component unit tests
└── setup.js           # Test configuration
\`\`\`

## 🚀 Deployment

The application can be deployed to any static hosting service:

1. **Build the application**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Deploy the `dist` folder** to your hosting service

### Recommended Hosting

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📈 Future Enhancements

- **Offline Support**: Service worker for offline functionality
- **Push Notifications**: Real-time content updates
- **User Preferences**: Customizable themes and settings
- **Content Filtering**: Search and filter capabilities
- **Social Features**: Sharing and favorites

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
