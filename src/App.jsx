import { useMemo } from 'react';
import { frameUrls } from './generated/frameManifest.js';
import { FrameSequence } from './components/FrameSequence.jsx';
import { Hero } from './components/Hero.jsx';
import { CTA, FeatureShowcase, Footer, Gallery, Performance } from './components/ContentSections.jsx';
import { SceneChrome } from './components/SceneChrome.jsx';
import { BootScreen } from './components/BootScreen.jsx';
import { Hud } from './components/Hud.jsx';
import { useLenis } from './hooks/useLenis.js';
import { usePointerGlow } from './hooks/usePointerGlow.js';

export default function App() {
  useLenis();
  const pointer = usePointerGlow();
  const frames = useMemo(() => frameUrls, []);
  const heroFrame = frames[Math.min(12, frames.length - 1)];

  return (
    <main id="top">
      <BootScreen frames={frames} />
      <Hud />
      <SceneChrome pointer={pointer} quality={window.matchMedia('(max-width: 760px)').matches ? 'low' : 'high'} />
      <div className="grain" aria-hidden="true" />
      <Hero frame={heroFrame} />
      <FrameSequence frames={frames} />
      <Performance />
      <FeatureShowcase />
      <Gallery frames={frames} />
      <CTA />
      <Footer />
    </main>
  );
}
