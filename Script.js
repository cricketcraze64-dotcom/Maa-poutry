// ===== OWNER SETTINGS: change these =====
const CONFIG={upiId:"9898819898@upi",upiName:"Maa Poultry Farm",wa:"919898819898",pricePiece:15,priceTray:450,trayQty:30};
// ========================================
const $=id=>document.getElementById(id);
let mode="piece",qty=6,order={};

/* routing */
const PAGES=["home","order","about","contact"];
function route(){
  let h=(location.hash||"#home").slice(1);if(!PAGES.includes(h))h="home";
  PAGES.forEach(p=>$("pg-"+p).classList.toggle("show",p===h));
  document.querySelectorAll("[data-p]").forEach(a=>a.classList.toggle("on",a.dataset.p===h));
  window.scrollTo({top:0,behavior:"instant"in window?"instant":"auto"});
}
addEventListener("hashchange",route);

/* background eggs */
const bg=$("bg");
for(let i=0;i<10;i++){const s=document.createElement("span");s.className="float";s.textContent=["🥚","🐣","🌾"][i%3];s.style.left=Math.random()*100+"%";s.style.animationDuration=(9+Math.random()*10)+"s";s.style.animationDelay=(-Math.random()*14)+"s";s.style.fontSize=(18+Math.random()*20)+"px";bg.appendChild(s)}

$("egg").onclick=()=>{const o=$("egg").classList.toggle("open");$("hint").textContent=o?"Surprise! 🐥 Now order some eggs":"Tap the egg 👆";if(o)confetti(60)};

/* order */
function calc(){return{total:mode==="piece"?qty*CONFIG.pricePiece:qty*CONFIG.priceTray,eggs:mode==="piece"?qty:qty*CONFIG.trayQty}}
function render(){
  const{total,eggs}=calc();$("q").textContent=qty;
  $("tlabel").textContent=mode==="piece"?`${eggs} egg${eggs>1?"s":""}`:`${qty} tray${qty>1?"s":""} (${eggs} eggs)`;
  $("tprice").textContent="₹"+total;
  $("eggrow").innerHTML=Array.from({length:Math.min(eggs,30)},()=>"<span>🥚</span>").join("");
  $("tTray").classList.toggle("on",mode==="tray");$("tPiece").classList.toggle("on",mode==="piece");
}
$("tPiece").onclick=()=>{mode="piece";qty=6;render()};
$("tTray").onclick=()=>{mode="tray";qty=1;render()};
$("plus").onclick=()=>{qty=Math.min(qty+1,mode==="piece"?300:20);render()};
$("minus").onclick=()=>{qty=Math.max(qty-1,1);render()};
function go(n){document.querySelectorAll(".panel").forEach(p=>p.classList.remove("show"));$("p"+n).classList.add("show");
  [...$("steps").children].forEach((d,i)=>d.classList.toggle("on",i<n));$("steps").scrollIntoView({behavior:"smooth",block:"center"})}
$("n1").onclick=()=>go(2);$("b2").onclick=()=>go(1);$("b3").onclick=()=>go(2);
$("n2").onclick=()=>{
  const nm=$("nm").value.trim(),ph=$("ph").value.trim(),ad=$("ad").value.trim();
  if(nm.length<2)return $("err").textContent="Please enter your name.";
  if(!/^[6-9]\d{9}$/.test(ph))return $("err").textContent="Enter a valid 10-digit mobile number.";
  if(ad.length<8)return $("err").textContent="Please enter your full delivery address.";
  $("err").textContent="";
  const{total,eggs}=calc();order={nm,ph,ad,total,eggs,id:"MPF"+Date.now().toString().slice(-6)};
  $("payamt").textContent=total;$("upiid").textContent=CONFIG.upiId;
  const link=`upi://pay?pa=${encodeURIComponent(CONFIG.upiId)}&pn=${encodeURIComponent(CONFIG.upiName)}&am=${total}&cu=INR&tn=${order.id}`;
  $("upiBtn").href=link;$("qr").innerHTML="";
  try{new QRCode($("qr"),{text:link,width:220,height:220,correctLevel:QRCode.CorrectLevel.M})}catch(e){$("qr").textContent="QR could not load. Pay to UPI ID: "+CONFIG.upiId}
  go(3);
};
$("n3").onclick=()=>{
  const utr=$("utr").value.trim();
  const what=mode==="piece"?`${qty} egg${qty>1?"s":""}`:`${qty} tray${qty>1?"s":""} (${order.eggs} eggs)`;
  const msg=`🥚 *New Order – Maa Poultry Farm*\n\nOrder ID: ${order.id}\nItem: ${what}\nAmount: ₹${order.total}\n\nName: ${order.nm}\nMobile: ${order.ph}\nAddress: ${order.ad}\n\nPayment: I have paid ₹${order.total} by UPI.${utr?"\nUTR: "+utr:""}\nPlease verify the payment and confirm my order. Thank you!`;
  $("waBtn").href=`https://wa.me/${CONFIG.wa}?text=${encodeURIComponent(msg)}`;
  $("oid").textContent=order.id;$("sum").innerHTML=`${what} · <b>₹${order.total}</b><br>${order.nm} · ${order.ph}`;
  go(4);confetti(140);
};
$("again").onclick=()=>{qty=6;mode="piece";render();["nm","ph","ad","utr"].forEach(i=>$(i).value="");go(1)};

/* contact */
$("waDirect").href=`https://wa.me/${CONFIG.wa}?text=${encodeURIComponent("Hello Maa Poultry Farm, I have a question.")}`;
$("cs").onclick=()=>{const n=$("cn").value.trim(),m=$("cm").value.trim();if(!m){$("cm").focus();return}
  window.open(`https://wa.me/${CONFIG.wa}?text=${encodeURIComponent((n?"Hi, I am "+n+".\n":"")+m)}`,"_blank","noopener")};

/* confetti */
function confetti(n){
  const c=$("cf"),x=c.getContext("2d");c.width=innerWidth;c.height=innerHeight;
  const cols=["#ffb300","#e8590c","#2f7d32","#fff3c4","#ff8f00"];
  const ps=Array.from({length:n},()=>({x:innerWidth/2,y:innerHeight/2,vx:(Math.random()-.5)*16,vy:-Math.random()*14-4,s:5+Math.random()*7,c:cols[Math.random()*5|0],r:Math.random()*6}));
  let t=0;(function f(){x.clearRect(0,0,c.width,c.height);ps.forEach(p=>{p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.r+=.2;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);x.restore()});
  if(++t<110)requestAnimationFrame(f);else x.clearRect(0,0,c.width,c.height)})();
}
render();route();