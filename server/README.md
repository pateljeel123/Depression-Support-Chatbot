# Depression Support Chatbot - Backend Server

This is the backend server for the Depression Support Chatbot application. It handles API requests from the frontend and communicates with the Mistral AI API.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the server directory with the following content:

```
PORT=5000
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_API_URL=https://api.mistral.ai/v1/chat/completions
```

4. Start the development server:

```bash
npm run dev
```

The server will start on port 5000 by default.

## API Endpoints

### Health Check

```
GET /
```

Returns a simple message to confirm the API is running.

### Chat

```
POST /api/chat
```

Sends a message to the Mistral AI API and returns the response.

#### Request Body

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ]
}
```

#### Response

Returns the response from the Mistral AI API.

## Running in Production

To start the server in production mode:

```bash
npm start
```