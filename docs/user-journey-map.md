# Swiftie App User Navigation Journey

This document outlines the navigation paths for different user types within the Swiftie app, highlighting key touchpoints, features, and experiences throughout their journey.

## User Types

The Swiftie app serves several distinct user types, each with unique needs and journeys:

1. **First-time Visitor** - New to the app, exploring features
2. **Unregistered User** - Using basic features without an account
3. **Free Tier User** - Registered with basic access
4. **Premium User** - Subscribed with full access to all features
5. **Returning User** - Familiar with the app, has preferences saved

## Navigation Journeys

### 1. First-time Visitor Journey

**Entry Point:** Home Page (`/`)

**Journey Path:**
1. **Home Page** - First impression and app overview
   - Views welcome message and animations
   - Has two options: "Get Started" or "Quick Share"
   
2. **If selects "Get Started":**
   - → **Albums Selection** (`/albums`)
   - Chooses 3 favorite Taylor Swift albums
   - → **Album Confirmation** (`/albums/confirm`)
   - → **Song Selection** (for each album)
   - → **Results Page** (`/albums/results`)
   - → **Share Options** (`/albums/share`)
   
3. **If selects "Quick Share":**
   - → **Albums Selection** with auto-selection (`/albums?quick-share=true`)
   - → **Album Confirmation** (`/albums/confirm?quick-share=true`)
   - → **Results Page** with pre-selected content
   - → **Share Options** (`/albums/share`)

4. **Conversion Opportunities:**
   - Sign Up prompt on Share page
   - Login option in navigation

### 2. Unregistered User Journey

**Entry Point:** Home Page (`/`) or Share Link

**Journey Path:**
1. **Limited Navigation** - Access to:
   - Home (`/`)
   - Albums selection and results (without saving)
   - Share page (temporary)
   
2. **Navigation Bar Options:**
   - Home
   - Sign In
   
3. **Conversion Points:**
   - Login prompt when attempting to save preferences
   - Sign Up option on share page results

### 3. Free Tier User Journey

**Entry Point:** Home Page after login (`/`) or direct login (`/login`)

**Journey Path:**
1. **Authentication:**
   - → **Login Page** (`/login`)
   - → Reddit OAuth authentication
   
2. **Full Navigation Access:**
   - Home (`/`)
   - Feed (`/feed`) - Community content
   - Albums (`/albums`) - Selection process
   - Profile (`/profile`) - User details
   
3. **Album Journey:**
   - Albums selection → Confirmation → Song selection → Results → Share
   - Ability to save preferences
   
4. **Social Features:**
   - View community shares in Feed
   - Share own selections
   
5. **Upgrade Opportunities:**
   - Premium features preview
   - Upgrade button in Profile

### 4. Premium User Journey

**Entry Point:** Home Page after login (`/`)

**Journey Path:**
1. **Enhanced Navigation:**
   - All Free Tier navigation options
   - Additional premium-only sections
   
2. **Extended Features:**
   - Advanced sharing options
   - Multiple saved lists
   - Personalized recommendations
   
3. **Premium Experience:**
   - No upgrade prompts
   - Access to all display options
   - Ability to create custom lists

### 5. Returning User Journey

**Entry Point:** Home Page (`/`) or deep link from previous session

**Journey Path:**
1. **Personalized Welcome:**
   - Home page with saved preferences
   - Quick access to previous selections
   
2. **Streamlined Navigation:**
   - Direct access to frequently used features
   - Suggested new content based on history
   
3. **Continued Engagement:**
   - Updates on new features
   - Community content in Feed

## Feature Access by User Type

| Feature | First-time | Unregistered | Free Tier | Premium |
|---------|------------|--------------|-----------|---------|
| Album Selection | ✅ | ✅ | ✅ | ✅ |
| Song Selection | ✅ | ✅ | ✅ | ✅ |
| Basic Sharing | ✅ | ✅ | ✅ | ✅ |
| Save Preferences | ❌ | ❌ | ✅ | ✅ |
| View Feed | ❌ | ❌ | ✅ | ✅ |
| Profile Management | ❌ | ❌ | ✅ | ✅ |
| Multiple Lists | ❌ | ❌ | ❌ | ✅ |
| Advanced Sharing | ❌ | ❌ | ❌ | ✅ |

## Key Interaction Points

### Share Page Display Options

All users can access the share page with three display options:
1. **List View** - Traditional vertical list of albums and songs
2. **Grid View** - Visual grid layout with proportional album sizes
3. **Free Style** - User suggestion form for custom layouts

### Authentication Touchpoints

- **Reddit OAuth** - Primary authentication method
- **Login Page** - Entry point for returning users
- **Registration** - New user signup process
- **Upgrade Flow** - Conversion from Free to Premium

## User Flow Diagram

```
Home Page
├── Quick Share → Auto-Selection → Results → Share Options
└── Get Started → Manual Selection → Confirmation → Song Selection → Results → Share Options
    └── [If Logged In] → Save Preferences
        └── [If Premium] → Create Multiple Lists

Navigation Bar
├── Home → Welcome Screen
├── Feed → Community Content [Requires Login]
├── Albums → Selection Process
└── Profile → User Details [Requires Login]
    └── Upgrade Option [Free Tier Only]
```

## Conclusion

The Swiftie app provides tailored experiences for different user types while maintaining a consistent core journey focused on album and song selection. The navigation structure encourages exploration for new users while providing efficient paths for returning users, with clear upgrade opportunities for free tier users to convert to premium.
