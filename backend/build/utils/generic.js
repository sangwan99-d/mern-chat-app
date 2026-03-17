import { messaging } from "../config/firebase.config.js";
import { notificationTitles } from "../constants/notification-title.contant.js";
export const calculateSkip = (page, limit) => {
    return Math.ceil((page - 1) * limit);
};
export const getRandomIndex = (length) => {
    return Math.floor(Math.random() * length);
};
export const sendPushNotification = ({ fcmToken, body, title }) => {
    try {
        console.log('push notification called for fcmToken', fcmToken);
        const link = '/';
        const payload = {
            token: fcmToken,
            notification: {
                title: title ? title : `${notificationTitles[getRandomIndex(notificationTitles.length)]}`,
                body,
                imageUrl: "https://ucarecdn.com/a6f395bf-29ae-4a55-85ee-57e7423d1d14/logo192.png"
            },
            webpush: link && {
                fcmOptions: {
                    link,
                },
            },
        };
        messaging.send(payload);
    }
    catch (error) {
        console.log('error while sending push notification', error);
    }
};
export const convertBufferToBase64 = (buffer) => {
    return Buffer.from(buffer).toString("base64");
};
export const bufferToBase64 = (buffer) => {
    return buffer.toString("base64");
};
