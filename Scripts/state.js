let records = [];
 
let settings = {
  cap: 100,
  base: 'USD',
  rates: { USD: 1, RWF: 1400, EUR: 0.92 }
};
 
export function getRecords() {
  return records;
}
 
export function setRecords(newRecords) {
  records = newRecords;
}
 
export function getSettings() {
  return settings;
}
 
export function setSettings(newSettings) {
  if (newSettings.cap !== undefined) settings.cap = newSettings.cap;
  if (newSettings.base !== undefined) settings.base = newSettings.base;
  if (newSettings.rates !== undefined) {
    settings.rates.RWF = newSettings.rates.RWF || settings.rates.RWF;
    settings.rates.EUR = newSettings.rates.EUR || settings.rates.EUR;
  }
}
 
export function addRecord(data) {
  const now = new Date().toISOString();
 
  const record = {
    id: 'rec_' + Date.now(),
    description: data.description.trim().replace(/\s{2,}/g, ' '),
    amount: Number(data.amount),
    category: data.category.trim(),
    date: data.date,
    createdAt: now,
    updatedAt: now
  };
 
  records.push(record);
}
 
export function deleteRecord(id) {
  const kept = [];
  for (let i = 0; i < records.length; i++) {
    if (records[i].id !== id) {
      kept.push(records[i]);
    }
  }
  records = kept;
}
 
export function updateRecord(id, fields) {
  for (let i = 0; i < records.length; i++) {
    if (records[i].id === id) {
      records[i].description = fields.description.trim().replace(/\s{2,}/g, ' ');
      records[i].amount = Number(fields.amount);
      records[i].category = fields.category.trim();
      records[i].date = fields.date;
      records[i].updatedAt = new Date().toISOString();
    }
  }
}
 
export function sortRecords(list, key, direction) {
  const copy = list.slice();
 
  copy.sort(function (a, b) {
    let result = 0;
 
    if (key === 'amount') {
      result = a.amount - b.amount;
    } else if (key === 'description') {
      result = a.description.localeCompare(b.description);
    } else {
      result = a.date.localeCompare(b.date);
    }
 
    if (direction === 'desc') {
      result = -result;
    }
    return result;
  });
 
  return copy;
}
