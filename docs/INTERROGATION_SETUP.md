# AI Interrogation Feature Setup

The detective notebook app now includes an **AI-powered interrogation feature** that allows you to question suspects using Groq AI's completion API.

## Features

- 🎭 **Roleplay Interrogations** - Ask questions to AI-powered suspect characters
- 💬 **Real-time Responses** - Get contextual answers based on suspect profiles
- 📝 **Message History** - Full conversation history with timestamps
- 🎯 **Character Consistency** - AI maintains character throughout the conversation

## Setup

### 1. Get a Groq API Key

1. Visit the [Groq AI dashboard](https://www.groq.ai) or the appropriate developer portal.
2. Sign up or log in to your account.
3. Navigate to **API keys** or **Developer Settings**.
4. Create a new API key and copy it (you won't be able to retrieve it again later).

### 2. Add to Environment Variables

Add your Groq API key to your `.env` file:

```bash
VITE_SUPABASE_URL=https://your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
VITE_GROQ_API_KEY=gsk-your-groq-api-key-here
GROQ_API_KEY=gsk-your-groq-api-key-here
```

### 3. Restart Development Server

```bash
npm run dev
```

## How to Use

1. **Load a Case** - Select a case from the dropdown menu
2. **View Suspects** - All suspects for the case appear in the "Suspects" section
3. **Start Interrogation** - Click the blue "Question" button on any suspect card
4. **Ask Questions** - Type your question in the input box and press Enter or click Send
5. **Review Responses** - AI responds as the suspect character with contextual answers

## How It Works

The interrogation feature:

1. Takes the suspect's name and profile from your Supabase database
2. Creates a system prompt that instructs the AI to roleplay as that character
3. Sends your questions to Groq AI's `groq2-mini` model via the backend proxy.
4. Displays the character's response in real-time
5. Maintains full conversation history

## Suspect Profile Requirements

For the best interrogation experience, populate these fields in your Supabase `suspects` table:

| Field | Type | Purpose |
|-------|------|---------|
| `name` | TEXT | Suspect's name (required) |
| `profile` | TEXT | Character background and personality |
| `role` | TEXT | Occupation or role (e.g., "Business partner") |
| `image` | TEXT | URL to suspect image (optional) |

### Example Profile

```
A smooth-talking business partner with a gambling addiction. 
Known for being charming but evasive about financial matters. 
Recently discovered embezzling company funds. 
Has motive to harm the victim but maintains innocence.
```

## API Costs

Groq AI charges for API usage (check current rates on their site):
- **groq2-mini** (or whichever model you choose) is billed per token
- Each interrogation question uses ~200‑500 tokens
- Budget approximately $0.01‑0.05 per interrogation

**Free tier**: Groq may offer free credits or trial usage; refer to their pricing page.

## Troubleshooting

### "AI API key not configured" Error

- Verify `VITE_GROQ_API_KEY` (and `GROQ_API_KEY` on the backend) are present in your `.env` file
- Ensure the dev server was restarted after adding the key
- Check that the key starts with `gsk-`

### Slow Responses

- API calls can take 2-5 seconds per response depending on load
- Check your network connection
- Verify Groq service status if available, or consult their documentation for uptime information

### Character Not Following Profile

- Ensure the `profile` field in Supabase has detailed character information
- Try asking more specific questions tied to the case
- The AI works best with detailed, nuanced profiles

## Advanced Usage

### Using a Different AI Provider

To use Claude, Anthropic, or another provider:

1. Update `interrogationService.ts` to use your provider's API
2. Change the `createSuspectSystemPrompt` function as needed
3. Update the API endpoint and authentication headers
4. Test with your suspects

### Caching Conversations

The app stores conversation history in component state (not persistent). To save interrogations:

1. Add a database table for conversation history
2. Save messages to database in `InterrogationPanel` component
3. Load previous conversations when re-opening interrogations

## Privacy & Security

⚠️ **Important**: Your interrogation conversations are sent to Groq AI's servers. Do not use sensitive information.

- Groq may store API calls as described in their privacy policy
- Enable OpenAI's Data Privacy & Controls in your account settings
- Never include real case details or victim names

## Support

If you encounter issues:

1. Check the browser console (F12) for error messages
2. Verify your Groq API key is valid
3. Ensure `VITE_GROQ_API_KEY` (and `GROQ_API_KEY`) are properly set in `.env`
4. Check Groq API status or contact their support
