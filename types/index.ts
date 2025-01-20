// types/index.ts

// Category Type
export interface Category {
    id: number;
    name: string;
  }
  
  // ProductVariant Type
  export interface ProductVariant {
    sku: string;
    name: string;
    price: number;
    quantity: number;
    variantImage: string;
    images: string[];
  }
  
  // Product Type
  export interface Product {
    id: number;
    name: string;
    description: string;
    primaryImage: string;
    category: Category;
    productVariants: ProductVariant[];
  }
  