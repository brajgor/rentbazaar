import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OFFER_TYPES = {
  1: "Game Currency",
  2: "Account",
};

const GAMES = {
  2: "Fortnite",
  3: "CS 2",
  4: "DOTA 2",
  5: "Roblox",
  6: "Steam",
  7: "World of Warcraft",
  8: "War Thunder"
};

const CreateOffer = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [type, setType] = useState(1);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [gameId, setGame] = useState("");
  const [images, setImages] = useState([]); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {

      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", type);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("userId", userId);
      formData.append("gameId", gameId);


      images.forEach((file) => formData.append("images", file));

      const response = await fetch(
        "https://rentbazaar-app.azurewebsites.net/api/offers/placeOffer",
        {
          method: "POST",
          body: formData, 
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error creating offer");

      setSuccess("Offer is created!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create your offer</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Type:</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(parseInt(e.target.value, 10) || 0)}
            required
          >
            <option value="">Select type</option>
            {Object.entries(OFFER_TYPES).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Price:</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Game:</label>
          <select
            className="form-select"
            value={gameId}
            onChange={(e) => setGame(parseInt(e.target.value, 10) || 0)}
            required
          >
            <option value="">Select a game</option>
            {Object.entries(GAMES).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Images (max 10):</label>
          <input
            type="file"
            className="form-control"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          {images.length > 0 && (
            <small className="text-muted">
              Selected: {images.map((f) => f.name).join(", ")}
            </small>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </form>

      {success && <p className="text-success mt-3">{success}</p>}
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
};

export default CreateOffer;