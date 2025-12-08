/**
 * User Entity
 *
 * Core business entity representing a user in the system.
 */

import { Email } from '../value-objects/email';

export class User {
  constructor(
    public readonly id: string,
    private _email: Email,
    private _name: string,
    private _createdAt: Date = new Date()
  ) {
    this.validate();
  }

  get email(): Email {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this._name = newName;
  }

  private validate(): void {
    if (!this.id) {
      throw new Error('User must have an id');
    }
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
  }
}
