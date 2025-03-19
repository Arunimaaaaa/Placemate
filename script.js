let selectedVenueId = null;

const venues = [
  {
    id: 1,
    name: "Grand Ballroom",
    capacity: "200 people",
    price: "$1000/day",
    location: "Downtown",
  },
  {
    id: 2,
    name: "Cozy Lounge",
    capacity: "50 people",
    price: "$300/day",
    location: "Midtown",
  },
  {
    id: 3,
    name: "Rooftop Garden",
    capacity: "100 people",
    price: "$700/day",
    location: "Uptown",
  },
  {
    id: 4,
    name: "Conference Hall",
    capacity: "150 people",
    price: "$800/day",
    location: "Business District",
  },
  {
    id: 5,
    name: "Beachside Pavilion",
    capacity: "120 people",
    price: "$900/day",
    location: "Seaside",
  },
];

function renderVenues() {
  const venueContainer = document.querySelector(".venue-container");
  const loading = document.getElementById("loading");

  loading.style.display = "block"; // Show loading
  venueContainer.innerHTML = ""; // Clear existing content

  setTimeout(() => {
    venueContainer.innerHTML = venues
      .map(
        (venue) => `
        <div class="venue-card" data-venue-id="${venue.id}">
          <h3>${venue.name}</h3>
          <p>Capacity: ${venue.capacity}</p>
          <p>Price: ${venue.price}</p>
          <p>📍 Location: ${venue.location}</p>
          <button onclick="bookVenue(${venue.id})">Book Now</button>
        </div>
      `
      )
      .join("");
    loading.style.display = "none"; // Hide loading
  }, 1000); // Simulate a delay
}

function bookVenue(venueId) {
  selectedVenueId = venueId;
  document.getElementById("venue-list").style.display = "none";
  document.getElementById("booking-form").style.display = "block";
}

document.getElementById("booking-details").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;
  const startTime = document.getElementById("start-time").value;
  const endTime = document.getElementById("end-time").value;

  // Basic validation
  if (!name || !date || !startTime || !endTime) {
    alert("Please fill out all fields.");
    return;
  }

  // Check if end time is after start time
  if (startTime >= endTime) {
    alert("End time must be after start time.");
    return;
  }

  const confirmationDetails = `
    Venue ID: ${selectedVenueId}<br>
    Name: ${name}<br>
    Date: ${date}<br>
    Time: ${startTime} - ${endTime}
  `;

  document.getElementById("confirmation-details").innerHTML = confirmationDetails;
  document.getElementById("booking-form").style.display = "none";
  document.getElementById("confirmation").style.display = "block";
});

function resetPage() {
  selectedVenueId = null;
  document.getElementById("name").value = "";
  document.getElementById("date").value = "";
  document.getElementById("start-time").value = "";
  document.getElementById("end-time").value = "";
  document.getElementById("venue-list").style.display = "block";
  document.getElementById("confirmation").style.display = "none";
}

// Render venues when the page loads
window.onload = renderVenues;
