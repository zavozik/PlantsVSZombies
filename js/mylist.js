function renderMyListItem(entry) {
  const plant = findPlant(entry.plantId);
  if (!plant) return "";

  const { count: required, periodWeeks } = parseWateringFrequency(plant.watering);
  const requiredWord = pluralizeRu(required, ["полив", "полива", "поливов"]);

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
        <li><span class="mylist-card__conditions-label">Полив</span>${required} ${requiredWord} ${periodPhrase(periodWeeks)}</li>
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
