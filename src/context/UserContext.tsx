import React, { createContext, useContext, useState } from "react";

interface GoogleUser {
  id: string;
  name: string | null;
  email: string | null;
  photo: string | null;
}

interface UserContextType {
  user: GoogleUser | null;
  setUser: (user: GoogleUser | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
