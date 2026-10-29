const descriptionRule = /^\S(?:.*\S)?$/;                          
const amountRule = /^(0|[1-9]\d*)(\.\d{1,2})?$/;                  
const dateRule = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/; 
const categoryRule = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;            
 
export function hasDuplicateWord(text) {
  return /\b(\w+)\s+\1\b/i.test(text);
}
 
export function cleanSpaces(text) {
  return text.trim().replace(/\s{2,}/g, ' ');
}
 
export function isValidDescription(text) {
  return descriptionRule.test(text);
}
export function isValidAmount(text) {
  return amountRule.test(text);
}
export function isValidDate(text) {
  return dateRule.test(text);
}
export function isValidCategory(text) {
  return categoryRule.test(text);
}
 
export function validateRecord(record) {
  const errors = {};
 
  const description = cleanSpaces(String(record.description));
 
  if (!descriptionRule.test(description)) {
    errors.description = 'Description is required.';
  } else if (hasDuplicateWord(description)) {
    errors.description = 'Description has a repeated word (like "the the").';
  }
 
  if (!amountRule.test(String(record.amount))) {
    errors.amount = 'Enter a number like 12 or 12.50.';
  }
 
  if (!categoryRule.test(String(record.category))) {
    errors.category = 'Use letters, spaces and hyphens only.';
  }
 
  if (!dateRule.test(String(record.date))) {
    errors.date = 'Use the format YYYY-MM-DD.';
  }
 
  return errors;
}
 
export function validateImport(data) {
  let list = data;
  if (!Array.isArray(data)) {
    list = data.records;
  }
 
  if (!Array.isArray(list)) {
    return { ok: false, error: 'File must contain a list of records.' };
  }
 
  for (let i = 0; i < list.length; i++) {
    const r = list[i];
    const number = i + 1;
 
    if (typeof r.id !== 'string' || typeof r.createdAt !== 'string' || typeof r.updatedAt !== 'string') {
      return { ok: false, error: 'Record ' + number + ' is missing id, createdAt or updatedAt.' };
    }
 
    const errors = validateRecord(r);
    if (Object.keys(errors).length > 0) {
      return { ok: false, error: 'Record ' + number + ' has invalid data.' };
    }
  }
 
  return { ok: true, error: '' };
}
 
