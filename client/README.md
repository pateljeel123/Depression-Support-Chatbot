# Support Companion App with Supabase Authentication

This project is a mental health support application with secure authentication using Supabase, built with React and Vite.

## Features

- Secure authentication (signup, login, password reset)
- Chat interface with AI support companion
- Mood tracking functionality
- PHQ-9 depression assessment tool
- User onboarding flow
- Dark mode support

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account (free tier available at [supabase.com](https://supabase.com))

### Supabase Setup

1. Create a new Supabase project at [app.supabase.com](https://app.supabase.com)
2. Once your project is created, go to Settings > API in the Supabase dashboard
3. Copy your project URL and anon/public key
4. Open the `.env` file in the project root and replace the placeholder values:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173)

## Authentication Flow

1. **Sign Up**: New users can create an account with email and password
2. **Login**: Existing users can sign in with their credentials
3. **Password Reset**: Users can request a password reset link via email
4. **Onboarding**: After authentication, new users complete a profile setup

## Project Structure

- `src/components/Auth/` - Authentication components (login, signup)
- `src/context/AuthContext.jsx` - Authentication state management
- `src/services/supabaseClient.js` - Supabase client configuration and auth helpers

## Technical Details

This project uses:
- [React](https://reactjs.org/) for the UI
- [Vite](https://vitejs.dev/) for fast development and building
- [Supabase](https://supabase.com/) for authentication and backend services

## Vite Plugins

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
