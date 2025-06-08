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
    const origin = person.dataset.origin || "";

    if (parent.classList.contains("cabinet")) {
      data[name] = { location: parent.dataset.id, time, origin };
    } else {
      data[name] = { location: null, time, origin };
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
    const origin = value.origin || "";

    const person = document.querySelector(`.person[data-name="${name}"]`);
    if (!person) return;

    // Восстановим data-origin если не было
    if (!person.dataset.origin && origin) {
      person.dataset.origin = origin;
    }

    const cabinet = cabinetId ? document.querySelector(`.cabinet[data-id="${cabinetId}"]`) : null;
    const start = origin ? document.getElementById(origin) : null;

    if (cabinet) {
      cabinet.appendChild(person);
    } else if (start) {
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
  // Проставим data-origin на старте
  document.querySelectorAll(".people").forEach(group => {
    const groupId = group.id;
    group.querySelectorAll(".person").forEach(person => {
      person.dataset.origin = groupId;
    });
  });

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
      selectedPerson.dataset.updated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      selectedPerson = null;
      updateSummary();
    }
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    let msg = confirm("Вы точно хотите сбросить?");
    if (msg) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      document.querySelectorAll(".person").forEach(person => {
        const originId = person.dataset.origin;
        const originContainer = document.getElementById(originId);
        if (originContainer) {
          originContainer.appendChild(person);
        }
        person.dataset.updated = now;
      });

      updateSummary();
    }
  });
});

