export type ProductCategory = 
  | "rumah-tangga"
  | "laundry"
  | "otomotif"
  | "industri"
  | "aroma-bibit"
  | "kemasan";

export type HazardLevel = 
  | "aman" 
  | "iritasi" 
  | "korosif" 
  | "mudah-terbakar" 
  | "beracun";

export interface ProductVariant {
  id: string;
  productId: string;
  unitName: string; // contoh: "1 Liter", "5 Liter (Jerigen)", "20 Liter (Pail)", "25 Kg (Sak)"
  sku: string;
  basePrice: number;
  retailPrice: number;
  weightGrams: number;
  inStock?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  categoryLabel: string;
  description: string;
  features: string[];
  safetyGuidelines?: string;
  hazardLevel: HazardLevel;
  msdsUrl?: string;
  isHouseholdChemical: boolean; // true = produk jadi rumah tangga, false = bahan baku kimia teknis
  image: string;
  variants: ProductVariant[];
  usageInstructions?: string;
}

export interface PartnerStore {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  province: string;
  district: string;
  latitude: number;
  longitude: number;
  serviceRadiusKm: number;
  rating: number;
  reviewCount: number;
  operationalHours: string;
  supportsPickup: boolean;
  supportsLocalDelivery: boolean;
  distanceKm?: number;
  stockMap?: Record<string, number>; // variantId -> stock quantity
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export type FulfillmentMethod = 
  | "partner-pickup"   // Ambil langsung di toko mitra (Gratis Ongkir)
  | "partner-delivery" // Kurir instan / lokal dari toko mitra
  | "central-cargo";   // Ekspedisi kargo dari gudang pusat

export interface CustomerOrderInfo {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  district: string;
  province: string;
  postalCode?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerOrderInfo;
  items: CartItem[];
  fulfillmentMethod: FulfillmentMethod;
  selectedPartner?: PartnerStore;
  totalProductsAmount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: "qris" | "transfer_bank" | "bayar_di_toko";
  status: "pending" | "paid" | "processing" | "shipping" | "ready-pickup" | "completed" | "cancelled";
  createdAt: string;
}
