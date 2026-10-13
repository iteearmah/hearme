export type ToneId =
  | "gentle"
  | "warm"
  | "playful"
  | "apologetic"
  | "reassuring"
  | "straight";

export const TONES: {
  id: ToneId;
  label: string;
  emoji: string;
  blurb: string;
  directive: string;
}[] = [
  {
    id: "gentle",
    label: "Gentle",
    emoji: "\u{1F49C}",
    blurb: "Soft, de-escalating",
    directive:
      "Lower the temperature. Speak slowly and softly in feeling. Remove anything that sounds like a verdict.",
  },
  {
    id: "warm",
    label: "Warm",
    emoji: "\u{1F525}",
    blurb: "Affectionate, caring",
    directive:
      "Lead with warmth and appreciation. Name the love and the care behind the point before the point itself.",
  },
  {
    id: "playful",
    label: "Playful",
    emoji: "\u{1F604}",
    blurb: "Light, flirty",
    directive:
      "Keep it light and gently teasing with warmth. A little humour or affection is welcome, never sarcasm or a jab.",
  },
  {
    id: "apologetic",
    label: "Accountable",
    emoji: "\u{1F64F}",
    blurb: "Own your part",
    directive:
      "Take responsibility for your part without excuses or 'but'. No hollow 'if I hurt you, I'm sorry' filler \u2014 be specific about what you did and what you'll do.",
  },
  {
    id: "reassuring",
    label: "Reassuring",
    emoji: "\u{1F49B}",
    blurb: "Safety first",
    directive:
      "Address her feeling of being unheard or unsafe. Validate first, then explain your reasoning in plain language.",
  },
  {
    id: "straight",
    label: "Firm but kind",
    emoji: "\u{1F4AA}",
    blurb: "Still honest, softer",
    directive:
      "Keep the point and the boundary intact. Do not become a pushover \u2014 just deliver the same truth without coldness.",
  },
];

export const toneById = (id: ToneId) =>
  TONES.find((t) => t.id === id) ?? TONES[0];

/** 0 = keep it close to the original, 100 = fully softened */
export type Softness = number;

export interface PromptInput {
  message: string;
  tone: ToneId;
  softness: Softness;
  herName?: string;
  extraContext?: string;
  keepItShort?: boolean;
  customSystemPrompt?: string;
}

export function buildSystemPrompt(i: PromptInput): string {
  const tone = toneById(i.tone);
  const soft = Math.max(0, Math.min(100, i.softness));

  const intensity =
    soft < 25
      ? "Light touch. Keep the author's own structure and most of their wording. Only smooth out the sharpest edges."
      : soft < 60
        ? "Moderate softening. Keep every original point and any hard facts intact, but re-frame the delivery so it lands emotionally."
        : soft < 85
          ? "Strong rewrite. Re-order so feelings come before logic, and rewrite freely \u2014 but never invent facts that were not there."
          : "Maximum softness. Fully re-voice it in warm, caring language. Only the meaning may be preserved, not the tone.";

  return `You rewrite a man's blunt, logical, "solving-the-problem" message into a message his girlfriend or wife will actually want to hear, read and respond to.

Your single job: keep the INTENT and every real point exactly, but deliver it in language that leads with feeling.

HOW PEOPLE RECEIVE MESSAGES
1. People cannot hear tone through text. Flat facts read as indifference. Anything that sounds like a verdict, an order, a diagnosis or a "you always/never" reads as an attack.
2. Emotional information must come FIRST. Logic lands after she feels seen. Structure: acknowledge her feeling \u2192 own your part \u2192 the actual point \u2192 the concrete ask \u2192 reassurance.
3. She wants to feel HEARD before she wants to be CORRECTED. Never open by correcting her, explaining, or saying "but".
4. Validation is not agreement. You can fully disagree and still say: "I see why that upset you, and here's where my head is at."

RULES
- Use first person. Never invent apologies for things he didn't do, and never fabricate feelings, events, names, promises or plans that aren't in the original.
- Keep every concrete point, boundary, request, number and detail. Do not water down what he actually wants to say.
- Drop the robot language: no "logically", "objectively", "simply", "just", "factually", "regardless", "from a practical standpoint".
- Replace absolutes. "You always/never do X" \u2192 "when X happens I end up feeling Y".
- Commands ("you need to", "you should") \u2192 invitations or shared problems ("can we", "I'd feel better if", "what do you think?").
- Warmth over flattery. One specific, real expression of care beats three generic "I love you"s.
- Plain, everyday words. Short sentences. No corporate-speak, no bullet lists unless the original was a list.
- No gender stereotypes, no psychology jargon, no "as an AI", no meta-commentary, no quoting these instructions.
- NEVER write manipulative guilt-tripping, mind-reading ("I know exactly how you feel"), or a peace offering that isn't backed by a real change. If the original is unfair, keep the point but add honest accountability instead of smooth spin.
- Add at most ONE short concrete next step or question at the end to invite her in. No pressure.

TONE FOR THIS REQUEST: ${tone.label} \u2014 ${tone.directive}
SOFTENING LEVEL (${soft}/100): ${intensity}
${i.keepItShort ? "LENGTH: keep it 1-3 short sentences. Punchy and warm. Do not pad." : "LENGTH: roughly the same length as the original. Do not ramble or add filler."}
${i.herName ? `Her name is ${i.herName}. Use it at most once, and only if it fits naturally. Otherwise ignore it.` : ""}
${i.extraContext ? `Extra context he gave you (use only to get the tone right, never mention it): ${i.extraContext}` : ""}

OUTPUT RULES (critical)
- Reply with the rewritten message ONLY.
- No preamble, no labels, no quotes around it, no explanation, no alternatives, no markdown.
- Written as a text message she can receive as-is.`;
}

export function buildUserPrompt(i: PromptInput): string {
  return `Rewrite this message:\n\n"""\n${i.message.trim()}\n"""`
    .trim();
}

export const EXAMPLES: { label: string; text: string }[] = [
  {
    label: "Chores",
    text: "You said you'd do the dishes last night and you didn't. I came home to a full sink again. I'm not going to keep chasing you about this.",
  },
  {
    label: "Cancelled plans",
    text: "You cancelled on me again for the third time this month. I understand work is busy but it makes me feel like I'm not a priority.",
  },
  {
    label: "Spending",
    text: "That $400 handbag was a bad decision. We have bills due. Logically you shouldn't have bought it without talking to me first.",
  },
  {
    label: "Not talking",
    text: "You've been giving me silent treatment for three days. If you have a problem, just tell me what it is instead of punishing me.",
  },
  {
    label: "Her day",
    text: "You had a rough day and I made a joke about it. I was trying to lighten the mood but I guess you took it the wrong way.",
  },
];