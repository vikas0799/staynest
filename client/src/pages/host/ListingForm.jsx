import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../../api/client.js';
import { STAY_TYPES } from '../../utils/format.js';

const empty = {
  title: '',
  description: '',
  type: 'homestay',
  city: '',
  state: '',
  address: '',
  pricePerNight: '',
  maxGuests: 2,
  bedrooms: 1,
  amenities: '',
  imageUrls: [''],
};

export default function ListingForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/listings/${id}`).then(({ data }) =>
      setForm({
        ...empty,
        ...data,
        amenities: data.amenities.join(', '),
        imageUrls: data.images.length > 0 ? data.images : [''],
      })
    );
  }, [id, isEdit]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const setImageUrl = (index, value) => {
    const updated = [...form.imageUrls];
    updated[index] = value;
    setForm({ ...form, imageUrls: updated });
  };

  const addImageUrl = () => setForm({ ...form, imageUrls: [...form.imageUrls, ''] });

  const removeImageUrl = (index) => {
    const updated = form.imageUrls.filter((_, i) => i !== index);
    setForm({ ...form, imageUrls: updated.length > 0 ? updated : [''] });
  };

  // TODO: replace the image URL fields with real image upload (Cloudinary / multer).
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const { title, description, type, city, state, address, amenities } = form;
    const images = form.imageUrls.map((u) => u.trim()).filter(Boolean);
    const payload = {
      title,
      description,
      type,
      city,
      state,
      address,
      pricePerNight: Number(form.pricePerNight),
      maxGuests: Number(form.maxGuests),
      bedrooms: Number(form.bedrooms),
      amenities: amenities.split(',').map((a) => a.trim()).filter(Boolean),
    };
    if (images.length > 0) payload.images = images;
    try {
      if (isEdit) await api.put(`/listings/${id}`, payload);
      else await api.post('/listings', payload);
      navigate('/host');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form className="card form wide" onSubmit={submit}>
      <h1>{isEdit ? 'Edit listing' : 'Create a new listing'}</h1>
      <input required placeholder="Title" value={form.title} onChange={set('title')} />
      <textarea required placeholder="Describe your place" value={form.description} onChange={set('description')} />
      <div className="row">
        <select value={form.type} onChange={set('type')}>
          {STAY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <input required type="number" min="0" placeholder="Price per night (₹)" value={form.pricePerNight} onChange={set('pricePerNight')} />
      </div>
      <div className="row">
        <input required placeholder="City" value={form.city} onChange={set('city')} />
        <input required placeholder="State" value={form.state} onChange={set('state')} />
      </div>
      <input required placeholder="Address" value={form.address} onChange={set('address')} />
      <div className="row">
        <label className="grow">Max guests
          <input type="number" min="1" value={form.maxGuests} onChange={set('maxGuests')} />
        </label>
        <label className="grow">Bedrooms
          <input type="number" min="0" value={form.bedrooms} onChange={set('bedrooms')} />
        </label>
      </div>
      <input placeholder="Amenities (comma separated: WiFi, AC, Parking)" value={form.amenities} onChange={set('amenities')} />

      <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <legend style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>Image URLs</legend>
        {form.imageUrls.map((url, i) => (
          <div key={i} className="row">
            <input
              placeholder={`Image URL ${i + 1}${i === 0 ? ' (optional)' : ''}`}
              value={url}
              onChange={(e) => setImageUrl(i, e.target.value)}
              style={{ flex: 1 }}
            />
            {form.imageUrls.length > 1 && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => removeImageUrl(i)}
                aria-label={`Remove image URL ${i + 1}`}
                style={{ flexShrink: 0 }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="btn btn-ghost"
          onClick={addImageUrl}
          style={{ alignSelf: 'flex-start' }}
        >
          + Add image URL
        </button>
      </fieldset>

      {error && <p className="error">{error}</p>}
      <button className="btn">{isEdit ? 'Save changes' : 'Publish listing'}</button>
    </form>
  );
}
