import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createFrameCache } from '../utils/framePreloader.js';

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  {
    kicker: '01 / Ignition',
    title: 'A low pulse cuts through the dark.',
    copy: 'The silhouette wakes under red studio light, every surface tuned for tension.',
  },
  {
    kicker: '02 / Aero',
    title: 'Air is shaped before it is split.',
    copy: 'Scroll through the body line as the camera glides over carbon, glass, and reflection.',
  },
  {
    kicker: '03 / Command',
    title: 'The machine locks into focus.',
    copy: 'Velocity-reactive sequencing gives the reveal the weight of a launch film.',
  },
];

const callouts = [
  {
    label: 'Active aero vectoring',
    detail: 'Dynamic wing profile',
    left: '63%',
    top: '33%',
    delay: 0.18,
  },
  {
    label: 'Carbon splitter',
    detail: 'High-pressure front bite',
    left: '26%',
    top: '66%',
    delay: 1.15,
  },
  {
    label: 'Hybrid torque core',
    detail: '986 hp all-wheel impulse',
    left: '52%',
    top: '56%',
    delay: 2.08,
  },
];

function drawCover(ctx, image, width, height, alpha = 1, scale = 1, shiftX = 0) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;
  let dx = 0;
  let dy = 0;

  if (imageRatio > canvasRatio) {
    drawHeight = height;
    drawWidth = height * imageRatio;
    dx = (width - drawWidth) / 2;
  } else {
    drawWidth = width;
    drawHeight = width / imageRatio;
    dy = (height - drawHeight) / 2;
  }

  const scaledWidth = drawWidth * scale;
  const scaledHeight = drawHeight * scale;
  const scaledX = dx - (scaledWidth - drawWidth) / 2 + shiftX;
  const scaledY = dy - (scaledHeight - drawHeight) / 2;

  ctx.globalAlpha = alpha;
  ctx.drawImage(image, scaledX, scaledY, scaledWidth, scaledHeight);
  ctx.globalAlpha = 1;
}

