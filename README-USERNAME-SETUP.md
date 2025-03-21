# Username Setup Instructions

## Database Setup

To implement the username feature, you need to apply the SQL changes to your Supabase database. Here's how to do it:

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of `setup-profiles-table.sql` into the query editor
5. Run the query

This will:
- Create a profiles table with username constraints
- Set up the necessary indexes and policies
- Enable row-level security

## Implementation Details

The username feature includes:

1. **Email-only Authentication**: Google authentication has been removed
2. **Username Creation Flow**: After email verification, users are prompted to create a unique username
3. **Username Validation**: Usernames must be 3-20 characters and can only contain letters, numbers, underscores, and hyphens
4. **Username Uniqueness**: The system checks if a username is already taken before saving

## Testing the Flow

To test the complete flow:

1. Sign up with a new email
2. Verify your email via the link sent to your inbox
3. You'll be redirected to the username creation page
4. Create a username that follows the requirements
5. After successful username creation, you'll be redirected to the feed

## Files Changed

- `/src/routes/signup/+page.svelte` - Removed Google auth, updated email signup flow
- `/src/routes/login/+page.svelte` - Removed Google auth
- `/src/routes/create-username/+page.svelte` - New page for username creation
- `/src/routes/create-username/+page.server.ts` - Server-side validation for username creation
- `/src/routes/auth/callback/+page.server.ts` - Handles email verification and redirects
- `/src/hooks.server.js` - Updated to enforce username creation
- `/src/lib/context/user.svelte.ts` - Added username management functionality
