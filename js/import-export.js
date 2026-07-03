function exportPlantsToJSON() {
  const blob = new Blob([JSON.stringify(PLANTS, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "plants.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importPlantsFromJSON(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let importedPlants;
    try {
      importedPlants = JSON.parse(reader.result);
    } catch (e) {
      alert("Не удалось прочитать файл: некорректный JSON.");
      return;
    }
    if (!Array.isArray(importedPlants)) {
      alert("Файл должен содержать список растений (JSON-массив).");
      return;
    }

    let added = 0;
    let skipped = 0;
    importedPlants.forEach((plant) => {
      if (!plant || typeof plant.name !== "string" || !plant.name.trim()) {
        skipped++;
        return;
      }
      if (plant.id && findPlant(plant.id)) {
        skipped++;
        return;
      }
      addCustomPlant({
        id: plant.id || generatePlantId(),
        name: plant.name.trim(),
        latinName: plant.latinName || "",
        description: plant.description || "",
        careLevel: plant.careLevel || "Средний уход",
        watering: plant.watering || "раз в неделю",
        light: plant.light || "",
        transplant: plant.transplant || "раз в год",
        toxic: Boolean(plant.toxic),
        features: plant.features || "",
        image: plant.image || "",
      });
      added++;
    });

    renderPlantGrid("plant-grid", PLANTS);
    renderFavorites();
    alert(`Импортировано растений: ${added}. Пропущено: ${skipped}.`);
  };
  reader.readAsText(file);
}

document.getElementById("export-plants").addEventListener("click", exportPlantsToJSON);

const importPlantsInput = document.getElementById("import-plants-input");
importPlantsInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) importPlantsFromJSON(file);
  importPlantsInput.value = "";
});
