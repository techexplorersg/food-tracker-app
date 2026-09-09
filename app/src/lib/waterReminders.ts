import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Schedules a repeating local reminder to drink water. Entirely on-device —
 * no server round trip, no cost, works offline. Interval is user-configurable
 * from SettingsScreen (default 2 hours).
 */
export async function scheduleWaterReminders(intervalMinutes = 120) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time for some water 💧',
      body: "Keep your hydration on track — take a moment for a glass of water.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: intervalMinutes * 60,
      repeats: true,
    },
  });
}
