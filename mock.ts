interface ProductData {
  title: string;
  price: number;
  rating: number;
  type: "item" | "service";
  image: string;
}

interface StoreData {
  name: string;
  tag: "Fulfilled" | "Filled";
  offeringCount: number;
  images: string[];
}

export const products: readonly ProductData[] = [
  {
    title: "Wireless Headphones",
    price: 79.99,
    rating: 4.5,
    type: "item",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
  },
  {
    title: "Yoga Class Pass",
    price: 25.0,
    rating: 4.8,
    type: "service",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
  },
  {
    title: "Leather Notebook",
    price: 24.99,
    rating: 4.2,
    type: "item",
    image: "https://images.unsplash.com/photo-1531346878377-1270d5fe5b8b?w=400&h=300&fit=crop",
  },
  {
    title: "Guitar Lesson",
    price: 45.0,
    rating: 4.9,
    type: "service",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop",
  },
  {
    title: "Mechanical Keyboard",
    price: 149.99,
    rating: 4.7,
    type: "item",
    image: "https://images.unsplash.com/photo-1611669333507-fcbf2a11e20e?w=400&h=300&fit=crop",
  },
  {
    title: "Spa Massage",
    price: 85.0,
    rating: 4.6,
    type: "service",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
  },
  {
    title: "Minimalist Watch",
    price: 199.0,
    rating: 4.4,
    type: "item",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop",
  },
  {
    title: "Cooking Workshop",
    price: 60.0,
    rating: 4.3,
    type: "service",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  },
  {
    title: "Designer Sunglasses",
    price: 129.99,
    rating: 4.1,
    type: "item",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
  },
];

export const stores: readonly StoreData[] = [
  {
    name: "Urban Essentials",
    tag: "Fulfilled",
    offeringCount: 24,
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1441984904996-e0b6ba9b56e3?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&h=150&fit=crop",
    ],
  },
  {
    name: "The Artisan Loft",
    tag: "Filled",
    offeringCount: 12,
    images: [
      "https://images.unsplash.com/photo-1567721913486-6585f069b332?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1546241072-48010ad2862c?w=150&h=150&fit=crop",
    ],
  },
  {
    name: "Tech Haven",
    tag: "Filled",
    offeringCount: 38,
    images: [
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150&h=150&fit=crop",
    ],
  },
  {
    name: "Bloom & Co.",
    tag: "Fulfilled",
    offeringCount: 18,
    images: [
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1490750967868-88aa4f44bcad?w=150&h=150&fit=crop",
    ],
  },
];