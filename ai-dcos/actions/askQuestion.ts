'use server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { auth } from '@clerk/nextjs/server';
import { Message } from '@/components/Chat';
import { generateLangchainCompletion } from '@/lib/landchain';

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

  const { data: subData, error: subError } = await getSupabaseServerClient
    .from('subscriptions')
    .select('is_pro')
    .eq('user_id', userId)
    .maybeSingle();

  if (subError) {
    console.error('Error fetching user data:', subError.message);
    return { success: false, message: 'Failed to check membership status.' };
  }

  const isPro = subData?.is_pro ?? false;

  if (!isPro && messageCount >= FREE_LIMIT) {
    return {
      success: false,
      message: `Upgrade to PRO to ask more than ${FREE_LIMIT} questions.`,
    };
  }

  if (isPro && messageCount >= PRO_LIMIT) {
    return {
      success: false,
      message: `You've reached the PRO limit of ${PRO_LIMIT} questions for this file.`,
    };
  }

  const userMessage: Message = {
    role: 'human',
    message: question,
    createdAt: new Date(),
  };

  const { error: insertUserError } = await getSupabaseServerClient.from('chat_messages').insert([
    {
      user_id: userId,
      file_id: id,
      role: userMessage.role,
      message: userMessage.message,
      created_at: userMessage.createdAt.toISOString(),
    },
  ]);

  if (insertUserError) {
    console.error('Failed to insert user message:', insertUserError.message);
    return { success: false, message: 'Failed to ask question.' };
  }

  const reply = await generateLangchainCompletion(id, question);

  const aiMessage: Message = {
    role: 'ai',
    message: reply,
    createdAt: new Date(),
  };

  const { error: insertAiError } = await getSupabaseServerClient.from('chat_messages').insert([
    {
      user_id: userId,
      file_id: id,
      role: aiMessage.role,
      message: aiMessage.message,
      created_at: aiMessage.createdAt.toISOString(),
    },
  ]);

  if (insertAiError) {
    console.error('Failed to insert AI message:', insertAiError.message);
    return { success: false, message: 'Failed to store AI reply.' };
  }

  return { success: true, message: null };
}
