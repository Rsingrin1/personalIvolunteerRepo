import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tags");
        setTags(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const createTag = async (e) => {
    e.preventDefault();
    if (!form.name || form.name.trim() === "") return;
    setCreating(true);
    try {
      // Only send non-empty optional fields to avoid creating empty-string slugs
      const payload = { name: form.name.trim() };
      if (form.slug && form.slug.trim() !== "") payload.slug = form.slug.trim();
      if (form.description && form.description.trim() !== "") payload.description = form.description.trim();

      const res = await axios.post("http://localhost:5000/api/tags", payload);
      setTags((prev) => [res.data, ...prev]);
      setForm({ name: "", slug: "", description: "" });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setCreating(false);
    }
  };

  const deleteTag = async (id) => {
    if (!confirm("Delete this tag?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/tags/${id}`);
      setTags((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div>Loading tags…</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <Link to="/" className="btn btn-secondary">
        Back
      </Link>
      <h2>Create Tag</h2>
      <form onSubmit={createTag} style={{ marginBottom: "1rem" }}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="Slug (optional)"
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (optional)"
        />
        <button type="submit" disabled={creating} className="btn btn-primary">
          {creating ? "Creating…" : "Create"}
        </button>
      </form>
      <h2>Tags</h2>
      {tags.length === 0 ? (
        <div>No tags found.</div>
      ) : (
        <ul>
          {tags.map((tag) => (
            <li key={tag._id} style={{ marginBottom: "0.5rem" }}>
              <strong>{tag.name}</strong>
              {tag.slug ? <span> — {tag.slug}</span> : null}
              {tag.description ? <div>{tag.description}</div> : null}
              <div>
                <button
                  className="btn btn-danger"
                  style={{ marginTop: "0.25rem" }}
                  onClick={() => deleteTag(tag._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagsPage;
