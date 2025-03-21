export function Movies({ movies }) {
  const okMovies = movies?.length > 0;

  if (okMovies)
    return (
      <ul className="movies">
        {movies.map((movie) => (
          <li key={movie.id} className="movie">
            <h3>{movie.title}</h3>
            <p>{movie.year}</p>
            <img src={movie.poster} alt={movie.title} />
          </li>
        ))}
      </ul>
    );
  return <p>No results for this search</p>;
}
