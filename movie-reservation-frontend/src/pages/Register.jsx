import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css"; // Importer le fichier CSS Module

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await registerUser({ email, password });
      navigate("/login"); // Rediriger vers la page de connexion
    } catch (err) {
      setError("Erreur lors de l'inscription.");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleRegister}>
        <h2 className={styles.title}>Inscription 📝</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>
          S'inscrire
        </button>
        <a href="/login" className={styles.link}>
          Déjà un compte ? Connectez-vous ici
        </a>
      </form>
    </div>
  );
}

export default Register;


  