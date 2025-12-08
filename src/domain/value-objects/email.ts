/**
 * Email Value Object
 *
 * Immutable value object for email addresses with validation.
 */

export class Email {
  private readonly value: string;

  constructor(email: string) {
    this.validate(email);
    this.value = email.toLowerCase().trim();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  private validate(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }
}
