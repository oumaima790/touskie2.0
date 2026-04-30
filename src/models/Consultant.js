export class Consultant {
  constructor({
    caseId,
    transactionId,
    consultantId,
    amountId
  }) {
    this.id = Consultant.generateId();
    this.caseId = caseId;
    this.transactionId = transactionId;
    this.consultantId = consultantId;
    this.amountId = amountId;
  }

  static generateId() {
    return Math.random().toString(36).substring(2, 9);
  }
}
