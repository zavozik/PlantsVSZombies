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
        <button
          class="plant-card__delete"
          aria-label="Удалить растение из справочника"
          data-plant-id="${plant.id}"
        >&times;</button>
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
            <span class="plant-card__stat-label">Пересадка</span>
            <span class="plant-card__stat-value">${plant.transplant}</span>
          </div>
          <div class="plant-card__stat">
            <span class="plant-card__stat-label">Токсично</span>
            <span class="plant-card__stat-value${toxicClass}">${toxicLabel}</span>
          </div>
        </div>
        ${plant.features ? `<p class="plant-card__features"><strong>Особенности:</strong> ${plant.features}</p>` : ""}
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
