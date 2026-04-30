export class PublisherProfile {
  constructor({
    publisherId,
    displayName
  }) {
    this.publisherId = publisherId;
    this.displayName = displayName;
  }

  static generateId() {
    return Math.random().toString(36).substring(2, 9);
  }
}
