/**
 * Inline SVG icon set — no emoji, no icon-font dependency.
 * All icons inherit `currentColor` and scale via the `size` prop.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 18, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ---------- brand ---------- */

export function LogoMark({ size = 18, ...rest }: IconProps) {
  return (
    <Icon size={size} strokeWidth={1.6} {...rest}>
      <path
        d="M20.5 12.4c0 3.9-3.6 7-8 7-.8 0-1.6-.1-2.3-.3l-4.2 1 1.2-3.4C5.3 15.5 4.5 14 4.5 12.4c0-3.9 3.6-7 8-7s8 3.1 8 7Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M12.5 14.8c-1.1-1.4-3.4-1.4-4.4-.2-1.2 1.5-.4 3.5 1.5 4.7.9.6 1.6.9 1.6.9s.7-.3 1.6-.9c1.9-1.2 2.7-3.2 1.5-4.7-1-1.2-3.3-1.2-4.4.2Z"
        fill="var(--brand)"
        stroke="none"
      />
    </Icon>
  );
}

/* ---------- tones ---------- */

export function GentleIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      <path d="M9.5 14.5c1.7 1.7 3.3 2 5 0" />
    </Icon>
  );
}

export function WarmIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M12 21.2c3.4 0 6.2-2.6 6.2-6 0-4.6-4.3-6.6-4.3-10.6 0-.9.1-1.6.2-2.1-3.9 1.2-6.7 4.3-6.7 8.2 0 1.5.4 2.6.9 3.4-1-.5-1.7-1.3-2.1-2.3-.4.8-.6 1.7-.6 2.6 0 3.8 3 6.8 6.4 6.8Z" />
      <path d="M12 21.2c1.7 0 3-1.4 3-3.1 0-2.2-2.1-3.1-2.1-5.3-1.3 1-2.3 2.3-2.3 3.9 0 .6.1 1 .3 1.5-.6-.3-1-.8-1.2-1.4-.2.4-.3.9-.3 1.4 0 1.9 1.6 4 2.6 4Z" />
    </Icon>
  );
}

export function PlayfulIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14.5c.9 1.3 2.1 2 3.5 2s2.6-.7 3.5-2" />
      <path d="M9 9.5h.01M15 9.5h.01" />
    </Icon>
  );
}

export function AccountableIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M12 21s-7-4.6-7-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 3.6C19 16.4 12 21 12 21Z" />
      <path d="m9.5 12.6 1.7 1.7 3.3-3.6" />
    </Icon>
  );
}

export function ReassuringIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M12 21s-7-4.6-7-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 3.6C19 16.4 12 21 12 21Z" />
      <path d="M12 3.2v2.4" />
      <path d="M4.8 6.4 6.4 8M19.2 6.4 17.6 8" />
    </Icon>
  );
}

export function FirmIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M7 11V7.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M10 11V6.2a1.5 1.5 0 0 1 3 0V11" />
      <path d="M13 11V7.6a1.5 1.5 0 0 1 3 0V13" />
      <path d="M7 11V9.4a1.5 1.5 0 0 0-3 0V14a7 7 0 0 0 7 7h1a6 6 0 0 0 6-6v-3.4a1.5 1.5 0 0 0-3 0V14" />
    </Icon>
  );
}

/* ---------- ui ---------- */

export function SparkIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M12 3.5 13.6 8 18 9.6 13.6 11.2 12 15.7 10.4 11.2 6 9.6 10.4 8Z" />
      <path d="M18.5 15.5 19.3 17.4 21.2 18.2 19.3 19 18.5 20.9 17.7 19 15.8 18.2 17.7 17.4Z" />
    </Icon>
  );
}

export function ClockIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <circle cx="12" cy="12" r="8.7" />
      <path d="M12 7.3V12l3.2 2" />
    </Icon>
  );
}

export function SlidersIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M5 21v-7M5 10V3M12 21v-9M12 8V3M19 21v-5M19 12V3" />
      <path d="M2.5 14h5M9.5 8h5M16.5 16h5" />
    </Icon>
  );
}

