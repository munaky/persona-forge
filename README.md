# Persona Forge – Chatbot with Preset Personas

**PersonaForge** is an AI-powered chatbot designed to make conversations smarter, more personal, and more fun.  
Instead of a one-size-fits-all assistant, PersonaForge gives you **ready-to-use personas** (like *Teacher, Copywriter, Mentor, or Comedian*) and the freedom to **craft your own unique personas**.

With just a switch, the AI can transform from a friendly teacher into a witty stand-up comedian—or from a business consultant into a motivational coach. 🚀

---

## ✨ Features

- **Preset Personas** → Jump right in with a collection of built-in personas for different use cases.  
- **Custom Persona Builder** → Define your own persona with a *name, description, and tone of voice*.  
- **Dynamic Chat Interface** → Conversations instantly adapt to the selected persona’s style.  
- **Persona Management** → Edit, delete, or save your favorite personas for quick access.  
- **Flexible Mode** → Bypass presets and send prompts directly when you just need a plain AI assistant.  
- **Memory Toggle** → Choose whether the chatbot remembers past conversations or starts fresh each time.  
- **Reasoning Mode** → Enable structured step-by-step reasoning for more accurate and thoughtful responses.  
- **Web Search Integration** → Allow the chatbot to fetch real-time information from the web when needed.  
- **Function Calling (via Webhooks)** → Connect external services or trigger custom actions directly from conversations.  

---

## ⚡ Installation (Next.js)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/persona-forge.git
   cd persona-forge
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root and add your API key:

   ```bash
    GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
    MONGODB_URI=your_mongodb_connection_string
    MONGODB_DB=your_database_name
   ```

4. **Run the server**

   ```bash
   npm run dev
   ```

   Now open [http://localhost:3000](http://localhost:3000) in your browser 🎉
