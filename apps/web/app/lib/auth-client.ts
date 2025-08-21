import { getWebUrl } from "@boilerplate/config/project.config";
import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// For single web app, API and frontend are on the same domain
const apiUrl = getWebUrl();

export const authClient = createAuthClient({
  baseURL: apiUrl,
  // Simplified credentials for same-origin requests
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [
    usernameClient()
  ]
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;