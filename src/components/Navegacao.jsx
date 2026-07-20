import { NavLink } from 'react-router-dom'
import { useFavoritos } from '../context/FavoritosContext'

function Navegacao() {
  const { favoritos } = useFavoritos()

  return (
    <nav className="navegacao">
      <div className="container navegacao__conteudo">
        <NavLink to="/" className="navegacao__link">
          Personagens
        </NavLink>
        <NavLink to="/episodios" className="navegacao__link">
          Episódios
        </NavLink>
        <NavLink to="/localizacoes" className="navegacao__link">
          Localizações
        </NavLink>
        <NavLink to="/favoritos" className="navegacao__link">
          Favoritos {favoritos.length > 0 && `(${favoritos.length})`}
        </NavLink>
      </div>
    </nav>
  )
}

export default Navegacao