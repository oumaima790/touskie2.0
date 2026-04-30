export class Transaction {
  constructor({
    listingId,
    storeId,
    userId,
    publisherId
  }) {
    this.id = Transaction.generateId();
    this.listingId = listingId;
    this.storeId = storeId;
    this.userId = userId;
    this.publisherId = publisherId;
  }

  static generateId() {
    return Math.random().toString(36).substring(2, 9);
  }
}
