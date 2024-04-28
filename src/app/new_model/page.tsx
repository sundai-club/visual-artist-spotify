import Link from "next/link";

import CreateModel from "~/app/_components/create-model";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function NewModelPage() {
    const session = await getServerAuthSession();

    // User is not logged in
    if (!session?.user) return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Please Log In to Create Models
          </h1>
          <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
          </Link>
        </div>
      </main>
    ); 

    return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create a Generative Model in Your Own Style!
        </h1>
          Please upload your vizual art here:
          <CreateModel index={session?.user.id}/>        
      </div>
    </main>
  );
}
