const MY_LIST_STORAGE_KEY = "plantCare.myList";
const FAVORITES_STORAGE_KEY = "plantCare.favorites";

let myList = loadMyList();
let favorites = loadFavorites();

function loadMyList() {
  try {
    const raw = localStorage.getItem(MY_LIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveMyList() {
  localStorage.setItem(MY_LIST_STORAGE_KEY, JSON.stringify(myList));
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

function findPlant(plantId) {
  return PLANTS.find((p) => p.id === plantId);
}

function isInMyList(plantId) {
  return myList.some((entry) => entry.plantId === plantId);
}

function isFavorite(plantId) {
  return favorites.includes(plantId);
}

function toggleFavorite(plantId) {
  favorites = isFavorite(plantId)
    ? favorites.filter((id) => id !== plantId)
    : [...favorites, plantId];
  saveFavorites();
  renderPlantGrid("plant-grid", PLANTS);
  renderFavorites();
}

function addToMyList(plantId) {
  if (isInMyList(plantId)) return;
  myList.push({
    plantId,
    addedAt: getTodayISO(),
    notes: "",
  });
  saveMyList();
  renderPlantGrid("plant-grid", PLANTS);
  renderFavorites();
  renderMyList();
}

function removeFromMyList(plantId) {
  myList = myList.filter((entry) => entry.plantId !== plantId);
  saveMyList();
  renderPlantGrid("plant-grid", PLANTS);
  renderFavorites();
  renderMyList();
}

function updateEntryField(plantId, field, value) {
  const entry = myList.find((e) => e.plantId === plantId);
  if (!entry) return;
  entry[field] = value;
  saveMyList();
}

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function getTodayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


function renderPlantCard(plant) {
  const toxicClass = plant.toxic ? " plant-card__stat-value--warning" : "";
  const toxicLabel = plant.toxic ? "токсично" : "не токсично";
  const added = isInMyList(plant.id);
  const favorite = isFavorite(plant.id);

  return `
    <article class="plant-card">
      <div class="plant-card__image">
        ${plant.image ? `<img class="plant-card__photo" src="${plant.image}" alt="${plant.name}" onerror="this.remove()">` : ""}
        <button
          class="plant-card__favorite${favorite ? " plant-card__favorite--active" : ""}"
          aria-label="${favorite ? "Убрать из избранного" : "Добавить в избранное"}"
          data-plant-id="${plant.id}"
        >&#9733;</button>
        <button
          class="plant-card__add${added ? " plant-card__add--added" : ""}"
          aria-label="${added ? "Уже в списке" : "Добавить в список"}"
          data-plant-id="${plant.id}"
          ${added ? "disabled" : ""}
        >${added ? "&#10003;" : "+"}</button>
        <span class="plant-card__caption">фото &middot; ${plant.name}</span>
      </div>
      <div class="plant-card__body">
        <span class="plant-card__badge">${plant.careLevel}</span>
        <h3 class="plant-card__title">${plant.name}</h3>
        <p class="plant-card__description">${plant.description}</p>
        <div class="plant-card__stats">
          <div class="plant-card__stat">
            <span class="plant-card__stat-label">Полив</span>
            <span class="plant-card__stat-value">${plant.watering}</span>
          </div>
          <div class="plant-card__stat">
            <span class="plant-card__stat-label">Свет</span>
            <span class="plant-card__stat-value">${plant.light}</span>
          </div>
          <div class="plant-card__stat">
            <span class="plant-card__stat-label">Токсично</span>
            <span class="plant-card__stat-value${toxicClass}">${toxicLabel}</span>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderPlantGrid(containerId, plants) {
  const grid = document.getElementById(containerId);
  grid.innerHTML = plants.length
    ? plants.map(renderPlantCard).join("")
    : `<p class="empty-state">Здесь пока пусто.</p>`;
}


function renderFavorites() {
  const favoritePlants = PLANTS.filter((plant) => isFavorite(plant.id));
  const grid = document.getElementById("favorites-grid");
  grid.innerHTML = favoritePlants.length
    ? favoritePlants.map(renderPlantCard).join("")
    : `<p class="empty-state">Избранное пусто. Отмечайте растения звёздочкой в справочнике.</p>`;
}


function renderMyListItem(entry) {
  const plant = findPlant(entry.plantId);
  if (!plant) return "";

  return `
    <article class="mylist-card" data-plant-id="${plant.id}">
      <div class="mylist-card__header">
        <div>
          <h3 class="mylist-card__title">${plant.name}</h3>
          <p class="mylist-card__latin">${plant.latinName}</p>
        </div>
        <button class="mylist-card__remove" data-action="remove" aria-label="Удалить из списка">&times;</button>
      </div>
      <ul class="mylist-card__conditions">
        <li><span class="mylist-card__conditions-label">Полив</span>${plant.watering}</li>
        <li><span class="mylist-card__conditions-label">Свет</span>${plant.light}</li>
        <li><span class="mylist-card__conditions-label">Пересадка</span>${plant.transplant}</li>
        <li><span class="mylist-card__conditions-label">Токсично</span>${plant.toxic ? "да" : "нет"}</li>
      </ul>
      <p class="mylist-card__added">Добавлено: ${formatDate(entry.addedAt)}</p>
      <label class="mylist-card__field">
        Заметки
        <textarea data-action="notes" rows="2" placeholder="Например: пересадили в марте">${entry.notes}</textarea>
      </label>
    </article>
  `;
}

function renderMyList() {
  const container = document.getElementById("my-list");
  if (myList.length === 0) {
    container.innerHTML = `<p class="empty-state">Список пуст. Добавьте растения из справочника.</p>`;
    return;
  }
  container.innerHTML = myList.map(renderMyListItem).join("");
}


function switchView(view) {
  document.querySelectorAll(".view").forEach((section) => {
    section.hidden = section.id !== `view-${view}`;
  });
  document.querySelectorAll(".sidebar__link").forEach((link) => {
    link.classList.toggle("sidebar__link--active", link.dataset.view === view);
  });
}

document.querySelectorAll(".sidebar__link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    switchView(link.dataset.view);
  });
});


function handlePlantGridClick(e) {
  const addButton = e.target.closest(".plant-card__add");
  if (addButton && !addButton.disabled) {
    addToMyList(addButton.dataset.plantId);
    return;
  }
  const favoriteButton = e.target.closest(".plant-card__favorite");
  if (favoriteButton) {
    toggleFavorite(favoriteButton.dataset.plantId);
  }
}

document.getElementById("plant-grid").addEventListener("click", handlePlantGridClick);
document.getElementById("favorites-grid").addEventListener("click", handlePlantGridClick);

const myListContainer = document.getElementById("my-list");

myListContainer.addEventListener("click", (e) => {
  const button = e.target.closest('[data-action="remove"]');
  if (!button) return;
  const card = button.closest(".mylist-card");
  removeFromMyList(card.dataset.plantId);
});

myListContainer.addEventListener("input", (e) => {
  const card = e.target.closest(".mylist-card");
  if (!card) return;
  const { action } = e.target.dataset;
  if (action === "notes") {
    updateEntryField(card.dataset.plantId, "notes", e.target.value);
  }
});

renderPlantGrid("plant-grid", PLANTS);
renderFavorites();
renderMyList();
