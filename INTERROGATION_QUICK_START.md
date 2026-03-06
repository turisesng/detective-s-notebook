# AI Interrogation Feature - Quick Start

## What's New

Your Detective Notebook now has **AI-powered suspect interrogation**! Question suspects and get real-time AI responses based on their character profiles.

## Installation (2 minutes)

1. **Get Groq API Key** (visit Groq AI dashboard)
   - Visit https://www.groq.ai or your Groq developer portal
   - Generate a new API key

2. **Add to .env file**
   ```bash
   VITE_GROQ_API_KEY=gsk-your-key-here
   GROQ_API_KEY=gsk-your-key-here
   ```

3. **Restart dev server**
   ```bash
   npm run dev
   ```

## Using Interrogation

1. Load a case from the dropdown
2. Find a suspect in the Suspects section
3. Click the blue **"Question"** button on their card
4. Type your question and press Enter
5. AI responds as the suspect character

## Example Questions

- "Where were you on the night of the crime?"
- "Why did you have a motive to harm the victim?"
- "What's your relationship with the other suspects?"
- "Can you prove your alibi?"

## Tips for Best Results

✅ **DO:**
- Ask specific questions about the case
- Reference evidence and suspects
- Ask follow-up questions to uncover contradictions
- Use the suspect's known background

❌ **DON'T:**
- Ask unrelated questions (character will refuse)
- Share real personal information
- Ask for real legal advice
- Use for actual criminal investigations

## No API Key?

See [INTERROGATION_SETUP.md](./INTERROGATION_SETUP.md) for detailed setup guide, troubleshooting, and advanced options.
