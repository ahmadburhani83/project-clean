import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Order } from "@/types/store.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format angka ke mata uang Rupiah (contoh: Rp 45.000)
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Menghitung jarak antara 2 titik koordinat bumi dalam satuan kilometer (Haversine formula)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius bumi dalam kilometer
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // 1 desimal
}

/**
 * Membuat tautan WhatsApp instan dengan template ringkasan pesanan untuk dikirim ke Mitra Daerah
 */
export function generateWhatsAppOrderLink(order: Order): string {
  const partnerPhone = order.selectedPartner?.whatsapp || order.selectedPartner?.phone || "6281234567890";
  // Sanitasi nomor telepon ke format internasional (misal 0812 -> 62812)
  const cleanPhone = partnerPhone.replace(/[^0-9]/g, "");
  const formattedPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;

  const fulfillmentLabels: Record<string, string> = {
    "partner-pickup": "Ambil Langsung di Toko Mitra (Self-Pickup)",
    "partner-delivery": "Kurir Lokal Mitra (Local Delivery)",
    "central-cargo": "Ekspedisi Kargo Pusat",
  };

  const paymentLabels: Record<string, string> = {
    qris: "QRIS",
    transfer_bank: "Transfer Bank Manual",
    bayar_di_toko: "Bayar di Toko (COD)",
  };

  const itemsList = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product.name}* (${item.variant.unitName})\n   Qty: ${item.quantity}x @ ${formatRupiah(item.variant.retailPrice)} = ${formatRupiah(item.quantity * item.variant.retailPrice)}`
    )
    .join("\n");

  const message = `*HALO MITRA ${order.selectedPartner?.name.toUpperCase() || "PUSAT"}!*
Ada pesanan baru dari website Kimia Nusantara:

📋 *No. Pesanan:* ${order.orderNumber}
👤 *Nama Pemesan:* ${order.customer.name}
📱 *No. WhatsApp:* ${order.customer.phone}
📍 *Alamat Pengiriman:*
${order.customer.address}, ${order.customer.district}, ${order.customer.city}, ${order.customer.province}

🚚 *Metode Pemenuhan:* ${fulfillmentLabels[order.fulfillmentMethod] || order.fulfillmentMethod}
💳 *Metode Pembayaran:* ${paymentLabels[order.paymentMethod] || order.paymentMethod}

📦 *Rincian Produk:*
${itemsList}

💰 *Subtotal Produk:* ${formatRupiah(order.totalProductsAmount)}
🚚 *Ongkir:* ${order.shippingFee === 0 ? "GRATIS" : formatRupiah(order.shippingFee)}
*TOTAL DIBAYAR:* *${formatRupiah(order.totalAmount)}*

${order.customer.notes ? `📝 *Catatan Khusus:* ${order.customer.notes}\n` : ""}
Mohon konfirmasi ketersediaan stok & proses pesanan ini. Terima kasih!`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}
