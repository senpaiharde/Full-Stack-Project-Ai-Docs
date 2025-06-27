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
      if (!user) return;
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('file_id', id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('ERROR fetching messages', error.message);
        return;
      }

      const formatted = data.map((m) => ({
        id: m.id,
        role: m.role,
        message: m.message,
        createdAt: new Date(m.created_at),
      }));
      setMessages(formatted);
    };
    fetchMessages();
    const channel = supabase
      .channel(`realtime:chat_messages:file:${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `file_id=eq.${id}`,
        },
        (payload) => {
          const newMsg = payload.new as {
            id: string;
            role: 'human' | 'ai';
            message: string;
            created_at: string;
          };
          setMessages((prev) => [
            ...prev,
            {
              id: newMsg?.id,
              role: newMsg.role,
              message: newMsg.message,
              createdAt: new Date(newMsg.created_at),
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, id, supabase]);

  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const q = input.trim();
    if (!q) return;
    setInput('');

    const humanMessage: Message = {
      role: 'human',
      message: q,
      createdAt: new Date(),
    };
    const aiPlaceholder: Message = {
      role: 'ai',
      message: 'Thinking...',
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, humanMessage, aiPlaceholder]);

    await supabase.from('chat_messages').insert({
      file_id: id,
      user_id: user?.id,
      rile: 'human',
      message: q,
    });

    startTransition(async () => {
      const { success, message } = await askQuestion(id, q);

      if (!success) {
        toast.error('Error', {
          description: message,
        });

        setMessages((prev) =>
          prev.slice(0, prev.length - 1).concat([
            {
              role: 'ai',
              message: `whoops.... ${message}`,
              createdAt: new Date(),
            },
          ])
        );
        return;
      }

      await supabase.from('chat_messages').insert({
        file_id: id,
        user_id: user?.id,
        rile: 'ai',
        message,
      });
    });
  };
  return (
    <div className="flex flex-col h-full overflow-scroll">
      {/* Chat contents */}
      <div className="flex-1 w-full">
        {messages.length === 0 ? (
          <div>
            hey
            {/**<ChatMessage key="placeholder" />**/}
          </div>
        ) : (
          <div className="p-5">
            {messages.map((messages, index) => (
              <div key={index}>
                <p>{messages.message}</p>
                {/**<ChatMessage key={index} message={messages} />**/}
              </div>
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
