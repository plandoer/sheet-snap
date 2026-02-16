export class User {
  constructor(
    public id: string,
    public name: string | null,
    public email: string | null,
    public photo: string | null
  ) {}
}

export function initUser(): User {
  return new User("", null, null, null);
}
