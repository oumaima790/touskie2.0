export class User {
  constructor({
    email,
    phone,
    password
  }) {
    this.id = User.generateId();
    this.email = email;
    this.phone = phone;
    this.password = password;
  }

  static generateId() {
    return Math.random().toString(36).substring(2, 9);
  }
}


