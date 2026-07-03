function switchView(view) {
  document.querySelectorAll(".view").forEach((section) => {
    section.hidden = section.id !== `view-${view}`;
  });
  document.querySelectorAll(".sidebar__link").forEach((link) => {
    link.classList.toggle("sidebar__link--active", link.dataset.view === view);
  });
  if (view === "reminders") {
    renderReminders();
  }
}

document.querySelectorAll(".sidebar__link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    switchView(link.dataset.view);
  });
});
