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
      <div className='bg-white py-24 sm:py-32 rounded-md drop-shadow-xl'>
        <div>
 hello
        </div>
      </div>
    </main>
  );
}
