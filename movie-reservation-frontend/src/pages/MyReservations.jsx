import { useState, useEffect } from "react";
import { api } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css"; // 📌 Importer Bootstrap CSS

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // 📌 Charger les réservations de l’utilisateur connecté
  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vous devez être connecté pour voir vos réservations.");

      const response = await api.get("/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReservations(response.data);
    } catch (err) {
      setError("Erreur lors de la récupération des réservations.");
    }
  };

  // 📌 Annuler une réservation
  const handleCancel = async (reservationId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vous devez être connecté pour annuler une réservation.");

      await api.delete(`/reservations/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("🎉 Réservation annulée avec succès !");
      setReservations((prev) => prev.filter((r) => r.id !== reservationId));

      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setMessage(`❌ Erreur : ${err.response?.data?.message || err.message}`);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="container-lg py-5 bg-dark text-white">
      <h1 className="text-center mb-4">📅 Mes Réservations</h1>
      {error && <p className="text-danger text-center">{error}</p>}
      {message && (
        <div className="alert alert-success alert-dismissible fade show position-fixed bottom-0 end-0 m-4" role="alert">
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
        </div>
      )}

      {/* 📌 Liste des réservations */}
      <div className="row g-4">
        {reservations.length === 0 ? (
          <p className="text-center">❌ Aucune réservation trouvée.</p>
        ) : (
          reservations.map((res) => (
            <div key={res.id} className="col-lg-4 col-md-6">
              <div className="card bg-light text-dark shadow">
                <div className="card-body text-center">
                  <h5 className="card-title">🎬 Film ID: {res.movieId}</h5>
                  <p className="card-text">📅 Début: {new Date(res.startTime).toLocaleString()}</p>
                  <p className="card-text">⏳ Fin: {new Date(res.endTime).toLocaleString()}</p>
                  
                  {/* 📌 Bouton "Annuler" */}
                  <button
                    onClick={() => handleCancel(res.id)}
                    className="btn btn-danger w-100"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyReservations;

  