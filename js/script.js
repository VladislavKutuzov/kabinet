let selectedPerson = null;

function updateSummary() {
  const summary = document.getElementById("summary");
  summary.innerHTML = "";

  document.querySelectorAll(".person").forEach(person => {
    const name = person.dataset.name;
    const parent = person.parentElement;
    let location = "в списке";

    if (parent.classList.contains("cabinet")) {
      location = parent.dataset.id;
    }

    // НЕ обновляем время здесь, берем из data-updated
    const time = person.dataset.updated || "--:--";

    const li = document.createElement("li");
    li.textContent = `${name} — ${location} (${time})`;
    summary.appendChild(li);
  });

  saveToLocalStorage();
}

function saveToLocalStorage() {
  const data = {};
  document.querySelectorAll(".person").forEach(person => {
    const name = person.dataset.name;
    const parent = person.parentElement;
    const time = person.dataset.updated || null;

    if (parent.classList.contains("cabinet")) {
      data[name] = { location: parent.dataset.id, time };
    } else {
      data[name] = { location: null, time };
    }
  });

  localStorage.setItem("peopleLocations", JSON.stringify(data));
}

function loadFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("peopleLocations"));
  if (!data) return;

  Object.entries(data).forEach(([name, value]) => {
    if (!value || typeof value !== "object") return;

    const cabinetId = value.location || null;
    const time = value.time || null;

    const person = document.querySelector(`.person[data-name="${name}"]`);
    if (!person) return;

    const cabinet = cabinetId ? document.querySelector(`.cabinet[data-id="${cabinetId}"]`) : null;
    const start = document.getElementById("peopleList");

    if (cabinet) {
      cabinet.appendChild(person);
    } else {
      start.appendChild(person);
    }

    if (time) {
      person.dataset.updated = time;
    }
  });
}

function renderSummaryFromStoredData() {
  const data = JSON.parse(localStorage.getItem("peopleLocations"));
  if (!data) return;
  const summary = document.getElementById("summary");
  summary.innerHTML = "";

  Object.entries(data).forEach(([name, value]) => {
    if (!value || typeof value !== "object") return;

    const location = value.location || "в списке";
    const time = value.time || "--:--";
    const li = document.createElement("li");
    li.textContent = `${name} — ${location} (${time})`;
    summary.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  renderSummaryFromStoredData();

  document.addEventListener("click", e => {
    const person = e.target.closest(".person");
    if (person) {
      document.querySelectorAll(".person").forEach(p => p.classList.remove("selected"));
      selectedPerson = person;
      selectedPerson.classList.add("selected");
      return;
    }

    const cabinet = e.target.closest(".cabinet");
    if (cabinet && selectedPerson) {
      cabinet.appendChild(selectedPerson);
      selectedPerson.classList.remove("selected");
      // Обновляем время только у перемещенного человека
      selectedPerson.dataset.updated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      selectedPerson = null;
      updateSummary();
    }
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    const peopleList = document.getElementById("peopleList");
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    document.querySelectorAll(".person").forEach(person => {
      peopleList.appendChild(person);
      // Обновляем время у всех при сбросе
      person.dataset.updated = now;
    });
    updateSummary();
  });
});
