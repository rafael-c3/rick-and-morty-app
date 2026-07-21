import { useFavoritos } from '../context/FavoritosContext'

const statusInfo = {
  Alive: { cor: '#55cc44', texto: 'Vivo' },
  Dead: { cor: '#d63d2e', texto: 'Morto' },
  unknown: { cor: '#9e9e9e', texto: 'Desconhecido' },
}

const IMAGEM_FALLBACK =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%231a1d24"/><text x="50%" y="50%" font-size="14" fill="%239aa0a8" text-anchor="middle" dy=".3em">sem imagem</text></svg>'

function PersonagemCard({ personagem }) {
  const { isFavorito, alternarFavorito } = useFavoritos()
  const favoritado = isFavorito(personagem.id)
  const { cor, texto } = statusInfo[personagem.status] || statusInfo.unknown

  function handleImagemErro(e) {
    e.target.onerror = null
    e.target.src = IMAGEM_FALLBACK
  }

  return (
    <div className="personagem-card">
      <img
        src={personagem.image}
        alt={personagem.name}
        className="personagem-card__imagem"
        onError={handleImagemErro}
      />
      <div className="personagem-card__conteudo">
        <h3 className="personagem-card__nome">{personagem.name}</h3>
        <p className="personagem-card__especie">{personagem.species}</p>
        <div className="personagem-card__status">
          <span
            className="personagem-card__status-bolinha"
            style={{ backgroundColor: cor }}
          />
          <span>{texto}</span>
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