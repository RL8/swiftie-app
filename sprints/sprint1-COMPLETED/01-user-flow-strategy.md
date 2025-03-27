# Sprint 1: User Flow Optimization

## Overview
This sprint focuses on simplifying the user experience, streamlining access control, and creating a more intuitive progression from visitor to premium user.

## Goals
- Simplify user types and access control
- Create a clear path from visitor to registered user to premium user
- Improve email verification flow
- Track anonymous user selections

## Changes

### 1. Three-Layer Access Model

#### Public Access (No Login)
- Landing page, previews, and demos accessible to everyone
- Clear "Sign up" prompts when trying to take actions

#### Free Registered Users
- Core functionality available after registration
- Basic features with reasonable usage limits
- Personal dashboard and content creation

#### Premium Users
- Single premium tier (simplified from multiple subscription types)
- Unlimited usage and enhanced features
- No complex subscription distinctions

### 2. Email-Based Registration Flow

#### Email as Initial Username
- Use email address as default username
- Allow customization after verification

#### Strict Email Verification
- No app access until email is verified
- Verification screen with clear instructions
- Option to edit email if mistyped
- Resend verification option
- Cross-device compatibility

### 3. Anonymous User Tracking

#### Browser Storage for Visitors
- Remember selections made before signup
- Transfer choices to user account upon registration

#### Database-Backed Storage
- All user data stored in database, not just browser
- Accessible across all devices after verification

### 4. Simplified Database Structure

#### Streamlined User Types
- Single boolean flag for premium status
- Remove complex subscription type distinctions
- Simpler database queries and access control

### 5. "Show Everything, Limit Actions" UI Approach

#### All Pages Visible
- No hidden sections based on user type
- Clear premium indicators on premium features
- Upgrade prompts when trying premium actions

## Implementation Plan

### Phase 1: Database Simplification
- Modify user profile schema to include single premium flag
- Update database queries to use simplified structure
- Migrate existing users to new structure

### Phase 2: Access Control Refactoring
- Implement "Show Everything, Limit Actions" approach
- Remove complex route protection
- Add action-level permission checks

### Phase 3: Email Verification Improvement
- Create dedicated verification page
- Add email editing capability
- Implement resend functionality
- Ensure cross-device compatibility

### Phase 4: Anonymous User Tracking
- Implement browser storage for visitor selections
- Create mechanism to transfer selections to user account
- Test cross-device scenarios

## Success Metrics
- Reduced code complexity in access control
- Improved signup completion rate
- Decreased support requests related to email verification
- Increased conversion from visitor to registered user
