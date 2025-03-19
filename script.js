let selectedVenueId = null;

function bookVenue(venueId) {
  selectedVenueId = venueId;
  document.getElementById('venue-list').style.display = 'none';
  document.getElementById('booking-form').style.display = 'block';
}

document.getElementById('booking-details').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const date = document.getElementById('date').value;
  const startTime = document.getElementById('start-time').value;
  const endTime = document.getElementById('end-time').value;

  // Basic validation
  if (!name || !date || !startTime || !endTime) {
    alert('Please fill out all fields.');
    return;
  }

  const confirmationDetails = `
    Venue ID: ${selectedVenueId}<br>
    Name: ${name}<br>
    Date: ${date}<br>
    Time: ${startTime} - ${endTime}
  `;

  document.getElementById('confirmation-details').innerHTML = confirmationDetails;
  document.getElementById('booking-form').style.display = 'none';
  document.getElementById('confirmation').style.display = 'block';
});

function resetPage() {
  selectedVenueId = null;
  document.getElementById('name').value = '';
  document.getElementById('date').value = '';
  document.getElementById('start-time').value = '';
  document.getElementById('end-time').value = '';
  document.getElementById('venue-list').style.display = 'grid';
  document.getElementById('confirmation').style.display = 'none';
}