/**
 * Example Domain Entity
 *
 * Entities are objects with a unique identity that persists over time.
 * They contain business logic and enforce business rules.
 */

export class ExampleEntity {
  constructor(
    public readonly id: string,
    private _name: string,
    private _createdAt: Date
  ) {
    this.validate();
  }

  get name(): string {
    return this._name;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // Business logic methods
  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this._name = newName;
  }

  private validate(): void {
    if (!this.id) {
      throw new Error('Entity must have an id');
    }
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
  }
}
