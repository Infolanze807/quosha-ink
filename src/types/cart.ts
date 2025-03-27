import { Product } from "./product";
export interface Variant {
  id: number;
  name: string;
  size: string;
  color: string;
  retail_price: number;
  files?: File[];
  availability_status:string
  // files: string?
}

export interface CartItem {
  product: Product;
  // product: {
  //   id: number;
  //   name: string;
  //   price: number;
  //   thumbnail_url: string;
  //   size: string;
  //   // external_id: string;
  //   variants: number;
  //   synced: number;
  //   retailPrice?: string;
  //   sync_variants: Variant[];
  //   productId: number;
  // };
  quantity: number;
}
