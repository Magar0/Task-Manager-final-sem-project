import { desc, eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { users } from "../db/schema";

// get all users from the database
export const getAllUsers = async () => {
  const usersList = await db
    .select({ id: users.id, email: users.email, username: users.username })
    .from(users)
    .orderBy(desc(users.createdAt));
  return usersList;
};

// get a user by ID from the database
export const getUserById = async (id: string) => {
  if (!id) {
    throw new Error("User ID is required");
  }
  const user = await db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      name: users.name,
      createdAt: users.createdAt,
      profilePicUrl: users.profilePicUrl,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return user[0] || null;
};
//create a new user in the database
export const createUser = async ({
  name,
  email,
  username,
  hashedPassword,
}: {
  name: string;
  email: string;
  username: string;
  hashedPassword: string;
}) => {
  if (!name || !email || !username || !hashedPassword) {
    throw new Error("All fields are required");
  }
  const user = await db
    .insert(users)
    .values({ name, email, username, password: hashedPassword })
    .returning();
  return user[0] || null;
};

// check if an email exists in the database
export const checkEmailExists = async (email: string) => {
  if (!email) {
    throw new Error("Email is required");
  }
  const user = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      email: users.email,
      password: users.password,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user[0] || null;
};
// check if a username exists in the database
export const checkUsernameExists = async (username: string) => {
  if (!username) {
    throw new Error("Username is required");
  }
  const user = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return user[0] || null;
};

// update user profile picture URL in the database
export const updateUserProfilePic = async (
  userId: string,
  profilePicUrl: string
) => {
  if (!userId || !profilePicUrl) {
    throw new Error("User ID and profile picture URL are required");
  }
  const updatedUser = await db
    .update(users)
    .set({ profilePicUrl })
    .where(eq(users.id, userId))
    .returning();
  return updatedUser[0] || null;
};
