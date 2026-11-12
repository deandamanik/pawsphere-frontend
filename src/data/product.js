import amoxicillinImage from "../assets/product/Amoxicillin.png";
import probioticImage from "../assets/product/Probiotik.png";
import royalCaninImage from "../assets/product/Royal Canin.png";
import vitaminBImage from "../assets/product/Vitamin B.png";
import shampooImage from "../assets/product/Shampoo.png";
import ivermectinImage from "../assets/product/Ivermectin.png";

export const productsData = [
  {
    id: 1,
    name: "Amoxicillin 250mg Tablet",
    brand: "VetPharma",
    rating: 4.8,
    reviews: 234,
    price: 45000,
    oldPrice: 60000,
    discount: 25,
    image: amoxicillinImage,
    hasPrescription: true,
    category: "Obat"
  },
  {
    id: 2,
    name: "Probiotik Paste Premium",
    brand: "PetHealth",
    rating: 4.9,
    reviews: 156,
    price: 89000,
    oldPrice: null,
    discount: null,
    image: probioticImage,
    hasPrescription: false,
    category: "Vitamin"
  },
  {
    id: 3,
    name: "Royal Canin Indoor Adult",
    brand: "Royal Canin",
    rating: 4.7,
    reviews: 412,
    price: 185000,
    oldPrice: 210000,
    discount: 12,
    image: royalCaninImage,
    hasPrescription: false,
    category: "Makanan"
  },
  {
    id: 4,
    name: "Vitamin B Complex Drops",
    brand: "NutriPet",
    rating: 4.6,
    reviews: 89,
    price: 65000,
    oldPrice: null,
    discount: null,
    image: vitaminBImage,
    hasPrescription: false,
    category: "Vitamin"
  },
  {
    id: 5,
    name: "Anti-Tick & Flea Shampoo",
    brand: "FleaGuard",
    rating: 4.5,
    reviews: 178,
    price: 55000,
    oldPrice: 70000,
    discount: 21,
    image: shampooImage,
    hasPrescription: false,
    category: "Obat"
  },
    {
    id: 6,
    name: "Ivermectin 1% Injection",
    brand: "VetMed",
    rating: 4.7,
    reviews: 97,
    price: 35000,
    oldPrice: null,
    discount: null,
    image: ivermectinImage,
    hasPrescription: true,
    category: "Obat"
  },
];

const legacyProductImages = {
  "amoxicillin.png": amoxicillinImage,
  "probiotik.png": probioticImage,
  "royal canin.png": royalCaninImage,
  "vitamin b.png": vitaminBImage,
  "shampoo.png": shampooImage,
  "ivermectin.png": ivermectinImage,
};

export const resolveProductImage = (product = {}) => {
  const image = product.image || product.image_url || product.imageUrl;
  const normalizedName = product.name?.trim().toLowerCase();
  const matchingProduct = productsData.find(
    (item) => item.name.toLowerCase() === normalizedName,
  );

  if (typeof image === "string" && image.trim() && !/^\/?src\/assets\//.test(image)) {
    return image;
  }

  const legacyFilename = image?.split("/").pop()?.toLowerCase();

  return legacyProductImages[legacyFilename] || matchingProduct?.image || "";
};