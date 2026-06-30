'use client';
import dynamic from 'next/dynamic';

const ServicesPage = dynamic(() => import('../../components/ServicesPage'), { ssr: false });

export default function Page() {
  return <ServicesPage />;
}
