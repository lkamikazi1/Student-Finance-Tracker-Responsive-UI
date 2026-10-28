import 'Scripts/nav.js';
import {validaterecs,xrec,validatesetting,xsetting,newrec,deleterec,updaterec,arrangerecs} from 'Scripts/state.js';
import { store,bootdata,ExportJSON,ImportJSON} from 'Scripts/storage.js';
import {legitrecord} from 'Scripts/validators.js';
import{regx,recsearch} from 'Scripts/search.js';
import{table,stats,errorsz} from 'Scripts/ui.js';

const kept = bootdata();
if (kept !== null){
        validaterecs=(kept.records|| []);
        validatesetting(kept.settings||{});
}
const form = document.getElementById('record form');
const searchput = document.getElementById('search');
const cnote = document.getElementById('note');
const sorting = document.getElementById('sort');
const tbody = document.getElementById('#records tbody');
const targetput= document.getElementById('target');
const mcselect= document.getElementById('moneycurrency');
const rwfput= document.getElementById('rwf rate');
const eurput= document.getElementById('eur rate');

let editid = null;

function reload() {
        const result = regx(searchput.value, cnote.checked);
        document.getElementById('search-error').textContent = result.error;
        const equivalent = [];
        const all = validaterecs();
        for (let i=0; i<all.length; i++){
                if(recsearch(all[i],result.regex)){
                        equivalent.push(all[i]);
                }
                const parts = sorting.value.split('-');
                const sorted = arrangerecs(equivalent, parts[0],parts[1]);
                table(sorted, result.regex,editid,validatesetting());
                stats(validaterecs(),validatesetting());
                saveData(validaterecs(),validatesetting());
        }
        form.addEventListener('submit', function(event){
                event.preventDefualt();

                const data = {
                        description: document.getElementById('description').value,
                        amount: document.getElementById('amount').value,
                        category: document.getElementById('category').value,
                        date: document.getElementById('date').value
                };
                const errors = legitrecord(data);
                errorsz(errors);

                if (Object.keys(errors).length>0){
                        return;
                }
                newrec(data);
                form.reset();
                document.getElementById('form-status').textContent= 'Record Saved';
                refresh();
        }
        );

        tbody.addEventListener('click',function(event){
                const action = event.target.closest('tr');
                const id = row.getAtrribute('data id');
                 if(action==='edit'){
                         editid=id;
                 }
                if (action==='cancel'){
                        editid=null;
                }
                if (action==='delete'){
                        if (confirm('Are you sure you want to delete record?')){
                                deleterec(id);;;
                        }
                }
                if (action==='save'){
                        const input= row.querySelectorAll('input');
                        const field = {};
                        for (let i=0; i<input.length;i++){
                                field[input[i].getAtrribute('data field')]=input[i].value;
                        }
                        const errors = legitrecord(field);
                        if (Obeject.keys(errors).length>0){
                                alert('fix errors' + Object.values(errors).join(' '));
                                        return;
                        }
                        updaterec(id,field);
                        editid = null;
                }
                refresh();
        }
                                );
                                searchput.addEventListener('input',refresh);
                                cnote.addEventListener('change',refresh);
                                sorting.addEventListener('change',refresh);
        targetput.value=validatesetting().target;
        mcselect.value=validatesetting().moneycurrency;
        rwfput.value=validatesetting().rate.RWF;
        eurput.value=validatesetting().rate.EUR;
        function savesettings(){
                xsetting({
                        target:Number(targetput.value),
                        moneycurrency: mcselect.value,
                        rate: {RWF: Number(rwfput.value), EUR:Number(eurput.value)
                        }
                });
                refresh();
        }
        targetput.addEventListener('change', savesettings);
        mcselect.addEventListener('change', savesettings);
        rwfput.addEventListener('change', savesettings);
        eurput.addEventListener('change', savesettings);

        document.getElementById('export').addEventListener('click',function(){
                exportJSON(validaterecs(), validatesetting() );
        });
        document.getElementById('import').addEventListener('click',function(event){
                const file = event.target.files[0];
                if (!file){
                        return;
                }
                importJSON(file,function(result){
                        if(!result.ok){
                                alert(result.error);
                                return;
                        }
                        xsetting(result.records);
                        if (result.settings!==null){
                                xsetting(result.settings);
                        }
                        refresh();
                        alert('Import Success.');                        
                        alert('Import Success.');
                });
        });
        refresh();
    }

