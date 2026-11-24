import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favoritos, setFavoritos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favoritos')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  function alternarFavorito(id) {
    setFavoritos((actual) =>
      actual.includes(id)
        ? actual.filter((favorito) => favorito !== id)
        : [...actual, id]
    );
  }

  return (
    <FavoritesContext.Provider
      value={{
        favoritos,
        setFavoritos,
        alternarFavorito,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}