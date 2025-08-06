# Gemini Chat - AI Conversation App

A fully functional, responsive, and visually appealing frontend for a Gemini-style conversational AI chat application. Built with React, Redux, and Tailwind CSS.

## 🚀 Live Demo

[Deploy to Vercel](https://vercel.com) or [Deploy to Netlify](https://netlify.com)

### Quick Deploy

```bash
# Clone and deploy
git clone https://github.com/ShadowFax1731/gemini-clone
cd gemini-chat-app
npm install
npm run build
```

## ✨ Features

### 🔐 Authentication

- **OTP-based Login/Signup** using country codes
- **Country data fetching** from restcountries.com API
- **Form validation** using React Hook Form + Zod
- **Simulated OTP** send and validation with setTimeout

### 💬 Chat Interface

- **Real-time messaging** with user and AI messages
- **Typing indicators** - "Gemini is typing..."
- **Auto-scroll** to latest messages
- **Infinite scroll** to load older messages
- **Message timestamps** and copy-to-clipboard functionality
- **Image upload support** with preview and validation
- **Responsive design** for mobile and desktop

### 🎨 UI/UX Features

- **Dark/Light mode toggle** with system preference detection
- **Debounced search** for filtering chatrooms
- **Toast notifications** for all key actions
- **Loading skeletons** and smooth animations
- **Keyboard accessibility** for all interactions
- **Mobile-responsive** design

### 📱 Dashboard

- **Chatroom management** - Create, delete, and search
- **Local storage** for persistent data
- **User profile** with avatar generation
- **Real-time updates** and state management

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Form Validation**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd gemini-chat-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── Login.jsx              # OTP authentication
│   ├── dashboard/
│   │   ├── Dashboard.jsx          # Main dashboard layout
│   │   ├── Sidebar.jsx            # Chatroom list and search
│   │   ├── ChatArea.jsx           # Chat interface
│   │   ├── MessageList.jsx        # Message display with infinite scroll
│   │   ├── Message.jsx            # Individual message component
│   │   ├── MessageInput.jsx       # Message input with image upload
│   │   ├── TypingIndicator.jsx    # AI typing animation
│   │   ├── CreateChatroomModal.jsx # Create chatroom modal
│   │   └── DeleteConfirmModal.jsx # Delete confirmation modal
│   └── AppRouter.jsx              # Route management
├── store/
│   ├── index.js                   # Redux store configuration
│   └── slices/
│       ├── authSlice.js           # Authentication state
│       ├── chatSlice.js           # Chat and messages state
│       └── uiSlice.js             # UI state (dark mode, search, etc.)
├── hooks/
│   └── useDebounce.js             # Custom debounce hook
└── index.css                      # Tailwind CSS styles
```

## 🔧 Implementation Details

### Authentication Flow

- **Country Selection**: Fetches countries from restcountries.com API
- **Phone Validation**: Uses Zod schema for phone number validation
- **OTP Simulation**: Generates random 6-digit OTP stored in localStorage
- **Form Handling**: React Hook Form with Zod validation

### Chat Features

- **Message Throttling**: Simulated AI responses with random delays
- **Infinite Scroll**: Loads older messages when scrolling to top
- **Auto-scroll**: Automatically scrolls to new messages
- **Image Upload**: Base64 encoding with file validation
- **Copy Functionality**: Clipboard API for message copying

### State Management

- **Redux Toolkit**: Centralized state management
- **Local Storage**: Persistent data for chatrooms and messages
- **Real-time Updates**: Immediate UI updates with Redux

### Performance Optimizations

- **Debounced Search**: 300ms delay for search input
- **Lazy Loading**: Images loaded with lazy attribute
- **Virtual Scrolling**: Efficient message rendering
- **Memoization**: Optimized re-renders

## 🎯 Key Features Explained

### Throttling Implementation

AI responses are throttled using `setTimeout` with random delays (1-3 seconds) to simulate realistic AI thinking time.

### Pagination & Infinite Scroll

- Messages are loaded 10 at a time
- Scroll detection triggers older message loading
- Maintains scroll position during loading

### Form Validation

- **Phone Number**: 10-15 digits, numbers only
- **OTP**: Exactly 6 digits
- **Chatroom Title**: 1-50 characters
- **Image Upload**: 5MB limit, image files only

### Dark Mode

- System preference detection
- Persistent localStorage setting
- Smooth transitions between modes

## 🚀 Deployment

### Vercel

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

### Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

## 📱 Mobile Responsiveness

The app is fully responsive with:

- **Mobile-first design**
- **Touch-friendly interactions**
- **Collapsible sidebar** on mobile
- **Optimized layouts** for all screen sizes

## 🔒 Security Features

- **Input sanitization** and validation
- **File type validation** for uploads
- **Size limits** for image uploads
- **XSS prevention** through proper escaping

## 🎨 Customization

### Colors

The app uses a custom color palette defined in `tailwind.config.js`:

- Primary colors for brand elements
- Dark mode variants
- Consistent theming throughout

### Animations

- **Fade-in effects** for new messages
- **Slide-up animations** for modals
- **Pulse animations** for typing indicators
- **Smooth transitions** for all interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **React** for the amazing framework
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Lucide React** for beautiful icons
- **React Hot Toast** for notifications

---

Built with ❤️ for the Gemini Frontend Clone Assignment
