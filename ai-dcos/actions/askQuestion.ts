'use server';
import { auth } from '@clerk/nextjs/server';


export async function askQuestion(id: string, question: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized'); // protect this route with clerk
}
