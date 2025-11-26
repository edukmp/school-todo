import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from '@/types/task';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }
        // token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}

export async function scheduleTaskNotification(task: Task) {
    if (!task.date || !task.time) return;

    try {
        const datePart = task.date.split('T')[0];
        const timePart = task.time.includes('T') ? task.time.split('T')[1].substring(0, 5) : task.time;

        const scheduledTime = new Date(`${datePart}T${timePart}:00`);
        const now = new Date();

        if (scheduledTime > now) {
            const seconds = Math.floor((scheduledTime.getTime() - now.getTime()) / 1000);
            if (seconds > 0) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Task Due Soon! ⏰",
                        body: `Don't forget: ${task.title}`,
                        sound: true,
                        data: { taskId: task.id },
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                        seconds: seconds,
                        repeats: false,
                    },
                });
                console.log(`Notification scheduled for ${task.title} in ${seconds} seconds`);
            }
        }
    } catch (e) {
        console.error("Error scheduling notification:", e);
    }
}
