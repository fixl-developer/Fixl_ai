'use client';
import dynamic from 'next/dynamic';

const EnterprisePage = dynamic(() => import('../../components/EnterprisePage'), { ssr: false });

export default function Page() {
  return <EnterprisePage />;
}
