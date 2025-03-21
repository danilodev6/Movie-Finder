import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { useMovies } from "./hooks/useMovies";
import { Movies } from "./components/Movies";
import debounce from "just-debounce-it";

function useSearch() {
  const [search, updateSearch] = useState("");
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true);

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === "";
      return;
    }

    if (search === "") {
      setError("No se puede buscar una pelicula vacia");
      return;
    }
    setError(null);
  }, [search]);
  return { search, updateSearch, error };
}

function App() {
  const [sort, setSort] = useState(false);
  const { search, updateSearch, error } = useSearch();
  const { movies, loading, getMovies } = useMovies({ search, sort });

  const debounceMovies = useCallback(
    debounce((search) => {
      getMovies({ search });
    }, 300),
    [getMovies],
  );

  // uncontroled way - no React
  const handleSubmit = (event) => {
    event.preventDefault();
    // const { query } = Object.fromEntries(new window.FormData(event.target));
    getMovies({ search });
  };

  const handleChange = (event) => {
    const newQuery = event.target.value;
    if (newQuery.startsWith(" ")) return;

    updateSearch(newQuery);
    debounceMovies(newQuery);
  };

  const handleSort = () => {
    setSort(!sort);
  };

  return (
    <div id="page">
      <header>
        <h1>Movie Finder</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            value={search}
            name="query"
            placeholder="Avengers, Interstellar, Fast and Furious ..."
            style={{
              border: "1px solid transparent",
              borderColor: error ? "red" : "transparent",
            }}
          />
          <button type="submit">Search</button>
          <p>Sort by name: </p>
          <input type="checkbox" onChange={handleSort} checked={sort} />
        </form>
        {error && <p className="error1">{error}</p>}
      </header>
      <main>{loading ? <p>Cargando...</p> : <Movies movies={movies} />}</main>
    </div>
  );
}

export default App;
