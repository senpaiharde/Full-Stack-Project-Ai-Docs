import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
} from 'lucide-react';
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
    icon: BrainCogIcon,
  },
  
];
export default function Home() {
  return (
    <main className="">
      <h1>Lets build a Sass AI Application</h1>
    </main>
  );
}
