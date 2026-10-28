const sections = document.querySelectorAll('main>section');
const links = document.querySelectorAll('nav a');

function eachsection(){
        let id = location.hash.replace('#', '');
        let located = false;
        for (let i= 0; i<sections.length; i++){
                if (sections[i].id===id){
                        located = true;
                }
        }
        if (!located){
                id = 'Aabout';
        }
        for (let i=0;i<sections.length;i++){
                sections[i].hidden=sections[i].id!==id;
        }
        for (let i=0; i<links.length; i++){
                if(links[i].getAttribute('href')==='#'+id){
                        links[i].setAttribute('aria-current','page');
                }
                else{
                        links[i].removeAttribute('aria-current');
                }
        }
}
window.addEventListener('hashchange', eachsection);
eachsection();
