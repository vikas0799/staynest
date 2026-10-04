export const getBookingStatusHtml = (guestName, listingTitle, status) => `
  <h2>Booking ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
  <p>Hi ${guestName},</p>
  <p>Your booking for ${listingTitle} has been <strong>${status}</strong> by the host.</p>
`;
