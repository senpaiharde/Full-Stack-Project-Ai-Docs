'use client';

import { FormEvent, useEffect, useRef, useState, useTransition } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2Icon } from 'lucide-react';

import { useCollection } from 'react-firebase-hooks/firestore';
import { useUser } from '@clerk/nextjs';

import { askQuestion } from '@/actions/askQuestion';
import ChatMessage from './ChatMessage';
import { useToast } from './ui/use-toast';

export type Message = {
  id?: string;
  role: 'human' | 'ai' | 'placeholder';
  message: string;
  createdAt: Date;
};

function Chat({ id }: { id: string }) {
  const { user } = useUser();
  const { toast } = useToast();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);


  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault()

  }
  return (
    <div className="flex flex-col h-full overflow-scroll">
      <div className='flex 1 w-full'>

      </div>

      <form 
      className='flex sticky bottom-0 space-x-2 p-5 bg-indigo-600/75'
      onSubmit={handleSubmit}
      
      >
        <Input 
        placeholder='Ask a Question...'
        value={input}
        onChange={(e) => {setInput(e.target.value)}}
        />
        <Button>Ask</Button>
      </form>
    </div>
  );
}

export default Chat;
