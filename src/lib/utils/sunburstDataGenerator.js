/**
 * Utility functions for generating sample hierarchical data for sunburst charts
 * @typedef {Object} SunburstNode
 * @property {string} name - The name of the node
 * @property {number} [value] - The value of the node (for leaf nodes)
 * @property {SunburstNode[]} [children] - Child nodes (for non-leaf nodes)
 * @property {string} [color] - Optional color for the node
 */

/**
 * Generate a random hierarchical data structure for a sunburst chart
 * @param {number} [maxDepth=3] - Maximum depth of the hierarchy
 * @param {number} [maxChildren=5] - Maximum number of children per node
 * @param {number} [maxValue=100] - Maximum value for leaf nodes
 * @returns {SunburstNode} Root node of the generated hierarchy
 */
export function generateRandomData(maxDepth = 3, maxChildren = 5, maxValue = 100) {
  const root = {
    name: 'Root',
    children: []
  };

  // Generate random children for the root node
  const numChildren = Math.floor(Math.random() * maxChildren) + 2;
  for (let i = 0; i < numChildren; i++) {
    root.children.push(generateNode(1, maxDepth, `Category ${i + 1}`));
  }

  return root;
}

/**
 * Generate a random node for the hierarchy
 * @param {number} currentDepth - Current depth in the hierarchy
 * @param {number} maxDepth - Maximum depth of the hierarchy
 * @param {string} parentName - Name of the parent node
 * @returns {SunburstNode} Generated node
 */
function generateNode(currentDepth, maxDepth, parentName) {
  const node = {
    name: `${parentName}`
  };

  // If we've reached the maximum depth, create a leaf node with a value
  if (currentDepth >= maxDepth) {
    node.value = Math.floor(Math.random() * 100) + 1;
    return node;
  }

  // Otherwise, create a non-leaf node with children
  node.children = [];
  const numChildren = Math.floor(Math.random() * 4) + 1;
  
  for (let i = 0; i < numChildren; i++) {
    node.children.push(generateNode(currentDepth + 1, maxDepth, `${node.name}-${i + 1}`));
  }

  return node;
}

