import { createContext } from 'react'

// A "context" is a shared box any component can read from, without passing
// props down through every layer. This one holds the authentication state.
// It is filled in by AuthProvider.
export const AuthContext = createContext(null)