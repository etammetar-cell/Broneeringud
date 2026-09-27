const rowsElement = document.querySelector("#bookingRows");
const statusElement = document.querySelector("#statusMessage");
const searchInput = document.querySelector("#searchInput");
const serviceFilter = document.querySelector("#serviceFilter");
const sortSelect = document.querySelector("#sortSelect");
const refreshButton = document.querySelector("#refreshButton");

let bookings = [];
const API_URL = "https://metshein.com/kordamine/json/broneeringud.json";

async function loadBookings() {
  statusElement.textContent = "Laadin broneeringuid…";
  rowsElement.replaceChildren();

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP viga: ${response.status}`);
    const json = await response.json();
    const rawBookings = findBookingArray(json);
    bookings = rawBookings.map(normalizeBooking).filter(item => item.client && item.service);
    if (!bookings.length) throw new Error("API vastuses puuduvad broneeringud");
    updateStats();
    renderBookings();
    showToast(`Laaditud ${bookings.length} broneeringut`);
  } catch (error) {
    console.error("Andmete laadimine ebaõnnestus:", error);
    statusElement.textContent = "Andmete laadimine ebaõnnestus. Proovi lehte värskendada.";
  }
}

function findBookingArray(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  const directArray = Object.values(data).find(Array.isArray);
  return directArray || [];
}

function normalizeBooking(item) {
  const get = (...names) => {
    const key = Object.keys(item).find(current =>
      names.includes(current.toLocaleLowerCase("et").replaceAll("_", ""))
    );
    return key ? String(item[key]) : "";
  };

  return {
    client: get("klient", "kliendinimi", "client", "customer", "nimi", "name"),
    service: get("teenus", "teenusenimi", "service", "treatment"),
    date: get("kuupäev", "kuupaev", "date", "bookingdate"),
    time: get("kellaaeg", "aeg", "time", "bookingtime")
  };
}

function renderBookings() {
  const query = searchInput.value.trim().toLocaleLowerCase("et");
  const selectedService = serviceFilter.value;
  const visibleBookings = bookings
    .filter(item => item.client.toLocaleLowerCase("et").includes(query))
    .filter(item => !selectedService || item.service === selectedService)
    .sort(sortBookings);

  rowsElement.replaceChildren();
  statusElement.textContent = visibleBookings.length ? "" : "Sobivaid broneeringuid ei leitud.";
  document.querySelector("#resultCount").textContent = `${visibleBookings.length} tulemust`;

  visibleBookings.forEach(booking => {
    const row = document.createElement("tr");
    const clientCell = document.createElement("td");
    const serviceCell = document.createElement("td");
    const dateCell = document.createElement("td");
    const timeCell = document.createElement("td");
    const badge = document.createElement("span");

    row.className = `row-${booking.service.toLocaleLowerCase("et")}`;
    clientCell.textContent = booking.client;
    badge.textContent = booking.service;
    badge.className = `service service-${booking.service.toLocaleLowerCase("et")}`;
    serviceCell.append(badge);
    const parsedDate = parseDate(booking.date);
    dateCell.textContent = parsedDate ? new Intl.DateTimeFormat("et-EE", {
      day: "2-digit", month: "long", year: "numeric"
    }).format(parsedDate) : booking.date;
    timeCell.textContent = booking.time;

    clientCell.dataset.label = "Klient";
    serviceCell.dataset.label = "Teenus";
    dateCell.dataset.label = "Kuupäev";
    timeCell.dataset.label = "Kellaaeg";

    row.append(clientCell, serviceCell, dateCell, timeCell);
    rowsElement.append(row);
  });
}

function parseDate(value) {
  if (!value) return null;
  const estonianDate = value.match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})$/);
  const date = estonianDate
    ? new Date(`${estonianDate[3]}-${estonianDate[2].padStart(2, "0")}-${estonianDate[1].padStart(2, "0")}T00:00:00`)
    : new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sortBookings(a, b) {
  if (sortSelect.value === "client") return a.client.localeCompare(b.client, "et");
  const first = new Date(`${parseDate(a.date)?.toISOString().slice(0, 10) || a.date}T${a.time}`);
  const second = new Date(`${parseDate(b.date)?.toISOString().slice(0, 10) || b.date}T${b.time}`);
  return sortSelect.value === "date-desc" ? second - first : first - second;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function updateStats() {
  document.querySelector("#bookingCount").textContent = bookings.length;
  document.querySelector("#clientCount").textContent = new Set(bookings.map(item => item.client)).size;
  document.querySelector("#serviceCount").textContent = new Set(bookings.map(item => item.service)).size;
}

searchInput.addEventListener("input", renderBookings);
serviceFilter.addEventListener("change", renderBookings);
sortSelect.addEventListener("change", renderBookings);
refreshButton.addEventListener("click", loadBookings);

loadBookings();
