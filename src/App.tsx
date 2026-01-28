import { Routes, Route, Navigate } from 'react-router-dom';
import Nodes from '@/pages/Nodes';
import { Layout } from '@/components/Layout';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/nodes" replace />} />
        <Route path="/nodes" element={<Nodes />} />
      </Route>
    </Routes>
  );
}

export default App;
