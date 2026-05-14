import { motion } from 'framer-motion';

export function Hero({ frame }) {
  return (
    <section className="hero-section">
      <motion.img
        className="hero-frame"
        src={frame}
        alt="Apex Noir supercar cinematic reveal"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.82 }}
        transition={{ duration: 1.45, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="hero-shade" />
      <motion.div className="hero-copy" initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.25 }}>
        <span className="eyebrow">Apex Noir / 2026 Launch Film</span>
        <h1>Born in shadow. Tuned for velocity.</h1>
        <p>A cinematic scroll experience driven by 240 real sequence frames, red-line motion, and studio-grade atmosphere.</p>
        <a href="#sequence" className="magnetic-button">Enter the reveal</a>
      </motion.div>
      <div className="scroll-cue">
        <span />
        Scroll
      </div>
    </section>
  );
}
