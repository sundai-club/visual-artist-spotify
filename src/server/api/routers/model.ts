import { z } from "zod";
import Replicate from "replicate";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import * as trpc from "@trpc/server";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API,
});

export const modelRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ controlnet: z.string() }))
    .mutation(async ({ input }) => {
      console.log("render API called");
      try {
        const output = await replicate.run(
          "usamaehsan/controlnet-x-majic-mix-realistic-x-ip-adapter:0ee845d75ba767bcad9743837b4e9a495f2032459d055b4ceeab4726a0c0489d",
          {
            input: {
              prompt: "input.controlnet",
              negative_prompt:
                "out of frame, lowres, text, error, cropped, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, username, watermark, signature",
              scribble_conditioning_scale: 1,
              sorted_controlnets: "scribble",
              ip_adapter_weight: 1,
              disable_safety_check: true,
            },
          },
        );

        console.log(output);

        return {
          greeting: output,
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `An error occurred: ${error.message}`,
          });
        } else {
          // Handle non-standard errors
          throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unknown error occurred",
          });
        }
      }
    }),
  generateImage: protectedProcedure
    .input(z.object({ modelId: z.string(), imageUrl: z.string() }))
    .mutation(async ({ input }) => {
      console.log("generate Image called");
      try {
        // @ts-ignore
        const output = await replicate.run(input.modelId, {
          input: {
            image: input.imageUrl,
            width: 1024,
            height: 1024,
            prompt: "In the style of TOK",
            refine: "no_refiner",
            scheduler: "K_EULER",
            lora_scale: 0.95,
            num_outputs: 1,
            guidance_scale: 7.5,
            apply_watermark: false,
            high_noise_frac: 0.8,
            negative_prompt: "",
            prompt_strength: 0.6,
            num_inference_steps: 50,
          },
        });

        console.log(output);

        return output;
      } catch (error) {
        if (error instanceof Error) {
          throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `An error occurred: ${error.message}`,
          });
        } else {
          // Handle non-standard errors
          throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unknown error occurred",
          });
        }
      }
    }),

  trainModel: protectedProcedure
    .input(z.object({ modelName: z.string(), inputUrl: z.string() }))
    .mutation(async ({ input }) => {
      console.log("train model called");
      try {
        const model = await replicate.models.create("daoluc", input.modelName, {
          visibility: "private",
          hardware: "cpu",
        });
        console.log(model);
        const output = await replicate.trainings.create(
          "stability-ai",
          "sdxl",
          "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
          {
            // You need to create a model on Replicate that will be the destination for the trained version.
            // @ts-ignore
            destination: "daoluc/" + input.modelName,
            input: {
              input_images: input.inputUrl,
              token_string: "TOK",
              caption_prefix: "a photo of TOK",
              max_train_steps: 1000,
              use_face_detection_instead: false,
            },
          },
        );

        console.log(output);

        return output;
      } catch (error) {
        if (error instanceof Error) {
          throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `An error occurred: ${error.message}`,
          });
        } else {
          // Handle non-standard errors
          throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unknown error occurred",
          });
        }
      }
    }),

  getTraining: protectedProcedure
    .input(z.object({ trainingId: z.string() }))
    .mutation(async ({ input }) => {
      console.log("get training called");
      try {
        const training = await replicate.trainings.get(input.trainingId);
        console.log(training);

        return training;
      } catch (error) {
        if (error instanceof Error) {
          throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `An error occurred: ${error.message}`,
          });
        } else {
          // Handle non-standard errors
          throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unknown error occurred",
          });
        }
      }
    }),
});
