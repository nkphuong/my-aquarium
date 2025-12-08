/**
 * NestJS User Repository
 *
 * Implements UserRepository by calling NestJS backend API.
 * This connects to your NestJS server which uses Supabase.
 */

import { User } from '@/domain/entities/user.entity'
import { Email } from '@/domain/value-objects/email'
import { UserRepository } from '@/domain/repositories/user.repository'

// Configure your NestJS API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export class NestJSUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return this.toDomain(data)
    } catch (error) {
      console.error('Error fetching user by ID:', error)
      return null
    }
  }

  async findByEmail(email: Email): Promise<User | null> {
    try {
      const response = await fetch(
        `${API_URL}/users/email/${email.getValue()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return this.toDomain(data)
    } catch (error) {
      console.error('Error fetching user by email:', error)
      return null
    }
  }

  async findByEmailAndPassword(
    email: Email,
    password: string
  ): Promise<User | null> {
    try {
      // Call NestJS login endpoint
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.getValue(),
          password,
        }),
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()

      // NestJS should return user data after successful login
      if (data.user) {
        return this.toDomain(data.user)
      }

      return null
    } catch (error) {
      console.error('Error during login:', error)
      return null
    }
  }

  async save(user: User): Promise<void> {
    try {
      await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email.getValue(),
          name: user.name,
        }),
      })
    } catch (error) {
      console.error('Error saving user:', error)
      throw error
    }
  }

  private toDomain(data: any): User {
    return new User(
      data.id,
      new Email(data.email),
      data.name,
      data.createdAt ? new Date(data.createdAt) : new Date()
    )
  }
}
