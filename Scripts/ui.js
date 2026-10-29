import { highlight, escapeHTML } from './search.js';
 
function money(amount, settings) {
  const converted = amount * settings.rates[settings.base];
  return converted.toFixed(2) + ' ' + settings.base;
}
 
export function renderTable(list, regex, editingId, settings) {
  const tbody = document.querySelector('#records tbody');
  let html = '';
 
  for (let i = 0; i < list.length; i++) {
    const r = list[i];
 
    if (r.id === editingId) {
      html += '<tr data-id="' + r.id + '">';
      html += '<td><input data-field="date" value="' + escapeHTML(r.date) + '" aria-label="Date"></td>';
      html += '<td><input data-field="description" value="' + escapeHTML(r.description) + '" aria-label="Description"></td>';
      html += '<td><input data-field="category" value="' + escapeHTML(r.category) + '" aria-label="Category"></td>';
      html += '<td><input data-field="amount" value="' + r.amount + '" aria-label="Amount"></td>';
      html += '<td><button data-action="save">Save</button> <button data-action="cancel">Cancel</button></td>';
      html += '</tr>';
    } else {
      html += '<tr data-id="' + r.id + '">';
      html += '<td>' + highlight(r.date, regex) + '</td>';
      html += '<td>' + highlight(r.description, regex) + '</td>';
      html += '<td>' + highlight(r.category, regex) + '</td>';
      html += '<td>' + money(r.amount, settings) + '</td>';
      html += '<td><button data-action="edit">Edit</button> <button data-action="delete">Delete</button></td>';
      html += '</tr>';
    }
  }
 
  if (list.length === 0) {
    html = '<tr><td colspan="5">No records found.</td></tr>';
  }
 
  tbody.innerHTML = html;
}
 
export function renderStats(records, settings) {
  let sum = 0;
  const categoryTotals = {};
 
  for (let i = 0; i < records.length; i++) {
    sum += records[i].amount;
    const cat = records[i].category;
    if (categoryTotals[cat] === undefined) {
      categoryTotals[cat] = 0;
    }
    categoryTotals[cat] += records[i].amount;
  }
 
  let topCategory = '-';
  let topAmount = 0;
  for (const cat in categoryTotals) {
    if (categoryTotals[cat] > topAmount) {
      topAmount = categoryTotals[cat];
      topCategory = cat;
    }
  }
 
  document.getElementById('stat-count').textContent = records.length;
  document.getElementById('stat-sum').textContent = money(sum, settings);
  document.getElementById('stat-top').textContent = topCategory;
 
  const totals = [];
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateText = day.toISOString().slice(0, 10);
    let dayTotal = 0;
    for (let j = 0; j < records.length; j++) {
      if (records[j].date === dateText) {
        dayTotal += records[j].amount;
      }
    }
    dates.push(dateText);
    totals.push(dayTotal);
  }
 
  let biggest = 1;
  for (let i = 0; i < totals.length; i++) {
    if (totals[i] > biggest) biggest = totals[i];
  }
 
  let chartHTML = '';
  for (let i = 0; i < totals.length; i++) {
    const height = (totals[i] / biggest) * 100;
    chartHTML += '<span style="height:' + height + '%" title="' + dates[i] + '"></span>';
  }
  document.querySelector('.chart').innerHTML = chartHTML;
 
  // cap message
  const message = document.getElementById('cap-message');
  const spent = sum * settings.rates[settings.base];
  const cap = Number(settings.cap);
 
  if (spent > cap) {
    message.setAttribute('aria-live', 'assertive');   
    message.classList.add('over');
    message.textContent = 'Cap exceeded by ' + (spent - cap).toFixed(2) + ' ' + settings.base + '!';
  } else {
    message.setAttribute('aria-live', 'polite');      
    message.classList.remove('over');
    message.textContent = 'You have ' + (cap - spent).toFixed(2) + ' ' + settings.base + ' left under your cap.';
  }
}
 
export function showErrors(errors) {
  const fields = ['description', 'amount', 'category', 'date'];
 
  for (let i = 0; i < fields.length; i++) {
    const name = fields[i];
    const errorBox = document.getElementById(name + '-error');
    const input = document.getElementById(name);
 
    if (errors[name]) {
      errorBox.textContent = errors[name];
      input.setAttribute('aria-invalid', 'true');
    } else {
      errorBox.textContent = '';
      input.setAttribute('aria-invalid', 'false');
    }
  }
}
