'use client';
import React from 'react';
import { Message } from './Chat';
import Image from 'next/image';
import { BotIcon, Loader2Icon } from 'lucide-react';
import Markdown from 'react-markdown';
import { useUser } from '@clerk/nextjs';

function ChatMessage({ message }: { message: Message }) {
  const isHuman = message.role === 'human';
  const { user } = useUser();
  return <div></div>;
}

export default ChatMessage;
