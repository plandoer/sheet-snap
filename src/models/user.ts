export class User {
  id: string = ""; // This is the Supabase user ID
  name: string | null = null; // This is the name from Google Sign-In
  email: string | null = null; // This is the email from Google Sign-In
  photo: string | null = null; // This is the photo from Google Sign-In
}

export function initUser(): User {
  return new User();
}
