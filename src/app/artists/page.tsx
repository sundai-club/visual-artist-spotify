import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { signIn } from 'next-auth/react';
import { CreateModelPreview } from "~/app/_components/create-model-preview";

export default async function NewModel() {
    const hello = await api.post.hello({ text: "from tRPC" });
    const session = await getServerAuthSession();

    return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create a Generative Model in Your Own Style!
        </h1>
        
        <CreateModelPreview session={session} />
      </div>
    </main>
  );
}
