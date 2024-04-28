"use client";

import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { signIn } from 'next-auth/react';

export function CreateModelPreview() {
  return (

        <button
        onClick={() => signIn('artists', { callbackUrl: '/new_model' })}
        //href={session ? "/new_model" : "/api/auth/signin"}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
    >
        Create Model
    </button>
  );
}
