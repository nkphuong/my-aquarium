/**
 * User Types - Single Source of Truth
 *
 * All user-related types consolidated in one place.
 * Used by: Accessors, Actions, Components
 */

export interface User {
    id: number
    email?: string
    fullname?: string
    image?: string
}
