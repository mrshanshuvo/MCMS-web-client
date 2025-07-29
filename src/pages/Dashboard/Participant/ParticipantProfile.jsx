// ParticipantProfile.jsx
import React, { useState } from "react";

const ParticipantProfile = ({ participant, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: participant.name || "",
    image: participant.image || "",
    contact: participant.contact || "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setEditing(false);
  };

  return (
    <div>
      <h2>Participant Profile</h2>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image URL"
          />
          <input
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact"
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p>Name: {participant.name}</p>
          <p>
            Image: <img src={participant.image} alt="Profile" width={100} />
          </p>
          <p>Contact: {participant.contact}</p>
          <button onClick={() => setEditing(true)}>Update</button>
        </div>
      )}
    </div>
  );
};

export default ParticipantProfile;
