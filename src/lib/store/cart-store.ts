import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, ProductVariant, PartnerStore, CartItem, FulfillmentMethod, CustomerOrderInfo } from "@/types/store.types";
import { MOCK_PARTNERS } from "@/lib/mock-data";

interface CartState {
  items: CartItem[];
  selectedPartner: PartnerStore | null;
  fulfillmentMethod: FulfillmentMethod;
  customerInfo: CustomerOrderInfo;
  isPartnerModalOpen: boolean;

  // Actions
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;

  setSelectedPartner: (partner: PartnerStore | null) => void;
  setFulfillmentMethod: (method: FulfillmentMethod) => void;
  setCustomerInfo: (info: Partial<CustomerOrderInfo>) => void;
  setPartnerModalOpen: (open: boolean) => void;

  // Computed
  getTotalItemsCount: () => number;
  getTotalProductsAmount: () => number;
  getTotalWeightGrams: () => number;
  getEstimatedShippingFee: () => number;
  getGrandTotal: () => number;
}

const defaultCustomerInfo: CustomerOrderInfo = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  district: "",
  province: "",
  postalCode: "",
  notes: "",
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      // Default partner: Jakarta Barat sebagai demonstrasi awal jika belum memilih
      selectedPartner: MOCK_PARTNERS[0],
      fulfillmentMethod: "partner-pickup",
      customerInfo: defaultCustomerInfo,
      isPartnerModalOpen: false,

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.variant.id === variant.id
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + quantity,
            };
            return { items: updatedItems };
          } else {
            return {
              items: [...state.items, { product, variant, quantity }],
            };
          }
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variant.id !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.variant.id === variantId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setSelectedPartner: (partner) => {
        set({ selectedPartner: partner });
      },

      setFulfillmentMethod: (method) => {
        set({ fulfillmentMethod: method });
      },

      setCustomerInfo: (info) => {
        set((state) => ({
          customerInfo: { ...state.customerInfo, ...info },
        }));
      },

      setPartnerModalOpen: (open) => {
        set({ isPartnerModalOpen: open });
      },

      getTotalItemsCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalProductsAmount: () => {
        return get().items.reduce(
          (total, item) => total + item.variant.retailPrice * item.quantity,
          0
        );
      },

      getTotalWeightGrams: () => {
        return get().items.reduce(
          (total, item) => total + item.variant.weightGrams * item.quantity,
          0
        );
      },

      getEstimatedShippingFee: () => {
        const method = get().fulfillmentMethod;
        if (method === "partner-pickup") {
          return 0; // Gratis ongkir ambil di mitra
        }
        if (method === "partner-delivery") {
          // Estimasi flat kurir lokal toko mitra (area radius dekat)
          return 20000;
        }
        // Central cargo (perhitungan kargo berdasarkan berat)
        const totalKg = Math.ceil(get().getTotalWeightGrams() / 1000);
        return Math.max(35000, totalKg * 3500);
      },

      getGrandTotal: () => {
        return get().getTotalProductsAmount() + get().getEstimatedShippingFee();
      },
    }),
    {
      name: "kimia-nusantara-cart-storage",
      partialize: (state) => ({
        items: state.items,
        selectedPartner: state.selectedPartner,
        fulfillmentMethod: state.fulfillmentMethod,
        customerInfo: state.customerInfo,
      }),
    }
  )
);
