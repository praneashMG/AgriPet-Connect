const pool = require('./config/db');

async function updateImages() {
  try {
    const animalImages = [
      { name: 'Premium Holstein Cow', url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=1200&q=80' },
      { name: 'Golden Retriever Puppy', url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&q=80' },
      { name: 'Beetal Goat', url: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=1200&q=80' },
      { name: 'Persian Cat', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200&q=80' },
      { name: 'Thoroughbred Horse', url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200&q=80' }
    ];

    const productImages = [
      { name: 'Premium Calf Starter Feed', url: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=1200&q=80' },
      { name: 'Multivitamin Syrup', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80' },
      { name: 'Heavy Duty Dog Collar', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200&q=80' },
      { name: 'Organic Poultry Feed', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&q=80' },
      { name: 'Goat Mineral Block', url: 'https://images.unsplash.com/photo-1621217036329-84724cb11444?w=1200&q=80' }
    ];

    console.log("Updating animal images...");
    for (let a of animalImages) {
      await pool.query("UPDATE animals SET image=$1 WHERE animal_name=$2", [a.url, a.name]);
    }

    console.log("Updating product images...");
    for (let p of productImages) {
      await pool.query("UPDATE products SET image=$1 WHERE name=$2", [p.url, p.name]);
    }

    console.log("All images updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating images:", err);
    process.exit(1);
  }
}

updateImages();
