import { UploadClient } from '@uploadcare/upload-client';
import { UploadcareSimpleAuthSchema } from '@uploadcare/rest-client';
import { env } from '../schemas/env.schema.js';
export const uploadClient = new UploadClient({
    publicKey: env.UPLOADCARE_PUBLIC_KEY,
});
export const uploadcareAuthSchema = new UploadcareSimpleAuthSchema({
    publicKey: env.UPLOADCARE_PUBLIC_KEY,
    secretKey: env.UPLOADCARE_SECRET_KEY,
});
