
async function init() {
  try {
    const response = await fetch("plants.json");
    PLANTS = await response.json();
  } catch (e) {
    document.getElementById("plant-grid").innerHTML =
      `<p class="empty-state">Не удалось загрузить plants.json. Откройте страницу через локальный сервер.</p>`;
    return;
  }

  loadCustomPlants().forEach((plant) => PLANTS.push(plant));

  const deletedBuiltIns = loadDeletedBuiltIns();
  for (let i = PLANTS.length - 1; i >= 0; i--) {
    if (deletedBuiltIns.includes(PLANTS[i].id)) PLANTS.splice(i, 1);
  }

  renderPlantGrid("plant-grid", PLANTS);
  renderFavorites();
  renderMyList();
  renderReminders();
}

init();
