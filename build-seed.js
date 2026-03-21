import fs from 'fs';

// Read the entire catalogData file 
const catalogPath = './src/data/catalogData.ts';
const content = fs.readFileSync(catalogPath, 'utf8');

// Extract just the products array
const productsMatch = content.match(/const products: CatalogProduct\[\] = \[([\s\S]*?)\];/);

if (productsMatch) {
  const productsArray = productsMatch[1];
  
  // Create the seed products file
  const seedContent = `/**
 * Seed Products Data - Copied from catalogData.ts
 * 114+ products ready to be seeded to MongoDB
 * Edit this file to modify products
 */

export const productsData = [${productsArray}
];
`;

  fs.writeFileSync('./backend/src/data/seed-products.js', seedContent);
  
  // Count products
  const productCount = (productsArray.match(/id: "/g) || []).length;
  console.log(`✓ Seed file created with ${productCount} products`);
} else {
  console.error('✗ Could not extract products from catalogData');
}
