import React, { useState } from 'react';

function App() {
  const [pokemonNameOrId, setPokemonNameOrId] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState('');
  const [currentPokemonId, setCurrentPokemonId] = useState(1);

  const fetchPokemon = async (pokemon) => {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon}/`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Pokémon não localizado');
      }
      const data = await response.json();
      setCurrentPokemonId(data.id);
      fetchPokemonSpecies(data.species.url, data);
    } catch (error) {
      setError('Pokémon não localizado');
      setPokemonData(null);
    }
  };

  const fetchPokemonSpecies = async (url, data) => {
    try {
      const response = await fetch(url);
      const speciesData = await response.json();
      setPokemonData({
        name: speciesData.name,
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
        description: getDescription(speciesData)
      });
      setError('');
    } catch (error) {
      setError('Erro ao carregar informações do Pokémon');
    }
  };

  const getDescription = (species) => {
    const descriptionEntry =
      species.flavor_text_entries.find((entry) => entry.language.name === 'pt') ||
      species.flavor_text_entries.find((entry) => entry.language.name === 'en');
    return descriptionEntry ? descriptionEntry.flavor_text.replace(/\n/g, ' ') : 'Descrição não disponível.';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (pokemonNameOrId) {
      fetchPokemon(pokemonNameOrId.toLowerCase());
    }
  };

  const handleNext = () => {
    const nextId = currentPokemonId + 1;
    setCurrentPokemonId(nextId);
    fetchPokemon(nextId);
  };

  const handlePrev = () => {
    if (currentPokemonId > 1) {
      const prevId = currentPokemonId - 1;
      setCurrentPokemonId(prevId);
      fetchPokemon(prevId);
    }
  };

  return (
    <div>
      <h1>Localizar Pokémon</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={pokemonNameOrId}
          onChange={(e) => setPokemonNameOrId(e.target.value)}
          placeholder="Nome do Pokémon ou ID"
        />
        <button type="submit">Localizar</button>
      </form>
      {error && <p>{error}</p>}
      {pokemonData && (
        <div>
          <h2>{pokemonData.name.toUpperCase()}</h2>
          <img src={pokemonData.imageUrl} alt={pokemonData.name} />
          <p>{pokemonData.description}</p>
        </div>
      )}
      <div>
        <button onClick={handlePrev} disabled={currentPokemonId <= 1}>
          Anterior
        </button>
        <button onClick={handleNext}>Próximo</button>
      </div>
    </div>
  );
}

export default App;
