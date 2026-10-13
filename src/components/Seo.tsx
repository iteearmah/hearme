import {
  AccountableIcon,
  FirmIcon,
  GentleIcon,
  LockIcon,
  PlayfulIcon,
  ReassuringIcon,
  WarmIcon,
} from "./icons";

const TONE_ROWS = [
  {
    Icon: GentleIcon,
    name: "Gentle",
    blurb: "Lowers the temperature and strips out anything that sounds like a verdict.",
  },
  {
    Icon: WarmIcon,
    name: "Warm",
    blurb: "Leads with care and appreciation before getting to the point you wanted to make.",
  },
  {
    Icon: PlayfulIcon,
    name: "Playful",
    blurb: "Light and gently teasing — never sarcasm, never a jab.",
  },
  {
    Icon: AccountableIcon,
    name: "Accountable",
    blurb: "Owns your part specifically, with no 'but' and no empty filler apology.",
  },
  {
    Icon: ReassuringIcon,
    name: "Reassuring",
    blurb: "Addresses the feeling of not being heard, then explains your reasoning.",
  },
  {
    Icon: FirmIcon,
    name: "Firm but kind",
    blurb: "Keeps your point and your boundary intact — just without the coldness.",
  },
];

const FAQ = [
  {
    q: "What does HearMe do with my message?",
    a: "It keeps your intent and every concrete point you made — the facts, the boundaries, the requests — and rewrites only the delivery so the feeling lands first. It will not invent apologies, guilt-trip you, or claim to know how she feels.",
  },
  {
    q: "Do I need an API key or an account?",
    a: "No. HearMe works out of the box on a free, keyless AI provider. You can also paste your own key for OpenCode Zen, Groq, Google AI Studio or OpenRouter, or point it at a local Ollama or LM Studio server.",
  },
  {
    q: "Is my data private?",
    a: "There is no account and no analytics. Your history lives only in your own browser and can be cleared at any time. Requests go through the app's own proxy, and no API key is ever bundled into the app.",
  },
  {
    q: "Can I install it on my phone?",
    a: "Yes. HearMe is an installable PWA — use your browser's Add to Home Screen option and it launches full-screen with an app icon, and the app shell still opens offline.",
  },
];

export function SeoContent() {
  return (
    <>
      <section className="card seo-intro" aria-labelledby="seo-what">
        <h2 id="seo-what">What it actually does</h2>
        <p>
          Most arguments don&apos;t start with disagreement. They start with a message
          that is factually correct and completely unhearable — because the facts
          arrived before the feeling.
        </p>
        <p>
          HearMe takes that message and re-delivers it. Your meaning, your points
          and your boundaries stay exactly as they were. What changes is the order and
          the language: her feeling comes first, your part in it gets owned, and the
          actual point lands at the end where it can actually be heard.
        </p>
        <p>
          It also strips out the language that quietly turns a conversation into a
          fight — <em>logically</em>, <em>just</em>, <em>objectively</em>,{" "}
          <em>regardless</em> — and turns absolutes like &ldquo;you always&rdquo;
          into what you actually mean: how it made you feel.
        </p>
      </section>

      <section className="card" aria-labelledby="seo-tones">
        <h2 id="seo-tones">Six tones, one softening dial</h2>
        <ul className="seo-list">
          {TONE_ROWS.map(({ Icon, name, blurb }) => (
            <li key={name}>
              <span className="seo-li-icon" aria-hidden="true">
                <Icon size={17} />
              </span>
              <span>
                <strong>{name}</strong> — {blurb}
              </span>
            </li>
          ))}
        </ul>
        <p style={{ marginBottom: 0 }}>
          The softening slider decides how far it travels: at 0 you keep almost all of
          your own wording, at 100 it fully re-voices the message while still keeping
          the meaning intact.
        </p>
      </section>

      <section className="card" aria-labelledby="seo-privacy">
        <h2 id="seo-privacy">
          <LockIcon size={15} /> Private by default
        </h2>
        <p style={{ marginBottom: 0 }}>
          No sign-up, no tracking, no server-side storage of your messages. Your history
          is saved on your device only. The AI provider is yours to choose — a free
          keyless one by default, your own API key, or a model running entirely on your
          own machine.
        </p>
      </section>

      <section className="card" aria-labelledby="seo-faq">
        <h2 id="seo-faq">Questions</h2>
        <div className="seo-faq">
          {FAQ.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="seo-footer">
        <p>
          HearMe — a private, installable app for saying what you mean in a way that
          lands.
        </p>
        <p style={{ marginBottom: 0 }}>
          Add to Home Screen to install · Works offline · No account required
        </p>
      </footer>
    </>
  );
}