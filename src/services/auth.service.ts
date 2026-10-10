import { db } from "../database/mock-db";
import { User } from "../types";

export class AuthService {
  async register(email: string, password: string, name: string): Promise<User> {
    const existing = db.users.find((u) => u.email === email);
    if (existing) {
      throw new Error("User already exists");
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      passwordHash: password,
      name,
      role: "user",
      createdAt: new Date(),
    };

    db.users.push(newUser);
    return newUser;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; user: User }> {
    const user = db.users.find((u) => u.email === email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (user.passwordHash !== password) {
      throw new Error("Invalid credentials");
    }

    const token = `mock-jwt-token-${user.id}`;
    return { token, user };
  }
}

export const authService = new AuthService();
