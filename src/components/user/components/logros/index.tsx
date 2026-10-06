import type { Achievement } from "@/types";
import { AchievementItem } from "./achievement-item";

export function Logros({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="mt-8">
      <h3 className="mb-4 text-xl font-medium text-white/80">Logros</h3>
      <ul className="flex flex-col gap-3">
        {achievements.map((achievement) => (
          <AchievementItem key={achievement.id} achievement={achievement} />
        ))}
      </ul>
    </div>
  );
}
