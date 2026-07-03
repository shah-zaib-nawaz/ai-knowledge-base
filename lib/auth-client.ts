import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

// Export the pieces you'll use most, for convenience
export const { signIn, signUp, signOut, useSession } = authClient;
