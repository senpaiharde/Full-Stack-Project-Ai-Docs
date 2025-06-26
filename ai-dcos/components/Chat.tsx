'use client';

import { FormEvent, useEffect, useRef, useState, useTransition } from 'react';
import { Button } from './button';
import { Input } from './ui/input';
import { Loader2Icon } from 'lucide-react';


import { useUser } from '@clerk/nextjs';

import { askQuestion } from '@/actions/askQuestion';
import ChatMessage from './ChatMessage';
import { useToast } from './ui/use-toast';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
export type Message = {
  id?: string;
  role: 'human' | 'ai' | 'placeholder';
  message: string;
  createdAt: Date;
};

function Chat({ id }: { id: string }) {
  const { user } = useUser();
  //const { toast } = useToast();
  const supabase = createClientComponentClient();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const fetchMessages = async () => {
        if(!user)return
        const {data,error} = await supabase
        .from('chat_messages')
        .select('*')
        .eq('file_id',id)
        .order('created_at',{ascending: true})

        if(error){console.error("ERROR fetching messages", error.message); return;}
    }
  },[])
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };
  return (
    <div className="flex flex-col h-full overflow-scroll">
      {/* Chat contents */}
      <div className="flex-1 w-full">
        {/* chat messages... */}
    
        
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex  sticky bottom-0 space-x-2 p-5 bg-indigo-600/75"
      >
        <Input className='bg-white'
          placeholder="Ask a Question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <Button type="submit" disabled={!input || isPending}>
          {isPending ? (
            <Loader2Icon className="animate-spin text-indigo-600" />
          ) : (
            "Ask"
          )}
        </Button>
      </form>
    </div>
  );
}

export default Chat;
