import type { Achievement } from "@/types";
import { FaTrophy, FaLock } from "react-icons/fa";
import { rarityColor } from "@/lib/rarity";

export function AchievementItem({ achievement }: { achievement: Achievement }) {
  const unlocked = true;
  return (
    <li className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <span className={`flex h-11 w-11 items-center justify-center rounded-full text-2xl ${rarityColor(achievement.rarity)}`}>
        {unlocked ? <FaTrophy /> : <FaLock />}
      </span>
      <div>
        <p className="font-medium text-white">{achievement.title}</p>
        <p className="text-sm text-white/50">{achievement.description}</p>
      </div>
    </li>
  );
}
