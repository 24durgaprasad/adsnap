# AdGenius - AI Video Ad Generator

A full-stack application that generates professional video advertisements using AI.

## Architecture

- **Backend**: Express.js server with Gemini AI, Pexels API, and ElevenLabs integration
- **Frontend**: React/Vite application with modern UI components
- **Video Processing**: FFmpeg for video editing and compilation

## Quick Start

### Prerequisites
- Node.js (v16+)
- FFmpeg installed and accessible in PATH
- API Keys for:
  - Google Gemini AI
  - Pexels
  - ElevenLabs

### Setup

1. **Install Backend Dependencies**
   ```bash
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd gemini-ad-craft-main
   npm install
   cd ..
   ```

3. **Configure Environment Variables**
   Create `.env` file in root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   PEXELS_API_KEY=your_pexels_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ```

### Development

**Option 1: Use the automated script**
```bash
start-dev.bat
```

**Option 2: Manual startup**

Terminal 1 (Backend):
```bash
node index.js
```

Terminal 2 (Frontend):
```bash
cd gemini-ad-craft-main
npm run dev
```

### Access Points

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000/api
- **Generated Videos**: http://localhost:3000/videos/

## API Endpoints

### POST /api/response
Generates a video advertisement from text prompt.

**Request Body:**
```json
{
  "prompt": "Revolutionary fitness app that transforms lives",
  "options": {
    "duration": 15,
    "style": "modern",
    "aspectRatio": "16:9",
    "voiceover": true,
    "musicIntensity": 50,
    "template": "dynamic"
  }
}
```

**Response:**
```json
{
  "title": "Generated Ad Title",
  "videoUrl": "/videos/ad_1234567890.mp4"
}
```

## Project Structure

```
d:\version1\
├── index.js                 # Backend server entry point
├── routes/
│   └── response.js          # Main API route handler
├── public/
│   └── videos/              # Generated video files
├── gemini-ad-craft-main/    # Frontend React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Application pages
│   │   └── assets/          # Static assets
│   └── vite.config.ts       # Vite configuration
├── .env                     # Environment variables
└── start-dev.bat           # Development startup script
```

## Features

- **AI Storyboard Generation**: Creates detailed video scripts using Gemini AI
- **Stock Video Integration**: Automatically finds relevant videos from Pexels
- **AI Voiceover**: Generates natural speech using ElevenLabs
- **Video Compilation**: Combines scenes with subtitles and audio using FFmpeg
- **Modern UI**: Responsive React interface with glass morphism design
- **Real-time Progress**: Live updates during video generation

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for frontend origin
2. **FFmpeg Not Found**: Install FFmpeg and add to system PATH
3. **API Rate Limits**: Check API key quotas for external services
4. **Port Conflicts**: Ensure ports 3000 and 8080 are available

### Development Tips

- Use browser dev tools to monitor API calls
- Check backend console for detailed error logs
- Verify all environment variables are set correctly
- Test API endpoints directly using tools like Postman
