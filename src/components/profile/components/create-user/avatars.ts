import type { AvatarConfig } from "react-nice-avatar";

export interface CustomAvatar {
  id: string;
  label: string;
  config: AvatarConfig;
}

export const AVAILABLE_AVATARS: CustomAvatar[] = [
  {
    id: "indigo",
    label: "Indigo",
    config: {
      sex: "man",
      faceColor: "#f2c9b6",
      hairColor: "#4f46e5",
      hairStyle: "normal",
      hatStyle: "none",
      eyeStyle: "circle",
      noseStyle: "round",
      mouthStyle: "smile",
      shirtStyle: "short",
      shirtColor: "#6d28d9",
      bgColor: "#4f46e5",
      isGradient: true,
    },
  },
  {
    id: "rose",
    label: "Rose",
    config: {
      sex: "woman",
      faceColor: "#ffd9b2",
      hairColor: "#e11d48",
      hairStyle: "womanLong",
      hatStyle: "none",
      eyeStyle: "oval",
      noseStyle: "round",
      mouthStyle: "laugh",
      shirtStyle: "polo",
      shirtColor: "#be123c",
      bgColor: "#e11d48",
      isGradient: true,
    },
  },
  {
    id: "emerald",
    label: "Emerald",
    config: {
      sex: "man",
      faceColor: "#e6b48f",
      hairColor: "#059669",
      hairStyle: "mohawk",
      hatStyle: "none",
      eyeStyle: "smile",
      noseStyle: "short",
      mouthStyle: "peace",
      shirtStyle: "hoody",
      shirtColor: "#047857",
      bgColor: "#059669",
      isGradient: true,
    },
  },
  {
    id: "amber",
    label: "Amber",
    config: {
      sex: "man",
      faceColor: "#f2c9b6",
      hairColor: "#b45309",
      hairStyle: "thick",
      hatStyle: "none",
      eyeStyle: "oval",
      glassesStyle: "square",
      noseStyle: "long",
      mouthStyle: "smile",
      shirtStyle: "short",
      shirtColor: "#d97706",
      bgColor: "#d97706",
      isGradient: true,
    },
  },
];
