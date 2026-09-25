'use strict';
// Screen navigation, keypad, editable settings and simulated payment behavior.
const STORAGE_KEY = 'cash-demo-standalone-v1';
const $ = id => document.getElementById(id);
const defaults = () => structuredClone(window.DEMO_DEFAULTS);
let state = defaults();
let currentScreen = 'pay';
let action = 'Pay';
let note = '';
let messageTimer;
const money = value => Number(value).toLocaleString('en-US', {style:'currency',currency:'USD'});
const normalizeTag = value => String(value).trim().replace(/^\$+/, '').replace(/[^a-zA-Z0-9_]/g, '');
function notify(text) { $('message').textContent=text; $('message').hidden=false; clearTimeout(messageTimer); messageTimer=setTimeout(()=>$('message').hidden=true,5500); }
function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { notify('Your changes work now, but this browser could not save them.'); } }
function load() {
  try {
    const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null'); if(!data)return;
    for(const key of ['recipientName','recipientTag','warningName'])if(typeof data[key]==='string')state[key]=data[key].slice(0,80);
    if(Number.isFinite(data.balance)&&data.balance>=0)state.balance=data.balance;
    if(typeof data.amount==='string'&&/^\d{1,7}(\.\d{0,2})?$/.test(data.amount))state.amount=data.amount;
    if(['failed','success'].includes(data.outcome))state.outcome=data.outcome;
    if(typeof data.artwork==='string'&&/^data:image\/(png|jpeg|webp);base64,/.test(data.artwork))state.artwork=data.artwork;
    if(Array.isArray(data.history))state.history=data.history.filter(x=>x&&typeof x.tag==='string'&&Number.isFinite(x.amount)&&typeof x.action==='string').slice(0,100);
  } catch { /* A fresh demo still works if storage is unavailable or invalid. */ }
}
function show(screen) {
  currentScreen=screen;
  document.querySelectorAll('.screen').forEach(el=>el.hidden=el.id!=='screen-'+screen);
  render(); window.scrollTo(0,0);
  const heading=$('screen-'+screen).querySelector('h1,h2');
  if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
}
function render() {
  $('amount-display').textContent='$'+state.amount;
  document.querySelectorAll('.amount-label').forEach(el=>el.textContent=money(Number(state.amount)));
  document.querySelectorAll('.action-label').forEach(el=>el.textContent=action);
  document.querySelectorAll('.name-label').forEach(el=>el.textContent=state.recipientName||'$'+state.recipientTag);
  document.querySelectorAll('.tag-label').forEach(el=>el.textContent='$'+state.recipientTag);
  $('review-note').textContent=note;
  $('balance-display').textContent=money(state.balance);$('funding-balance').textContent=money(state.balance);
  $('confirm-payment').textContent=action+' '+money(Number(state.amount));
  $('failed-recipient').textContent=state.warningName.trim()||'$'+state.recipientTag;
  for(const id of ['review-artwork','settings-artwork']) {$(id).hidden=!state.artwork;if(state.artwork)$(id).src=state.artwork;else $(id).removeAttribute('src');}
  if(currentScreen==='activity')renderActivity();
}
function digit(value) {
  if(value==='.'&&state.amount.includes('.'))return;
  if(value!=='.'&&state.amount.includes('.')&&state.amount.split('.')[1].length>=2)return;
  if(!state.amount.includes('.')&&value!=='.'&&state.amount.length>=7)return;
  state.amount=state.amount==='0'&&value!=='.'?value:state.amount+value;render();save();
}
function start(type='Pay') {
  if(!Number.isFinite(Number(state.amount))||Number(state.amount)<=0){notify('Enter an amount greater than zero.');return;}
  action=type;$('recipient-input').value=state.recipientTag?'$'+state.recipientTag:'';updateRecipient();show('recipient');
}
function updateRecipient() {
  const tag=normalizeTag($('recipient-input').value);$('recipient-result').hidden=!tag;
  $('result-tag').textContent='$'+tag;
  $('result-name').textContent=tag===state.recipientTag?state.recipientName:tag;
  document.querySelector('.avatar').textContent=(tag[0]||'A').toUpperCase();
}
function selectRecipient() {
  const tag=normalizeTag($('recipient-input').value);if(!tag){notify('Enter a sample $cashtag.');return;}
  if(tag!==state.recipientTag)state.recipientName=tag;
  state.recipientTag=tag;save();$('note-input').value=note;show('note');
}
function settings() {
  const form=$('settings-form');for(const key of ['amount','recipientName','recipientTag','balance','outcome','warningName'])form.elements.namedItem(key).value=state[key];
  show('settings');
}
function readSettings() {
  const form=$('settings-form');if(!form.reportValidity())return false;
  const data=new FormData(form),tag=normalizeTag(data.get('recipientTag'));
  if(!tag){notify('Enter a valid sample $cashtag.');return false;}
  state.amount=String(Math.round(Number(data.get('amount'))*100)/100);
  state.balance=Math.round(Number(data.get('balance'))*100)/100;
  state.recipientName=String(data.get('recipientName')).trim()||tag;state.recipientTag=tag;
  state.warningName=String(data.get('warningName')).trim();state.outcome=String(data.get('outcome'));
  save();return true;
}
function complete() {
  if(state.outcome==='failed'&&action==='Pay'){show('failed');return;}
  const amount=Number(state.amount);
  if(!Number.isFinite(amount)||amount<=0){notify('Enter a positive amount.');show('pay');return;}
  if(action==='Pay'&&amount>state.balance){notify('Sample balance is too low. Edit it in Demo Settings.');return;}
  if(action==='Pay')state.balance=Math.round((state.balance-amount)*100)/100;
  state.history.unshift({tag:'$'+state.recipientTag,amount,note,action,date:new Date().toLocaleString()});state.history=state.history.slice(0,100);save();
  $('success-title').textContent=action==='Pay'?'Demo payment complete':'Demo request created';show('success');
}
function renderActivity() {
  const list=$('activity-list');list.replaceChildren();
  if(!state.history.length){list.textContent='Your simulated payments and requests will appear here.';return;}
  for(const item of state.history){const row=document.createElement('div');row.className='activity-item';const title=document.createElement('strong');title.textContent=item.tag+' · '+money(item.amount);const detail=document.createElement('small');detail.textContent=item.action+' · Simulated · '+(item.date||'');const text=document.createElement('p');text.textContent=item.note||'';row.append(title,detail,text);list.append(row);}
}
const actions={home:()=>show('pay'),settings,money:()=>show('money'),activity:()=>show('activity'),pay:()=>start('Pay'),request:()=>start('Request'),recipient:()=>start('Pay'),'recipient-back':()=>show('recipient'),'select-recipient':selectRecipient,note:()=>show('note'),review:()=>{note=$('note-input').value;show('review');},confirm:complete,done:()=>{state.amount='0';note='';save();show('pay');},backspace:()=>{state.amount=state.amount.slice(0,-1)||'0';save();render();},funding:()=>notify('Sample balance only. Edit it using the yellow profile button.'),scan:()=>notify('Enter a sample $cashtag using Pay. Camera scanning is not part of this demo.'),pool:()=>notify('Use Pay or Request for this demo. Pool is a visual placeholder.'),'remove-artwork':()=>{state.artwork='';$('artwork-input').value='';save();render();},'preview-failure':()=>{if(readSettings())show('failed');},reset:()=>{if(confirm('Reset all sample data and remove your image?')){state=defaults();note='';action='Pay';save();show('pay');}}};
document.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;if(button.dataset.digit!==undefined)digit(button.dataset.digit);else if(actions[button.dataset.action])actions[button.dataset.action]();});
$('recipient-input').addEventListener('input',updateRecipient);
$('recipient-input').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();selectRecipient();}});
$('settings-form').addEventListener('submit',event=>{event.preventDefault();if(readSettings())show('pay');});
$('artwork-input').addEventListener('change',event=>{
  const file=event.target.files[0];if(!file)return;
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>3*1024*1024){notify('Choose a PNG, JPG or WebP smaller than 3 MB.');event.target.value='';return;}
  const reader=new FileReader();reader.onload=()=>{state.artwork=reader.result;save();render();};reader.onerror=()=>notify('Unable to read the image.');reader.readAsDataURL(file);
});
document.addEventListener('keydown',event=>{if(currentScreen!=='pay'||event.target.matches('input,select,textarea'))return;if(/^[0-9.]$/.test(event.key))digit(event.key);else if(event.key==='Backspace'){event.preventDefault();actions.backspace();}});
load();show('pay');
