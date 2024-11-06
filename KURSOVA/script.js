const eventsContainer = document.getElementById('eventsContainer');
const eventModal = document.getElementById('eventModal');
const closeModalButton = document.getElementById('closeModal');
const modalEventName = document.getElementById('modalEventName');
const modalEventDescription = document.getElementById('modalEventDescription');
const modalEventParticipants = document.getElementById('modalEventParticipants');
const searchInput = document.getElementById('search');
const sportFilter = document.getElementById('sportFilter');
const locationFilter = document.getElementById('locationFilter');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const sortByNameButton = document.getElementById('sortByName');
const sortByDateButton = document.getElementById('sortByDate');

let eventsData = []; // Зберігаємо дані про події

// Функція для завантаження даних з 16-events.json
async function loadEvents() {
  try {
    const response = await fetch('16-events.json');
    const data = await response.json();
    eventsData = data;
    displayEvents(eventsData); // Відображаємо події після завантаження
    populateFilters(); // Заповнюємо фільтри після завантаження
  } catch (error) {
    console.error('Помилка при завантаженні даних:', error);
    // Додайте обробку помилки для користувача, наприклад, виведення повідомлення на сторінці
  }
}

// Функція для відображення подій на сторінці
function displayEvents(events) {
  eventsContainer.innerHTML = ''; // Очищуємо контейнер перед відображенням

  if (events.length === 0) {
    eventsContainer.innerHTML = '<p>Немає подій для відображення.</p>';
    return;
  }

  events.forEach(event => {
    const eventCard = document.createElement('div');
    eventCard.classList.add('event-card');

    eventCard.innerHTML = `
      <div class="event-content">
        <h2>${event.name}</h2>
        <p>Вид спорту: ${event.sport}</p>
        <p>Дата: ${event.date}</p>
        <p>Локація: ${event.location}</p>
        <p>${event.description}</p>
      </div>
    `;

    eventCard.addEventListener('click', () => showEventDetails(event));
    eventsContainer.appendChild(eventCard);
  });
}

// Функція для відображення деталей події в модальному вікні
function showEventDetails(event) {
  modalEventName.textContent = event.name;
  modalEventDescription.textContent = event.description;

  // Додаємо зображення до модального вікна
  const imageContainer = document.getElementById('modalEventImage');
  imageContainer.innerHTML = '';
  const eventImage = document.createElement('img');
  eventImage.src = `images/${event.name.toLowerCase().replace(/ /g, '-')}.jpg`;
  eventImage.alt = event.name;
  eventImage.onerror = function() {
    this.onerror=null;
    this.src='images/placeholder.jpg'
  };
  imageContainer.appendChild(eventImage);

  // Додаємо список учасників, якщо є
  modalEventParticipants.innerHTML = '';
  if (event.participants) {
    event.participants.forEach(participant => {
      const li = document.createElement('li');
      li.textContent = participant;
      modalEventParticipants.appendChild(li);
    });
  } else {
    modalEventParticipants.innerHTML = '<li>Список учасників не доступний.</li>';
  }

  eventModal.style.display = 'block';
}

// Функція для закриття модального вікна
function closeModal() {
  eventModal.style.display = 'none';
}

// Функція для фільтрації подій
function filterEvents() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedSport = sportFilter.value;
  const selectedLocation = locationFilter.value;
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  const filteredEvents = eventsData.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm);
    const matchesSport = selectedSport === '' || event.sport === selectedSport;
    const matchesLocation = selectedLocation === '' || event.location === selectedLocation;
    const matchesStartDate = startDate === '' || event.date >= startDate;
    const matchesEndDate = endDate === '' || event.date <= endDate;

    return matchesSearch && matchesSport && matchesLocation && matchesStartDate && matchesEndDate;
  });

  displayEvents(filteredEvents);
}

// Функція для сортування подій за назвою
function sortEventsByName() {
  eventsData.sort((a, b) => a.name.localeCompare(b.name));
  displayEvents(eventsData);
}

// Функція для сортування подій за датою
function sortEventsByDate() {
  eventsData.sort((a, b) => new Date(a.date) - new Date(b.date));
  displayEvents(eventsData);
}

// Функція для заповнення фільтрів
function populateFilters() {
  const sports = new Set();
  const locations = new Set();

  eventsData.forEach(event => {
    sports.add(event.sport);
    locations.add(event.location);
  });

  sports.forEach(sport => {
    const option = document.createElement('option');
    option.value = sport;
    option.textContent = sport;
    sportFilter.appendChild(option);
  });

  locations.forEach(location => {
    const option = document.createElement('option');
    option.value = location;
    option.textContent = location;
    locationFilter.appendChild(option);
  });
}

// Вішаємо обробники подій на фільтри та кнопки сортування
searchInput.addEventListener('input', filterEvents);
sportFilter.addEventListener('change', filterEvents);
locationFilter.addEventListener('change', filterEvents);
startDateInput.addEventListener('change', filterEvents);
endDateInput.addEventListener('change', filterEvents);
sortByNameButton.addEventListener('click', sortEventsByName);
sortByDateButton.addEventListener('click', sortEventsByDate);

// Закриваємо модальне вікно при кліку на кнопку закриття
closeModalButton.addEventListener('click', closeModal);

// Завантажуємо дані при завантаженні сторінки
loadEvents();