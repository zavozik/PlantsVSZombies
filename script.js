function renderPlantCard(plant) {
  const toxicClass = plant.toxic ? " plant-card__stat-value--warning" : "";
  const toxicLabel = plant.toxic ? "токсично" : "не токсично";

  return `
    <article class="plant-card">
      <div class="plant-card__image">
        <button class="plant-card__add" aria-label="Добавить в список">+</button>
        <span class="plant-card__caption">фото &middot; ${plant.name}</span>
      </div>
      <div class="plant-card__body">
        <span class="plant-card__badge">${plant.careLevel}</span>
        <h3 class="plant-card__title">${plant.name}</h3>
        <p class="plant-card__latin">${plant.latinName}</p>
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

function renderPlantGrid(plants) {
  const grid = document.getElementById("plant-grid");
  grid.innerHTML = plants.map(renderPlantCard).join("");
}

renderPlantGrid(PLANTS);
