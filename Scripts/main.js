import './nav.js';
import { getRecords, getSettings, setRecords, setSettings, addRecord, deleteRecord, updateRecord, sortRecords } from './state.js';
import { saveData, loadData, exportJSON, importJSON } from './storage.js';
import { validateRecord } from './validators.js';
import { makeRegex, recordMatches } from './search.js';
import { renderTable, renderStats, showErrors } from './ui.js';
 
const saved = loadData();
if (saved !== null) {
  setRecords(saved.records || []);
  setSettings(saved.settings || {});
}
 
const form = document.getElementById('record-form');
const searchInput = document.getElementById('search');
const caseBox = document.getElementById('case');
const sortSelect = document.getElementById('sort');
const tbody = document.querySelector('#records tbody');
 
const capInput = document.getElementById('cap');
const baseSelect = document.getElementById('base');
const rwfInput = document.getElementById('rate-rwf');
const eurInput = document.getElementById('rate-eur');
 
let editingId = null;   
 
function refresh() {
  const result = makeRegex(searchInput.value, caseBox.checked);
  document.getElementById('search-error').textContent = result.error;
 
  const matching = [];
  const all = getRecords();
  for (let i = 0; i < all.length; i++) {
    if (recordMatches(all[i], result.regex)) {
      matching.push(all[i]);
    }
  }
 
  const parts = sortSelect.value.split('-');
  const sorted = sortRecords(matching, parts[0], parts[1]);
 
  renderTable(sorted, result.regex, editingId, getSettings());
  renderStats(getRecords(), getSettings());
  saveData(getRecords(), getSettings());   
}
 
form.addEventListener('submit', function (event) {
  event.preventDefault();
 
  const data = {
    description: document.getElementById('description').value,
    amount: document.getElementById('amount').value,
    category: document.getElementById('category').value,
    date: document.getElementById('date').value
  };
 
  const errors = validateRecord(data);
  showErrors(errors);
 
  if (Object.keys(errors).length > 0) {
    return;
  }
 
  addRecord(data);
  form.reset();
  document.getElementById('form-status').textContent = 'Record saved!';
  refresh();
});
 
tbody.addEventListener('click', function (event) {
  const action = event.target.getAttribute('data-action');
  if (action === null) {
    return;
  }
 
  const row = event.target.closest('tr');
  const id = row.getAttribute('data-id');
 
  if (action === 'edit') {
    editingId = id;
  }
 
  if (action === 'cancel') {
    editingId = null;
  }
 
  if (action === 'delete') {
    if (confirm('Delete this record?')) {
      deleteRecord(id);
    }
  }
 
  if (action === 'save') {
    const inputs = row.querySelectorAll('input');
    const fields = {};
    for (let i = 0; i < inputs.length; i++) {
      fields[inputs[i].getAttribute('data-field')] = inputs[i].value;
    }
 
    const errors = validateRecord(fields);
    if (Object.keys(errors).length > 0) {
      alert('Please fix the errors: ' + Object.values(errors).join(' '));
      return;
    }
 
    updateRecord(id, fields);
    editingId = null;
  }
 
  refresh();
});
 
searchInput.addEventListener('input', refresh);
caseBox.addEventListener('change', refresh);
sortSelect.addEventListener('change', refresh);
 
capInput.value = getSettings().cap;
baseSelect.value = getSettings().base;
rwfInput.value = getSettings().rates.RWF;
eurInput.value = getSettings().rates.EUR;
 
function saveSettings() {
  setSettings({
    cap: Number(capInput.value),
    base: baseSelect.value,
    rates: { RWF: Number(rwfInput.value), EUR: Number(eurInput.value) }
  });
  refresh();
}
 
capInput.addEventListener('change', saveSettings);
baseSelect.addEventListener('change', saveSettings);
rwfInput.addEventListener('change', saveSettings);
eurInput.addEventListener('change', saveSettings);
 
document.getElementById('export').addEventListener('click', function () {
  exportJSON(getRecords(), getSettings());
});
 
document.getElementById('import').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
 
  importJSON(file, function (result) {
    if (!result.ok) {
      alert(result.error);
      return;
    }
    setRecords(result.records);
    if (result.settings !== null) {
      setSettings(result.settings);
    }
    refresh();
    alert('Import successful!');
  });
});
 
refresh();
 