// Sample categories and subcategories for more realistic data
const categories = {
  Music: ['Pop', 'Rock', 'Jazz', 'Classical', 'Hip Hop', 'Electronic', 'Country', 'R&B'],
  Movies: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance', 'Documentary', 'Animation'],
  Books: ['Fiction', 'Non-Fiction', 'Mystery', 'Science', 'Fantasy', 'Biography', 'History', 'Self-Help'],
  Sports: ['Football', 'Basketball', 'Baseball', 'Soccer', 'Tennis', 'Golf', 'Swimming', 'Running'],
  Food: ['Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'French', 'American', 'Mediterranean'],
  Travel: ['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Australia', 'Antarctica', 'Islands'],
  Technology: ['Smartphones', 'Computers', 'Software', 'Gadgets', 'AI', 'VR/AR', 'Gaming', 'Internet'],
  Fashion: ['Casual', 'Formal', 'Sportswear', 'Vintage', 'Luxury', 'Streetwear', 'Accessories', 'Footwear'],
  Art: ['Painting', 'Sculpture', 'Photography', 'Digital Art', 'Drawing', 'Ceramics', 'Printmaking', 'Installation'],
  Science: ['Physics', 'Biology', 'Chemistry', 'Astronomy', 'Mathematics', 'Medicine', 'Environmental', 'Psychology']
};

const subcategories = {
  Pop: ['Dance Pop', 'Synth Pop', 'Power Pop', 'Indie Pop', 'K-Pop', 'Electropop'],
  Rock: ['Classic Rock', 'Alternative', 'Indie Rock', 'Metal', 'Punk', 'Grunge'],
  Action: ['Superhero', 'Spy', 'Martial Arts', 'War', 'Adventure', 'Disaster'],
  Comedy: ['Romantic Comedy', 'Slapstick', 'Satire', 'Dark Comedy', 'Parody', 'Sitcom'],
  Fiction: ['Science Fiction', 'Fantasy', 'Thriller', 'Romance', 'Historical Fiction', 'Young Adult'],
  'Non-Fiction': ['Biography', 'History', 'Science', 'Self-Help', 'Travel', 'True Crime']
};

/**
 * Generate sample data with realistic categories
 * @returns {SunburstNode} Root node with realistic category data
 */
export function generateSampleData() {
  const root = {
    name: 'Interests',
    children: []
  };

  // Add some categories
  const categoryKeys = Object.keys(categories);
  const numCategories = Math.min(5, categoryKeys.length);
  
  for (let i = 0; i < numCategories; i++) {
    const categoryKey = categoryKeys[i];
    const category = {
      name: categoryKey,
      children: []
    };
    
    // Add subcategories
    const subcategoryItems = categories[categoryKey] || [];
    const numSubcategories = Math.min(4, subcategoryItems.length);
    
    for (let j = 0; j < numSubcategories; j++) {
      const subcategoryName = subcategoryItems[j];
      
      // Check if this subcategory has further divisions
      if (subcategories[subcategoryName]) {
        const subcategory = {
          name: subcategoryName,
          children: []
        };
        
        // Add items within the subcategory
        const items = subcategories[subcategoryName] || [];
        const numItems = Math.min(3, items.length);
        
        for (let k = 0; k < numItems; k++) {
          subcategory.children.push({
            name: items[k],
            value: Math.floor(Math.random() * 100) + 20
          });
        }
        
        category.children.push(subcategory);
      } else {
        // Add as a leaf node
        category.children.push({
          name: subcategoryName,
          value: Math.floor(Math.random() * 100) + 20
        });
      }
    }
    
    root.children.push(category);
  }
  
  return root;
}

// Taylor Swift albums and songs for themed data
const taylorSwiftData = {
  albums: [
    {
      name: 'Taylor Swift',
      year: 2006,
      songs: ['Tim McGraw', 'Picture to Burn', 'Teardrops on My Guitar', 'A Place in This World', 'Cold as You', 'The Outside', 'Tied Together with a Smile', 'Stay Beautiful', 'Should\'ve Said No', 'Mary\'s Song (Oh My My My)', 'Our Song']
    },
    {
      name: 'Fearless',
      year: 2008,
      songs: ['Fearless', 'Fifteen', 'Love Story', 'Hey Stephen', 'White Horse', 'You Belong with Me', 'Breathe', 'Tell Me Why', 'You\'re Not Sorry', 'The Way I Loved You', 'Forever & Always', 'The Best Day', 'Change']
    },
    {
      name: 'Speak Now',
      year: 2010,
      songs: ['Mine', 'Sparks Fly', 'Back to December', 'Speak Now', 'Dear John', 'Mean', 'The Story of Us', 'Never Grow Up', 'Enchanted', 'Better Than Revenge', 'Innocent', 'Haunted', 'Last Kiss', 'Long Live']
    },
    {
      name: 'Red',
      year: 2012,
      songs: ['State of Grace', 'Red', 'Treacherous', 'I Knew You Were Trouble', 'All Too Well', '22', 'I Almost Do', 'We Are Never Ever Getting Back Together', 'Stay Stay Stay', 'The Last Time', 'Holy Ground', 'Sad Beautiful Tragic', 'The Lucky One', 'Everything Has Changed', 'Starlight', 'Begin Again']
    },
    {
      name: '1989',
      year: 2014,
      songs: ['Welcome to New York', 'Blank Space', 'Style', 'Out of the Woods', 'All You Had to Do Was Stay', 'Shake It Off', 'I Wish You Would', 'Bad Blood', 'Wildest Dreams', 'How You Get the Girl', 'This Love', 'I Know Places', 'Clean']
    },
    {
      name: 'Reputation',
      year: 2017,
      songs: ['...Ready for It?', 'End Game', 'I Did Something Bad', 'Don\'t Blame Me', 'Delicate', 'Look What You Made Me Do', 'So It Goes...', 'Gorgeous', 'Getaway Car', 'King of My Heart', 'Dancing with Our Hands Tied', 'Dress', 'This Is Why We Can\'t Have Nice Things', 'Call It What You Want', 'New Year\'s Day']
    },
    {
      name: 'Lover',
      year: 2019,
      songs: ['I Forgot That You Existed', 'Cruel Summer', 'Lover', 'The Man', 'The Archer', 'I Think He Knows', 'Miss Americana & the Heartbreak Prince', 'Paper Rings', 'Cornelia Street', 'Death by a Thousand Cuts', 'London Boy', 'Soon You\'ll Get Better', 'False God', 'You Need to Calm Down', 'Afterglow', 'Me!', 'It\'s Nice to Have a Friend', 'Daylight']
    },
    {
      name: 'Folklore',
      year: 2020,
      songs: ['The 1', 'Cardigan', 'The Last Great American Dynasty', 'Exile', 'My Tears Ricochet', 'Mirrorball', 'Seven', 'August', 'This Is Me Trying', 'Illicit Affairs', 'Invisible String', 'Mad Woman', 'Epiphany', 'Betty', 'Peace', 'Hoax']
    },
    {
      name: 'Evermore',
      year: 2020,
      songs: ['Willow', 'Champagne Problems', 'Gold Rush', '\'Tis the Damn Season', 'Tolerate It', 'No Body, No Crime', 'Happiness', 'Dorothea', 'Coney Island', 'Ivy', 'Cowboy like Me', 'Long Story Short', 'Marjorie', 'Closure', 'Evermore']
    },
    {
      name: 'Midnights',
      year: 2022,
      songs: ['Lavender Haze', 'Maroon', 'Anti-Hero', 'Snow on the Beach', 'You\'re on Your Own, Kid', 'Midnight Rain', 'Question...?', 'Vigilante Shit', 'Bejeweled', 'Labyrinth', 'Karma', 'Sweet Nothing', 'Mastermind']
    }
  ],
  eras: [
    {
      name: 'Country Era',
      albums: ['Taylor Swift', 'Fearless', 'Speak Now']
    },
    {
      name: 'Pop Transition',
      albums: ['Red', '1989']
    },
    {
      name: 'Mature Pop',
      albums: ['Reputation', 'Lover']
    },
    {
      name: 'Indie/Alternative',
      albums: ['Folklore', 'Evermore']
    },
    {
      name: 'Return to Pop',
      albums: ['Midnights']
    }
  ]
};

/**
 * Generate Taylor Swift themed data for the sunburst chart
 * @param {boolean} [byEra=true] - Whether to organize by era (true) or chronologically (false)
 * @returns {SunburstNode} Root node with Taylor Swift data
 */
export function generateTaylorSwiftData(byEra = true) {
  if (byEra) {
    return generateTaylorSwiftDataByEra();
  } else {
    return generateTaylorSwiftDataChronologically();
  }
}

/**
 * Generate Taylor Swift data organized by musical era
 * @returns {SunburstNode} Root node with Taylor Swift data organized by era
 */
function generateTaylorSwiftDataByEra() {
  const root = {
    name: 'Taylor Swift',
    children: []
  };

  // Add eras
  for (const era of taylorSwiftData.eras) {
    const eraNode = {
      name: era.name,
      children: []
    };

    // Add albums for this era
    for (const eraAlbumName of era.albums) {
      // Find the album details
      const albumDetails = taylorSwiftData.albums.find(album => album.name === eraAlbumName);
      
      if (albumDetails) {
        const albumNode = {
          name: `${albumDetails.name} (${albumDetails.year})`,
          children: []
        };

        // Add songs from this album
        for (const song of albumDetails.songs) {
          albumNode.children.push({
            name: song,
            value: Math.floor(Math.random() * 50) + 50 // Random popularity value
          });
        }

        eraNode.children.push(albumNode);
      }
    }

    root.children.push(eraNode);
  }

  return root;
}

/**
 * Generate Taylor Swift data organized chronologically by album
 * @returns {SunburstNode} Root node with Taylor Swift data organized chronologically
 */
function generateTaylorSwiftDataChronologically() {
  const root = {
    name: 'Taylor Swift',
    children: []
  };

  // Sort albums by year
  const sortedAlbums = [...taylorSwiftData.albums].sort((a, b) => a.year - b.year);

  // Add albums
  for (const album of sortedAlbums) {
    const albumNode = {
      name: `${album.name} (${album.year})`,
      children: []
    };

    // Add songs
    for (const song of album.songs) {
      albumNode.children.push({
        name: song,
        value: Math.floor(Math.random() * 50) + 50 // Random popularity value
      });
    }

    root.children.push(albumNode);
  }

  return root;
}

/**
 * Converts flat data to hierarchical format for the sunburst chart
 * @param {Array} data - Array of flat data objects
 * @param {Array} hierarchyLevels - Array of property names to create hierarchy
 * @param {string} [valueField='value'] - Field to use for the value
 * @returns {SunburstNode} Hierarchical data object
 */
export function convertFlatToHierarchical(data, hierarchyLevels, valueField = 'value') {
  // Create root node
  const root = {
    name: 'root',
    children: []
  };

  // Process each data item
  data.forEach(item => {
    // Start at the root level
    let currentLevel = root;

    // Process each level of the hierarchy
    hierarchyLevels.forEach((level, i) => {
      const levelValue = item[level];
      
      // Skip if the level value is missing
      if (levelValue === undefined || levelValue === null) return;

      // Check if this node already exists at the current level
      let existingNode = currentLevel.children && currentLevel.children.find(node => node.name === levelValue);

      // If not, create a new node
      if (!existingNode) {
        existingNode = {
          name: levelValue
        };

        // If this is not the last level, add a children array
        if (i < hierarchyLevels.length - 1) {
          existingNode.children = [];
        } 
        // If this is the last level, add the value
        else if (valueField in item) {
          existingNode.value = item[valueField];
        }

        // Add the new node to the current level
        if (!currentLevel.children) {
          currentLevel.children = [];
        }
        currentLevel.children.push(existingNode);
      }

      // Move to the next level
      currentLevel = existingNode;
    });
  });

  return root;
}
