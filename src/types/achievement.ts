export type AchievementRarity = "bronze" | "silver" | "gold" | "platinum";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rarity: AchievementRarity;
}
