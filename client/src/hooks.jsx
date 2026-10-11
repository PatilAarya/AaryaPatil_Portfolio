import { Fragment, createElement, useEffect, useRef, useState } from 'react';

export const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/*
 * Becomes true once the element scrolls into view. Kept in React state
 * (not added to classList by hand) so re-renders never wipe it out.
 */
export function useReveal(threshold = 0.18) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, shown];
}

export function Reveal({ as = 'div', className = '', children, ...rest }) {
  const [ref, shown] = useReveal();
  return createElement(
    as,
    { ref, className: `reveal ${className} ${shown ? 'is-in' : ''}`, ...rest },
    children,
  );
}

/* Splits a line into words that rise out of a mask, one after another. */
export function Words({ text, start = 0 }) {
  return text.split(' ').map((word, i) => (
    <Fragment key={i}>
      <span className="word">
        <span className="word-in" style={{ '--i': i + start }}>{word}</span>
      </span>{' '}
    </Fragment>
  ));
}

export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/* Writes scroll progress (0–1) to a CSS variable; no re-renders. */
export function useScrollProgress() {
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty('--progress', max > 0 ? scrollY / max : 0);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, []);
}

export function useClock(timeZone) {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000);
    return () => clearInterval(id);
  }, [timeZone]);
  return time;
}

export function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      return true;
    } catch {
      return false;
    }
  };
  return [copied, copy];
}

/* The owner's initials, set like the stamp on a wax seal. */
export const initials = (profile) => `${profile.firstName[0]}${profile.lastName[0]}`;
