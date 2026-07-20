import { useFavoritos } from '../context/FavoritosContext'
import PersonagemCard from '../components/PersonagemCard'

function Favoritos() {
  const { favoritos } = useFavoritos()

  return (
    <div className="container">
      <h1>Favoritos</h1>

      {favoritos.length === 0 && <p>Nenhum favorito ainda.</p>}

      <div className="grid-personagens">
        {favoritos.map((personagem) => (
          <PersonagemCard key={personagem.id} personagem={personagem} />
        ))}
      </div>
    </div>
  )
}

export default Favoritos