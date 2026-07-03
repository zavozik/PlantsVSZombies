function handlePlantGridClick(e) {
  const addButton = e.target.closest(".plant-card__add");
  if (addButton && !addButton.disabled) {
    addToMyList(addButton.dataset.plantId);
    return;
  }
  const favoriteButton = e.target.closest(".plant-card__favorite");
  if (favoriteButton) {
    toggleFavorite(favoriteButton.dataset.plantId);
    return;
  }
  const deleteButton = e.target.closest(".plant-card__delete");
  if (deleteButton) {
    deletePlant(deleteButton.dataset.plantId);
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

const reminderList = document.getElementById("reminder-list");

reminderList.addEventListener("click", (e) => {
  const incrementButton = e.target.closest('[data-action="increment"]');
  if (incrementButton) {
    const item = incrementButton.closest(".reminder-item");
    incrementWatering(item.dataset.plantId);
    return;
  }
  const transplantButton = e.target.closest('[data-action="transplant"]');
  if (transplantButton) {
    const item = transplantButton.closest(".reminder-item");
    markTransplanted(item.dataset.plantId);
  }
});
