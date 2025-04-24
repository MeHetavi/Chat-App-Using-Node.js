'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const route = useRouter();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold">Chat App</h1>
      <button className="cursor-pointer text-4xl"
        onClick={() => route.push('/ChatRoom')}
      >Chat</button>
    </div>
  );
}
