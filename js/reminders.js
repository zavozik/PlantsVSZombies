function renderReminderItem(entry) {
  const plant = findPlant(entry.plantId);
  if (!plant) return "";

  const { count: required, periodWeeks } = parseWateringFrequency(plant.watering);
  const current = getWateringCountThisPeriod(entry, periodWeeks);
  const done = current >= required;
  const requiredWord = pluralizeRu(required, ["полив", "полива", "поливов"]);

  const { years } = parseTransplantFrequency(plant.transplant);
  const yearsWord = pluralizeRu(years, ["год", "года", "лет"]);
  const transplantDue = isTransplantDue(entry, plant);

  const needsAttention = !done || transplantDue;

  return `
    <div class="reminder-item${needsAttention ? " reminder-item--alert" : ""}" data-plant-id="${plant.id}">
      <div class="reminder-item__info">
        <h3 class="reminder-item__title">${plant.name}</h3>
        <span class="reminder-item__target">Норма полива: ${required} ${requiredWord} ${periodPhrase(periodWeeks)}</span>
        <span class="reminder-item__target">Норма пересадки: раз в ${years} ${yearsWord}</span>
      </div>
      <div class="reminder-item__actions">
        <div class="reminder-item__counter">
          <span class="reminder-item__count">Полито: <strong>${current}</strong> из ${required}</span>
          ${done ? "" : `<button class="reminder-item__increment" data-action="increment" aria-label="Отметить полив">+</button>`}
        </div>
        <div class="reminder-item__transplant">
          <span class="reminder-item__transplant-box${transplantDue ? " reminder-item__transplant-box--due" : ""}">
            ${transplantDue ? "Пора пересадить" : "Пересадка не требуется"}
          </span>
          <button class="reminder-item__transplant-btn" data-action="transplant" aria-label="Отметить пересадку">Пересадил(а)</button>
        </div>
      </div>
    </div>
  `;
}

function renderReminders() {
  const container = document.getElementById("reminder-list");
  if (myList.length === 0) {
    container.innerHTML = `<p class="empty-state">Список пуст. Добавьте растения в «Мой список».</p>`;
  } else {
    container.innerHTML = myList.map(renderReminderItem).join("");
  }
  updateReminderBadge();
}

function hasPendingReminders() {
  return myList.some((entry) => {
    const plant = findPlant(entry.plantId);
    if (!plant) return false;
    const { count: required, periodWeeks } = parseWateringFrequency(plant.watering);
    const wateringNeeded = getWateringCountThisPeriod(entry, periodWeeks) < required;
    return wateringNeeded || isTransplantDue(entry, plant);
  });
}

function updateReminderBadge() {
  const link = document.querySelector('.sidebar__link[data-view="reminders"]');
  if (!link) return;
  link.classList.toggle("sidebar__link--alert", hasPendingReminders());
}
