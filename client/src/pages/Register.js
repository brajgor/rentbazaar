import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);;
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate(); 

  const validateEmail = (value) => {
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(value) ? null : "Nepareiza e-pasta adrese");
  };

  const validatePassword = (value) => {
    setPassword(value);
    const minLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!minLength) setPasswordError("Parolei jābūt vismaz 8 burtiem");
    else if (!hasUpperCase) setPasswordError("Parolei jābūt vismaz vienam lielajam burtam");
    else if (!hasSpecialChar) setPasswordError("Parolei jābūt vismaz vienai īpašajai zīmei");
    else setPasswordError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    try {
      const response = await fetch("https://rentbazaar-app.azurewebsites.net/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
      
      navigate("/login");

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
            <h1 className="h3 mb-3 fw-normal">Sveciens, Lūdzu reģistrēties!</h1>
          </div>

          {error && <p className="text-danger text-center">{error}</p>}

          <div className="form-floating mb-3">
            <input
              type="email"
              className={`form-control ${emailError ? "is-invalid" : ""}`}
              id="floatingInput"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
              required
            />
            <label htmlFor="floatingInput">E-pasta adrese</label>
            {emailError && <div className="invalid-feedback">{emailError}</div>}
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => validatePassword(e.target.value)}
              required
            />
            <label htmlFor="floatingPassword">Parole</label>
            {passwordError && <div className="invalid-feedback">{passwordError}</div>}
          </div>

          {/* <div className="form-check text-start my-3">
            <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Remember me
            </label>
          </div> */}

          <button type="submit" className="btn btn-primary" disabled={emailError || passwordError}>
            Reģistrēties
          </button>

          <p className="mt-3 text-center">
            Jau ir konts? <Link to="/login">Ielogoties</Link>
          </p>

        </form>
      </main>
    </div>
  );
};

export default Register;