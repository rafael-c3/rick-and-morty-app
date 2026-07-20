import { useState, useEffect, useRef } from 'react'
import PersonagemCard from '../components/PersonagemCard'

const API_URL = 'https://rickandmortyapi.com/api/character'

function Personagens() {
  const [personagens, setPersonagens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState('')
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  const inputBuscaRef = useRef(null)

  // Foco automático no campo de busca quando a página carrega
  useEffect(() => {
    inputBuscaRef.current?.focus()
  }, [])

  // Busca dados sempre que busca, status ou página mudam
  useEffect(() => {
    async function buscarPersonagens() {
      setCarregando(true)
      setErro(null)

      const params = new URLSearchParams()
      params.set('page', pagina)
      if (busca) params.set('name', busca)
      if (status) params.set('status', status)

      try {
        const resposta = await fetch(`${API_URL}?${params.toString()}`)

        if (!resposta.ok) {
          if (resposta.status === 404) {
            setPersonagens([])
            setTotalPaginas(1)
            setCarregando(false)
            return
          }
          throw new Error('Erro ao buscar personagens')
        }

        const dados = await resposta.json()
        setPersonagens(dados.results)
        setTotalPaginas(dados.info.pages)
      } catch (err) {
        setErro(err.message)
        setPersonagens([])
      } finally {
        setCarregando(false)
      }
    }

    buscarPersonagens()
  }, [busca, status, pagina])

  function handleBuscaChange(e) {
    setBusca(e.target.value)
    setPagina(1) // volta pra página 1 sempre que muda a busca
  }

  function handleStatusChange(e) {
    setStatus(e.target.value)
    setPagina(1)
  }

  return (
    <div className="container">
      <h1>Personagens</h1>

      <div className="filtros">
        <input
          ref={inputBuscaRef}
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={handleBuscaChange}
          className="filtros__input"
        />

        <select
          value={status}
          onChange={handleStatusChange}
          className="filtros__select"
        >
          <option value="">Todos os status</option>
          <option value="alive">Vivo</option>
          <option value="dead">Morto</option>
          <option value="unknown">Desconhecido</option>
        </select>
      </div>

      {carregando && <p>Carregando...</p>}
      {erro && <p className="mensagem-erro">Erro: {erro}</p>}
      {!carregando && !erro && personagens.length === 0 && (
        <p>Nenhum personagem encontrado.</p>
      )}

      <div className="grid-personagens">
        {personagens.map((personagem) => (
          <PersonagemCard key={personagem.id} personagem={personagem} />
        ))}
      </div>

      {!carregando && personagens.length > 0 && (
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

export default Personagens