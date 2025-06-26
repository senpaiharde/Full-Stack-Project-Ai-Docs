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
export async function generateDocs(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User not found');
  }
  console.log('--- Fetching the download URL from supabase... ---');
  const { data, error } = await getSupabaseServerClient
    .from('pdf_files')
    .select('path')
    .eq('id', docId)
    .eq('owner_id', userId)
    .single();

  if (error || !data?.path) {
    console.error(error);
    throw new Error('Could not fetch PDF file path from Supabase.');
  }
  //taking the path
  const path = data.path;
  const downloadUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/pdfs/${path}`;
  console.log(`--- Public download URL: ${downloadUrl} ---`);
  //downloading
  const respone = await fetch(downloadUrl);
  const arrayBuffer = await respone.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

  console.log('--- Loading PDF document... ---');
  // storing
  const loader = new PDFLoader(blob);
  const docs = await loader.load();

  console.log('--- Splitting document into chunks... ---');

  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);

  console.log(`--- Split into ${splitDocs.length} parts ---`);
  return splitDocs;
}

async function namespaceExists(index: Index<RecordMetadata>, namespace: string) {
  if (namespace === null) throw new Error('No namespace value provided.');
  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User not found');
  }

  let pineconeVectorStore;
  // Generate embeddings (numerical representations) for the split documents
  console.log('--- Generating embeddings... ---');

  const embeddings = new OpenAIEmbeddings();
  const index = await pineconeClient.index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, docId);
  if (namespaceAlreadyExists) {
    console.log(`--- Namespace ${docId} already exists, reusing existing embeddings... ---`);
    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });
    return pineconeVectorStore;
  } else {
    /// If the namespace does not exist, download the PDF from
    // supabase via the stored Download URL & generate the embeddings and store them in the Pinecone vector store

    const splitDocs = await generateDocs(docId)
  }
}
