import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ZoneEditsProvider } from './hooks/ZoneEditsContext';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Every page except Home loads on demand, so a first visit downloads only the code it needs.
const Calculator = lazy(() => import('./pages/Calculator'));
const Compare = lazy(() => import('./pages/Compare'));
const Science = lazy(() => import('./pages/Science'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const Researchers = lazy(() => import('./pages/Researchers'));
const References = lazy(() => import('./pages/References'));
const About = lazy(() => import('./pages/About'));

export default function App() {
  return (
    <ZoneEditsProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="compare" element={<Compare />} />
          <Route path="science" element={<Science />} />
          <Route path="science/:slug" element={<ArticlePage />} />
          <Route path="researchers" element={<Researchers />} />
          <Route path="references" element={<References />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ZoneEditsProvider>
  );
}
