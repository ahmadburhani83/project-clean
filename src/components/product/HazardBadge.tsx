import React from "react";
import { HazardLevel } from "@/types/store.types";
import { ShieldCheck, AlertTriangle, Flame, Skull, AlertCircle } from "lucide-react";

interface HazardBadgeProps {
  level: HazardLevel;
  showIcon?: boolean;
  size?: "sm" | "md";
}

export function HazardBadge({ level, showIcon = true, size = "sm" }: HazardBadgeProps) {
  const configs: Record<
    HazardLevel,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    aman: {
      label: "Aman Rumah Tangga",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
    },
    iritasi: {
      label: "Iritasi Ringan",
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />,
    },
    korosif: {
      label: "Korosif / Gunakan Sarung Tangan",
      bg: "bg-orange-50",
      text: "text-orange-800",
      border: "border-orange-200",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />,
    },
    "mudah-terbakar": {
      label: "Mudah Terbakar",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: <Flame className="w-3.5 h-3.5 text-red-600" />,
    },
    beracun: {
      label: "Bahan Teknis Beracun",
      bg: "bg-purple-50",
      text: "text-purple-800",
      border: "border-purple-200",
      icon: <Skull className="w-3.5 h-3.5 text-purple-600" />,
    },
  };

  const config = configs[level] || configs.aman;

  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
      title={config.label}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
}
