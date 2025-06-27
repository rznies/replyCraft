# ReplyCraft

ReplyCraft is a modern, Gen-Z-focused web application that uses AI to generate witty, context-aware, and multilingual smart reply suggestions for your text messages. Built with Next.js, Genkit, Vertex AI (Google Gemini), and a beautiful UI powered by Tailwind CSS and Radix UI, ReplyCraft is your ultimate texting sidekick.

## Features

- **Smart Reply Generator:** Generate contextually appropriate and witty reply suggestions using Vertex AI (Google Gemini).
- **Reply Display:** View and easily copy generated replies.
- **Multilingual Support:** Toggle replies between English and Hinglish (English transliterated into Hindi).
- **Contextual Customization:** Adjust reply tone, sender type, relationship vibe, mood, timing, and more for highly personalized suggestions.
- **Modern UI:** Clean, mobile-optimized interface with Gen-Z-friendly colors and icons.
- **Community Feedback (Planned):** Upvote or downvote reply suggestions to improve results.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **AI/LLM:** [Genkit](https://github.com/genkit-dev/genkit) + [Google Gemini (Vertex AI)](https://cloud.google.com/vertex-ai)
- **UI:** [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/)
- **Validation:** [zod](https://zod.dev/)
- **State Management:** React Hooks

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- (Optional) Google Cloud credentials for Vertex AI access

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd replyCraft
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure Environment:**
   - Set up your Google Cloud credentials for Vertex AI (see Genkit docs).
   - Create a `.env` file if needed for API keys or secrets.

### Running the App

- **Development:**
  ```bash
  npm run dev
  # or
  yarn dev
  ```
  The app will be available at [http://localhost:9002](http://localhost:9002)

- **AI/Genkit Dev Server:**
  ```bash
  npm run genkit:dev
  # or
  yarn genkit:dev
  ```

- **Build for Production:**
  ```bash
  npm run build && npm start
  ```

## Usage

1. Enter the incoming message you want to reply to.
2. Select your preferred language (English or Hinglish).
3. Customize the reply by choosing tone, sender type, relationship vibe, mood, timing, and more.
4. Click "Generate" to receive a list of smart, context-aware replies.
5. Copy your favorite reply and send it!

## Project Structure

- `src/app/` — Next.js app directory (pages, layout, API routes)
- `src/ai/` — Genkit AI configuration and smart reply logic
- `src/components/` — UI components (cards, buttons, forms, etc.)
- `src/hooks/` — Custom React hooks
- `src/lib/` — Utility functions
- `docs/` — Project documentation and blueprints

## Style Guide

- **Primary color:** Teal (#008080)
- **Secondary color:** Light gray (#D3D3D3)
- **Accent:** Bright Pink (#FF69B4)
- **Typography:** Clear, readable, mobile-optimized
- **Icons:** Modern, minimalist, scenario-based
- **Layout:** Clean, intuitive, and mobile-friendly

## Contributing

Contributions are welcome! Please open issues or submit pull requests for new features, bug fixes, or improvements.

## License

[MIT](LICENSE)

---

*ReplyCraft — Your Gen-Z Texting Sidekick!*
