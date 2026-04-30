export class Review {
  constructor({
    reviewerId,
    transactionId,
    scores
  }) {
    this.id = Review.generateId();
    this.reviewerId = reviewerId;
    this.transactionId = transactionId;
    this.scores = scores;
  }

  static generateId() {
    return Math.random().toString(36).substring(2, 9);
  }
}
