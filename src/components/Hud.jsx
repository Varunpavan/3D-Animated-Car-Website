import { motion, useScroll, useTransform } from 'framer-motion';
import ThemeToggle from './ThemeToggle.jsx';

const links = [
  ['Sequence', '#sequence'],
  ['Specs', '#performance'],
  ['Gallery', '#gallery'],
  ['Reserve', '#reserve'],
];

export function Hud() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <header className="site-hud">
      <a className="hud-brand" href="#top" aria-label="Apex Noir home">
        <span />
        Apex Noir
      </a>
      <nav aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <a href={href} key={href}>
            {label}
          </a>
        ))}
      </nav>
      <div className="hud-status">
        <span>Launch Film</span>
        <strong>Live</strong>
        <ThemeToggle />
      </div>
      <div className="hud-progress" aria-hidden="true">
        <motion.div style={{ width }} />
      </div>
    </header>
  );
}
