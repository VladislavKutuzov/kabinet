let selectedPerson = null;

function updateSummary() {
  const summary = document.getElementById("summary");
  summary.innerHTML = "";

  document.querySelectorAll(".person").forEach(person => {
    let name = person.dataset.name;
    let location = "в списке";

    const parent = person.parentElement;
    if (parent.classList.contains("cabinet")) {
      location = parent.dataset.id;
    }

    const li = document.createElement("li");
    li.textContent = `${name} — ${location}`;
    summary.appendChild(li);
  });

  saveToLocalStorage();
}

function saveToLocalStorage() {
  const data = {};
  document.querySelectorAll(".person").forEach(person => {
    const name = person.dataset.name;
    const parent = person.parentElement;

    if (parent.classList.contains("cabinet")) {
      data[name] = parent.dataset.id;
    } else {
      data[name] = null;
    }
  });

  localStorage.setItem("peopleLocations", JSON.stringify(data));
}

function loadFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("peopleLocations"));
  if (!data) return;

  Object.entries(data).forEach(([name, cabinetId]) => {
    const person = document.querySelector(`.person[data-name="${name}"]`);
    const cabinet = document.querySelector(`.cabinet[data-id="${cabinetId}"]`);
    const start = document.getElementById("peopleList");

    if (cabinetId && cabinet) {
      cabinet.appendChild(person);
    } else {
      start.appendChild(person);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  updateSummary();

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
    });
    updateSummary();
  });
});
