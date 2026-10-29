const sections = document.querySelectorAll('main > section');
const links = document.querySelectorAll('nav a');
 
function showSection() {
  let id = location.hash.replace('#', '');
 
  let found = false;
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].id === id) {
      found = true;
    }
  }
  if (!found) {
    id = 'about';
  }
 
  for (let i = 0; i < sections.length; i++) {
    sections[i].hidden = sections[i].id !== id;
  }
 
  for (let i = 0; i < links.length; i++) {
    if (links[i].getAttribute('href') === '#' + id) {
      links[i].setAttribute('aria-current', 'page');
    } else {
      links[i].removeAttribute('aria-current');
    }
  }
}
 
window.addEventListener('hashchange', showSection);
showSection();
