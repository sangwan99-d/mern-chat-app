import fs from 'fs';
import { deleteFile } from '@uploadcare/rest-client';
import { uploadClient, uploadcareAuthSchema } from '../config/uploadcare.config.js';
const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
export const uploadFilesToUploadcare = async ({ files }) => {
    try {
        const uploadPromises = files.map(async (file) => {
            const fileBuffer = fs.readFileSync(file.path);
            const result = await uploadClient.uploadFile(fileBuffer, {
                fileName: file.originalname,
                contentType: file.mimetype,
            });
            return { uuid: result.uuid, cdnUrl: result.cdnUrl };
        });
        const results = await Promise.all(uploadPromises);
        return results;
    }
    catch (error) {
        console.log('Error uploading files to Uploadcare');
        console.log(error);
    }
};
export const deleteFilesFromUploadcare = async ({ fileIds }) => {
    try {
        const deletePromises = fileIds.map(fileId => deleteFile({ uuid: fileId }, { authSchema: uploadcareAuthSchema }));
        await Promise.all(deletePromises);
    }
    catch (error) {
        console.log('Error deleting files from Uploadcare');
        console.log(error);
    }
};
export const uploadEncryptedAudioToUploadcare = async ({ buffer }) => {
    try {
        const nodeBuffer = Buffer.from(buffer);
        const result = await uploadClient.uploadFile(nodeBuffer, {
            fileName: 'encrypted-audio.webm',
            contentType: 'audio/webm',
        });
        return { uuid: result.uuid, cdnUrl: result.cdnUrl };
    }
    catch (error) {
        console.error("Error uploading encrypted audio to Uploadcare:", error);
    }
};
export const uploadAudioToUploadcare = async ({ buffer }) => {
    try {
        const nodeBuffer = Buffer.from(buffer);
        const result = await uploadClient.uploadFile(nodeBuffer, {
            fileName: 'group-audio.webm',
            contentType: 'audio/webm',
        });
        return { uuid: result.uuid, cdnUrl: result.cdnUrl };
    }
    catch (error) {
        console.error("Error uploading audio to Uploadcare:", error);
    }
};
export const getSecureUserInfo = (user) => {
    return {
        id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar?.secureUrl,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        verified: user.verified,
        publicKey: user?.publicKey,
        notificationsEnabled: user.notificationsEnabled,
        verificationBadge: user.verificationBadge,
        fcmTokenExists: user.fcmToken?.length ? true : false,
        oAuthSignup: user.oAuthSignup
    };
};
