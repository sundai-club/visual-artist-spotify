"use client";

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function CreateModelPreview({ session }: { session: any }) {
  const router = useRouter()

  const handleClick = (e: any, path: any) => {
    e.preventDefault()
    router.push(path)
  };

  console.log(session)

  return (

        <button
            onClick={ session ? (e) => handleClick(e, "/new_model") : () => signIn('artists', { callbackUrl: '/new_model' }) }
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
        Create Model
    </button>
  );
}
