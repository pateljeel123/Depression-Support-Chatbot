# Depression Support Chatbot Services

## Overview
This directory contains service files that handle external API connections and data management for the Depression Support Chatbot application.

## Files
- `supabaseClient.js` - Handles authentication and database operations using Supabase

## API Integration
The chatbot uses a backend API to process messages and generate responses. The API URL is configured in the Chat component:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/chat';
```

## Recent Updates
- Converted all UI text from Hindi to English
- Enhanced UI with improved styling and animations
- Added functional emoji buttons
- Improved message bubbles with border styling
- Added decorative background elements
- Enhanced header with gradient text and emoji
- Expanded welcome message with more supportive content

## Usage
To use these services in components:

```javascript
import { supabase } from '../services/supabaseClient';

// Example: Get current user
const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  // Use user data
};
```

## Configuration
Make sure to set up the required environment variables in your `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=your_backend_api_url
```