import { useState, useEffect, useMemo } from 'react'

const API_URL = 'https://rickandmortyapi.com/api/location'

function Localizacoes() {
  const [localizacoes, setLocalizacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const [tipo, setTipo] = useState('')
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  useEffect(() => {
    async function buscarLocalizacoes() {
      setCarregando(true)
      setErro(null)

      const params = new URLSearchParams()
      params.set('page', pagina)

      try {
        const resposta = await fetch(`${API_URL}?${params.toString()}`)

        if (!resposta.ok) {
          throw new Error('Erro ao buscar localizações')
        }

        const dados = await resposta.json()
        setLocalizacoes(dados.results)
        setTotalPaginas(dados.info.pages)
      } catch (err) {
        setErro(err.message)
        setLocalizacoes([])
      } finally {
        setCarregando(false)
      }
    }

    buscarLocalizacoes()
  }, [pagina])

  // Extrai os tipos únicos presentes na página atual, pra montar as opções do select dinamicamente
  const tiposDisponiveis = useMemo(() => {
    const tipos = new Set(localizacoes.map((loc) => loc.type).filter(Boolean))
    return Array.from(tipos).sort()
  }, [localizacoes])

  const localizacoesFiltradas = tipo
    ? localizacoes.filter((loc) => loc.type === tipo)
    : localizacoes

  function handleTipoChange(e) {
    setTipo(e.target.value)
  }

  return (
    <div className="container">
      <h1>Localizações</h1>

      <div className="filtros">
        <select
          value={tipo}
          onChange={handleTipoChange}
          className="filtros__select"
        >
          <option value="">Todos os tipos</option>
          {tiposDisponiveis.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {carregando && <p>Carregando...</p>}
      {erro && <p className="mensagem-erro">Erro: {erro}</p>}
      {!carregando && !erro && localizacoesFiltradas.length === 0 && (
        <p>Nenhuma localização encontrada nesta página para o filtro selecionado.</p>
      )}

      <div className="grid-localizacoes">
        {localizacoesFiltradas.map((localizacao) => (
          <div key={localizacao.id} className="localizacao-card">
            <h3 className="localizacao-card__nome">{localizacao.name}</h3>
            <p className="localizacao-card__info">
              <strong>Tipo:</strong> {localizacao.type || 'Desconhecido'}
            </p>
            <p className="localizacao-card__info">
              <strong>Dimensão:</strong> {localizacao.dimension || 'Desconhecida'}
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

export default Localizacoes