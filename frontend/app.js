// Kude The Dude V1 - frontend logic (vanilla JS)


const addressInput = document.getElementById('addressInput');
const goBtn = document.getElementById('goBtn');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const refreshBtn = document.getElementById('refreshBtn');
const newTabBtn = document.getElementById('newTabBtn');
const tabsBar = document.getElementById('tabsBar');
const browserArea = document.getElementById('browserArea');


let tabs = [];
let activeTabId = null;
let tabCounter = 0;


function createTab(url = 'https://www.google.com'){
const id = 'tab-' + (++tabCounter);
const tab = {
id,
title: 'New Tab',
history: [],
historyIndex: -1,
iframe: null
};
tabs.push(tab);
renderTabElement(tab);
switchToTab(id);
navigateTo(id, url);
}


function renderTabElement(tab){
const el = document.createElement('div');
el.className = 'tab';
el.id = 'label-' + tab.id;
el.textContent = tab.title;
el.onclick = () => switchToTab(tab.id);
tabsBar.appendChild(el);
}


function switchToTab(id){
activeTabId = id;
// mark active
document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
const lbl = document.getElementById('label-' + id);
if(lbl) lbl.classList.add('active');


// show iframe for tab (create if missing)
let t = tabs.find(x=>x.id===id);
if(!t) return;
browserArea.innerHTML = '';
if(!t.iframe){
const iframe = document.createElement('iframe');
iframe.id = 'iframe-' + id;
t.iframe = iframe;
}
browserArea.appendChild(t.iframe);
updateAddressInput();
}


function updateAddressInput(){
const t = tabs.find(x=>x.id===activeTabId);
createTab('https://www.google.com');
