import type { AchievementRarity } from "@/types";

const RARITY_COLOR: Record<AchievementRarity, string> = {
  bronze: "text-amber-600",
  silver: "text-slate-300",
  gold: "text-yellow-400",
  platinum: "text-[var(--ps-blue)]",
};

export function rarityColor(rarity: AchievementRarity) {
  return RARITY_COLOR[rarity];
}
