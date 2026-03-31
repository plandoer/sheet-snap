import React, { createContext, ReactNode, useContext, useState } from "react";

interface User {
  id: string; // This is the Supabase user ID
  name: string | null; // This is the name from Google Sign-In
  email: string | null; // This is the email from Google Sign-In
  photo: string | null; // This is the photo from Google Sign-In
}

interface Props {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<Props | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return <UserContext value={{ user, setUser }}>{children}</UserContext>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
