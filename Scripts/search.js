let Records=[];
let Settings={
        Target: 100,
        moneycurency: 'USD',
        Rate: {USD: 1, RWF: 1661, EUR: 0.89}
};
export function validaterecs(){
        return Records;
}
export function xrec(newrec){
        Records = newrec;
}
export function validatesetting(){
        return Settings;
}
export function xsetting(newset){
        if (newset.Target!== undefined) Settings.Target=newset.Target;
        if (newset.moneycurrency!== undefined) Settings.moneycurrency=newset.moneycurrency;
        if (newset.Rate!==undefined){
                Settings.Rate.EUR=newset.Rate.EUR||Settings.Rate.EUR;
                Settings.Rate.RWF=newset.Rate.RWF||Settings.Rate.RWF;
        }
}
export function newrec(list){
        const now = new Date().toISOString();
        const Record = {
                id: 'recs'+Date.now(),
                Description: list.Description.trim().replace(/\s{2,}/g, ''),
                Amount: Number(list.Amount),
                Category: list.Category.trim(),
                Date: list.Date,
                create: now,
                update: now
        };

        Records.push(Record);
}
export function deleterec(ID){
        const saved=[];
        for (let i=0; i<Records.length; i++){
                if (Records[i].id !== ID){
                        saved.push(Records[i]);
                }
        }
        Records=saved;
}
export function updatedrec(ID,Area){
        for(let i=0; i< Records.length; i++){
                if(Records[i].id ===ID){
                        Records[i].Description=Area.Description.trim().replace(/\s{2,}/g,'');
                        Records[i].Amount=Number(Area.Amount);
                        Records[i].Category=Area.Category.trim();
                        Records[i].Date=Area.Date;
                        Records[i].update=new Date().toISOString();
                }
        }
}
export function arrangerecs( x,data,order){
        const copy = x.slice();

        copy.sort(function (a,b){
                let result = 0 ;
                if (data ==='Amount'){
                        result = a.Amount - b.Amount;
                }
                else if (data === 'Description'){
                        result = c.Description.localCompare(b.Description);
                }
                                else {
                        result= a.Date.localCompare(b.Date);
                }
                if (order === 'desc'){
                        result = -result;
                }
                return result;
        }
        );
        return copy;
}
                                 
