import { useEffect, useState } from 'react';
import Landing from './screens/Landing';
import Funnel from './screens/Funnel';

// Простой роутинг по пути (без зависимостей):
//   /        → лендинг (промо продукта)
//   /funnel  → воронка-прототип в «телефоне»
// На Vercel /funnel отдаёт index.html (rewrite в vercel.json); в dev — SPA-fallback Vite.
const routeFromPath = () =>
  window.location.pathname.replace(/\/+$/, '') === '/funnel' ? 'funnel' : 'landing';

export default function App() {
  const [route, setRoute] = useState(routeFromPath);

  useEffect(() => {
    const onPop = () => setRoute(routeFromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (to) => {
    const path = to === 'funnel' ? '/funnel' : '/';
    const cur = window.location.pathname.replace(/\/+$/, '') || '/';
    if (cur !== path) window.history.pushState({}, '', path);
    setRoute(to);
    window.scrollTo(0, 0);
  };

  return route === 'funnel' ? (
    <Funnel onExitToLanding={() => navigate('landing')} />
  ) : (
    <Landing onStartFunnel={() => navigate('funnel')} />
  );
}
