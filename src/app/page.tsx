"use client";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import './services/i18n';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/empresas");
  }, []);

  return (
    <></>
  );
}
