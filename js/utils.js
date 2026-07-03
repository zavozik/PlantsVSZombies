function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function getTodayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseWateringFrequency(text) {
  const perWeekMatch = text.match(/^(\d+)\s*раза?\s+в\s+недел/);
  if (perWeekMatch) {
    return { count: Number(perWeekMatch[1]), periodWeeks: 1 };
  }
  if (/^раз\s+в\s+недел/.test(text)) {
    return { count: 1, periodWeeks: 1 };
  }
  const periodMatch = text.match(/раз\s+в\s+(\d+)/);
  if (periodMatch) {
    return { count: 1, periodWeeks: Number(periodMatch[1]) };
  }
  return { count: 1, periodWeeks: 1 };
}

function periodPhrase(periodWeeks) {
  if (periodWeeks === 1) return "в неделю";
  const weekWord = pluralizeRu(periodWeeks, ["неделю", "недели", "недель"]);
  return `в ${periodWeeks} ${weekWord}`;
}

function getWeekNumber() {
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const epochMonday = new Date(2020, 0, 6);
  const diffDays = Math.round((todayMidnight - epochMonday) / 86400000);
  return Math.floor(diffDays / 7);
}

function getPeriodKey(periodWeeks) {
  return Math.floor(getWeekNumber() / periodWeeks);
}

function getWateringCountThisPeriod(entry, periodWeeks) {
  const periodKey = getPeriodKey(periodWeeks);
  if (entry.wateringPeriod && entry.wateringPeriod.periodKey === periodKey) {
    return entry.wateringPeriod.count;
  }
  return 0;
}

function parseTransplantFrequency(text) {
  const match = text.match(/раз\s+в\s+(\d+)/);
  return { years: match ? Number(match[1]) : 1 };
}

function getDaysSince(dateIso) {
  const [y, m, d] = dateIso.split("-").map(Number);
  const startDate = new Date(y, m - 1, d);
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((todayMidnight - startDate) / 86400000);
}

function isTransplantDue(entry, plant) {
  const { years } = parseTransplantFrequency(plant.transplant);
  const referenceDate = entry.lastTransplantAt || entry.addedAt;
  return getDaysSince(referenceDate) >= years * 365;
}

function pluralizeRu(n, [one, few, many]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
