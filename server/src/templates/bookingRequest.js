export const getBookingRequestHtml = (guestName, listingTitle, checkIn, checkOut) => `
  <h2>New Booking Request</h2>
  <p>${guestName} wants to book ${listingTitle} from ${new Date(checkIn).toDateString()} to ${new Date(checkOut).toDateString()}.</p>
  <p>Please log in to your host dashboard to accept or decline.</p>
`;
