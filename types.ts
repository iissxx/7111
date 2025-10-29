export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  data?: {
    internet: string;
    calls: string;
    sms: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface SubCategory {
  name: string;
  products: Product[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  products?: Product[];
  subCategories?: SubCategory[];
}

export interface User {
  name: string;
  email: string;
  phone: string;
  country: string;
  gender: string;
}
