import { useState, useEffect } from 'react'
import LocalizacaoCard from '../components/LocalizacaoCard'

const API_URL = 'https://rickandmortyapi.com/api/location'
const ITENS_POR_PAGINA = 20

const TIPOS_FILTRO = ['Planet', 'Space station', 'Microverse', 'TV', 'Resort']

function Localizacoes() {
  const [todasLocalizacoes, setTodasLocalizacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const [tipo, setTipo] = useState('')
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    async function buscarTodasLocalizacoes() {
      setCarregando(true)
      setErro(null)

      try {
        const primeiraResposta = await fetch(`${API_URL}?page=1`)
        if (!primeiraResposta.ok) throw new Error('Erro ao buscar localizações')
        const primeiraPagina = await primeiraResposta.json()

        const totalPaginasApi = primeiraPagina.info.pages
        let todas = [...primeiraPagina.results]

        if (totalPaginasApi > 1) {
          const restantes = await Promise.all(
            Array.from({ length: totalPaginasApi - 1 }, (_, i) =>
              fetch(`${API_URL}?page=${i + 2}`).then((r) => r.json())
            )
          )
          restantes.forEach((pagina) => {
            todas = todas.concat(pagina.results)
          })
        }

        setTodasLocalizacoes(todas)
      } catch (err) {
        setErro(err.message)
        setTodasLocalizacoes([])
      } finally {
        setCarregando(false)
      }
    }

    buscarTodasLocalizacoes()
  }, [])

  const localizacoesFiltradas = tipo
    ? todasLocalizacoes.filter((loc) => loc.type === tipo)
    : todasLocalizacoes

  const totalPaginas = Math.max(
    1,
    Math.ceil(localizacoesFiltradas.length / ITENS_POR_PAGINA)
  )

  const localizacoesDaPagina = localizacoesFiltradas.slice(
    (pagina - 1) * ITENS_POR_PAGINA,
    pagina * ITENS_POR_PAGINA
  )

  function handleTipoClick(novoTipo) {
    setTipo(novoTipo)
    setPagina(1)
  }

  return (
    <div className="container">
      <h1>Localizações</h1>

      <div className="filtro-pills">
        <button
          className={`filtro-pill ${tipo === '' ? 'filtro-pill--ativo' : ''}`}
          onClick={() => handleTipoClick('')}
        >
          Todos
        </button>
        {TIPOS_FILTRO.map((t) => (
          <button
            key={t}
            className={`filtro-pill ${tipo === t ? 'filtro-pill--ativo' : ''}`}
            onClick={() => handleTipoClick(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {carregando && <p>Carregando...</p>}
      {erro && <p className="mensagem-erro">Erro: {erro}</p>}
      {!carregando && !erro && localizacoesDaPagina.length === 0 && (
        <p>Nenhuma localização encontrada para o filtro selecionado.</p>
      )}

      <div className="grid-localizacoes">
        {localizacoesDaPagina.map((localizacao) => (
          <LocalizacaoCard key={localizacao.id} localizacao={localizacao} />
        ))}
      </div>

      {!carregando && localizacoesFiltradas.length > 0 && (
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

export default Localizacoes