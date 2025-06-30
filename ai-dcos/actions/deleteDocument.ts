'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from "next/cache";
import pineconeClient from "@/lib/pinecone";
import { indexName } from "@/lib/landchain";
