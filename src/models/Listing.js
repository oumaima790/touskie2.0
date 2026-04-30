export class Listing {
  constructor({
    productId,
    publisherId
  }) {
    this.id = Listing.generateId();
    this.productId = productId;
    this.publisherId = publisherId;
  }

  static generateId() {
    return Math.random().toString(36).substring(2, 9);
  }
}
