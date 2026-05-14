import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function BootScreen({ frames }) {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sampleFrames = frames.filter((_, index) => index % 8 === 0 || index < 8 || index > frames.length - 8);
    let loaded = 0;

    const update = () => {
      if (cancelled) return;
      const next = Math.round((loaded / sampleFrames.length) * 100);
      setProgress(Math.max(8, next));
    };

    sampleFrames.forEach((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      img
        .decode()
        .catch(() => undefined)
        .then(() => {
          loaded += 1;
          update();
          if (loaded === sampleFrames.length) {
            window.setTimeout(() => {
              if (!cancelled) setComplete(true);
            }, 420);
          }
        });
    });

    const fallback = window.setTimeout(() => {
      if (!cancelled) setComplete(true);
    }, 2400);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, [frames]);

  return (
    <AnimatePresence>
      {!complete && (
        <motion.div className="boot-screen" initial={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(14px)' }} transition={{ duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}>
          <div className="boot-mark">
            <span>Apex Noir</span>
            <strong>{progress.toString().padStart(2, '0')}%</strong>
          </div>
          <div className="boot-line">
            <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.35, ease: 'easeOut' }} />
          </div>
          <p>Initializing studio sequence</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
