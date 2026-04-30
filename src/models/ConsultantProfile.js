export class ConsultantProfile {
  constructor({
    consultantId,
    specialty,
    bio
  }) {
    this.id = ConsultantProfile.generateId();
    this.consultantId = consultantId;
    this.specialty = specialty;
    this.bio = bio;
  }

  static generateId() {
    return Math.random().toString(36).substring(2, 9);
  }
}
