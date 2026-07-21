import { useState, useEffect } from 'react'
import EpisodioCard from '../components/EpisodioCard'

const API_URL = 'https://rickandmortyapi.com/api/episode'
const ITENS_POR_PAGINA = 20

function extrairTemporada(codigo) {
  const match = codigo.match(/S(\d+)E\d+/)
  return match ? match[1] : null
}

function Episodios() {
  const [todosEpisodios, setTodosEpisodios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const [temporada, setTemporada] = useState('')
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    async function buscarTodosEpisodios() {
      setCarregando(true)
      setErro(null)

      try {
        const primeiraResposta = await fetch(`${API_URL}?page=1`)
        if (!primeiraResposta.ok) throw new Error('Erro ao buscar episódios')
        const primeiraPagina = await primeiraResposta.json()

        const totalPaginasApi = primeiraPagina.info.pages
        let todos = [...primeiraPagina.results]

        if (totalPaginasApi > 1) {
          const restantes = await Promise.all(
            Array.from({ length: totalPaginasApi - 1 }, (_, i) =>
              fetch(`${API_URL}?page=${i + 2}`).then((r) => r.json())
            )
          )
          restantes.forEach((pagina) => {
            todos = todos.concat(pagina.results)
          })
        }

        setTodosEpisodios(todos)
      } catch (err) {
        setErro(err.message)
        setTodosEpisodios([])
      } finally {
        setCarregando(false)
      }
    }

    buscarTodosEpisodios()
  }, [])

  const episodiosFiltrados = temporada
    ? todosEpisodios.filter((ep) => extrairTemporada(ep.episode) === temporada)
    : todosEpisodios

  const totalPaginas = Math.max(
    1,
    Math.ceil(episodiosFiltrados.length / ITENS_POR_PAGINA)
  )

  const episodiosDaPagina = episodiosFiltrados.slice(
    (pagina - 1) * ITENS_POR_PAGINA,
    pagina * ITENS_POR_PAGINA
  )

  function handleTemporadaChange(e) {
    setTemporada(e.target.value)
    setPagina(1)
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
      {!carregando && !erro && episodiosDaPagina.length === 0 && (
        <p>Nenhum episódio encontrado para o filtro selecionado.</p>
      )}

      <div className="grid-episodios">
        {episodiosDaPagina.map((episodio) => (
          <EpisodioCard key={episodio.id} episodio={episodio} />
        ))}
      </div>

      {!carregando && episodiosFiltrados.length > 0 && (
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