export function SunIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
    </Icon>
  );
}

export function MoonIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5a8.5 8.5 0 1 0 10.8 10.8Z" />
    </Icon>
  );
}

export function AutoIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <circle cx="12" cy="12" r="8.7" />
      <path d="M12 3.3v17.4" />
      <path d="M12 3.3a8.7 8.7 0 0 1 0 17.4Z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function CopyIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <rect x="9" y="9" width="11.5" height="11.5" rx="2.4" />
      <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3h-7A2.5 2.5 0 0 0 3 5.5v7A2.5 2.5 0 0 0 5.5 15" />
    </Icon>
  );
}

export function CheckIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="m4.5 12.5 5 5 10-11" />
    </Icon>
  );
}

export function ShareIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M12 15.5V3.8" />
      <path d="m8.2 7.3 3.8-3.8 3.8 3.8" />
      <path d="M5.5 12.8v5.4a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-5.4" />
    </Icon>
  );
}

export function RefreshIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20.4 4.2v4.4H16" />
    </Icon>
  );
}

export function CompareIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M9.5 4.5H6.8A2.3 2.3 0 0 0 4.5 6.8v10.4a2.3 2.3 0 0 0 2.3 2.3h2.7" />
      <path d="M14.5 4.5h2.7a2.3 2.3 0 0 1 2.3 2.3v10.4a2.3 2.3 0 0 1-2.3 2.3h-2.7" />
      <path d="M12 3v18" />
    </Icon>
  );
}

export function PinIcon({ filled, ...p }: IconProps & { filled?: boolean }) {
  return (
    <Icon {...p} fill={filled ? "currentColor" : "none"}>
      <path d="M9.5 3.5h5l-.7 5.2 3.2 3.1H7l3.2-3.1Z" />
      <path d="M12 11.8V20.5" />
    </Icon>
  );
}

export function TrashIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M4.8 6.8h14.4" />
      <path d="M9.5 6.8V4.9a1.4 1.4 0 0 1 1.4-1.4h2.2a1.4 1.4 0 0 1 1.4 1.4v1.9" />
      <path d="M6.6 6.8 7.5 19a1.6 1.6 0 0 0 1.6 1.5h5.8a1.6 1.6 0 0 0 1.6-1.5l.9-12.2" />
      <path d="M10.5 10.5v6M13.5 10.5v6" />
    </Icon>
  );
}

export function LockIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <rect x="4.8" y="10.2" width="14.4" height="10" rx="2.4" />
      <path d="M8.3 10.2V7.6a3.7 3.7 0 0 1 7.4 0v2.6" />
    </Icon>
  );
}

export function KeyIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <circle cx="8.2" cy="15.8" r="3.9" />
      <path d="m11 13.2 7.4-7.4" />
      <path d="m16.2 8 2.2 2.2M18.6 5.6l2 2" />
    </Icon>
  );
}

export function FreeTagIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M3.8 12.6 11 5.4a2 2 0 0 1 1.4-.6h4.4a2 2 0 0 1 2 2v4.4c0 .5-.2 1-.6 1.4l-7.2 7.2a1.6 1.6 0 0 1-2.3 0l-4.6-4.6a1.6 1.6 0 0 1 0-2.3Z" />
      <circle cx="15.6" cy="8.4" r="1.3" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function EraserIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="m14.5 4.3 5.2 5.2a1.6 1.6 0 0 1 0 2.3l-6.6 6.6H8.4l-4.6-4.6a1.6 1.6 0 0 1 0-2.3l8.4-7.2a1.6 1.6 0 0 1 2.3 0Z" />
      <path d="m8 8.6 6.6 6.6" />
      <path d="M20.5 20.5h-6" />
    </Icon>
  );
}

export const TONE_ICONS = {
  gentle: GentleIcon,
  warm: WarmIcon,
  playful: PlayfulIcon,
  apologetic: AccountableIcon,
  reassuring: ReassuringIcon,
  straight: FirmIcon,
} as const;