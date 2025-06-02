function updateSummary() {
  const summary = document.getElementById("summary");
  summary.innerHTML = "";

  document.querySelectorAll(".person").forEach(person => {
    let name = person.dataset.name;
    let location = "в списке";
    let time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const parent = person.parentElement;
    if (parent.classList.contains("cabinet")) {
      location = parent.dataset.id;
    }

    // Сохраняем время обновления для каждого
    person.dataset.updated = time;

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

  Object.entries(data).forEach(([name, { location: cabinetId, time }]) => {
    const person = document.querySelector(`.person[data-name="${name}"]`);
    const cabinet = document.querySelector(`.cabinet[data-id="${cabinetId}"]`);
    const start = document.getElementById("peopleList");

    if (cabinetId && cabinet) {
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

  Object.entries(data).forEach(([name, { location, time }]) => {
    const locationText = location || "в списке";
    const timeText = time || "--:--";
    const li = document.createElement("li");
    li.textContent = `${name} — ${locationText} (${timeText})`;
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
      selectedPerson = null;
      updateSummary();
    }
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    const peopleList = document.getElementById("peopleList");
    document.querySelectorAll(".person").forEach(person => {
      peopleList.appendChild(person);
      person.dataset.updated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
    updateSummary();
  });
});
