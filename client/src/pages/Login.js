import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("https://rentbazaar-app.azurewebsites.net/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка входа");
      }

      login(data.userId);
      
      navigate("/");

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container-sm d-flex justify-content-center align-items-center vh-100">
      <main className="w-50 p-4 bg-white rounded shadow">
        <form onSubmit={handleSubmit}>
          <div className="text-center">
            {/* <img
              className="mb-4"
              src="https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo.svg"
              alt="Bootstrap Logo"
              width="72"
              height="57"
            /> */}
            <h1 className="h3 mb-3 fw-normal">Lūdzu pizslēdzaties</h1>
          </div>

          {error && <p className="text-danger text-center">{error}</p>}

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="floatingInput">E-adrese</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="floatingPassword">Parole</label>
          </div>

          {/* <div className="form-check text-start my-3">
            <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Remember me
            </label>
          </div> */}

          <button className="btn btn-primary w-100 py-2" type="submit">
            Pieslēgties
          </button>

          <p className="mt-3 text-center">
            Nav konta? <Link to="/register">Reģistrēties</Link>
          </p>

        </form>
      </main>
    </div>
  );
};

export default Login;

