import { useFavoritos } from '../context/FavoritosContext'

const statusCores = {
  Alive: '#55cc44',
  Dead: '#d63d2e',
  unknown: '#9e9e9e',
}

function PersonagemCard({ personagem }) {
  const { isFavorito, alternarFavorito } = useFavoritos()
  const favoritado = isFavorito(personagem.id)
  const corStatus = statusCores[personagem.status] || statusCores.unknown

  return (
    <div className="personagem-card">
      <img
        src={personagem.image}
        alt={personagem.name}
        className="personagem-card__imagem"
      />
      <div className="personagem-card__conteudo">
        <h3 className="personagem-card__nome">{personagem.name}</h3>
        <p className="personagem-card__especie">{personagem.species}</p>
        <div className="personagem-card__status">
          <span
            className="personagem-card__status-bolinha"
            style={{ backgroundColor: corStatus }}
          />
          <span>{personagem.status}</span>
        </div>
      </div>
      <button
        className={`personagem-card__favorito ${favoritado ? 'personagem-card__favorito--ativo' : ''}`}
        onClick={() => alternarFavorito(personagem)}
        aria-label={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        {favoritado ? '♥' : '♡'}
      </button>
    </div>
  )
}

export default PersonagemCard