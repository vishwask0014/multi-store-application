const content = {
  hero: {
    badge: "One login, every store you run",
    tagline: "Run every store you own.",
    highlight: "Sell goods, sell service, sell both.",
    subtitle:
      "Open as many stores as your business needs, list products, attach a service to any of them — installation, repair, a consult, a follow-up visit — and let customers get the good and the service done without ever leaving your listing.",
    cta: { shop: "Browse the marketplace", dashboard: "Open your first store" },
    tagLabels: {
      productOnly: "Product",
      bundled: "Product + Service",
    },
  },
  builder: {
    heading: "One listing. Good and service, together.",
    sub: "Pick a product, attach a service if it needs one, and see the listing your customer actually sees.",
    productLabel: "Choose a product",
    serviceLabel: "Attach a service (optional)",
    products: [
      { id: "machine", name: "Espresso Machine", price: 449, store: "Kessler Home Goods", emoji: "☕" },
      { id: "bike", name: "Trail Bike", price: 899, store: "Ridge & Co. Cycles", emoji: "🚲" },
      { id: "sofa", name: "3-Seat Sofa", price: 1290, store: "Linden Furniture", emoji: "🛋️" },
    ],
    services: [
      { id: "none", name: "No service needed", price: 0 },
      { id: "install", name: "Home installation", price: 79 },
      { id: "tuneup", name: "First-year tune-up", price: 45 },
      { id: "delivery", name: "White-glove delivery", price: 120 },
    ],
    addToCart: "Add to cart",
    added: "Added — good and service, one order.",
    totalLabel: "Total",
  },
  flow: {
    heading: "How it works",
    sub: "One side lists, the other side never has to look elsewhere",
    owner: {
      label: "Store Owners",
      sublabel: "Sell goods, services, or both",
      steps: [
        { step: "01", title: "Open as many stores as you run", desc: "Each business you own gets its own storefront, catalog, and dashboard under one account." },
        { step: "02", title: "List a product, attach a service", desc: "Add a good on its own, a service on its own, or bundle a service to any product you sell." },
        { step: "03", title: "Manage every store from one place", desc: "Track orders, bookings, and payouts across all your stores without switching accounts." },
      ],
      cta: "Open your store",
    },
    customer: {
      label: "Customers",
      sublabel: "Get the good and the fix in one order",
      steps: [
        { step: "01", title: "Browse one unified feed", desc: "Every store's products and services show up in the same feed — no separate site for the technician." },
        { step: "02", title: "Add goods and services together", desc: "Buy the item and the service it needs in the same cart, even across different stores." },
        { step: "03", title: "Track it all from one profile", desc: "Orders and bookings from every store you've used, in one place, with one history." },
      ],
      cta: "Start browsing",
    },
    connector: "Store Owners → One Marketplace → Customers",
  },
  values: {
    heading: "Why sellers and shoppers both stay",
    sub: "Built around one idea: nobody should have to leave to finish the job",
    items: [
      {
        icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2M5 21H3m16 0v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2M9 7h1m4 0h1M9 11h1m4 0h1",
        title: "Run more than one store",
        desc: "One owner account, unlimited storefronts. Switch between the businesses you run without logging out.",
      },
      {
        icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
        title: "Products that come with service",
        desc: "Any product can carry its own service — installation, repair, a booked visit — sold as a single listing.",
      },
      {
        icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        title: "Nowhere else to go",
        desc: "The good and the person who fixes, installs, or delivers it live in the same order, the same cart, the same receipt.",
      },
    ],
  },
  stats: {
    items: [
      { stat: "Unlimited", label: "Stores per owner" },
      { stat: "1", label: "Cart for goods & services" },
      { stat: "0", label: "Other sites you'll need" },
    ],
  },
  cta: {
    heading: "Your stores. Their services. One place.",
    sub: "Open a store, list what you sell, attach what you service — customers won't need to go anywhere else.",
    shop: "Browse the marketplace",
    dashboard: "Open a store",
  },
  footer: {
    copyright: "Market. All rights reserved.",
    links: [
      { label: "Shop", href: "/shop" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
};

export default content;