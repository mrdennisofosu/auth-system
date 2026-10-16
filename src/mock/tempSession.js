// TEMPORARY (Phase 1, Step 5)
// A pretend "logged-in user" so we can see the layouts working.
// This file is DELETED in Step 6, when real mock login state replaces it.
// These are not real accounts and nothing here is secure.

import { ROLES } from '../constants/roles'

export const TEMP_USER = { fullName: 'Ama Mensah', role: ROLES.USER }
export const TEMP_ADMIN = { fullName: 'Kwame Asante', role: ROLES.ADMIN }

// What the PUBLIC pages see. null = visitor (not signed in).
// To preview the signed-in navbar on public pages, change null to TEMP_USER.
export const TEMP_PUBLIC_USER = null

export function tempLogout() {
  console.log('Logout clicked (not wired yet; this comes in Phase 3)')
}