import { useState, useEffect, useRef } from 'react'
import PersonagemCard from '../components/PersonagemCard'

const API_URL = 'https://rickandmortyapi.com/api/character'

function Personagens() {
  const [personagens, setPersonagens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const [busca, setBusca] = useState('')
  const [buscaDebounced, setBuscaDebounced] = useState('')
  const [status, setStatus] = useState('')
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  const inputBuscaRef = useRef(null)

  useEffect(() => {
    inputBuscaRef.current?.focus()
  }, [])

  // Debounce: só atualiza buscaDebounced 400ms depois que o usuário para de digitar.
  useEffect(() => {
    const timer = setTimeout(() => {
      setBuscaDebounced(busca)
      setPagina(1)
    }, 400)

    return () => clearTimeout(timer)
  }, [busca])

  useEffect(() => {
    setPagina(1)
  }, [status])

  // Busca dados com AbortController pra cancelar requisições antigas
  useEffect(() => {
    const controller = new AbortController()

    async function buscarPersonagens() {
      setCarregando(true)
      setErro(null)

      const params = new URLSearchParams()
      params.set('page', pagina)
      if (buscaDebounced) params.set('name', buscaDebounced)
      if (status) params.set('status', status)

      try {
        const resposta = await fetch(`${API_URL}?${params.toString()}`, {
          signal: controller.signal,
        })

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
        setCarregando(false)
      } catch (err) {
        if (err.name === 'AbortError') return
        setErro(err.message)
        setPersonagens([])
        setCarregando(false)
      }
    }

    buscarPersonagens()

    return () => controller.abort()
  }, [buscaDebounced, status, pagina])

  function handleBuscaChange(e) {
    setBusca(e.target.value)
  }

  function handleStatusChange(e) {
    setStatus(e.target.value)
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