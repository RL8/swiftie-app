# Sprint 1: User Flow Optimization

## Overview
This sprint focuses on simplifying the user experience, streamlining access control, and creating a more intuitive progression from visitor to premium user.

## Goals
- Simplify user types and access control
- Create a clear path from visitor to registered user to premium user
- Improve email verification flow
- Track anonymous user selections
- Implement "Swiftivities" as the core organizational structure for user activities

## Implementation Strategy

### 1. Three-Layer Access Model

#### Public Access (No Login)
- Landing/welcome page accessible to everyone
- Welcome page improvements:
  * Replace "features" button with "log in" for existing users
  * Trigger popup with login option only (no sign up)
  * If a logged in user visits this page, they are taken directly to their feed
- Current Albums/Songs selection process is accessible without login
- Share page showing all options with clear CTA: "Create free account to store and share your preferences, plus lots more TS fun and games" which leads to a sign up page, that includes an option to log in using same login popup
- Redirect unregistered users attempting to access protected pages with context-aware messages explaining the page they tried to access and givng them the option to login [same popup with login form and no sign up option] or create an account [Go to welcome page]
- Standard 404 page for non-existent content

#### Free Registered Users
- Core functionality available after registration
- Strict verification screen until email is verified
- Profile page with username customization and basic info
- Feed page showing chronological activity of all user actions (selections, verification, logins)
- "Swiftivities" feature organization:
  * List Keeper with 3x3 album/song selections
  * Editing options for existing selections with original choices visible
  * Free tier limitations clearly indicated
  * Other swiftivities with both free and premium options [the other swiftivities are currently listed on the current swiftivities page.]
- Sharing capabilities with social media integration and custom text options

#### Premium Users ($13.13 Lifetime Access)
- Single premium tier (simplified from multiple subscription types) using the stripe API already integrated into this app
- Unlimited usage and enhanced features
- Premium badge displayed on profile and shared content
- Early access to new features
- Participation opportunities in app development (contributor status)
- Additional premium-only Swiftivities (11x3 and 5x10 lists)
- No complex subscription distinctions

### 2. Email-Based Registration Flow

#### Email as Initial Username
- Use email address as default username
- Allow customization after verification on profile page

#### Strict Email Verification
- No app access until email is verified
- Verification screen with clear instructions
- Option to edit email if mistyped
- Resend verification option
- Cross-device compatibility

### 3. Anonymous User Tracking

#### Browser Storage for Visitors
- Remember selections made before signup (albums/songs)
- Transfer choices to user account upon registration
- Delete temporary session data if an existing user logs in instead of creating a new account

#### Database-Backed Storage
- All user data stored in database, not just browser
- Accessible across all devices after verification

### 4. Simplified Database Structure

#### Streamlined User Types
- Single boolean flag for premium status
- Remove complex subscription type distinctions
- Simpler database queries and access control
- One pricing model: $13.13 lifetime access

### 5. "Show Everything, Limit Actions" UI Approach

#### All Pages Visible
- No hidden sections based on REGISTERED user type
- Clear premium indicators on premium features (11x3 and 5x10 lists)
- Upgrade prompts when trying premium actions
- Swiftivities organized to show both free and premium options

## Implementation Plan

### Phase 1: Database Simplification
- Modify user profile schema to include single premium flag
- Update database queries to use simplified structure
- Migrate existing users to new structure
- Implement $13.13 lifetime pricing model

### Phase 2: Access Control Refactoring
- Implement "Show Everything, Limit Actions" approach
- Remove complex route protection
- Add action-level permission checks
- Develop Swiftivities structure as the core organization method
- Create Feed page showing chronological user activity
- Implement welcome page improvements with login popup

### Phase 3: Email Verification Improvement
- Create dedicated verification screen
- Add email editing capability
- Implement resend functionality
- Ensure cross-device compatibility
- Block access to app features until verification complete

### Phase 4: Anonymous User Tracking
- Implement browser storage for visitor album/song selections
- Create mechanism to transfer selections to user account
- Add logic to delete temporary session when existing users log in
- Test cross-device scenarios
- Implement context-aware redirects for unregistered users

### Phase 5: Premium Features Implementation
- Create premium badge system
- Implement lifetime access subscription option
- Develop premium-only Swiftivities (11x3 and 5x10 lists)
- Add early access capabilities for new features
- Create contributor program for premium users

## Success Metrics
- Reduced code complexity in access control
- Improved signup completion rate
- Decreased support requests related to email verification
- Increased conversion from visitor to registered user
- Higher engagement with Swiftivities
- Premium conversion rate of at least 5% of registered users
