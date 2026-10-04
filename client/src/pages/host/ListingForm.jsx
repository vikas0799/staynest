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
  imageUrl: '',
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
        imageUrl: data.images[0] || '',
      })
    );
  }, [id, isEdit]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  // TODO: replace the image URL field with real image upload (Cloudinary / multer).
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const { title, description, type, city, state, address, imageUrl, amenities } = form;
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
    if (imageUrl) payload.images = [imageUrl];
    try {
      if (isEdit) await api.put(`/listings/${id}`, payload);
      else await api.post('/listings', payload);
      navigate('/host');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const isTitleTooShortOrLong = form.title.length > 0 && (form.title.length < 10 || form.title.length > 100);
  const isDescTooShort = form.description.length > 0 && form.description.length < 30;
  const isPriceZeroOrEmpty = form.pricePerNight === '' || Number(form.pricePerNight) === 0;
  let isImageNotValidUrl = false;
  if (form.imageUrl.length > 0) {
    try {
      new URL(form.imageUrl);
    } catch (e) {
      isImageNotValidUrl = true;
    }
  }

  const isFormSubmitDisabled = isTitleTooShortOrLong || isDescTooShort || isPriceZeroOrEmpty || isImageNotValidUrl || !form.title || !form.description;

  return (
    <form className="card form wide" onSubmit={submit}>
      <h1>{isEdit ? 'Edit listing' : 'Create a new listing'}</h1>
      
      <input required placeholder="Title" value={form.title} onChange={set('title')} />
      {isTitleTooShortOrLong && <p className="error small" style={{ margin: '-8px 0 0' }}>Title must be between 10 and 100 characters.</p>}
      
      <textarea required placeholder="Describe your place" value={form.description} onChange={set('description')} />
      {isDescTooShort && <p className="error small" style={{ margin: '-8px 0 0' }}>Description must be at least 30 characters.</p>}
      
      <div className="row">
        <select value={form.type} onChange={set('type')}>
          {STAY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <input required type="number" min="0" placeholder="Price per night (₹)" value={form.pricePerNight} onChange={set('pricePerNight')} />
          {isPriceZeroOrEmpty && <p className="error small" style={{ margin: '4px 0 0' }}>Price cannot be 0 or empty.</p>}
        </div>
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
      
      <input placeholder="Image URL (optional)" value={form.imageUrl} onChange={set('imageUrl')} />
      {isImageNotValidUrl && <p className="error small" style={{ margin: '-8px 0 0' }}>Please enter a valid URL.</p>}
      
      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={isFormSubmitDisabled}>{isEdit ? 'Save changes' : 'Publish listing'}</button>
    </form>
  );
}
