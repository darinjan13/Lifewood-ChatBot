# Lifewood AI Chat Pro

Lifewood AI Chat Pro is a sophisticated, branded conversational AI interface designed for Lifewood Intelligence. It bridges the gap between powerful LLM capabilities and professional workflows by providing a structured, secure, and intuitive environment for AI-driven innovation and logistics strategy.

## ✨ Core Features

- **Multi-Model Orchestration**: Integrated with Google Gemini 2.0 and Flash models for high-performance reasoning and rapid responses.
- **Project-Based Organization**: Advanced folder management system ("Collections") allowing users to categorize and store related conversations.
- **Multimodal Context**: Native support for file attachments (images, documents) with direct processing through the Gemini vision and document analysis APIs.
- **Dynamic Personas**: Customizable system instructions and persona profiles to tailor the AI's expertise to specific business domains.
- **Brand-Centric UI**: A custom-crafted interface following Lifewood's visual identity, built with Tailwind CSS for high performance and responsiveness.
- **Offline Persistence**: Robust local session persistence ensuring your innovation history is saved securely in the browser.
- **Rich Media Rendering**: Full support for GFM (GitHub Flavored Markdown), code syntax highlighting, and interactive UI elements.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) (Functional components, custom hooks)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type safety)
- **AI Engine**: [Google Generative AI SDK](https://github.com/google-gemini/generative-ai-js)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Markdown**: [React-Markdown](https://github.com/remarkjs/react-markdown) & [Remark-GFM](https://github.com/remarkjs/remark-gfm)

## 📁 Architecture

- `src/App.tsx`: Main application controller and state management.
- `src/services/geminiService.ts`:抽象ized AI service layer for model communication.
- `src/components/`: Modular UI system with specialized components for messages, navigation, and settings.
- `src/constants.tsx`: Brand assets, theme definitions, and model configurations.
- `src/types.ts`: Centralized TypeScript definitions for consistent data structures.

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- A Google AI Studio API Key

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📄 License
Private/Proprietary for Lifewood Intelligence.
