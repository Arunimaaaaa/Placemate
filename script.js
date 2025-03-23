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
