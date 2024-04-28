// src/server/api/routers/upload.ts
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { onFileSubmission } from '~/server/api/on_images_submission'; // Ensure correct path

const fileInputSchema = z.object({
  file: z.string(),
  // Add other fields if necessary
});

export const uploadRouter = createTRPCRouter({
    uploadFiles: protectedProcedure.input(z.object({ file: fileInputSchema })).query(({ input }) => {
        onFileSubmission(input.file.file);
        return "Code is running! here we call the function to upload files to S3 bucket";
    }),
});
  
