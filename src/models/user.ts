export class User {
  constructor(
    public id: string, // This is the Supabase user ID
    public name: string | null, // This is the name from Google Sign-In
    public email: string | null, // This is the email from Google Sign-In
    public photo: string | null, // This is the photo from Google Sign-In
  ) {}
}

export function initUser(): User {
  return new User("", null, null, null);
}
