import { tags, escp} from './Scripts/search.js';

function currency( Amount, Settings){
        const changed = Amount * Settings.Rate[Settings.moneycurrency];
        return changed.toFixed(2)+ '' + Settings.moneycurrency;
}
export function table(list, regex, id, settings){
        const tbody=document.querySelector('#Records tbody');
        let html = '';
        for (let i=0; i<list.length; i++){
                const r = list[i];
                if (r.id===id){
                        html += '<tr data-id="' + r.id +'">';
                        html += '<td><input data-Area="date" value="' + escp(r.Date)+'"aria-label="Date"></td>';
                        html += '<td><input data-Area="category" value="' + escp(r.category)+'"aria-label="Category"></td>';
                        html += '<td><input data-Area="description" value="' + escp(r.description)+'"aria-label="Description"></td>';
                        html += '<td><input data-Area="amount" value="' + escp(r.amount)+'"aria-label="Amount"></td>';
                        html += '<td><button data-action="save">Save</button> <button data-action="cancel">Cancel</button></td>';
                        html += '</tr>';
                }
                else{
                        html += '<tr data-id="'+ r.id + '">';
                        html += '<td>' +tags(r.date,regex)+'</td>';
                        html += '<td>' +tags(r.category,regex)+'</td>';
                        html += '<td>' +tags(r.description,regex)+'</td>';
                        html += '<td>' +tags(r.amount,regex)+'</td>';
                        html += '<td><button data-action="save">Save</button> <button data-action="cancel">Cancel</button></td>';                        html += '</tr>';
                }
        }
        if (list.length===0){
                html = '<tr><td colspan="5">Records Not Found</td></tr>';
        }
        tbody.innerHTML = html;
}
export function stats(records,settings){
        let sum=0;
        const total={};
        for (let i = 0; i<records.length; i++){
                sum += records[i].amount;
                const mess = records[i].category;
                if (total[mess]===undefined){
                        total[mess]=0;
                }
                total[mess]+=records[i].amount;
        }
        let TC = '-';
        let TE =0;
        for (const mess in total){
                if(total[mess]>TE){
                        TE = total[mess];
                        TC= mess;
                }
        }
        document.getElementById('stat-count').textContent=recors.length;
        document.getElementById('stat-sum').textContent=money(sum,settings);
        document.getElementById('stat-top').textContent=TC;

        const totals =[];
        const date = [];
        for (let i=6; i>=0; i--){
                const day= new Date(Date.now()-i*24*60*60*1000);
                const datet=day.toISOString().slice(0,10);
                let dayt=0;
                for(let j=0; j<records.length; j++){
                        if(records[j].date===datet){
                        dayt += records[j].amount;
                }
        }
        date.push(datet);
        totals.push(dayt);
        }
        let large = 1;
        for (let i=0; i<totals.length; i++){
                if (totals[i] > large) large = totals [i];
        }
        let chart = '';
        for (let i=0; i < totals.length; i++){
                const height = (totals[i]/large)*100;
                chart += '<span style="height:' + height + '%" title="' + dates[i] + '"></span>';
        }
        document.querySelector('.charts').innerHTML = chart;
        const message = document.getElementById('Target message');
        const expense = sum * settings.rates[settings.moneycurrency];
        const target = Number(settings.target);

        if (expense > target){
                message.setAttribute('aria-live', 'assertive');
                message.classList.add('over');
                message.textContent = 'Target exceeded by ' + (expense-target).toFixed(2) + '' +settings.moneycurrency + '!';
        }
        else {
                message.setAttribute('aria-live', 'polite');
                message.classList.remove('over');
                message.textContent = 'You have ' + (target-expense).toFixed(2) + ' ' +settings.moneycurrency + 'left on your target';
        }
}

export function erorsz(error){
        const area = ['description', 'category', 'amount', 'date'];
        for (let i=0; i < area.length; i++){
                const name = area[i];
                const errornote= document.getElementById(name+'-error');
                const input = document.getElementById(name);
                if (errors[name]){
                        errornote.textContent= error[name];
                        input.setAttribute('aria-invalid', 'true');
                }
                else{
                        errornote.textContent= '';
                        input.setAttribute('aria-invalid', 'false');
                }
        }
}

