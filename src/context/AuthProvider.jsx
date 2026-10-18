import { useState } from "react";
import { AuthContext } from "./AuthContext";
import * as authService from "../services/authService";

// TEMPORARY STATE: the signed-in user lives only in memory.
// Nothing is saved in localStorage or sessionStorage, so refreshing
// the page signs you out. That is intentional at this stage.
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(credentials) {
    const signedInUser = await authService.login(credentials);
    setUser(signedInUser);
    return signedInUser;
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  // Used after the person edits their own profile, so the navbar etc. update
  function updateCurrentUser(updatedUser) {
    setUser(updatedUser);
  }

  const value = {
    user, // null when signed out, otherwise { id, fullName, email, role, ... }
    isAuthenticated: user !== null,
    login,
    logout,
    updateCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
