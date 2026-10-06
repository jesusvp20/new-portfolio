export interface AvatarConfig {
  faceShape: "round" | "oval" | "softSquare";
  skinTone: "light" | "peach" | "tan" | "brown" | "dark" | "deep";
  hair: "buzz" | "fade" | "curly" | "afro" | "bob" | "long" | "bald";
  hairColor: "black" | "brown" | "blonde" | "ginger" | "gray";
  eyes: "default" | "soft" | "almond" | "happy";
  eyebrows: "calm" | "raised" | "thick" | "thin";
  nose: "small" | "medium" | "broad";
  mouth: "smile" | "softSmile" | "neutral" | "grin";
  accessory: "none" | "glasses" | "roundGlasses" | "sunglasses";
  background: "gradient" | "solid" | "blob" | "transparent";
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
  avatar: string;
  memojiSeed: string;
  memojiPosture?: string;
  avatarConfig?: AvatarConfig;
  bio: string; // quién soy breve 220
  headline?: string; // profesional breve 80
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  location?: string;
  technologies?: string[];
  createdAt: string;
  updatedAt: string;
}
