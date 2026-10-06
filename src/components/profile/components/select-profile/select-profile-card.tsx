import type { Profile } from "@/types";
import { MemojiAvatar, AvatarFromConfig } from "dapvatar";
import { cn } from "@/lib/utils";

interface SelectProfileCardProps {
  profile: Profile;
  onSelect: (profile: Profile) => void;
  focused?: boolean;
}

export function SelectProfileCard({ profile, onSelect, focused }: SelectProfileCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(profile)}
      className={cn(
        "group flex w-[132px] cursor-pointer flex-col items-center gap-3 focus:outline-none",
        "transition-transform duration-200",
        focused && "scale-[1.04]"
      )}
      aria-label={`Seleccionar perfil ${profile.name}`}
    >
      <div
        className={cn(
          "relative h-[96px] w-[96px] md:h-[108px] md:w-[108px] overflow-hidden rounded-full bg-[#0a0a0a]",
          "ring-1 transition-all duration-200",
          focused
            ? "ring-white shadow-[0_0_0_2px_white,0_0_0_6px_#0070D1,0_8px_32px_rgba(0,112,209,0.55)] scale-[1.04]"
            : "ring-white/15 group-hover:ring-white/30 group-focus-visible:ring-white group-focus-visible:shadow-[0_0_0_2px_white,0_0_0_6px_#0070D1]"
        )}
      >
        {profile.avatarConfig ? (
          <AvatarFromConfig
            config={profile.avatarConfig}
            size={108}
            title={profile.name}
            className="h-full w-full"
          />
        ) : (
          <MemojiAvatar
            seed={profile.memojiSeed}
            posture={(profile.memojiPosture as never) ?? "happy"}
            size={108}
            shape="circle"
            alt={profile.name}
            className="h-full w-full object-cover"
          />
        )}
        {/* sutil highlight superior PS5 */}
        <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]" />
      </div>
      <span className="max-w-[128px] truncate text-center text-[15px] font-medium leading-none tracking-[-0.01em] text-white">
        {profile.name}
      </span>
      <span className="text-[11px] font-normal tracking-wide text-white/45">{profile.title}</span>
    </button>
  );
}