export function FrameSequence({ frames }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const chapterRefs = useRef([]);
  const calloutRefs = useRef([]);
  const rafRef = useRef(0);
  const targetIndex = useRef(0);
  const currentIndex = useRef(0);
  const velocity = useRef(0);
  const lastIndex = useRef(0);
  const [ready, setReady] = useState(false);
  const [quality, setQuality] = useState('high');
  const cache = useMemo(() => createFrameCache(frames), [frames]);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const progressWidth = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%']);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px), (prefers-reduced-motion: reduce)');
    const updateQuality = () => setQuality(media.matches ? 'low' : 'high');
    updateQuality();
    media.addEventListener('change', updateQuality);
    return () => media.removeEventListener('change', updateQuality);
  }, []);

  useEffect(() => {
    cache.warmup().then(() => setReady(true));
  }, [cache]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return undefined;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    const resize = () => {
      const dpr = quality === 'low' ? 1 : Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.9,
      onUpdate: (self) => {
        const eased = gsap.parseEase('power2.inOut')(self.progress);
        targetIndex.current = eased * (frames.length - 1);
        const nextVelocity = self.getVelocity();
        velocity.current = velocity.current * 0.6 + nextVelocity * 0.4;
        cache.preloadWindow(targetIndex.current, quality === 'low' ? 10 : 24);
      },
    });

    const chapterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.85,
      },
    });

    chapterRefs.current.forEach((chapter, index) => {
      if (!chapter) return;
      const start = index * 1.05;
      chapterTimeline.fromTo(
        chapter,
        { autoAlpha: 0, y: 34, filter: 'blur(10px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.34, ease: 'power2.out' },
        start,
      );
      chapterTimeline.to(
        chapter,
        { autoAlpha: 0, y: -26, filter: 'blur(8px)', duration: 0.34, ease: 'power2.in' },
        start + 0.68,
      );
    });

    calloutRefs.current.forEach((callout, index) => {
      if (!callout) return;
      const data = callouts[index];
      chapterTimeline.fromTo(
        callout,
        { autoAlpha: 0, scale: 0.94, y: 14, filter: 'blur(8px)' },
        { autoAlpha: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.22, ease: 'power2.out' },
        data.delay,
      );
      chapterTimeline.to(
        callout,
        { autoAlpha: 0, scale: 0.98, y: -10, filter: 'blur(6px)', duration: 0.24, ease: 'power2.in' },
        data.delay + 0.54,
      );
    });

    const render = () => {
      const stiffness = quality === 'low' ? 0.16 : 0.06;
      currentIndex.current += (targetIndex.current - currentIndex.current) * stiffness;
      const nextIndex = Math.max(0, Math.min(frames.length - 1, currentIndex.current));
      const lower = Math.floor(nextIndex);
      const upper = Math.min(frames.length - 1, lower + 1);
      const blend = nextIndex - lower;
      const lowerFrame = cache.load(lower);
      const upperFrame = cache.load(upper);

      if (lowerFrame.ready) {
        const motionDelta = Math.abs(nextIndex - lastIndex.current);
        const speedGlow = Math.min(1, Math.abs(velocity.current) / 3600 + motionDelta * 0.08);
        const direction = velocity.current >= 0 ? 1 : -1;
        const zoom = quality === 'low' ? 1 : 1 + speedGlow * 0.02;
        const slip = quality === 'low' ? 0 : speedGlow * direction * 9;

        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        drawCover(ctx, lowerFrame.image, window.innerWidth, window.innerHeight, 1, zoom, slip);

        if (upperFrame.ready && blend > 0.02 && quality === 'high') {
          drawCover(ctx, upperFrame.image, window.innerWidth, window.innerHeight, Math.min(blend, 0.62), zoom + 0.006, slip * 0.35);
        }

        if (quality === 'high' && speedGlow > 0.08) {
          ctx.globalCompositeOperation = 'screen';
          ctx.filter = `blur(${Math.min(11, 2 + speedGlow * 10)}px)`;
          drawCover(ctx, lowerFrame.image, window.innerWidth, window.innerHeight, speedGlow * 0.13, zoom + 0.018, -slip * 1.8);
          ctx.filter = 'none';
          ctx.globalCompositeOperation = 'source-over';
        }

        ctx.fillStyle = `rgba(255, 34, 56, ${0.02 + speedGlow * 0.045})`;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = `rgba(255, 255, 255, ${speedGlow * 0.016})`;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        lastIndex.current = nextIndex;
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      trigger.kill();
      chapterTimeline.kill();
      window.removeEventListener('resize', resize);
    };
  }, [cache, frames.length, quality]);

  return (
    <section ref={sectionRef} className="sequence-section" id="sequence">
      <div className="sequence-sticky">
        <canvas ref={canvasRef} className="sequence-canvas" aria-label="Scroll-driven cinematic car frame sequence" />
        <div className="sequence-scrim" />
        {!ready && (
          <div className="loader">
            <span />
            <p>Priming sequence</p>
          </div>
        )}
        <div className="sequence-progress" aria-hidden="true">
          <motion.div style={{ width: progressWidth }} />
        </div>
        <div className="chapter-layer">
          {chapters.map((chapter, index) => (
            <article
              className="chapter-card"
              ref={(node) => {
                chapterRefs.current[index] = node;
              }}
              key={chapter.kicker}
            >
              <span>{chapter.kicker}</span>
              <h2>{chapter.title}</h2>
              <p>{chapter.copy}</p>
            </article>
          ))}
        </div>
        <div className="callout-layer" aria-hidden="true">
          {callouts.map((callout, index) => (
            <div
              className="sequence-callout"
              key={callout.label}
              ref={(node) => {
                calloutRefs.current[index] = node;
              }}
              style={{ left: callout.left, top: callout.top }}
            >
              <span>{callout.label}</span>
              <strong>{callout.detail}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
