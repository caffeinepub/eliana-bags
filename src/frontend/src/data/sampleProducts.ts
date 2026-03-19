import type { SampleProduct } from "../context/CartContext";

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: "s1",
    name: "Venetian Tote",
    description:
      "A spacious, structured tote crafted from full-grain Italian leather. Features a top zip closure, interior pockets, and polished gold hardware. Perfect for the office or weekend travel.",
    price: BigInt(28900),
    category: "Tote",
    imageUrl: "/assets/generated/product-tote-venetian.dim_600x600.jpg",
    stock: BigInt(12),
    isActive: true,
    isSample: true,
  },
  {
    id: "s2",
    name: "Milan Crossbody",
    description:
      "A sleek crossbody in supple burgundy leather with an adjustable strap and signature gold chain accent. Holds your essentials with effortless style.",
    price: BigInt(19500),
    category: "Crossbody",
    imageUrl: "/assets/generated/product-crossbody-milan.dim_600x600.jpg",
    stock: BigInt(8),
    isActive: true,
    isSample: true,
  },
  {
    id: "s3",
    name: "Ivory Evening Clutch",
    description:
      "An exquisite satin clutch adorned with a delicate pearl clasp. Designed for special occasions, it holds your phone, cards, and essentials with timeless elegance.",
    price: BigInt(14500),
    category: "Clutch",
    imageUrl: "/assets/generated/product-clutch-ivory.dim_600x600.jpg",
    stock: BigInt(15),
    isActive: true,
    isSample: true,
  },
  {
    id: "s4",
    name: "Noir City Backpack",
    description:
      "A sophisticated take on the classic backpack. Crafted from smooth matte leather with gold zipper details, padded laptop sleeve, and adjustable straps for all-day comfort.",
    price: BigInt(33500),
    category: "Backpack",
    imageUrl: "/assets/generated/product-backpack-noir.dim_600x600.jpg",
    stock: BigInt(6),
    isActive: true,
    isSample: true,
  },
  {
    id: "s5",
    name: "Cognac Shoulder Bag",
    description:
      "A timeless shoulder bag in warm cognac leather with an elegant chain strap that can be worn short or long. Features a secure snap closure and suede interior.",
    price: BigInt(24500),
    category: "Shoulder",
    imageUrl: "/assets/generated/product-shoulder-cognac.dim_600x600.jpg",
    stock: BigInt(10),
    isActive: true,
    isSample: true,
  },
  {
    id: "s6",
    name: "Rose Mini Bag",
    description:
      "A darling mini bag in dusty rose leather with a delicate long strap and logo hardware. Small but mighty — it makes a statement at every event.",
    price: BigInt(16800),
    category: "Mini",
    imageUrl: "/assets/generated/product-mini-rose.dim_600x600.jpg",
    stock: BigInt(20),
    isActive: true,
    isSample: true,
  },
];

export const CATEGORIES = [
  "All",
  "Tote",
  "Crossbody",
  "Clutch",
  "Backpack",
  "Shoulder",
  "Mini",
];
