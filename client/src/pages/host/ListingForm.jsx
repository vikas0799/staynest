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

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function ListingForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [touched, setTouched] = useState({});
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

  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleBlur = (key) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const errors = {};
  const titleTrimmed = form.title.trim();
  if (titleTrimmed.length < 10 || form.title.length > 100) {
    errors.title = 'Title must be between 10 and 100 characters.';
  }

  const descTrimmed = form.description.trim();
  if (descTrimmed.length < 30) {
    errors.description = 'Description must be at least 30 characters.';
  }

  const priceNum = Number(form.pricePerNight);
  if (form.pricePerNight === '' || isNaN(priceNum) || priceNum <= 0) {
    errors.pricePerNight = 'Price must be greater than 0.';
  }

  if (form.imageUrl && form.imageUrl.trim() && !isValidUrl(form.imageUrl.trim())) {
    errors.imageUrl = 'Please enter a valid image URL.';
  }

  const hasErrors = Boolean(errors.title || errors.description || errors.pricePerNight || errors.imageUrl);
  const isFormValid =
    !hasErrors &&
    titleTrimmed.length >= 10 &&
    form.title.length <= 100 &&
    descTrimmed.length >= 30 &&
    form.pricePerNight !== '' &&
    priceNum > 0 &&
    form.city.trim() !== '' &&
    form.state.trim() !== '' &&
    form.address.trim() !== '';

  // TODO: replace the image URL field with real image upload (Cloudinary / multer).
  const submit = async (e) => {
    e.preventDefault();
    setTouched({
      title: true,
      description: true,
      pricePerNight: true,
      imageUrl: true,
    });
    if (!isFormValid) return;

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

  return (
    <form className="card form wide" onSubmit={submit}>
      <h1>{isEdit ? 'Edit listing' : 'Create a new listing'}</h1>
      <input
        required
        placeholder="Title"
        value={form.title}
        onChange={set('title')}
        onBlur={handleBlur('title')}
      />
      {touched.title && errors.title && <p className="error small">{errors.title}</p>}

      <textarea
        required
        placeholder="Describe your place"
        value={form.description}
        onChange={set('description')}
        onBlur={handleBlur('description')}
      />
      {touched.description && errors.description && <p className="error small">{errors.description}</p>}

      <div className="row">
        <select value={form.type} onChange={set('type')}>
          {STAY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <input
          required
          type="number"
          min="0"
          placeholder="Price per night (₹)"
          value={form.pricePerNight}
          onChange={set('pricePerNight')}
          onBlur={handleBlur('pricePerNight')}
        />
      </div>
      {touched.pricePerNight && errors.pricePerNight && <p className="error small">{errors.pricePerNight}</p>}

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
      <input
        placeholder="Image URL (optional)"
        value={form.imageUrl}
        onChange={set('imageUrl')}
        onBlur={handleBlur('imageUrl')}
      />
      {touched.imageUrl && errors.imageUrl && <p className="error small">{errors.imageUrl}</p>}

      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={!isFormValid}>{isEdit ? 'Save changes' : 'Publish listing'}</button>
    </form>
  );
}
