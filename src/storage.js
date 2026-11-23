import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'kaydedilenler';

export async function loadSaved() {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function writeSaved(list) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

const RECENT_KEY = 'son_aramalar';

export async function loadRecent() {
  const raw = await AsyncStorage.getItem(RECENT_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function addRecent(term) {
  const clean = term.trim();
  if (!clean) return [];
  const list = await loadRecent();
  const next = [clean, ...list.filter((t) => t !== clean)].slice(0, 5);
  await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}