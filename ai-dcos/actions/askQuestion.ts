'use server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { auth } from '@clerk/nextjs/server';

const FREE_LIMIT = 3;
const PRO_LIMIT = 20;
export async function askQuestion(id: string, question: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized'); // protect this route with clerk

  const { data: humanMessages, error: humanError } = await getSupabaseServerClient
    .from('chat_messages')
    .select('*', { count: 'exact', head: false })
    .eq('file_id', id)
    .eq('user_id', userId)
    .eq('role', 'human');

  if (humanError) {
    console.error('Error fetching user messages:', humanError.message);
    return { success: false, message: 'Failed to load chat history.' };
  }
  

  const messageCount = humanMessages.length;

  
}
