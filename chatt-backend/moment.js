import datetime from 'node-datetime';

const date = datetime.create();
const n = date.now();
const newdate = (n) + (60 * 10000);
const d  = new Date(newdate);
console.log(datetime.create(d, 'f d, Y H:M p').format());

