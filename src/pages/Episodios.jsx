import { useState, useEffect } from 'react'

const API_URL = 'https://rickandmortyapi.com/api/episode'

// Extrai o número da temporada a partir do código, ex: "S02E05" -> "02"
function extrairTemporada(codigo) {
  const match = codigo.match(/S(\d+)E\d+/)
  return match ? match[1] : null
}

function Episodios() {
  const [episodios, setEpisodios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const [temporada, setTemporada] = useState('')
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  useEffect(() => {
    async function buscarEpisodios() {
      setCarregando(true)
      setErro(null)

      const params = new URLSearchParams()
      params.set('page', pagina)

      try {
        const resposta = await fetch(`${API_URL}?${params.toString()}`)

        if (!resposta.ok) {
          throw new Error('Erro ao buscar episódios')
        }

        const dados = await resposta.json()
        setEpisodios(dados.results)
        setTotalPaginas(dados.info.pages)
      } catch (err) {
        setErro(err.message)
        setEpisodios([])
      } finally {
        setCarregando(false)
      }
    }

    buscarEpisodios()
  }, [pagina])

  // Filtro de temporada é aplicado no que já veio da API (client-side),
  // já que a API não tem um parâmetro de busca por temporada.
  const episodiosFiltrados = temporada
    ? episodios.filter((ep) => extrairTemporada(ep.episode) === temporada)
    : episodios

  function handleTemporadaChange(e) {
    setTemporada(e.target.value)
  }

  return (
    <div className="container">
      <h1>Episódios</h1>

      <div className="filtros">
        <select
          value={temporada}
          onChange={handleTemporadaChange}
          className="filtros__select"
        >
          <option value="">Todas as temporadas</option>
          <option value="01">Temporada 1</option>
          <option value="02">Temporada 2</option>
          <option value="03">Temporada 3</option>
          <option value="04">Temporada 4</option>
          <option value="05">Temporada 5</option>
        </select>
      </div>

      {carregando && <p>Carregando...</p>}
      {erro && <p className="mensagem-erro">Erro: {erro}</p>}
      {!carregando && !erro && episodiosFiltrados.length === 0 && (
        <p>Nenhum episódio encontrado nesta página para o filtro selecionado.</p>
      )}

      <div className="grid-episodios">
        {episodiosFiltrados.map((episodio) => (
          <div key={episodio.id} className="episodio-card">
            <span className="episodio-card__codigo">{episodio.episode}</span>
            <h3 className="episodio-card__nome">{episodio.name}</h3>
            <p className="episodio-card__data">{episodio.air_date}</p>
            <p className="episodio-card__personagens">
              {episodio.characters.length} personagens
            </p>
          </div>
        ))}
      </div>

      {!carregando && (
        <div className="paginacao">
          <button
            onClick={() => setPagina((p) => p - 1)}
            disabled={pagina === 1}
          >
            Anterior
          </button>
          <span>
            Página {pagina} de {totalPaginas}
          </span>
          <button
            onClick={() => setPagina((p) => p + 1)}
            disabled={pagina === totalPaginas}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  )
}

export default Episodios