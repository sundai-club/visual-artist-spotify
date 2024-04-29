// src/server/api/routers/upload.ts
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { onFileSubmission } from '~/server/api/on_images_submission'; // Ensure correct path
import { TRPCError } from '@trpc/server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const uploadRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ 
      upload_url: z.string().min(1),
      agreedMarketplace: z.boolean(),
      agreedTerms: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      console.log('\n\n\nReceived files:', input.upload_url, input.agreedMarketplace, input.agreedTerms);

      // Perform file upload logic here
      // For example, you could save the files to a specific directory on the server
      // or upload them to a cloud storage service like AWS S3, Google Cloud Storage, etc.

      return ctx.db.generativeModel.create({
        data: {
          name: "v1",
          status: "pending",
          agreedToTerms: input.agreedTerms,
          agreeMarketplace: input.agreedMarketplace,
          trainingData: input.upload_url,
          modelId: "v1",
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
});