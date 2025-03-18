/**
 * Utility functions for generating T3x3 data structures for visualization
 */

export type T3x3Node = {
  name: string;
  value?: number;
  children?: T3x3Node[];
};

export type T3x3Category = {
  name: string;
  items: T3x3Item[];
};

export type T3x3Item = {
  name: string;
  value: number;
};

/**
 * Converts user T3x3 data into a hierarchical structure for the sunburst visualization
 * @param categories Array of T3x3 categories with their items
 * @param rootName Name for the root node
 * @returns Hierarchical data structure for the sunburst visualization
 */
export function generateT3x3SunburstData(
  categories: T3x3Category[],
  rootName: string = "User T3x3"
): T3x3Node {
  console.log('T3x3DataGenerator: Starting generateT3x3SunburstData', { 
    categoriesCount: categories.length,
    rootName 
  });
  
  // Create the root node
  const rootNode: T3x3Node = {
    name: rootName,
    children: []
  };
  
  console.log('T3x3DataGenerator: Created root node', rootNode);

  // Process each category
  categories.forEach(category => {
    console.log('T3x3DataGenerator: Processing category', category.name, 'with', category.items.length, 'items');
    
    // Calculate the total value for this category
    const categoryTotal = category.items.reduce((sum, item) => sum + item.value, 0);
    
    // Create the category node
    const categoryNode: T3x3Node = {
      name: category.name,
      value: categoryTotal,
      children: []
    };
    
    console.log('T3x3DataGenerator: Created category node', categoryNode.name, 'with total value', categoryTotal);
    
    // Add items as children to the category
    category.items.forEach(item => {
      console.log('T3x3DataGenerator: Adding item', item.name, 'with value', item.value, 'to category', category.name);
      categoryNode.children?.push({
        name: item.name,
        value: item.value
      });
    });
    
    // Add the category to the root node
    rootNode.children?.push(categoryNode);
  });
  
  console.log('T3x3DataGenerator: Final root node structure', rootNode);

  return rootNode;
}

/**
 * Generates sample T3x3 data for testing
 * @returns Sample T3x3 data structure
 */
export function generateSampleT3x3Data(): T3x3Node {
  const categories: T3x3Category[] = [
    {
      name: "Top Artists",
      items: [
        { name: "Taylor Swift", value: 300 },
        { name: "Drake", value: 250 },
        { name: "The Weeknd", value: 200 },
        { name: "Billie Eilish", value: 150 }
      ]
    },
    {
      name: "Top Albums",
      items: [
        { name: "Midnights", value: 200 },
        { name: "After Hours", value: 180 },
        { name: "Certified Lover Boy", value: 170 },
        { name: "Happier Than Ever", value: 150 }
      ]
    },
    {
      name: "Top Genres",
      items: [
        { name: "Pop", value: 200 },
        { name: "Hip Hop", value: 150 },
        { name: "R&B", value: 100 },
        { name: "Alternative", value: 50 }
      ]
    }
  ];

  return generateT3x3SunburstData(categories);
}

/**
 * Normalizes the values in T3x3 data to ensure they sum to a specific total
 * @param data The T3x3 data to normalize
 * @param targetTotal The desired total sum (default: 1000)
 * @returns Normalized T3x3 data
 */
export function normalizeT3x3Data(data: T3x3Node, targetTotal: number = 1000): T3x3Node {
  // Deep clone the data to avoid modifying the original
  const normalizedData = JSON.parse(JSON.stringify(data)) as T3x3Node;
  
  if (!normalizedData.children || normalizedData.children.length === 0) {
    return normalizedData;
  }
  
  // Calculate the current total
  let currentTotal = 0;
  normalizedData.children.forEach(category => {
    if (category.value) {
      currentTotal += category.value;
    } else if (category.children && category.children.length > 0) {
      category.value = category.children.reduce((sum, item) => sum + (item.value || 0), 0);
      currentTotal += category.value;
    }
  });
  
  // Apply the normalization factor to all values
  const factor = targetTotal / currentTotal;
  
  normalizedData.children.forEach(category => {
    if (category.value) {
      category.value = Math.round(category.value * factor);
    }
    
    if (category.children && category.children.length > 0) {
      const categoryFactor = category.value ? category.value / category.children.reduce((sum, item) => sum + (item.value || 0), 0) : 1;
      
      category.children.forEach(item => {
        if (item.value) {
          item.value = Math.round(item.value * factor * categoryFactor);
        }
      });
    }
  });
  
  return normalizedData;
}

/**
 * Merges multiple T3x3 data structures into one
 * @param datasets Array of T3x3 data structures to merge
 * @param rootName Name for the merged root node
 * @returns Merged T3x3 data structure
 */
export function mergeT3x3Datasets(datasets: T3x3Node[], rootName: string = "Merged T3x3"): T3x3Node {
  const mergedData: T3x3Node = {
    name: rootName,
    children: []
  };
  
  // Map to track categories across datasets
  const categoryMap = new Map<string, T3x3Node>();
  
  // Process each dataset
  datasets.forEach(dataset => {
    if (!dataset.children) return;
    
    dataset.children.forEach(category => {
      if (!category.name || !category.children) return;
      
      // Get or create the category in the merged data
      let mergedCategory = categoryMap.get(category.name);
      if (!mergedCategory) {
        mergedCategory = {
          name: category.name,
          value: 0,
          children: []
        };
        categoryMap.set(category.name, mergedCategory);
        mergedData.children?.push(mergedCategory);
      }
      
      // Map to track items within this category
      const itemMap = new Map<string, T3x3Node>();
      mergedCategory.children?.forEach(item => {
        if (item.name) {
          itemMap.set(item.name, item);
        }
      });
      
      // Process items in this category
      category.children.forEach(item => {
        if (!item.name) return;
        
        // Get or create the item in the merged category
        let mergedItem = itemMap.get(item.name);
        if (!mergedItem) {
          mergedItem = {
            name: item.name,
            value: 0
          };
          itemMap.set(item.name, mergedItem);
          mergedCategory?.children?.push(mergedItem);
        }
        
        // Add the value
        if (item.value && mergedItem.value !== undefined) {
          mergedItem.value += item.value;
          if (mergedCategory.value !== undefined) {
            mergedCategory.value += item.value;
          }
        }
      });
    });
  });
  
  return mergedData;
}
