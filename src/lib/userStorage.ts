const USER_STORAGE_KEY = "fitness_books_user";

export interface User {
  username: string;
  created_at: string;
}

export class UserStorage {
  static getUser(): User | null {
    try {
      const userStr = localStorage.getItem(USER_STORAGE_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  static setUser(username: string): User {
    const user: User = {
      username: username.trim(),
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  }

  static clearUser(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  static isValidUsername(username: string): boolean {
    return username.trim().length >= 2 && username.trim().length <= 50;
  }
}
