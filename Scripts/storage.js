import { validateImport } from './validators.js';
 
const KEY = 'financeTrackerData';
 
export function saveData(records, settings) {
  const data = { records: records, settings: settings };
  localStorage.setItem(KEY, JSON.stringify(data));
}
 
export function loadData() {
  const text = localStorage.getItem(KEY);
  if (text === null) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}
 
export function exportJSON(records, settings) {
  const data = { records: records, settings: settings };
  const text = JSON.stringify(data, null, 2);
 
  const blob = new Blob([text], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'finance-data.json';
  link.click();
}
 
export function importJSON(file, callback) {
  const reader = new FileReader();
 
  reader.onload = function () {
    let data;
    try {
      data = JSON.parse(reader.result);
    } catch (error) {
      callback({ ok: false, error: 'That file is not valid JSON.' });
      return;
    }
 
    const check = validateImport(data);
    if (!check.ok) {
      callback(check);
      return;
    }
 
    if (Array.isArray(data)) {
      callback({ ok: true, records: data, settings: null });
    } else {
      callback({ ok: true, records: data.records, settings: data.settings || null });
    }
  };
 
  reader.readAsText(file);
}
