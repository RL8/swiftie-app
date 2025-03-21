/**
 * Reddit Authentication and Verification Module
 * Handles OAuth2 authentication with Reddit and verifies user activity in Taylor Swift subreddits
 */

// Reddit API credentials
const REDDIT_CLIENT_ID = 'PQNSwTWX0NnSUI_mAP1dZA';
const REDDIT_CLIENT_SECRET = 'jjhgcO-4agGSbcDjSyiPUNCvcS7Alw';
const REDDIT_REDIRECT_URI = 'http://localhost:5173/auth/reddit/callback';

// Target subreddits for activity verification
const SWIFTIE_SUBREDDITS = [
  'taylorswift',
  'trueswifties',
  'swiftiemerch',
  'TaylorGamesWannaPlay',
  'YouBelongWithMemes',
  'GaylorSwift',
  'DownTheRabbitHole',
  'StonedSwifties',
  'SwiftlyNeutral',
  'Gaylor_Swift'
];

// Activity requirements
const MIN_COMMENTS = 3;
const MIN_POSTS = 1;

/**
 * Generates a random state string for CSRF protection
 */
function generateState(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Initiates the Reddit OAuth2 flow
 * Redirects the user to Reddit's authorization page
 */
export function initiateRedditAuth(): void {
  // Generate and store state for CSRF protection
  const state = generateState();
  
  // Store state in a cookie instead of localStorage
  document.cookie = `reddit_auth_state=${state}; path=/; max-age=3600; SameSite=Lax`;
  
  // Construct the authorization URL
  const authUrl = new URL('https://www.reddit.com/api/v1/authorize');
  authUrl.searchParams.append('client_id', REDDIT_CLIENT_ID);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('redirect_uri', REDDIT_REDIRECT_URI);
  authUrl.searchParams.append('duration', 'permanent');
  authUrl.searchParams.append('scope', 'identity history');
  
  // Redirect to Reddit's authorization page
  window.location.href = authUrl.toString();
}

/**
 * Exchanges an authorization code for an access token
 * @param code The authorization code from Reddit
 * @returns Access token and refresh token
 */
export async function getRedditToken(code: string): Promise<{ accessToken: string, refreshToken: string }> {
  try {
    const tokenUrl = 'https://www.reddit.com/api/v1/access_token';
    const authHeader = `Basic ${btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`)}`;
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDDIT_REDIRECT_URI
      })
    });
    
    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token
    };
  } catch (error) {
    console.error('Error getting Reddit token:', error);
    throw new Error('Failed to authenticate with Reddit');
  }
}

/**
 * Gets just the username from Reddit
 * @param accessToken Reddit access token
 * @returns Reddit username
 */
export async function getRedditUsername(accessToken: string): Promise<string> {
  try {
    const response = await fetch('https://oauth.reddit.com/api/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'web:swiftie-app:v1.0.0 (by /u/swiftie_dev)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get Reddit user data: ${response.status} ${response.statusText}`);
    }
    
    const userData = await response.json();
    return userData.name;
  } catch (error) {
    console.error('Error getting Reddit username:', error);
    throw error;
  }
}

/**
 * Fetches basic user information from Reddit
 * @param accessToken Reddit access token
 * @returns User data including username and creation date
 */
export async function getRedditUserData(accessToken: string): Promise<any> {
  try {
    const response = await fetch('https://oauth.reddit.com/api/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'Swiftie App v1.0.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
    }
    
    const userData = await response.json();
    
    return {
      username: userData.name,
      created: new Date(userData.created_utc * 1000).toISOString(),
      karma: userData.link_karma + userData.comment_karma
    };
  } catch (error) {
    console.error('Error fetching Reddit user data:', error);
    throw new Error('Failed to get user information from Reddit');
  }
}

/**
 * Fetches user's recent comments
 * @param accessToken Reddit access token
 * @param username Reddit username
 * @returns Array of comment objects
 */
