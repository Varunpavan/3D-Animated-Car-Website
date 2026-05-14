import { motion } from 'framer-motion';

const stats = [
  ['2.1s', '0-100 km/h'],
  ['986hp', 'Hybrid output'],
  ['412km/h', 'V-max simulation'],
  ['900kg', 'Aero load'],
];

const features = [
  ['Active aero', 'Flaps trim airflow in milliseconds for road-hugging stability.'],
  ['Carbon cell', 'A sculpted monocoque keeps the cabin rigid, quiet, and impossibly focused.'],
  ['Neural torque', 'Predictive power delivery responds before grip changes are visible.'],
];

export function Performance() {
  return (
    <section className="content-band performance-section" id="performance">
      <div className="section-heading">
        <span className="eyebrow">Performance telemetry</span>
        <h2>Numbers with cinematic weight.</h2>
      </div>
      <div className="stats-grid">
        {stats.map(([value, label], index) => (
          <motion.div
            className="stat-card"
            key={label}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
          >
            <strong>{value}</strong>
            <span>{label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function FeatureShowcase() {
  return (
    <section className="content-band features-section">
      <div className="section-heading narrow">
        <span className="eyebrow">Driver systems</span>
        <h2>Everything disappears except intent.</h2>
      </div>
      <div className="feature-grid">
        {features.map(([title, copy], index) => (
          <motion.article
            className="feature-card"
            key={title}
            initial={{ opacity: 0, rotateX: 12, y: 34 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            whileHover={{ y: -8, scale: 1.015 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.72, delay: index * 0.08 }}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function Gallery({ frames }) {
  const picks = [0.08, 0.28, 0.48, 0.68, 0.88].map((ratio) => frames[Math.floor(frames.length * ratio)]);

  return (
    <section className="gallery-section" id="gallery">
      <div className="section-heading">
        <span className="eyebrow">Studio fragments</span>
        <h2>Five frames from the launch sequence.</h2>
      </div>
      <div className="gallery-track">
        {picks.map((src, index) => (
          <motion.figure
            key={src}
            className="gallery-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.035, rotate: index % 2 ? 1.2 : -1.2 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, delay: index * 0.06 }}
          >
            <img src={src} alt={`Apex Noir sequence frame ${index + 1}`} loading="lazy" />
            <figcaption>Frame {String(index + 1).padStart(2, '0')}</figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="cta-section" id="reserve">
      <motion.div className="cta-panel" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }}>
        <span className="eyebrow">Private preview</span>
        <h2>The next launch begins where the light ends.</h2>
        <button type="button" className="magnetic-button">Request allocation</button>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span>Apex Noir</span>
      <span>Frame-sequence cinematic showcase</span>
      <span>React / Three.js / GSAP</span>
    </footer>
  );
}
