// src/server/api/routers/upload.ts
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';

export const uploadRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ files: z.array(z.any()).min(1) }))
    .mutation(async ({ ctx, input }) => {
      const files = input.files;

      console.log('\n\n\nReceived files:', files.map((file) => file.name));

      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Simulated db call completed');

      // Perform file upload logic here
      // For example, you could save the files to a specific directory on the server
      // or upload them to a cloud storage service like AWS S3, Google Cloud Storage, etc.

      return {
        success: true,
        message: `${files.length} files processed successfully`,
      };
    }),
});