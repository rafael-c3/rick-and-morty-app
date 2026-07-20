import { Routes, Route } from 'react-router-dom'
import { FavoritosProvider } from './context/FavoritosContext'
import Navegacao from './components/Navegacao'
import Personagens from './pages/Personagens'
import Episodios from './pages/Episodios'
import Localizacoes from './pages/Localizacoes'
import Favoritos from './pages/Favoritos'

function App() {
  return (
    <FavoritosProvider>
      <Navegacao />
      <Routes>
        <Route path="/" element={<Personagens />} />
        <Route path="/episodios" element={<Episodios />} />
        <Route path="/localizacoes" element={<Localizacoes />} />
        <Route path="/favoritos" element={<Favoritos />} />
      </Routes>
    </FavoritosProvider>
  )
}

export default App