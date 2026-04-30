export class ApplicationStatus {
  constructor({
    status
  }) {
    this.id = ApplicationStatus.generateId();
    this.status = status; // pending | accepted | refused
  }

  static generateId() {
    return Math.random().toString(36).substring(2, 9);
  }
}
