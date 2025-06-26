'use server'

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"


export async function generateEmbedding(docId:string) {
    auth().protect()// protect this route with clerk

    // turning A PDF intto embedding
    await generateEmbeddinginPineconeVectorStore(docId);

    revalidatePath('/dashboard');

    return {completed : true}
}