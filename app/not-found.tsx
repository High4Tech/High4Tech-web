import Link from 'next/link';
import { ArrowUpRight } from '@/components/icons';
export default function NotFound() {return <section className="not-found wrap"><span className="eyebrow orange">A LITTLE OFF THE MAP / 404</span><h1>GOOD IDEAS.<br />WRONG <span className="orange">TURN.</span></h1><p>This page isn’t here. There’s plenty more to explore.</p><Link className="button orange-button" href="/">Back to the studio <ArrowUpRight size={18} /></Link></section>;}
