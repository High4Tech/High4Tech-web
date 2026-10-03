import { services, projects, resources, articles, faqs, socials } from './content';
import { assistantDefaults } from './assistant-search';

export const defaultSettings = {
  agencyName: 'High4Tech', studioName: 'High4Tech Studio', logo: '/brand/wordmark.png', mark: '/brand/mark.png',
  headline: 'Make the digital feel alive.', introduction: 'We turn ideas into identities, websites, and digital experiences. Thoughtful design. Useful technology. A little personality.',
  aboutTitle: 'Independent minds. Shared curiosity.', aboutText: 'We’re High4Tech. A creative technology studio turning ideas into identities, websites, and digital experiences.',
  email: 'high4tech360@gmail.com', calLink: '', welcomeSubject: 'Your next project starts here.',
  welcomeBody: 'Welcome to High4Tech. We bring design, development, and thoughtful automation together to turn ideas into useful digital experiences.\n\nHave a website, a brand, or a workflow in mind? Tell us about your project today. We’d love to hear what you’re planning and help shape the next step.\n\nReply to this message to start a conversation with our studio.',
};
export const defaultPricing = [
  { title: 'A focused project', price: '$1,490', unit: 'project', label: 'Design & development', intro: 'One clear idea, built with care.', items: ['Discovery and agreed scope','Design and implementation','Review, refinement, and handover'], sample: true },
  { title: 'A smarter workflow', price: '$990', unit: 'workflow', label: 'AI & automation', intro: 'Less repetition. More room to think.', items: ['Workflow discovery','A focused automation prototype','Testing and team handover'], sample: true },
  { title: 'A creative partner', price: '$790', unit: 'month', label: 'Ongoing collaboration', intro: 'Support for what comes next.', items: ['A shared list of priorities','Design and development support','A cadence that fits your team'], sample: true },
];
export const defaultAI = [
  { name:'Workflow automation', kind:'workflow', text:'Connect the steps that slow your team down.', items:['Lead capture and routing','CRM and spreadsheet workflows','Approvals, reminders, and reporting'] },
  { name:'AI assistants', kind:'assistant', text:'Give your knowledge a useful interface.', items:['Service and support assistants','Internal knowledge search','Human handoff and clear boundaries'] },
  { name:'Connected operations', kind:'integration', text:'Help your tools work together.', items:['API and system integrations','Document intake and processing','Status dashboards and notifications'] },
  { name:'AI strategy & prototypes', kind:'workflow', text:'Find a practical starting point before making a bigger investment.', items:['Process and opportunity mapping','A focused proof of concept','Testing and an implementation plan'] },
  { name:'Document intelligence', kind:'integration', text:'Turn incoming documents into information your team can use.', items:['Document field extraction','Exception checks and review queues','Structured exports to business systems'] },
  { name:'Internal knowledge assistants', kind:'assistant', text:'Give your team a clearer path to approved company information.', items:['Knowledge search with source references','Role-based access planning','Human handoff for uncertain answers'] },
];
export const defaultKnowledge = faqs.map(f=>({...f,keywords:f.question,link:'/contact',label:'Contact the studio'}));
export type StudioContent = {
  services: typeof services;
  projects: (typeof projects[number] & { images?: {url:string;alt:string}[] })[];
  resources: typeof resources;
  articles: (typeof articles[number] & {image?:string;publishedAt?:string})[];
  faqs: typeof faqs;
  socials: typeof socials;
  settings: typeof defaultSettings;
  pricing: typeof defaultPricing;
  ai: typeof defaultAI;
  knowledge: typeof defaultKnowledge;
  assistant: typeof assistantDefaults;
};
export const defaultContent: StudioContent = {services,projects,resources,articles,faqs,socials,settings:defaultSettings,pricing:defaultPricing,ai:defaultAI,knowledge:defaultKnowledge,assistant:assistantDefaults};
