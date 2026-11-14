import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import Compare from './pages/Compare';
import Science from './pages/Science';
import Researchers from './pages/Researchers';
import References from './pages/References';
import About from './pages/About';
import NotFound from './pages/NotFound';
import { ZoneEditsProvider } from './hooks/ZoneEditsContext';

export default function App() {
  return (
    <ZoneEditsProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="compare" element={<Compare />} />
          <Route path="science" element={<Science />} />
          <Route path="researchers" element={<Researchers />} />
          <Route path="references" element={<References />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ZoneEditsProvider>
  );
}
