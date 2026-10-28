const descriptlaw = /^\S(?:.*\S)?$/;
const datelaw = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const amountlaw = /^(0|[1-9]\d*)(\.\d{1,2})?&/;
const categrylaw = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

export function redundant(text){
    return /\b(\w+)\s+\1\b/i. test(text);
}

export function space(text){
    return text.trim().replace(/\s+/g, ' ');
}

export function legitdescript(text){
    return descriptlaw.test(text);
}

export function legitdate(text){
    return datelaw.test(text);
}

export function legitamount(text){
    return amountlaw.test(text);
}

export function legitcategry(text){
    return categrylaw.test(text);
}

export function legitrecord(record){
    const errors = {};
    const description  = space(String(record.description || ''));

    const rules = [
        {
            field: 'description',
            test: () => !descriptlaw.test(description),
            message: 'Description Required.'
        },
        {
            field: 'description',
            test: () => redundant(description),
            message: 'Replicated Words Detected.'
        },
        {
            field: 'date',
            test: () => !datelaw.test(String(record.date || '')),
            message: 'YYY-MM-DD Format Only.'
        },
        {
            field: 'amount',
            test: () => !amountlaw.test(String(record.amount || '')),
            message: 'Whole number or Decimal Only.'
        },
        {
            field: 'category',
            test: () => !categrylaw.test(String(record.category || '')),
            message: 'abc and - Only'
        }
    ];
    for (const rule of rules){
        if( errors[rule.field]) continue;
        if ( rule.test()){
            errors[rule.field] = rule.message;
        }
    }
    return errors;

}

export function legitinput(data){
    let list = data;
    if (!Array.isArray(data)){
        list = data.Records;
    }

    if (!Array.isArray(list)){
        return {ok: false, error: 'File must have records.'};
    }

    for (let i=0; i< list.length; i++){
        const x = list[i];
        const num = i + 1;
        if (typeof x.id !== 'string'|| typeof x.created !=='string'|| typeof x.updated !=='string'){
            return { ok: false, error: 'Record' + num + 'id, created, update are missing.'};
        }
        const errors = legitrecord(x);
        if (Object.keys(errors).length>0){
            return { ok: false, error: 'Record' + num+ 'Invalid Data Input.'};
        }
    }
    return {ok: true, error:''};
}

