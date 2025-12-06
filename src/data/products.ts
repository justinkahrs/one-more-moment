export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'Electronics' | 'Fashion' | 'Home & Garden' | 'Sports';
}

export const products: Product[] = [
  {
    id: 'wireless-headphones',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    description: 'Immersive sound with active noise cancellation and 40-hour battery life.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    category: 'Electronics',
  },
  {
    id: 'smartwatch',
    name: 'Fitness Smartwatch',
    price: 399.99,
    description: 'Track your health and fitness with precision. GPS, heart rate, and more.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    category: 'Electronics',
  },
  {
    id: 'laptop-bag',
    name: 'Leather Laptop Bag',
    price: 149.99,
    description: 'Handcrafted genuine leather bag for laptops up to 15 inches.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    category: 'Fashion',
  },
  {
    id: 'running-shoes',
    name: 'Ultra Running Shoes',
    price: 179.99,
    description: 'Lightweight performance running shoes with responsive cushioning.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    category: 'Sports',
  },
  {
    id: 'ceramic-mug',
    name: 'Artisan Ceramic Mug Set',
    price: 49.99,
    description: 'Set of 4 handmade ceramic mugs in earthy tones. Microwave safe.',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
    category: 'Home & Garden',
  },
  {
    id: 'yoga-mat',
    name: 'Premium Yoga Mat',
    price: 89.99,
    description: 'Eco-friendly natural rubber mat with excellent grip and cushioning.',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
    category: 'Sports',
  },
  {
    id: 'desk-lamp',
    name: 'Modern LED Desk Lamp',
    price: 129.99,
    description: 'Adjustable brightness and color temperature for perfect lighting.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    category: 'Home & Garden',
  },
  {
    id: 'wireless-earbuds',
    name: 'True Wireless Earbuds',
    price: 199.99,
    description: 'Crystal clear audio with active noise cancellation in a compact design.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    category: 'Electronics',
  },
  {
    id: 'cotton-tshirt',
    name: 'Organic Cotton T-Shirt',
    price: 39.99,
    description: 'Soft, breathable organic cotton in classic fit. Available in multiple colors.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    category: 'Fashion',
  },
  {
    id: 'plant-pot',
    name: 'Ceramic Plant Pot',
    price: 34.99,
    description: 'Minimalist design ceramic pot perfect for indoor plants.',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80',
    category: 'Home & Garden',
  },
  {
    id: 'denim-jacket',
    name: 'Classic Denim Jacket',
    price: 119.99,
    description: 'Timeless denim jacket with modern fit. A wardrobe essential.',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
    category: 'Fashion',
  },
  {
    id: 'water-bottle',
    name: 'Insulated Water Bottle',
    price: 44.99,
    description: 'Keep drinks cold for 24h or hot for 12h. 32oz stainless steel.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
    category: 'Sports',
  },
];

export const categories = ['All', 'Electronics', 'Fashion', 'Home & Garden', 'Sports'] as const;
