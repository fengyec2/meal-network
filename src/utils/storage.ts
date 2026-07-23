import { Friend } from '../types';

const STORAGE_KEY = 'cengfan_map_friends_data_v1';

export const INITIAL_DEMO_FRIENDS: Friend[] = [];

export function getStoredFriends(): Friend[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

export function saveFriends(friends: Friend[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(friends));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export function clearStoredFriends() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear localStorage', err);
  }
}
