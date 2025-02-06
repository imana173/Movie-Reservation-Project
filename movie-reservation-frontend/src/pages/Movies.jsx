import { useState, useEffect } from "react";
import { api } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css"; // 📌 Importer Bootstrap CSS

function Movies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("release_date");
  const [selectedDate, setSelectedDate] = useState(""); // 📌 Date sélectionnée

  // 📌 Gestion des messages
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");

  const fetchMovies = async () => {
    try {
      const response = await api.get(`/movies?page=${page}&search=${search}&sort=${sort}`);
      setMovies(response.data.results);
    } catch (err) {
      setError("Erreur lors de la récupération des films.");
    }
  };

  const handleReservation = async (movieId, title) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vous devez être connecté pour réserver.");

      if (!selectedDate) throw new Error("Veuillez sélectionner une date et une heure.");

      const startTime = new Date(selectedDate).toISOString();

      await api.post(
        "/reservations",
        { movieId, title, startTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAlertMessage(`🎉 Réservation réussie pour "${title}" à ${selectedDate} !`);
      setAlertType("success");
    } catch (err) {
      setAlertMessage(`❌ ${err.response?.data?.message || err.message}`);
      setAlertType("danger");
    }

    // 📌 Supprimer le message après 5 secondes
    setTimeout(() => setAlertMessage(null), 5000);
  };

  useEffect(() => {
    fetchMovies();
  }, [page, search, sort]);

  return (
    <div className="container-lg py-5 bg-dark text-white">
      <h1 className="text-center mb-4">🎬 Liste des Films</h1>
      {error && <p className="text-danger text-center">{error}</p>}

      {/* 📌 Barre de recherche et tri */}
      <div className="mb-5 p-4 bg-secondary rounded shadow">
        <div className="row g-3 align-items-center">
          <div className="col-md-8">
            <input
              type="text"
              placeholder="Rechercher un film..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control form-control-lg"
            />
          </div>
          <div className="col-md-4">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="form-select form-select-lg"
            >
              <option value="release_date">📅 Date de sortie</option>
              <option value="popularity">🔥 Popularité</option>
              <option value="vote_average">⭐ Note</option>
            </select>
          </div>
        </div>
      </div>

      {/* 📌 Liste des films */}
      <div className="row g-4">
        {movies.map((movie) => (
          <div key={movie.id} className="col-lg-3 col-md-4 col-sm-6">
            <div className="card bg-light text-dark shadow h-100">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="card-img-top"
              />
              <div className="card-body text-center">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">{movie.release_date}</p>
                
                {/* 📌 Sélection de la date et heure */}
                <input
                  type="datetime-local"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="form-control mb-2"
                />

                {/* 📌 Bouton "Réserver" */}
                <button
                  onClick={() => handleReservation(movie.id, movie.title)}
                  className="btn btn-primary w-100"
                >
                  Réserver
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📌 Pagination */}
      <div className="d-flex justify-content-center mt-5">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="btn btn-secondary me-3"
          disabled={page === 1}
        >
          Précédent
        </button>
        <span className="btn btn-outline-light disabled">Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="btn btn-primary ms-3"
        >
          Suivant
        </button>
      </div>

      {/* 📌 Message d'Alerte Fermable en Bas de l'Écran */}
      {alertMessage && (
        <div
          className={`alert alert-${alertType} alert-dismissible fade show position-fixed bottom-0 end-0 m-4`}
          role="alert"
          style={{ zIndex: 1050, minWidth: "300px" }}
        >
          {alertMessage}
          <button type="button" className="btn-close" onClick={() => setAlertMessage(null)}></button>
        </div>
      )}
    </div>
  );
}

export default Movies;









  