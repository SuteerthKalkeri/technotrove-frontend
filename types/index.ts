


export interface Category {
    id: number;
    name: string;
  }
  
  
  export interface ProductVariant {
    sku: string;
    name: string;
    price: number;
    quantity: number;
    variantImage: string;
    images: string[];
  }
  
  
  export interface Product {
    id: number;
    name: string;
    description: string;
    primaryImage: string;
    category: Category;
    productVariants: ProductVariant[];
  }
  