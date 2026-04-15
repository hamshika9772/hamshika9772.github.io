let tabs=[],active=null

const settings=JSON.parse(localStorage.getItem("bloxproxy_settings")||"{}")
const WISP=settings.wisp||"wss://wisp.classroom.lat/"

const connection=new BareMux.BareMuxConnection("/sail/baremux/worker.js")
connection.setTransport("/sail/libcurl/index.mjs",[{"websocket":WISP}])

const {ScramjetController}=$scramjetLoadController()
const scramjet=new ScramjetController({
 files:{all:"/sail/scram/scramjet.all.js",wasm:"/sail/scram/scramjet.wasm.wasm",sync:"/sail/scram/scramjet.sync.js"},
 prefix:"/sail/go/"
})
scramjet.init()

function addTab(url="/assets/newtab/"){
 const id="t"+Date.now()
 tabs.push({id,url})

 const t=document.createElement("div")
 t.className="tab"
 t.innerText="BloxProxy"
 t.onclick=()=>switchTab(id)
 document.getElementById("tabs").appendChild(t)

 const f=document.createElement("iframe")
 f.id=id
 if(!url.startsWith("/assets") && !url.startsWith("/proxy")){
  f.src=scramjet.encodeUrl(format(url))
 }else{
  f.src=url
 }
 document.getElementById("view").appendChild(f)

 switchTab(id)
}

function switchTab(id){
 tabs.forEach(x=>{
  document.getElementById(x.id).classList.remove("active")
 })
 active=id
 document.getElementById(id).classList.add("active")
}

function format(u){
 if(!u.includes(".")) return "https://duckduckgo.com/?q="+encodeURIComponent(u)
 if(!u.startsWith("http")) return "https://"+u
 return u
}

function go(){
 const url=bar.value
 load(url)
}

function load(url){
 const f=document.getElementById(active)
 if(!url.startsWith("/proxy") && !url.startsWith("/assets")){
  f.src=scramjet.encodeUrl(format(url))
 }else{
  f.src=url
 }

 saveHistory(url)
}

function back(){document.getElementById(active).contentWindow.history.back()}
function forward(){document.getElementById(active).contentWindow.history.forward()}
function refresh(){document.getElementById(active).contentWindow.location.reload()}

function toggleMenu(){
 const m=document.getElementById("menu")
 m.style.display=m.style.display=="block"?"none":"block"
}

function openPage(u){
 addTab(u)
}

function saveHistory(url){
 let h=JSON.parse(localStorage.getItem("bloxproxy_history")||"[]")
 h.unshift({url,time:Date.now()})
 localStorage.setItem("bloxproxy_history",JSON.stringify(h.slice(0,200)))
}

function loadBookmarks(){
 const b=JSON.parse(localStorage.getItem("bloxproxy_bookmarks")||"[]")
 const wrap=document.getElementById("bookmarks")
 wrap.innerHTML=""
 b.forEach(x=>{
  const el=document.createElement("div")
  el.className="bookmark"
  el.innerText=x.name
  el.onclick=()=>load(x.url)
  wrap.appendChild(el)
 })
}

bar.addEventListener("keydown",e=>{if(e.key=="Enter")go()})

addTab()
loadBookmarks()
