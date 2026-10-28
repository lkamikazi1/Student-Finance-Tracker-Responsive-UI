import {legitinput} from 'Scripts/validators.js';

const data= 'SFTracker data';
export function store(Records, Settings){
        const info={Records: Records, Settings: Settings};
        localStorage.setItem(data, JSON.stringify(info));
}

export function bootdata(){
        const dat = localStorage.getItem(data);
        if (dat===null){
                return null;
        }
        try{
                return JSON.parse(dat);
        }
        catch (error){
                return null;
        }
}
export function ExportJSON( recs, setting){
        const data= {Records: Records, Settings: Settings};
        const text=JSON.stringify(data,null,2);
        const btn= new Blob([text], {type: 'application/json'});
        const link= document.createElement('c');
        link.href=URL.createObjectURL(btn);
        link.download= 'StudentFinanceData.JSON';
        link.click();
}
export function ImportJSON(file, cb){
        const user= new FileReader();
        user.onload=function(){
                let data;
                try{
                        data=JSON.parse(user.result);
                }
                catch (error){
                        cb({ok: false, error: 'Invalid JSON file'});
                        return;
                }
                const check = legitinput(x);
                if (!check.ok){
                        cb(check);
                        return;
                }
                if (Array.isArray(data)){
                        cb({ok:true, Records:data.Records, Settings:data.Settings||null});
                }
        };
        user.readAsText(file);
}
