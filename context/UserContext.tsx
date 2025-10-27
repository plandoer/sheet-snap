import { getCurrentUser } from "@/config/google-signin";
import React, { createContext, useContext, useEffect, useState } from "react";

interface GoogleUser {
  id: string;
  name: string | null;
  email: string | null;
  photo: string | null;
}

interface UserContextType {
  user: GoogleUser | null;
  setUser: (user: GoogleUser | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in when app loads
    async function checkUser() {
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
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
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
