import { ChatOpenAI } from '@langchain/openai';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import pineconeClient from './pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { PineconeConflictError } from '@pinecone-database/pinecone/dist/errors';
import { Index, RecordMetadata } from '@pinecone-database/pinecone';
import { getSupabaseServerClient } from './supabaseServer';
import { auth } from '@clerk/nextjs/server';

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4o',
});

export const indexName = 'papafam';

async function fetchMessagesFromDB(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('User not found');
  }
  console.log('--- Fetching chat history from the supabase database... ---');
  // Get the last 6 messages from the chat history
  const { data, error } = await getSupabaseServerClient
    .from('ai_messages')
    .select('role, message')
    .eq('session_id', docId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) throw new Error('Failed to fetch chat history: ' + error.message);

  const chatHistory = data.map((msg) =>
    msg.role === 'human' ? new HumanMessage(msg.message) : new AIMessage(msg.message)
  );
  console.log(`--- fetched last ${chatHistory.length} messages successfully ---`);
  console.log(chatHistory.map((msg) => msg.content.toString()));

  return chatHistory;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User not found');
  }

  let pineconeVectorStore;
}
