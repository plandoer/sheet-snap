import { getCurrentUser } from "@/config/google-signin";
import React, { createContext, useContext, useState } from "react";

interface GoogleUser {
  id: string;
  name: string | null;
  email: string | null;
  photo: string | null;
}

interface UserContextType {
  user: GoogleUser | null;
  initUser: () => Promise<void>;
  setUser: (user: GoogleUser | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(null);

  async function initUser(): Promise<void> {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser?.user) {
        setUser({
          id: currentUser.user.id,
          name: currentUser.user.name,
          email: currentUser.user.email,
          photo: currentUser.user.photo,
        });
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Error checking user:", error);
      return Promise.reject(error);
    }
  }

  return (
    <UserContext.Provider value={{ user, initUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
