import { Button } from '@/components/button';
import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
const features = [
  {
    name: 'store your PDF Documents',
    description: 'Keep all your PDF files save and easily accessible anytime',
    icon: GlobeIcon,
  },
  {
    name: 'Fast Responses',
    description: 'ensuring you get all the information you need instantly',
    icon: ZapIcon,
  },
  {
    name: 'Chat Memorisation',
    description:
      'Our intelligent chatbot remembers previous interactions, providing a seamless and personalized experience',
    icon: BrainCogIcon,
  },
  {
    name: 'Interactive PDF Viewer',
    description:
      'Engage with your PDFs like never before using our intuitive and interactive viewer.',
    icon: EyeIcon,
  },
  {
    name: 'Cloud Backup',
    description:
      'Rest assured knowing your documents are safely backed up on the cloud , protected from loss or damage',
    icon: ServerCogIcon,
  },
  {
    name: 'Responsive Across Devices',
    description:
      'Access and chat with your PDFs seamlessly on any device, wether its your desktop, tablet, or smartPhone.',
    icon: MonitorSmartphoneIcon,
  },
];
export default function Home() {
  return (
    <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600">
      <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-xl">
        <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Your interactive Document Companion
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Transform Your PDFs into interactive Conversations
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Introducing{''}
              <span className="font-bold text-indigo-600">Chat with PDF.</span>
              <br />
              <br /> Upload your documents, and our chatbot will answer questions, summarize
              content, and answer all your Qs, Ideal for everyone,{' '}
              <span className="text-indigo-600">Chat with PDF</span>
              turns static documents into <span className="font-bold">dynamic conversations</span>,
              enhancing productivity 10x fold effortlessly
            </p>
          </div>
          <Button asChild className="mt-10">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Image
              alt="App screenshot"
              src="https://i.imgur.com/VciRSTI.jpeg"
              width={2432}
              height={1442}
              className="mb-[-0%] rounded-xl shadow-2xl right-1 ring-gray-900/10"
            />
            <div aria-hidden="true" className="relative">
              <div className="absolute bottom-0 -inset-x-32 bg-gradient-to-t from-white/95 pt-[5%]" />
            </div>
          </div>
        </div>

        <div className='mx-auto mt-16 max-w7xl px-6 sm:mt0-20 md:mt-24 lg:px-8'>
            <dl className='mx-auto grid max-w-2xl grid-cols-1 gap-x-6 
            gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 
            lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16'>
                {features.map((feature) => (
                    <div className='relative pl-9' key={feature.name}>
                        <dt className=' inline font-semibold text-gray-900'>
                            <feature.icon 
                            aria-hidden="true"
                            className='absolute left-1 top-1 h-5 w-5'/>
                        </dt>
                        <dd>{feature.description}</dd>
                    </div>
                ))}
            </dl>

        </div>
      </div>
    </main>
  );
}
