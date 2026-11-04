// Плавный скролл (Lenis) внутри «экрана телефона», синхронизирован с тикером GSAP.
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';

// wrapperRef — скроллящийся контейнер (.screen-body). Пересоздаём инстанс,
// когда меняется шаг воронки (другой скролл-контейнер).
export function useLenis(wrapperRef, deps = []) {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const lenis = new Lenis({
      wrapper,
      content: wrapper.firstElementChild || wrapper,
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    const onTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
