// Sample data for available venues
const venues = [
  { id: "M413", name: "M413", capacity: 50, facilities: "Projector, Whiteboard", booked: false },
  { id: "B105", name: "B105", capacity: 30, facilities: "Projector, Air Conditioning", booked: false },
  { id: "M101", name: "M101", capacity: 100, facilities: "Projector, Sound System", booked: false },
  { id: "Auditorium", name: "Auditorium", capacity: 300, facilities: "Stage, Sound System, Projector", booked: false },
];

// Function to render available venues
function renderVenues() {
  const venueCards = document.querySelector(".venue-cards");
  venueCards.innerHTML = "";

  venues.forEach((venue) => {
    if (!venue.booked) {
      const card = document.createElement("div");
      card.className = "venue-card";
      card.innerHTML = `
        <h3>${venue.name}</h3>
        <p><strong>Capacity:</strong> ${venue.capacity} students</p>
        <p><strong>Facilities:</strong> ${venue.facilities}</p>
        <a href="booking.html?venue=${venue.id}" class="btn">Book Now</a>
      `;
      venueCards.appendChild(card);
    }
  });
}

// Function to render booked venues
function renderBookedVenues() {
  const bookedCards = document.getElementById("booked-cards");
  bookedCards.innerHTML = "";

  const bookedVenues = venues.filter((venue) => venue.booked);

  if (bookedVenues.length === 0) {
    bookedCards.innerHTML = "<p>No venues have been booked yet.</p>";
    return;
  }

  bookedVenues.forEach((venue) => {
    const card = document.createElement("div");
    card.className = "venue-card";
    card.innerHTML = `
      <h3>${venue.name}</h3>
      <p><strong>Capacity:</strong> ${venue.capacity} students</p>
      <p><strong>Facilities:</strong> ${venue.facilities}</p>
      <button class="btn cancel-btn" data-id="${venue.id}">Cancel Booking</button>
    `;
    bookedCards.appendChild(card);
  });

  // Add event listeners to cancel buttons
  document.querySelectorAll(".cancel-btn").forEach((button) => {
    button.addEventListener("click", () => cancelBooking(button.dataset.id));
  });
}

// Function to cancel a booking
function cancelBooking(venueId) {
  const venue = venues.find((v) => v.id === venueId);
  if (venue) {
    venue.booked = false;
    saveToLocalStorage();
    renderVenues();
    renderBookedVenues();
  }
}

// Save booked venues to local storage
function saveToLocalStorage() {
  localStorage.setItem("bookedVenues", JSON.stringify(venues));
}

// Load booked venues from local storage
function loadFromLocalStorage() {
  const storedVenues = JSON.parse(localStorage.getItem("bookedVenues"));
  if (storedVenues) {
    venues.forEach((venue, index) => {
      venue.booked = storedVenues[index].booked;
    });
  }
}

// Initialize the page
function init() {
  loadFromLocalStorage();
  renderVenues();
  renderBookedVenues();
}

// Run the initialization function when the page loads
document.addEventListener("DOMContentLoaded", init);

// Helper function to get CSS class for status
function getStatusClass(status) {
  switch (status) {
    case "approved":
      return "status-approved";
    case "pending":
      return "status-pending";
    case "rejected":
      return "status-rejected";
    default:
      return "";
  }
}

// New functions to fetch and render all bookings for logged-in user on profile page

function renderUserVenueBookings() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const venueBookingsBody = document.getElementById("venue-bookings-body");
  const noVenueBookings = document.getElementById("no-venue-bookings");

  if (!loggedInUser || !venueBookingsBody || !noVenueBookings) return;

  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  const userBookings = bookings.filter(
    (booking) => booking.email === loggedInUser.email
  );

  venueBookingsBody.innerHTML = "";

  if (userBookings.length === 0) {
    noVenueBookings.style.display = "block";
    return;
  } else {
    noVenueBookings.style.display = "none";
  }

  userBookings.forEach((booking) => {
    const venue = venues.find((v) => v.id === booking.venue);
    const statusClass = getStatusClass(booking.status);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${venue ? venue.name : booking.venue}</td>
      <td>${booking.date}</td>
      <td>${booking.startTime} - ${booking.endTime}</td>
      <td class="${statusClass}">${booking.status || "pending"}</td>
      <td><button class="cancel-btn" data-id="${booking.id}">Cancel</button></td>
    `;
    venueBookingsBody.appendChild(row);
  });

  // Add cancel booking event listeners
  venueBookingsBody.querySelectorAll(".cancel-btn").forEach((button) => {
    button.addEventListener("click", () => {
      cancelUserVenueBooking(button.dataset.id);
    });
  });
}

function cancelUserVenueBooking(bookingId) {
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings = bookings.filter((booking) => booking.id !== bookingId);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  renderUserVenueBookings();
}

function renderUserEquipmentBookings() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const equipmentBookingsBody = document.getElementById("equipment-bookings-body");
  const noEquipmentBookings = document.getElementById("no-equipment-bookings");

  if (!loggedInUser || !equipmentBookingsBody || !noEquipmentBookings) return;

  const equipmentBookings = JSON.parse(localStorage.getItem("equipmentBookings")) || [];
  const userEquipmentBookings = equipmentBookings.filter(
    (booking) => booking.email === loggedInUser.email
  );

  equipmentBookingsBody.innerHTML = "";

  if (userEquipmentBookings.length === 0) {
    noEquipmentBookings.style.display = "block";
    return;
  } else {
    noEquipmentBookings.style.display = "none";
  }

  userEquipmentBookings.forEach((booking) => {
    const equipmentItem = window.equipment ? window.equipment.find(e => e.id === booking.equipmentId) : null;
    const statusClass = getStatusClass(booking.status);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${equipmentItem ? equipmentItem.name : booking.equipmentId}</td>
      <td>${booking.date}</td>
      <td>${booking.startTime} - ${booking.endTime}</td>
      <td>${booking.quantity || 1}</td>
      <td class="${statusClass}">${booking.status || "pending"}</td>
      <td><button class="cancel-btn" data-id="${booking.id}">Cancel</button></td>
    `;
    equipmentBookingsBody.appendChild(row);
  });

  // Add cancel equipment booking event listeners
  equipmentBookingsBody.querySelectorAll(".cancel-btn").forEach((button) => {
    button.addEventListener("click", () => {
      cancelUserEquipmentBooking(button.dataset.id);
    });
  });
}

function cancelUserEquipmentBooking(bookingId) {
  let equipmentBookings = JSON.parse(localStorage.getItem("equipmentBookings")) || [];
  equipmentBookings = equipmentBookings.filter((booking) => booking.id !== bookingId);
  localStorage.setItem("equipmentBookings", JSON.stringify(equipmentBookings));
  renderUserEquipmentBookings();
}
