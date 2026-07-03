function generatePlantId() {
  return `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

const addPlantModal = document.getElementById("add-plant-modal");
const addPlantForm = document.getElementById("add-plant-form");

function openAddPlantModal() {
  addPlantModal.hidden = false;
}

function closeAddPlantModal() {
  addPlantModal.hidden = true;
  addPlantForm.reset();
}

document.getElementById("open-add-plant").addEventListener("click", openAddPlantModal);
document.getElementById("add-plant-close").addEventListener("click", closeAddPlantModal);
document.getElementById("add-plant-cancel").addEventListener("click", closeAddPlantModal);

addPlantModal.addEventListener("click", (e) => {
  if (e.target === addPlantModal) closeAddPlantModal();
});

addPlantForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(addPlantForm);

  const newPlant = {
    id: generatePlantId(),
    name: data.get("name").trim(),
    latinName: data.get("latinName").trim(),
    description: data.get("description").trim(),
    careLevel: data.get("careLevel"),
    watering: data.get("watering").trim(),
    light: data.get("light").trim(),
    transplant: data.get("transplant").trim(),
    toxic: data.get("toxic") === "on",
    features: data.get("features").trim(),
    image: data.get("image").trim(),
  };

  addCustomPlant(newPlant);
  renderPlantGrid("plant-grid", PLANTS);
  closeAddPlantModal();
});
