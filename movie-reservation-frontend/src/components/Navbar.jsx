import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <ul className="flex space-x-4 justify-center">
        <li>
          <Link to="/movies">Films</Link>
        </li>
        <li>
          <Link to="/my-reservations">Mes Réservations</Link>
        </li>
        <li>
          <Link to="/login">Connexion</Link>
        </li>
        <li>
          <Link to="/register">Inscription</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
