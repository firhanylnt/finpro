export interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    productcategory: {
      name: string;
    }
    stock: Stock[],
    productdiscount: ProductDiscount[],
    productimages: ProductImage[],
}

interface Stock {
  id: number;
  qty: number;
  store_id: number;
}

interface ProductDiscount {
  discount: {
    amount: number;
    discount_type_id: number;
  }
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