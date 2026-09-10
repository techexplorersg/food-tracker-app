import { supabase } from './supabase';
import { UserSettings } from '../types';

const DEFAULTS: UserSettings = {
  dailyCalorieLimit: 2000,
  waterReminderIntervalMinutes: 120,
};

export async function fetchSettings(): Promise<UserSettings> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return DEFAULTS;

  const { data, error } = await supabase
    .from('user_settings')
    .select('daily_calorie_limit, water_reminder_interval_minutes')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) return DEFAULTS;

  return {
    dailyCalorieLimit: data.daily_calorie_limit,
    waterReminderIntervalMinutes: data.water_reminder_interval_minutes,
  };
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');

  const { error } = await supabase.from('user_settings').upsert({
    user_id: user.id,
    daily_calorie_limit: settings.dailyCalorieLimit,
    water_reminder_interval_minutes: settings.waterReminderIntervalMinutes,
  });

  if (error) throw error;
}
