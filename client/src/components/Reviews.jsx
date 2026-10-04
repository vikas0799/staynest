import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import StarRating from './StarRating.jsx';
import { formatDate } from '../utils/format.js';

export default function Reviews({ listingId, onReviewAdded }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });

  const load = () => api.get(`/listings/${listingId}/reviews`).then(({ data }) => setReviews(data));
  useEffect(() => {
    load();
  }, [listingId]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/listings/${listingId}/reviews`, form);
      setForm({ rating: 5, comment: '' });
      load();
      onReviewAdded?.();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleEdit = (r) => {
    setEditingId(r._id);
    setEditForm({ rating: r.rating, comment: r.comment });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setError('');
  };

  const saveEdit = async (reviewId) => {
    setError('');
    try {
      await api.put(`/listings/${listingId}/reviews/${reviewId}`, editForm);
      setEditingId(null);
      load();
      onReviewAdded?.();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setError('');
    try {
      await api.delete(`/listings/${listingId}/reviews/${reviewId}`);
      load();
      onReviewAdded?.();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const userHasReviewed = user && reviews.some((r) => r.user?._id === user._id);

  return (
    <section className="reviews">
      <h2>Reviews ({reviews.length})</h2>
      {reviews.length === 0 && <p className="muted">No reviews yet.</p>}
      {reviews.map((r) => {
        const isOwner = user && r.user?._id === user._id;
        const isEditing = editingId === r._id;
        
        return (
          <div key={r._id} className="review">
            <div className="row-between">
              <strong>{r.user?.name}</strong>
              <span className="muted small">{formatDate(r.createdAt)}</span>
            </div>
            
            {isEditing ? (
              <div className="card form" style={{ marginTop: '12px' }}>
                <StarRating value={editForm.rating} onChange={(rating) => setEditForm({ ...editForm, rating })} />
                <textarea
                  required
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                />
                <div className="row" style={{ marginTop: '8px' }}>
                  <button className="btn" onClick={() => saveEdit(r._id)}>Save</button>
                  <button className="btn btn-outline" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="row-between">
                  <div className="stars-static">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  {isOwner && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn small" onClick={() => handleEdit(r)}>Edit</button>
                      <button className="btn btn-outline small" onClick={() => handleDelete(r._id)}>Delete</button>
                    </div>
                  )}
                </div>
                <p>{r.comment}</p>
              </>
            )}
          </div>
        );
      })}

      {user && !userHasReviewed && (
        <form className="card form" onSubmit={submit}>
          <h3>Write a review</h3>
          <StarRating value={form.rating} onChange={(rating) => setForm({ ...form, rating })} />
          <textarea
            required
            placeholder="How was your stay?"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />
          {error && <p className="error">{error}</p>}
          <button className="btn">Submit review</button>
        </form>
      )}
    </section>
  );
}
