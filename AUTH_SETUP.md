# Setting up Authentication for Wedding Planner App

## Google OAuth Setup

1. **Create a Google Cloud Project**:

   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Credentials"

2. **Configure OAuth Consent Screen**:

   - Click "Configure Consent Screen"
   - Choose "External" user type
   - Fill in the required fields (App name, user support email, developer contact information)
   - For scopes, include the default ".../auth/userinfo.email" and ".../auth/userinfo.profile"
   - Add test users if you're in testing mode

3. **Create OAuth Client ID**:

   - Go to "Credentials" tab
   - Click "Create Credentials" and select "OAuth client ID"
   - Application type: "Web application"
   - Name: "Wedding Planner"
   - Authorized JavaScript origins: Add `http://localhost:3000` for development
   - Authorized redirect URIs: Add `http://localhost:3000/api/auth/callback/google`
   - Click "Create"

   > **Important**: Make sure the redirect URI exactly matches your application's callback URL. For Next.js applications using NextAuth.js, this is always in the format: `[your-domain]/api/auth/callback/[provider]`.

4. **Set up environment variables**:

   - Copy `.env.local.example` to `.env.local`
   - Add your Google Client ID and Secret - Generate a secure random string for NEXTAUTH_SECRET (you can use `openssl rand -base64 32` in a terminal)
   - Set MONGODB_URI to your MongoDB connection string
   - Ensure NEXTAUTH_URL is set to your app's URL (http://localhost:3000 for development)

   > **Critical**: All OAuth environment variables must be properly set before authentication will work. If you're experiencing authentication errors, verify that your environment variables are correctly configured and that your Google OAuth credentials are properly set up.

## MongoDB Setup

1. **Create a MongoDB cluster**:

   - Sign up for a [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas/register)
   - Create a new cluster
   - In "Security" > "Database Access", create a new database user
   - In "Security" > "Network Access", add your IP address or allow access from anywhere for development
   - In "Databases" > "Connect", get your connection string

2. **Add MongoDB URI to .env.local**:
   - Add the connection string to the MONGODB_URI environment variable
   - Replace `<username>`, `<password>`, and `<cluster-url>` with your values

## Running the App with Authentication

1. Install dependencies:

   ```
   npm install
   ```

2. Run the development server:

   ```
   npm run dev
   ```

3. Access the app at http://localhost:3000

4. Sign in with Google account

## Troubleshooting Authentication Issues

### Next.js Image Configuration

If you're seeing errors related to image domains when using profile pictures from authentication providers, ensure you've configured the image domains in your `next.config.ts` or `next.config.js` file:

```typescript
// next.config.ts
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google user profile images
      'googleusercontent.com',
      'avatars.githubusercontent.com', // GitHub avatars if using GitHub auth
    ],
  },
};
```

This allows Next.js to optimize and serve images from these external domains.

### OAuthAccountNotLinked Error

If you encounter an "OAuthAccountNotLinked" error, this typically means:

- A user is trying to sign in with an OAuth provider (e.g., Google)
- An account with the same email already exists but was created with a different provider

Our configuration prevents this error by allowing sign-ins with any OAuth provider that can verify the same email address. This is controlled by the `signIn` callback in `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
callbacks: {
  async signIn() {
    // Allow sign in with any OAuth account
    return true;
  },
}
```

If you want stricter account linking rules, you can modify this callback.

## Protected Routes

All routes are protected by default and require authentication. To make a route public, pass `requireAuth={false}` to the Layout component:

```tsx
<Layout requireAuth={false}>{/* Your public page content */}</Layout>
```

The authentication state is available in any client component using the `useSession()` hook from next-auth/react.
