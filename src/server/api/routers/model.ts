import { z } from "zod";
import Replicate from "replicate";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";
import * as trpc from '@trpc/server';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API,
});

export const modelRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ controlnet: z.string()}))
    .mutation(async ({ input }) => {
        console.log("render API called")
        try {
            const output = await replicate.run(
                "usamaehsan/controlnet-x-majic-mix-realistic-x-ip-adapter:0ee845d75ba767bcad9743837b4e9a495f2032459d055b4ceeab4726a0c0489d",
                {
                  input: {
                    prompt: "input.controlnet",
                    negative_prompt: "out of frame, lowres, text, error, cropped, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, username, watermark, signature",
                    scribble_conditioning_scale: 1,
                    sorted_controlnets: "scribble",
                    ip_adapter_weight: 1,
                    disable_safety_check: true,
                  }
                }
              );

            console.log(output);

            return {
                greeting: output,
            };
            
        } catch (error) {
            if (error instanceof Error) {
                throw new trpc.TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: `An error occurred: ${error.message}`,
                });
            } else {
                // Handle non-standard errors
                throw new trpc.TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'An unknown error occurred',
                });
            }        
        }
    }),
});
