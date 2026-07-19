import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Service } from "@/lib/models/Service";
import { Store } from "@/lib/models/Store";
import { Booking } from "@/lib/models/Booking";

const img = (id: string, w = 400, h = 300) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop`;

export async function POST() {
  await connectDB();

  const existing = await Product.countDocuments();
  if (existing > 0) {
    return NextResponse.json({ message: "Already seeded" });
  }

  const stores = await Store.insertMany([
    { name: "Urban Essentials", tag: "Fulfilled", offeringCount: 10, images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1441984904996-e0b6ba9b56e3?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&h=150&fit=crop",
    ]},
    { name: "The Artisan Loft", tag: "Filled", offeringCount: 5, images: [
      "https://images.unsplash.com/photo-1567721913486-6585f069b332?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1546241072-48010ad2862c?w=150&h=150&fit=crop",
    ]},
    { name: "Tech Haven", tag: "Filled", offeringCount: 5, images: [
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150&h=150&fit=crop",
    ]},
    { name: "Bloom & Co.", tag: "Fulfilled", offeringCount: 5, images: [
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1490750967868-88aa4f44bcad?w=150&h=150&fit=crop",
    ]},
  ]);

  const ue = stores[0]._id;
  const alt = stores[1]._id;
  const tech = stores[2]._id;
  const bloom = stores[3]._id;

  const bdayProducts = await Product.insertMany([
    { title: "Premium Balloons (12-pack)", price: 12.99, rating: 4.5, type: "item", storeId: ue, image: img("photo-1579972388899-85052bd71b5") },
    { title: "Confetti Cannon", price: 8.99, rating: 4.3, type: "item", storeId: ue, image: img("photo-1530103862676-de8c9debad1d") },
    { title: "Happy Birthday Banner", price: 6.99, rating: 4.6, type: "item", storeId: ue, image: img("photo-1527529482837-4698179dc6ce") },
    { title: "Party Hats (8-pack)", price: 5.99, rating: 4.2, type: "item", storeId: ue, image: img("photo-1558636508-e0db3814bd1b") },
    { title: "Cake Toppers (set)", price: 9.99, rating: 4.4, type: "item", storeId: ue, image: img("photo-1578985545062-69928b1d9587") },
  ]);

  const weddingProducts = await Product.insertMany([
    { title: "Wedding Invites (set of 50)", price: 34.99, rating: 4.8, type: "item", storeId: alt, image: img("photo-1604503468506-a8da13d82791") },
    { title: "Table Centerpieces (set)", price: 29.99, rating: 4.6, type: "item", storeId: alt, image: img("photo-1478145046317-39f10e56b5e9") },
    { title: "Wedding Favors (box of 20)", price: 24.99, rating: 4.5, type: "item", storeId: alt, image: img("photo-1511795409834-ef04bbd61622") },
    { title: "Photo Booth Props (set)", price: 15.99, rating: 4.3, type: "item", storeId: alt, image: img("photo-1496337589254-7e19d01cec44") },
    { title: "Aisle Decor Kit", price: 39.99, rating: 4.7, type: "item", storeId: alt, image: img("photo-1510076857177-7470076d4098") },
  ]);

  const cleanProducts = await Product.insertMany([
    { title: "Microfiber Mop", price: 24.99, rating: 4.4, type: "item", storeId: tech, image: img("photo-1563453392212-326f5e854473") },
    { title: "Cleaning Bucket (12L)", price: 14.99, rating: 4.3, type: "item", storeId: tech, image: img("photo-1563453392212-326f5e854473") },
    { title: "Rubber Gloves (pair)", price: 5.99, rating: 4.1, type: "item", storeId: tech, image: img("photo-1584820927498-cfe5211fd8bf") },
    { title: "Disinfectant Spray (1L)", price: 8.99, rating: 4.5, type: "item", storeId: tech, image: img("photo-1585421514284-efb74c2b69d3") },
    { title: "Scrub Brushes (set)", price: 11.99, rating: 4.2, type: "item", storeId: tech, image: img("photo-1563453392212-326f5e854473") },
  ]);

  const bbqProducts = await Product.insertMany([
    { title: "Portable Grill", price: 89.99, rating: 4.6, type: "item", storeId: bloom, image: img("photo-1558030089-0e3a9e8ed0d4") },
    { title: "Charcoal Bag (10kg)", price: 14.99, rating: 4.4, type: "item", storeId: bloom, image: img("photo-1558030089-0e3a9e8ed0d4") },
    { title: "BBQ Skewers (set)", price: 7.99, rating: 4.2, type: "item", storeId: bloom, image: img("photo-1558030089-0e3a9e8ed0d4") },
    { title: "BBQ Sauce Set (3-pack)", price: 12.99, rating: 4.5, type: "item", storeId: bloom, image: img("photo-1558030089-0e3a9e8ed0d4") },
    { title: "Disposable Plates (50-pack)", price: 9.99, rating: 4.3, type: "item", storeId: bloom, image: img("photo-1558030089-0e3a9e8ed0d4") },
  ]);

  await Service.insertMany([
    { title: "Birthday Decoration", price: 149.99, rating: 4.7, description: "Complete party decoration setup with balloons, banners & more", storeId: ue, image: img("photo-1464349153735-7db50ed83c84"), productCount: 5, products: bdayProducts.map((p) => p._id) },
    { title: "Wedding Planning", price: 499.99, rating: 4.9, description: "Elegant wedding essentials from invites to decor", storeId: alt, image: img("photo-1519741497674-611481863552"), productCount: 5, products: weddingProducts.map((p) => p._id) },
    { title: "Home Deep Clean", price: 89.99, rating: 4.6, description: "Professional-grade cleaning supplies for a spotless home", storeId: tech, image: img("photo-1581578731548-c64695cc6952"), productCount: 5, products: cleanProducts.map((p) => p._id) },
    { title: "Backyard BBQ", price: 199.99, rating: 4.5, description: "Everything for the perfect barbecue gathering", storeId: bloom, image: img("photo-1558030089-0e3a9e8ed0d4"), productCount: 5, products: bbqProducts.map((p) => p._id) },
  ]);

  return NextResponse.json({ message: "Seeded successfully" });
}
