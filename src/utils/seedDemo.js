// This runs once to seed a demo user
import { getUsers, saveUsers } from './storage';

export const seedDemoUser = () => {
  const users = getUsers();
  const exists = users.find(u => u.email === 'demo@streamvibe.com');
  if (!exists) {
    saveUsers([...users, {
      id: 'demo_user_main',
      username: 'demouser',
      email: 'demo@streamvibe.com',
      password: 'demo123',
      avatar: null,
      bio: 'This is the StreamVibe demo account. Feel free to explore!',
      channelName: "Demo Channel",
      createdAt: new Date().toISOString(),
    }]);
  }
};
