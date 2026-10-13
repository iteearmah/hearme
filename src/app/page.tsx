import HearMe from "../components/HearMe";
import { SeoContent } from "../components/Seo";

export const dynamic = "force-static";

export default function Page() {
  return (
    <>
      <h1 className="sr-only">
        HearMe — rewrite blunt, logical messages into warm, emotionally
        intelligent ones she will actually want to hear
      </h1>
      <HearMe />
      <SeoContent />
    </>
  );
}