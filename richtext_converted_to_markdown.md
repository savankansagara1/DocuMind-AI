Perfect 👍Below is a **clean, professional, recruiter-/client-ready README** written exactly the way **good engineers present real products**.

You can **copy-paste this directly as README.md**.

📄 DocuMind AI
==============

**ChatGPT-like PDF & Knowledge Assistant (RAG-Powered)**

DocuMind AI is a full-stack **Retrieval-Augmented Generation (RAG)** application that allows users to **upload PDFs and chat with them intelligently**, while also supporting **general AI conversation** when no document context is provided.

Built with a **production-grade architecture**, DocuMind AI combines modern LLMs, vector search, and a clean chat UI to deliver accurate, context-aware answers.

🚀 Live Demo
------------

*   **Frontend (Vercel):** [https://docu-mind-ai-zeta.vercel.app/](https://docu-mind-ai-zeta.vercel.app/)
    
*   **Backend API (Render):** [https://documind-ai-2.onrender.com](https://documind-ai-2.onrender.com/)
    

✨ Key Features
--------------

### 📌 Document-Aware Chat (RAG)

*   Upload any PDF document
    
*   Automatically chunks and indexes content
    
*   Answers questions **strictly from document context**
    

### 🤖 General AI Chat

*   Works like ChatGPT when no PDF is selected
    
*   Intelligent fallback if document context is not relevant
    

### 🧠 Contextual Memory

*   Maintains conversation history per session
    
*   Supports natural follow-up questions
    

### ⚡ Scalable Vector Search

*   Uses **Pinecone** for fast semantic similarity search
    
*   Isolates documents using namespaces (multi-PDF ready)
    

### 🌐 Modern Web UI

*   ChatGPT-style interface
    
*   PDF upload + chat in one flow
    
*   Clear distinction between **PDF mode** and **General mode**
    

### ☁️ Cloud Deployed

*   Frontend on **Vercel**
    
*   Backend on **Render**
    
*   Designed for real-world production usage
    

🏗️ System Architecture
-----------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User (Browser)     ↓  React UI (Vercel)     ↓  Express API (Bun, Render)     ↓  LangChain RAG Pipeline     ↓  Pinecone Vector Database     ↓  LLM (Groq)   `

🧠 How It Works (High Level)
----------------------------

1.  **PDF Upload**
    
    *   User uploads a PDF
        
    *   Backend saves it temporarily
        
    *   Document is chunked and embedded
        
    *   Vectors are stored in Pinecone under a unique namespace
        
2.  **Chat Flow**
    
    *   User asks a question
        
    *   If a pdfId exists → RAG search is performed
        
    *   Relevant chunks are sent to the LLM
        
    *   If no relevant context is found → fallback to general chat
        
3.  **Conversation Memory**
    
    *   Recent messages are stored per session
        
    *   Enables follow-up questions with context
        

🛠️ Tech Stack
--------------

### Frontend

*   React (Vite)
    
*   JavaScript
    
*   Fetch API
    
*   Deployed on **Vercel**
    

### Backend

*   Bun runtime
    
*   Node.js / Express
    
*   LangChain
    
*   Multer (PDF upload)
    
*   Deployed on **Render**
    

### AI & Data

*   Groq LLM API
    
*   Pinecone Vector Database
    
*   Google Generative AI Embeddings
    
*   LangChain PDF Loader
    

📂 Project Structure
--------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   company-chatbot/  ├── routes/  │   ├── chat.route.js  │   └── upload.route.js  ├── services/  │   ├── chat.service.js  │   └── pdf.service.js  ├── prepare.js  ├── server.js  ├── uploads/  └── package.json   `

Frontend is maintained separately in a chat-ui project.

⚙️ Environment Variables
------------------------

### Backend (Render)

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   GROQ_API_KEY=your_api_key  PINECONE_API_KEY=your_api_key  PINECONE_INDEX_NAME=your_index_name   `

### Frontend (Vercel)

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   VITE_BACKEND_URL=https://your-backend-url   `

▶️ Running Locally
------------------

### Backend

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bun install  bun server.js   `

### Frontend

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm install  npm run dev   `

🔐 Design Decisions & Stability Notes
-------------------------------------

*   Uses **disk-based PDF uploads** (safe on Render)
    
*   Avoids unstable PDF parsing logic
    
*   Relies on LangChain’s proven PDFLoader
    
*   Keeps infrastructure simple and reliable
    
*   Optimized for correctness before optimization
    

📈 Future Enhancements (Optional Roadmap)
-----------------------------------------

*   User authentication (JWT / OAuth)
    
*   Persistent chat history (Redis / DB)
    
*   Streaming responses (typing effect)
    
*   PDF management dashboard
    
*   Usage analytics & limits
    

🧑‍💻 Author
------------

**Savan Kansagara**Aspiring Software Engineer | GenAI & Full-Stack Developer

*   GitHub: [https://github.com/savankansagara1](https://github.com/savankansagara1)
    
*   LinkedIn: [https://www.linkedin.com/in/savan-kansagara/](https://www.linkedin.com/in/savan-kansagara/)
    

🏆 Why This Project Matters
---------------------------

DocuMind AI is not just a ordinary project.It demonstrates:

*   Real-world **RAG architecture**
    
*   Production debugging & rollback skills
    
*   Cloud deployment experience
    
*   Clean separation of frontend & backend
    
*   Strong understanding of LLM limitations and design
    

This project reflects **industry-ready engineering practices**.