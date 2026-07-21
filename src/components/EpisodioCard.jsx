function EpisodioCard({ episodio }) {
  return (
    <div className="episodio-card">
      <span className="episodio-card__codigo">{episodio.episode}</span>
      <h3 className="episodio-card__nome">{episodio.name}</h3>
      <p className="episodio-card__data">{episodio.air_date}</p>
      <p className="episodio-card__personagens">
        {episodio.characters.length} personagens
      </p>
    </div>
  )
}

export default EpisodioCard