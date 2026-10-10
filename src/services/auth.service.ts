import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { db } from "../database/mock-db";
import { User } from "../types";

export const JWT_SECRET =
  process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = "24h";

export class AuthService {
  private readonly SALT_ROUNDS = 10;

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<Omit<User, "passwordHash">> {
    const existing = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim(),
    );
    if (existing) {
      const error: any = new Error(
        "A user with this email address already exists",
      );
      error.status = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

    const newUser: User = {
      id: crypto.randomUUID(),
      email: email.toLowerCase().trim(),
      passwordHash,
      name: name.trim(),
      role: "user",
      createdAt: new Date(),
    };

    db.users.push(newUser);

    const { passwordHash: _, ...sanitizedUser } = newUser;
    return sanitizedUser;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; user: Omit<User, "passwordHash"> }> {
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim(),
    );
    if (!user) {
      const error: any = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const error: any = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    const { passwordHash: _, ...sanitizedUser } = user;

    return { token, user: sanitizedUser };
  }
}

export const authService = new AuthService();
