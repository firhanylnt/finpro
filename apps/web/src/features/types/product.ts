export interface Product {
    id: number;
    name: string;
}

export interface Categories {
    id: number;
    name: string;
}

interface ProductImage {
    image_url: string;
  }
  
export interface ProductList {
    id: number;
    name: string;
    price: string;
    productcategory: {
      name: string;
    }
    productimages: ProductImage[],
    createdAt: Date;
}