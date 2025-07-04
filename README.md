# 🧠 AI-Powered Document Chat App

A full-stack SaaS platform that lets users upload documents (like PDFs) and **chat with them using AI** — powered by OpenAI, LangChain, Pinecone, Supabase, and Clerk.

> “Turn any document into a conversation.”

---

## 🚀 Features

- 📄 Upload PDF documents
- 🔎 Semantic chunking + vector search with Pinecone
- 💬 Chat interface to ask questions about your documents
- 🧠 AI answers powered by LangChain + OpenAI
- 🔐 User authentication with Clerk
- ☁️ Data management via Supabase
- 💳 Stripe integration for payment/subscription
- 🌗 Light & Dark mode with full mobile responsiveness

---

## 🧰 Tech Stack

| Layer       | Tech Used |
|-------------|-----------|
| **Frontend** | React 19, Next.js 15, Tailwind CSS, Radix UI, TypeScript |
| **Auth**     | Clerk, Supabase Auth Helpers |
| **AI Engine**| LangChain, OpenAI GPT |
| **Search**   | Pinecone (Vector DB) |
| **Database** | Supabase |
| **File Upload** | Formidable + pdf-parse |
| **PDF Viewer**  | React-PDF |
| **Payments**    | Stripe |
| **Cloud**       | Supabase (Auth + DB + Storage) |

---

## 🧠 How It Works

1. **Upload a PDF**
   - The document is parsed using `pdf-parse`
   - Content is chunked into semantic blocks

2. **Embed & Store**
   - Each chunk is embedded with `OpenAI Embeddings` via LangChain
   - Vectors are stored in **Pinecone**

3. **Chat with Document**
   - User types a query
   - The system finds similar chunks using Pinecone
   - LangChain injects those chunks into the prompt
   - GPT generates a response based only on relevant document content

4. **Auth & Sync**
   - Clerk handles login, sessions
   - Supabase stores chat logs, document metadata, and user profiles

5. **Payments**
   - Stripe supports subscription plans for premium usage

---

## 🧪 Local Development

### 1. Clone the repo

```bash
git clone https://github.com/senpaiharde/Full-Stack-Project-Ai-Docs.git
cd ai-docs-chat

2:  Install dependencies: npm install


3. Configure environment variables: .env.local file
with following keys

OPENAI_API_KEY=your_openai_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_env
PINECONE_INDEX=your_index

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key

SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret


4: Run the app:  npm run dev




🧩 Integrations
Service	     Purpose
Clerk	       Auth + Session Management
Supabase    	DB, Auth, Storage
OpenAI       Embeddings + Chat Completion
LangChain    	Vector search + context mgmt
Pinecone    	Vector similarity search
Stripe	      Payment integration
