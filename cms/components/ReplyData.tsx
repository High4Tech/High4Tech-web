'use client';
import { useField } from '@payloadcms/ui';
import type { JSONFieldClientProps } from 'payload';

// Viewing stored reply data does not need a remotely loaded code editor.
export function ReplyData({ path }: JSONFieldClientProps) {
  const { value } = useField<unknown>({ path });
  return <div className="field-type textarea"><label className="field-label" htmlFor="stored-reply-data">Assistant reply data</label><textarea id="stored-reply-data" readOnly rows={12} value={value ? JSON.stringify(value,null,2) : ''} style={{width:'100%',fontFamily:'var(--font-body)',fontSize:12,padding:12,borderRadius:8}}/></div>;
}
