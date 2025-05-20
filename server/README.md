# Depression Support Chatbot - Backend Server

This is the backend server for the Depression Support Chatbot application. It handles API requests from the frontend and communicates with the Mistral AI API. The server now uses an MVC (Model-View-Controller) architecture for better code organization and maintainability.

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

## Project Structure

The server now follows an MVC (Model-View-Controller) architecture:

```
server/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Express middleware
├── models/         # Data and business logic
├── routes/         # Route definitions
├── .env            # Environment variables (not in repo)
├── server.js       # Application entry point
└── package.json    # Project dependencies
```

## API Endpoints

### Health Check

```
GET /
```

Returns a simple message to confirm the API is running.

## Emotional Intelligence

The chatbot now features enhanced emotional intelligence capabilities:

- **Emotion Detection**: Automatically detects emotions in user messages including sadness, anxiety, anger, loneliness, hopelessness, and suicidal thoughts
- **Tailored Responses**: Provides customized responses based on the detected emotion
- **Crisis Support**: Offers appropriate resources for users in crisis

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