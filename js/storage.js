const MY_LIST_STORAGE_KEY = "plantCare.myList";
const FAVORITES_STORAGE_KEY = "plantCare.favorites";
const CUSTOM_PLANTS_STORAGE_KEY = "plantCare.customPlants";
const DELETED_BUILTINS_STORAGE_KEY = "plantCare.deletedBuiltIns";

let PLANTS = [];
let myList = loadMyList();
let favorites = loadFavorites();

function loadCustomPlants() {
  try {
    const raw = localStorage.getItem(CUSTOM_PLANTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCustomPlants(customPlants) {
  localStorage.setItem(CUSTOM_PLANTS_STORAGE_KEY, JSON.stringify(customPlants));
}

function addCustomPlant(plant) {
  PLANTS.push(plant);
  const customPlants = loadCustomPlants();
  customPlants.push(plant);
  saveCustomPlants(customPlants);
}

function isCustomPlant(plantId) {
  return loadCustomPlants().some((p) => p.id === plantId);
}

function loadDeletedBuiltIns() {
  try {
    const raw = localStorage.getItem(DELETED_BUILTINS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveDeletedBuiltIns(ids) {
  localStorage.setItem(DELETED_BUILTINS_STORAGE_KEY, JSON.stringify(ids));
}

function deletePlant(plantId) {
  const plant = findPlant(plantId);
  if (!plant) return;
  if (!confirm(`Удалить «${plant.name}» из справочника? Оно также будет удалено из моего списка и избранного.`)) {
    return;
  }

  const index = PLANTS.findIndex((p) => p.id === plantId);
  if (index !== -1) PLANTS.splice(index, 1);

  if (isCustomPlant(plantId)) {
    saveCustomPlants(loadCustomPlants().filter((p) => p.id !== plantId));
  } else {
    const deletedBuiltIns = loadDeletedBuiltIns();
    deletedBuiltIns.push(plantId);
    saveDeletedBuiltIns(deletedBuiltIns);
  }

  myList = myList.filter((entry) => entry.plantId !== plantId);
  saveMyList();
  favorites = favorites.filter((id) => id !== plantId);
  saveFavorites();

  renderPlantGrid("plant-grid", PLANTS);
  renderFavorites();
  renderMyList();
  renderReminders();
}

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
  renderReminders();
}

function removeFromMyList(plantId) {
  myList = myList.filter((entry) => entry.plantId !== plantId);
  saveMyList();
  renderPlantGrid("plant-grid", PLANTS);
  renderFavorites();
  renderMyList();
  renderReminders();
}

function updateEntryField(plantId, field, value) {
  const entry = myList.find((e) => e.plantId === plantId);
  if (!entry) return;
  entry[field] = value;
  saveMyList();
}

function markTransplanted(plantId) {
  const entry = myList.find((e) => e.plantId === plantId);
  if (!entry) return;
  entry.lastTransplantAt = getTodayISO();
  saveMyList();
  renderReminders();
}

function incrementWatering(plantId) {
  const entry = myList.find((e) => e.plantId === plantId);
  if (!entry) return;
  const plant = findPlant(plantId);
  const { count: required, periodWeeks } = parseWateringFrequency(plant.watering);
  const periodKey = getPeriodKey(periodWeeks);
  if (!entry.wateringPeriod || entry.wateringPeriod.periodKey !== periodKey) {
    entry.wateringPeriod = { periodKey, count: 0 };
  }
  if (entry.wateringPeriod.count >= required) return;
  entry.wateringPeriod.count += 1;
  saveMyList();
  renderReminders();
}
