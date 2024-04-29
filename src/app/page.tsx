import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Use your favorite artists' work ethically
        </h1>
        <h2 className="text-3xl">Coming Soon: Generative Spotify for visual artists</h2>

        <p>Request your favorite artists</p>

        <div><iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdae6G7grLyo7RGCioYyQE7uj4SNWwR_olsEAf1RVyx9OmD3w/viewform?embedded=true" width="640" height="682" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe></div>

      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
