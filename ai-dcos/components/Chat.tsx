'use client';

import { FormEvent, useEffect, useRef, useState, useTransition } from 'react';
import { Button } from './button';
import { Input } from './ui/input';
import { Loader2Icon } from 'lucide-react';

import { useUser } from '@clerk/nextjs';

import { askQuestion } from '@/actions/askQuestion';
import ChatMessage from './ChatMessage';
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
export type Message = {
  id?: string;
  role: 'human' | 'ai' | 'placeholder';
  message: string;
  createdAt: Date;
};

function Chat({ id }: { id: string }) {
  const { user } = useUser();

  const supabase = createClientComponentClient();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`/api/getMessages?file_id=${id}`);
      const { data, error } = await res.json();

      if (error) {
        console.error('Fetch error:', error);
        return;
      }

      const formatted = data.map((m: any) => ({
        id: m.id,
        role: m.role,
        message: m.message,
        createdAt: new Date(m.created_at),
      }));
      setMessages(formatted);
    };

    fetchMessages();
  }, [id]);

  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error('User not found');
      return;
    }

    const q = input.trim();
    if (!q) return;
    setInput('');

    // 1) Push human + placeholder
    setMessages((prev) => [
      ...prev,
      { role: 'human', message: q, createdAt: new Date() },
      { id: 'ai-placeholder', role: 'ai', message: 'Thinking...', createdAt: new Date() },
    ]);

    // 2) Let the server insert both human + AI, and return the AI reply
    startTransition(async () => {
      const { success, message: aiReply } = await askQuestion(id, q);

      if (!success) {
        toast.error(`AI Error: ${aiReply}`);
        // replace placeholder with error text
        setMessages((prev) =>
          prev.map((m) =>
            m.id === 'ai-placeholder'
              ? { role: 'ai', message: `Whoops… ${aiReply}`, createdAt: new Date() }
              : m
          )
        );
        return;
      }

      // 3) On success, replace placeholder with the real reply
      setMessages((prev) =>
        prev.map((m) =>
          m.id === 'ai-placeholder' ? { role: 'ai', message: aiReply!, createdAt: new Date() } : m
        )
      );
    });
  };
  return (
    <div className="flex flex-col h-full overflow-scroll">
      {/* Chat contents */}
      <div className="flex-1 w-full">
        {/* chat messages... */}

        {isPending ? (
          <div className="flex items-center justify-center">
            <Loader2Icon className="animate-spin h-20 w-20 text-indigo-600 mt-20" />
          </div>
        ) : (
          <div className="p-5">
            {messages.length === 0 && (
              <ChatMessage
                key={"placeholder"}
                message={{
                  role: "ai",
                  message: "Ask me anything about the document!",
                  createdAt: new Date(),
                }}
              />
            )}

            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}

            <div ref={bottomOfChatRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex  sticky bottom-0 space-x-2 p-5 bg-indigo-600/75">
        <Input
          className="bg-white"
          placeholder="Ask a Question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <Button type="submit" disabled={!input || isPending}>
          {isPending ? <Loader2Icon className="animate-spin text-indigo-600" /> : 'Ask'}
        </Button>
      </form>
    </div>
  );
}

export default Chat;
