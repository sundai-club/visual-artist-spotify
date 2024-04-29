/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreatePost() {
  const router = useRouter();
  const [name, setName] = useState("");

  const createPost = api.model.getTraining.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
    },
  });

  // const createPost = api.model.hello.useMutation({
  //   onSuccess: () => {
  //     router.refresh();
  //     setName("");
  //   },
  // });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({
          trainingId: "hzxr5esd25rgg0cf4wf88t06nr"
          // modelName: "model456",
          // inputUrl: "https://arthack.s3.amazonaws.com/public/test_dataset.zip",
          // modelId: "daoluc/model456:d6e48e675618b86e2512505b52eb45171d58a134c4654fc438262da42e702b5b",
          // imageUrl: "https://replicate.delivery/pbxt/KpNAofFO7Z3srxjDIRRC7k5LQ9Hgze8ffxNo2xlfYghuwe1g/68990983_948603438822905_1041098289309971176_n.jpg"
        });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPost.isPending}
      >
        {createPost.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