export async function fetchRedditComments(accessToken: string, username: string): Promise<any[]> {
  try {
    const response = await fetch(`https://oauth.reddit.com/user/${username}/comments?limit=100`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'Swiftie App v1.0.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data.children.map((child: any) => ({
      id: child.data.id,
      subreddit: child.data.subreddit.toLowerCase(),
      created: new Date(child.data.created_utc * 1000).toISOString(),
      body: child.data.body
    }));
  } catch (error) {
    console.error('Error fetching Reddit comments:', error);
    return [];
  }
}

/**
 * Fetches user's recent posts
 * @param accessToken Reddit access token
 * @param username Reddit username
 * @returns Array of post objects
 */
export async function fetchRedditPosts(accessToken: string, username: string): Promise<any[]> {
  try {
    const response = await fetch(`https://oauth.reddit.com/user/${username}/submitted?limit=100`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'Swiftie App v1.0.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data.children.map((child: any) => ({
      id: child.data.id,
      subreddit: child.data.subreddit.toLowerCase(),
      created: new Date(child.data.created_utc * 1000).toISOString(),
      title: child.data.title
    }));
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    return [];
  }
}

/**
 * Checks if a user is active in Taylor Swift subreddits
 * @param accessToken Reddit access token
 * @param username Reddit username
 * @returns Whether the user meets the activity requirements
 */
export async function checkSwiftieActivity(accessToken: string, username: string): Promise<boolean> {
  try {
    // Get user's recent comments and posts
    const comments = await fetchRedditComments(accessToken, username);
    const posts = await fetchRedditPosts(accessToken, username);
    
    // Count activity in Taylor Swift subreddits
    const swiftieSubreddits = SWIFTIE_SUBREDDITS.map(s => s.toLowerCase());
    
    const commentCount = comments.filter(c => 
      swiftieSubreddits.includes(c.subreddit.toLowerCase())
    ).length;
    
    const postCount = posts.filter(p => 
      swiftieSubreddits.includes(p.subreddit.toLowerCase())
    ).length;
    
    // Verify using OR logic: at least MIN_COMMENTS comments OR MIN_POSTS posts
    return (commentCount >= MIN_COMMENTS || postCount >= MIN_POSTS);
  } catch (error) {
    console.error('Error checking Swiftie activity:', error);
    return false;
  }
}

/**
 * Gets detailed activity information for verified users
 * @param accessToken Reddit access token
 * @param username Reddit username
 * @returns Activity summary in Swiftie subreddits
 */
export async function getSwiftieActivityDetails(accessToken: string, username: string): Promise<any> {
  try {
    const comments = await fetchRedditComments(accessToken, username);
    const posts = await fetchRedditPosts(accessToken, username);
    
    const swiftieSubreddits = SWIFTIE_SUBREDDITS.map(s => s.toLowerCase());
    
    const swiftieComments = comments.filter(c => 
      swiftieSubreddits.includes(c.subreddit.toLowerCase())
    );
    
    const swiftiePosts = posts.filter(p => 
      swiftieSubreddits.includes(p.subreddit.toLowerCase())
    );
    
    return {
      commentCount: swiftieComments.length,
      postCount: swiftiePosts.length,
      isVerified: (swiftieComments.length >= MIN_COMMENTS || swiftiePosts.length >= MIN_POSTS),
      recentActivity: [
        ...swiftieComments.slice(0, 5).map(c => ({
          type: 'comment',
          subreddit: c.subreddit,
          created: c.created,
          preview: c.body.substring(0, 50) + (c.body.length > 50 ? '...' : '')
        })),
        ...swiftiePosts.slice(0, 5).map(p => ({
          type: 'post',
          subreddit: p.subreddit,
          created: p.created,
          title: p.title
        }))
      ].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    };
  } catch (error) {
    console.error('Error getting Swiftie activity details:', error);
    return {
      commentCount: 0,
      postCount: 0,
      isVerified: false,
      recentActivity: []
    };
  }
}
