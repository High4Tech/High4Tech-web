import type { Access, CollectionConfig, Field, GlobalConfig } from 'payload';

const authenticated:Access=({req})=>Boolean(req.user);
const published:Access=({req})=>req.user?true:{_status:{equals:'published'}};
const access={read:published,create:authenticated,update:authenticated,delete:authenticated};
const text=(name:string,required=true):Field=>({name,type:'text',required});
const list=(name:string):Field=>({name,type:'array',fields:[text('value')],admin:{description:'Add one item per row.'}});
const slug:Field={name:'slug',type:'text',required:true,unique:true,index:true,validate:(value:unknown)=>typeof value==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)||'Use lowercase words separated by hyphens.'};
const order:Field={name:'sortOrder',type:'number',defaultValue:0,admin:{position:'sidebar'}};
const media=(name:string):Field=>({name,type:'upload',relationTo:'media'});
const imagePath:Field={name:'imagePath',type:'text',admin:{description:'Optional existing local image path. An uploaded image takes priority.'}};
const make=(name:string,fields:Field[],title='title'):CollectionConfig=>({slug:name,access,versions:{drafts:true},admin:{useAsTitle:title,group:'Website content',defaultColumns:[title,'_status','updatedAt']},fields:[...fields,order]});
const safeURL=(value:unknown)=>!value||typeof value==='string'&&/^https?:\/\//i.test(value)||'Use a full https:// URL.';

export const collections:CollectionConfig[]=[
  {slug:'users',auth:true,access:{read:authenticated,create:authenticated,update:authenticated,delete:authenticated},admin:{useAsTitle:'email',group:'Administration'},fields:[text('name',false)]},
  {slug:'media',access:{read:()=>true,create:authenticated,update:authenticated,delete:authenticated},admin:{group:'Website content'},upload:{staticDir:'media',mimeTypes:['image/*'],imageSizes:[{name:'thumbnail',width:400,height:300,fit:'inside'}],adminThumbnail:'thumbnail'},fields:[text('alt')]},
  make('services',[text('title'),slug,text('short'),{name:'description',type:'textarea',required:true},list('tags'),list('deliverables'),{name:'symbol',type:'select',options:['flower','orbit','spark'],defaultValue:'flower'},{name:'draft',type:'checkbox',label:'Show scope preview note'}]),
  make('projects',[text('name'),slug,text('type'),text('category'),text('year'),media('image'),imagePath,{name:'gallery',type:'array',fields:[media('image'),imagePath,text('alt',false)]},text('color',false),{name:'description',type:'textarea',required:true},{name:'intro',type:'textarea',required:true}], 'name'),
  make('newsroom',[text('title'),slug,text('category'),text('read'),{name:'summary',type:'textarea',required:true},{name:'paragraphs',type:'array',minRows:1,fields:[{name:'value',type:'textarea',required:true}]},{name:'artwork',type:'select',options:['type','orbit','grid'],defaultValue:'type'},media('image'),{name:'publishedAt',type:'date'}]),
  make('resources',[text('title'),slug,{name:'description',type:'textarea',required:true},text('category'),{name:'price',type:'select',options:['Free','Paid'],required:true},text('label'),{name:'url',type:'text',validate:safeURL,admin:{description:'External platform for use or purchase.'}},{name:'icon',type:'select',options:['gradient','liquid','cube','tool'],defaultValue:'tool'}]),
  make('faqs',[text('question'),{name:'answer',type:'textarea',required:true}],'question'),
  make('pricing',[text('title'),text('price'),text('unit'),text('label'),{name:'intro',type:'textarea',required:true},list('items'),{name:'sample',type:'checkbox',defaultValue:true,label:'Illustrative price'}]),
  make('ai-services',[text('name'),{name:'kind',type:'select',options:['workflow','assistant','integration'],required:true},{name:'text',type:'textarea',required:true},list('items')],'name'),
  make('chatbot-data',[text('question'),{name:'keywords',type:'text',required:true,admin:{description:'Comma-separated words or phrases, e.g. pricing, project cost. Avoid generic words such as “what”.'}},{name:'answer',type:'textarea',required:true},{name:'link',type:'text',validate:(v:unknown)=>!v||typeof v==='string'&&/^\/(?!\/)/.test(v)||'Use a local path such as /services.'},text('label',false)],'question'),
];

export const globals:GlobalConfig[]=[
  {slug:'site-settings',access:{read:()=>true,update:authenticated},admin:{group:'Settings'},fields:[text('agencyName'),text('studioName'),media('logo'),{name:'logoPath',type:'text'},media('mark'),{name:'markPath',type:'text'},text('headline'),{name:'introduction',type:'textarea'},text('aboutTitle'),{name:'aboutText',type:'textarea'},{name:'contentSeeded',type:'checkbox',admin:{hidden:true},access:{read:({req})=>Boolean(req.user),update:()=>false}}]},
  {slug:'contact-info',access:{read:()=>true,update:authenticated},admin:{group:'Settings'},fields:[{name:'email',type:'email',required:true},{name:'calLink',type:'text',validate:safeURL},{name:'whatsapp',type:'text',validate:safeURL},{name:'instagram',type:'text',validate:safeURL},{name:'linkedin',type:'text',validate:safeURL},{name:'behance',type:'text',validate:safeURL},text('welcomeSubject'),{name:'welcomeBody',type:'textarea',required:true}]},
];
