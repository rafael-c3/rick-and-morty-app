function LocalizacaoCard({ localizacao }) {
  return (
    <div className="localizacao-card">
      <h3 className="localizacao-card__nome">{localizacao.name}</h3>
      <p className="localizacao-card__info">
        <strong>Tipo:</strong> {localizacao.type || 'Desconhecido'}
      </p>
      <p className="localizacao-card__info">
        <strong>Dimensão:</strong> {localizacao.dimension || 'Desconhecida'}
      </p>
    </div>
  )
}

export default LocalizacaoCard