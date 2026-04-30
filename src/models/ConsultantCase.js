export class ConsultantCase {
  constructor({
    userId,
    consultantId,
    statusId,
    applicationDate
  }) {
    this.id = ConsultantCase.generateId();
    this.userId = userId;
    this.consultantId = consultantId;
    this.statusId = statusId;
    this.applicationDate = applicationDate || new Date().toLocaleDateString();
  }

  static generateId() {
    return Math.random().toString(36).substring(2, 9);
  }
}
