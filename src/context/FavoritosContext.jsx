import { createContext, useContext, useState } from 'react'

const FavoritosContext = createContext(null)

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState([])

  function adicionarFavorito(personagem) {
    setFavoritos((prev) => {
      const jaExiste = prev.some((fav) => fav.id === personagem.id)
      if (jaExiste) return prev
      return [...prev, personagem]
    })
  }

  function removerFavorito(id) {
    setFavoritos((prev) => prev.filter((fav) => fav.id !== id))
  }

  function isFavorito(id) {
    return favoritos.some((fav) => fav.id === id)
  }

  function alternarFavorito(personagem) {
    if (isFavorito(personagem.id)) {
      removerFavorito(personagem.id)
    } else {
      adicionarFavorito(personagem)
    }
  }

  const value = {
    favoritos,
    adicionarFavorito,
    removerFavorito,
    isFavorito,
    alternarFavorito,
  }

  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  )
}

export function useFavoritos() {
  const context = useContext(FavoritosContext)
  if (!context) {
    throw new Error('useFavoritos precisa ser usado dentro de um FavoritosProvider')
  }
  return context
}