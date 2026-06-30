'use client';
import dynamic from 'next/dynamic';

const IndustriesPage = dynamic(() => import('../../components/IndustriesPage'), { ssr: false });

export default function Page() {
  return <IndustriesPage />;
}
