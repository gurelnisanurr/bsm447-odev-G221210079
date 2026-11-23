import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'kaydedilenler';

export async function loadSaved() {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function writeSaved(list) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}