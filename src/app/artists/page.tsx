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
          Make your art style available to anyone...
        </h1>
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">while keeping your Intellectual Property rights, using GenAI</h1>


        <ol className="list-decimal">
          <li>Select your best creations! Upload the pictures that best represent your style.</li>
          <li>The platform will analyze your images using advanced generative diffusion models based on text and image.</li>
          <li>Ready! With the power of these models, offer your audience new ways to experience your style by generating unique pictures while ensuring your intellectual rights are protected.</li>
        </ol>

        
        <CreateModelPreview session={session} />
      </div>
    </main>
  );
}
