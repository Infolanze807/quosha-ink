export interface File {
  type: string;
  preview_url: string;
  thumbnail_url?: string;
}

export interface Product1 {
  product_id: number;
}

export interface Variant {
  id: number;
  name: string;
  size: string;
  // external_id:string;
  variants:number;
  synced:number;
  retailPrice:string;
  sync_variants:Variant[];
  variant_id: number;
  productId:number
  color: string;
  retail_price: number;
  external_id:string
  files?: File[];
  availability_status:string;
  sync_product_id: number;
  product: Product1;
  // files: string?
}

export interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail_url: string;
  size: string;
  external_id: string; // Adjust if necessary
  variants: number;
  synced: number;
  retailPrice?: string | undefined;
  sync_variants: Variant[];
  variant_id: number;
  productId: number;
  availability_status: string;
  sync_product_id: number;
  // product_id: number;
}

// cart.ts
// export interface CartItem {
//   quantity: number;
//   product: {
//     id: number;
//     name: string;
//     price: number;
//     thumbnail_url: string;
//     size: string;
//   };
// }
