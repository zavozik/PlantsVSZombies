function renderPlantCard(plant) {
  const toxicClass = plant.toxic ? " plant-card__stat-value--warning" : "";
  const toxicLabel = plant.toxic ? "токсично" : "не токсично";

  return `
    <article class="plant-card">
      <div class="plant-card__image">
        ${plant.image ? `<img class="plant-card__photo" src="${plant.image}" alt="${plant.name}" onerror="this.remove()">` : ""}
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


renderPlantGrid("plant-grid", PLANTS);
