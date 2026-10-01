export const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    amount
  );

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const STAY_TYPES = ['homestay', 'hotel', 'villa', 'hostel', 'cottage'];

export const nightsBetween = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
  return diff > 0 ? Math.round(diff) : 0;
};

export const toDateInputValue = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const addDays = (dateStr, days = 1) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d + days);
  return toDateInputValue(target);
};
