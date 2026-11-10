/* Bản đồ văn hoá số Vĩnh Gia 2 – giao diện đọc dữ liệu từ thư mục data/ */
const $=i=>document.getElementById(i),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SITES=[{id:'tc',n:'Trường chính',a:'Ấp Vĩnh An, xã Vĩnh Gia'},{id:'vt',n:'Điểm trường Vĩnh Thành',a:'Ấp Vĩnh Thành, xã Vĩnh Gia'},{id:'ph',n:'Phân hiệu',a:'Ấp Ninh Phước, xã Vĩnh Gia'},{id:'np',n:'Điểm trường Ninh Phước',a:'Ấp Ninh Phước, xã Vĩnh Gia'}];
const CH=['Mỗi lớp một câu chuyện đẹp: kể chuyện có thật về tình bạn, thầy cô, mái trường','Mỗi lớp một di sản: giới thiệu một nét đẹp văn hoá quê hương','Mỗi lớp một góc văn hoá: thiết kế không gian văn hoá số bằng ảnh, video','Mỗi lớp một thông điệp: poster hoặc video về văn hoá ứng xử','Mỗi lớp một hành động đẹp: ghi lại việc tốt, việc tử tế','Mỗi lớp một đại sứ: giới thiệu học sinh tiêu biểu về văn hoá học đường'];
const TH=[['hs','Văn hoá học đường','Ghi lại một quy tắc ứng xử đẹp ở trụ sở của em.',['Giữ lớp sạch đẹp, lắng nghe thầy cô và bạn','Viết vẽ lên bàn ghế','Chen lấn khi xếp hàng'],0],['ts','Tôn sư trọng đạo','Viết lời tri ân một thầy cô, không nêu thông tin riêng tư.',['Chỉ nhớ thầy cô vào ngày lễ','Lễ phép, biết ơn và chăm học','Không cần chào hỏi'],1],['un','Ứng xử và lòng nhân ái','Kể một việc tử tế có thật trong trường.',['Làm ngơ','Chế giễu bạn','Hỏi han và giúp bạn trong khả năng'],2],['dp','Bản sắc văn hoá địa phương','Giới thiệu một nét văn hoá của ấp nơi trụ sở đặt, hỏi người lớn tuổi và ghi nguồn.',['Hỏi người lớn tuổi, ghi nguồn, xin phép khi chụp ảnh','Chép từ mạng không ghi nguồn','Tự bịa thông tin'],0],['ds','Di sản văn hoá dân tộc','Tìm hiểu một di sản qua nguồn chính thống và trình bày trong 5 câu.',['Tin đồn trên mạng','Sách, cơ quan văn hoá, bảo tàng chính thống','Bình luận ẩn danh'],1],['xanh','Văn hoá xanh','Thực hiện một việc bảo vệ môi trường và ghi lại kết quả.',['Xả rác xuống kênh','Đốt rác trong sân trường','Phân loại rác, hạn chế đồ nhựa dùng một lần'],2],['so','Văn hoá số, an toàn trên mạng','Soạn 3 quy tắc ứng xử an toàn trên mạng cho lớp.',['Đăng ngay cho vui','Xin phép bạn, gia đình và không đăng thông tin riêng tư','Gắn địa chỉ nhà bạn'],1]];
const CR=['Sáng tạo','Giá trị giáo dục','Lan toả, ứng dụng','Tinh thần tập thể','Đa dạng, duy trì'];
const BL=[['Nhà sáng tạo văn hoá số',s=>s.n>=3],['Người kể chuyện quê hương',s=>s.c.c2>0],['Đại sứ văn hoá học đường',s=>s.c.c6>0],['Chiến binh văn hoá xanh',s=>s.t.xanh>0],['Sứ giả lan toả yêu thương',s=>s.c.c5>0]];
const BLK=[['intro','Bản sắc và truyền thống nhà trường'],['mission','Sứ mệnh và giá trị cốt lõi'],['photos','Hình ảnh hoạt động tiêu biểu'],['stories','Những câu chuyện đẹp về thầy cô, học sinh, mái trường'],['milestones','Dấu mốc đáng nhớ của nhà trường']];
const PC=['var(--water)','var(--rice)','var(--gold)','var(--son)'];
let db=null,user=null,assets=null,isAdmin=false,uid=null,classes=[],pub=[],subs=[],sites={},content={},editing=null,pre={},sel=null;
const safeUrl=u=>/^https?:\/\//i.test(u||'')?u:'';
const cname=id=>(classes.find(x=>x.id===id)||{name:'Lớp đã xoá'}).name;
const sn=id=>(SITES.find(x=>x.id===id)||{n:''}).n;
const yr=t=>{const d=new Date(t||0),y=d.getFullYear()-(d.getMonth()<7?1:0);return y+'–'+(y+1)};
function media(o){let h='';if(o.image)h+=`<img class="m" alt="${esc(o.title||'')}" loading="lazy" src="${esc(o.image)}">`;if(o.video)h+=`<video class="m" controls src="${esc(o.video)}"></video>`;const l=safeUrl(o.link);if(l)h+=`<p><a href="${esc(l)}" target="_blank" rel="noopener">Xem liên kết</a></p>`;return h}
/* ---- định tuyến ---- */
const TABS=['khong-gian','hanh-trinh','sang-tao','tru-so','vinh-danh'];
const MENU=[['khong-gian','🧭 Vùng đất',BLK.map(b=>[b[0],b[1]])],['hanh-trinh','🚩 Hành trình',TH.map(t=>[t[0],t[1]])],['sang-tao','🎨 Sáng tạo',[['thu-thach','Sáu thử thách'],['ho-chieu','Hộ chiếu văn hoá'],['gui','Gửi sản phẩm'],['thu-vien','Thư viện sản phẩm']]],['tru-so','🏫 Bốn trụ sở',SITES.map(s=>[s.id,s.n])],['vinh-danh','🏆 Vinh danh',[]]];
$('nav').innerHTML=MENU.map(m=>`<div class="dd"><button type="button" data-tab="${m[0]}" aria-expanded="false" aria-controls="pl-${m[0]}">${m[1]}</button><div class="pl" id="pl-${m[0]}" hidden><a class="all" href="#${m[0]}">Xem toàn bộ mục</a>${m[2].map(i=>`<a href="#${m[0]}-${i[0]}">${esc(i[1])}</a>`).join('')}</div></div>`).join('');
function closeMenus(){document.querySelectorAll('#nav .pl').forEach(p=>p.hidden=true);document.querySelectorAll('#nav .dd>button').forEach(b=>b.setAttribute('aria-expanded','false'))}
$('nav').onclick=e=>{const b=e.target.closest('.dd>button');if(b){const open=b.getAttribute('aria-expanded')==='true';closeMenus();if(!open){b.setAttribute('aria-expanded','true');$('pl-'+b.dataset.tab).hidden=false}return}if(e.target.closest('.pl a'))closeMenus()};
document.addEventListener('click',e=>{if(!e.target.closest('#nav'))closeMenus()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenus()});
function route(){const h=location.hash.slice(1)||'khong-gian';const tab=TABS.find(t=>h===t||h.indexOf(t+'-')===0)||'khong-gian';
TABS.forEach(t=>$('s-'+t).hidden=t!==tab);
document.querySelectorAll('#nav .dd>button').forEach(b=>b.dataset.tab===tab?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current'));closeMenus();
if(tab==='sang-tao'&&pre.topic){$('ft').value=pre.topic;pre.topic=null}renderSites();const el=h!==tab&&tab!=='tru-so'?$(h):null;if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}
window.addEventListener('hashchange',route);
/* ---- bản đồ ---- */
function pts(){const P=SITES.map(s=>sites[s.id]);
if(!P.every(c=>c&&isFinite(parseFloat(c.lat))&&isFinite(parseFloat(c.lng))))return null;
const la=P.map(c=>+c.lat),lo=P.map(c=>+c.lng),a=Math.min(...la),b=Math.max(...la),c0=Math.min(...lo),d=Math.max(...lo);
return P.map(c=>[60+((+c.lng-c0)/((d-c0)||1))*280,245-((+c.lat-a)/((b-a)||1))*185])}
function drawMap(el,hl,pick,note){const real=pts(),p=real||[[105,95],[285,120],[95,215],[280,232]],k='f'+el.id;
const fields=[[18,60,110,52,0],[250,70,128,60,1],[14,186,100,56,1],[170,214,92,56,0],[300,196,84,56,0],[140,64,84,40,1]].map(r=>`<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" rx="6" fill="url(#${k}${r[4]?'g':''})" stroke="${r[4]?'var(--gold)':'var(--rice)'}" stroke-opacity=".55"/>`).join('');
const trees=[[168,60],[176,70],[158,72],[210,250],[222,258],[40,120],[52,128],[360,235],[370,248]].map(t=>`<circle cx="${t[0]}" cy="${t[1]}" r="6" fill="var(--rice)" opacity=".55"/>`).join('');
el.innerHTML=`<defs><pattern id="${k}" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 4H8" stroke="var(--rice)" stroke-width="1.4" opacity=".5"/></pattern><pattern id="${k}g" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 4H8" stroke="var(--gold)" stroke-width="1.4" opacity=".55"/></pattern></defs><rect width="400" height="300" fill="var(--rice)" opacity=".1"/><circle cx="44" cy="34" r="20" fill="var(--gold)" opacity=".4"/><ellipse cx="318" cy="34" rx="36" ry="9" fill="var(--card)"/><ellipse cx="338" cy="27" rx="22" ry="8" fill="var(--card)"/>${fields}${trees}
<path d="M-10,172 C70,126 150,196 232,158 S350,108 412,146" fill="none" stroke="var(--water)" stroke-width="15" opacity=".85"/><path d="M-10,172 C70,126 150,196 232,158 S350,108 412,146" fill="none" stroke="var(--card)" stroke-width="2" stroke-dasharray="4 10" opacity=".7"/>
<text class="it" x="236" y="192">kênh</text>
<path class="route" pathLength="1" d="M${p.map(q=>q.join(',')).join(' L')}"/>
<g transform="translate(366,34)"><circle r="16" fill="var(--card)" stroke="var(--ink)"/><path d="M0-12L4 0H-4Z" fill="var(--son)"/><path d="M0 12L4 0H-4Z" fill="var(--ink)"/><text class="it" y="-20" text-anchor="middle">B</text></g>
<text class="it" x="14" y="290">xã Vĩnh Gia · sơ đồ minh hoạ, không theo tỉ lệ</text>`+
SITES.map((s,i)=>{const on=hl===s.id;return`<g class="pn" tabindex="0" role="link" aria-label="${esc(s.n)}" data-id="${s.id}"><g transform="translate(${p[i][0]},${p[i][1]}) scale(${on?1.3:1})"><ellipse cy="2" rx="9" ry="3" fill="#000" opacity=".25"/><path class="ring" d="M0 0C-14-14-17-21-17-27A17 17 0 1 1 17-27C17-21 14-14 0 0Z" fill="${PC[i]}" stroke="var(--card)" stroke-width="3"/><circle cy="-27" r="9" fill="var(--card)"/><text y="-22.5" text-anchor="middle" style="stroke:none;font-size:13px;font-weight:700;fill:${PC[i]}">${i+1}</text></g><text x="${p[i][0]}" y="${p[i][1]+17}" text-anchor="middle">${esc(s.n)}</text></g>`}).join('');
el.querySelectorAll('.pn').forEach(g=>{g.onclick=()=>pick(g.dataset.id);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(g.dataset.id)}}});
if(note)note.textContent=real?'Vị trí các trạm theo toạ độ do quản trị viên cập nhật.':'Sơ đồ minh hoạ. Quản trị viên nhập toạ độ ở trang từng trụ sở để bản đồ định vị đúng.'}
function renderPin(){const s=SITES.find(x=>x.id===sel);
if(!s){$('pin').innerHTML='<p class="hint">Chạm vào một trạm trên bản đồ để mở câu chuyện của nơi ấy.</p>';return}
const cs=classes.filter(c=>c.site===s.id),ids=cs.map(c=>c.id),n=pub.filter(p=>ids.includes(p.cls)).length;
$('pin').innerHTML=`<div><h3>${s.n}</h3><p class="hint">${s.a} · ${cs.length} lớp · ${n} sản phẩm</p></div><a class="btn" href="#tru-so-${s.id}">Vào trụ sở</a>`}
function pickHome(id){sel=id;drawMap($('home'),sel,pickHome,$('homenote'));renderPin()}
/* ---- vùng đất ---- */
function renderBlocks(){$('blocks').innerHTML=BLK.map(b=>{const t=content[b[0]],ed=editing===b[0];return`<div class="card leaf" id="khong-gian-${b[0]}"><h3>${b[1]}</h3>`+(ed?`<textarea id="e-${b[0]}" rows="6">${esc(t||'')}</textarea><p><button class="btn g" data-sv="${b[0]}">Lưu</button> <button class="btn o" data-ca="1">Huỷ</button></p>`:(t?`<p style="white-space:pre-wrap;max-width:70ch">${esc(t)}</p>`:'<div class="sample">Trang này đang chờ câu chuyện của nhà trường. Khi có nội dung thật, quản trị viên viết vào đây.</div>')+(isAdmin?`<p><button class="btn o" data-ed="${b[0]}">Sửa nội dung</button></p>`:''))+'</div>'}).join('')}
/* ---- hành trình ---- */
function renderThemes(){$('themes').innerHTML=TH.map((t,i)=>`<div class="stop" id="hanh-trinh-${t[0]}"><div class="card"><span class="tag b">Chặng ${i+1}</span><h3>${t[1]}</h3><p><b>Nhiệm vụ:</b> ${t[2]}</p><p class="hint">Chọn cách làm đúng:</p>${t[3].map((o,j)=>`<button class="opt" data-t="${i}" data-j="${j}">${o}</button>`).join('')}<p class="hint" id="fb${i}" aria-live="polite"></p><a class="btn g" href="#sang-tao" data-top="${t[0]}">Gửi sản phẩm</a></div></div>`).join('')}
$('themes').onclick=e=>{const t=e.target;if(t.dataset.top){pre.topic=t.dataset.top;return}if(t.dataset.t==null)return;const i=+t.dataset.t,ok=+t.dataset.j===TH[i][4];t.classList.add(ok?'ok':'no');$('fb'+i).textContent=ok?'Chính xác!':'Chưa đúng, hãy thử lại.'};
/* ---- sáng tạo ---- */
function opts(el,arr,all){el.innerHTML=(all?`<option value="">${all}</option>`:'')+arr.map(a=>`<option value="${esc(a[0])}">${esc(a[1])}</option>`).join('')}
function fillSel(){const k=[$('gl').value,$('gy').value];
opts($('gl'),classes.map(c=>[c.id,c.name]),'Tất cả lớp');
opts($('gy'),[...new Set(pub.map(p=>yr(p.ts)))].sort().reverse().map(y=>[y,y]),'Mọi năm học');
if(!$('gc').options.length)opts($('gc'),CH.map((c,i)=>['c'+(i+1),(i+1)+'. '+c.split(':')[0]]),'Tất cả thử thách');
$('gl').value=k[0];$('gy').value=k[1]}
function stats(){const m={};classes.forEach(c=>m[c.id]={cls:c,n:0,pts:0,c:{},t:{}});
pub.forEach(p=>{const s=m[p.cls];if(!s)return;s.n++;s.pts+=+p.total||0;s.c[p.ch]=(s.c[p.ch]||0)+1;s.t[p.topic]=(s.t[p.topic]||0)+1});return Object.values(m)}
const stamps=s=>BL.filter(b=>b[1](s)).map(b=>`<span class="st">${b[0]}</span>`).join('');
function renderClasses(){const st=stats();
$('clist').innerHTML=st.length?st.map(s=>`<div class="card"><h3>Lớp ${esc(s.cls.name)}</h3><p class="hint">${esc(sn(s.cls.site))}${s.cls.teacher?' · GVCN: '+esc(s.cls.teacher):''}</p>${s.cls.slogan?`<p>“${esc(s.cls.slogan)}”</p>`:''}<p class="hint">${s.n} sản phẩm đã duyệt</p>${stamps(s)||'<span class="hint">Trang hộ chiếu còn trống, đang chờ con dấu đầu tiên.</span>'}</div>`).join(''):'<div class="sample">Chưa có lớp nào trên bản đồ. Quản trị viên thêm lớp ở biểu mẫu bên dưới.</div>';
$('chal').innerHTML=CH.map((c,i)=>`<div class="card"><span class="tag b">Thử thách ${i+1}</span><p style="margin:0">${esc(c)}</p></div>`).join('');
fillSel();renderGallery()}
function renderGallery(){const l=$('gl').value,c=$('gc').value,y=$('gy').value,q=$('gq').value.trim().toLowerCase();
const r=pub.filter(p=>(!l||p.cls===l)&&(!c||p.ch===c)&&(!y||yr(p.ts)===y)&&(!q||((p.title||'')+' '+(p.desc||'')).toLowerCase().includes(q))).sort((a,b)=>(b.ts||0)-(a.ts||0));
$('gal').innerHTML=r.length?r.map(p=>`<div class="card"><span class="tag">Lớp ${esc(cname(p.cls))}</span><span class="tag b">${esc((TH.find(t=>t[0]===p.topic)||[0,'Khác'])[1])}</span><span class="tag">${yr(p.ts)}</span><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p>${media(p)}<p class="hint">Điểm: ${p.total||0}/50</p></div>`).join(''):'<div class="sample">Chưa có sản phẩm nào khớp bộ lọc. Hãy là lớp đầu tiên gửi sản phẩm.</div>'}
['gl','gc','gy'].forEach(i=>$(i).onchange=renderGallery);$('gq').oninput=renderGallery;

/* ---- bốn trụ sở ---- */
function renderSites(){const h=location.hash.slice(1),id=h.indexOf('tru-so-')===0?h.slice(7):null,s=SITES.find(x=>x.id===id),el=$('sites');
if(!s){el.innerHTML='<h2>Bốn trụ sở, một mái nhà chung</h2><div class="grid">'+SITES.map((x,i)=>`<div class="card" style="border-top:6px solid ${PC[i]}"><h3>${x.n}</h3><p class="hint">${x.a}</p><a class="btn" href="#tru-so-${x.id}">Khám phá không gian</a></div>`).join('')+'</div>';return}
const d=sites[s.id]||{},cs=classes.filter(c=>c.site===s.id),ids=cs.map(c=>c.id),ps=pub.filter(p=>ids.includes(p.cls)),
gm=d.lat&&d.lng?`<p><a class="btn o" target="_blank" rel="noopener" href="https://www.google.com/maps?q=${encodeURIComponent(d.lat+','+d.lng)}">Mở Google Maps</a></p>`:'';
el.innerHTML=`<p><a href="#tru-so">Về bốn trụ sở</a></p><h2>${s.n}</h2><p class="hint">Địa chỉ: ${s.a}</p>`+(d.photo?`<img class="m" alt="Ảnh ${esc(s.n)}" src="${esc(d.photo)}">`:'<div class="sample">Trụ sở này chưa có ảnh đại diện. Quản trị viên tải ảnh thật lên.</div>')+(d.note?`<p style="white-space:pre-wrap;max-width:70ch">${esc(d.note)}</p>`:'')+`<div class="mapwrap" style="margin:12px 0"><svg id="loc" class="map" viewBox="0 0 400 300" role="group" aria-label="Vị trí trụ sở trên bản đồ"></svg></div>${gm}<h3>Các lớp học tại đây</h3>`+(cs.length?cs.map(c=>`<span class="tag">Lớp ${esc(c.name)}</span>`).join(''):'<p class="hint">Chưa có lớp nào gắn với trụ sở này.</p>')+'<h3 style="margin-top:14px">Sản phẩm của học sinh</h3><div class="grid">'+(ps.length?ps.map(p=>`<div class="card"><span class="tag">Lớp ${esc(cname(p.cls))}</span><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p>${media(p)}</div>`).join(''):'<div class="sample">Chưa có sản phẩm được duyệt tại trụ sở này.</div>')+'</div>';
drawMap($('loc'),s.id,i=>{location.hash='tru-so-'+i});
}
/* ---- vinh danh ---- */
function renderRank(){const st=stats().sort((a,b)=>b.pts-a.pts);
$('rank').innerHTML=st.length?st.map((s,i)=>`<div class="card rk"><b class="n">${i+1}</b><div><h3>Lớp ${esc(s.cls.name)} · ${s.pts} điểm</h3><p class="hint">${s.n} sản phẩm đã duyệt · ${esc(sn(s.cls.site))}</p>${stamps(s)||'<span class="hint">Chưa có con dấu</span>'}</div></div>`).join('')+'<p class="hint">Quy ước con dấu (có thể điều chỉnh): từ 3 sản phẩm → Nhà sáng tạo; thử thách 2 → Người kể chuyện quê hương; thử thách 6 → Đại sứ văn hoá học đường; chủ đề Văn hoá xanh → Chiến binh xanh; thử thách 5 → Sứ giả yêu thương. Huy hiệu cá nhân do quản trị viên trao ngoài hệ thống.</p>':'<div class="sample">Chưa có lớp hoặc sản phẩm đã duyệt nên bảng vinh danh còn trống.</div>';
}

function ban(t){$('ban').hidden=!t;$('ban').textContent=t||''}
function renderAll(){renderBlocks();renderClasses();renderRank();renderSites();drawMap($('home'),sel,pickHome,$('homenote'));renderPin()}
/* ---- khởi động ---- */
let CFG={};
renderThemes();
(async()=>{try{const g=n=>fetch('data/'+n+'.json').then(r=>{if(!r.ok)throw 0;return r.json()});
const d=await Promise.all(['config','sites','classes','products','content'].map(g));
CFG=d[0];sites=d[1];classes=d[2];pub=d[3].map(p=>({...p,ts:Date.parse(p.date)||0}));content=d[4]}
catch(e){ban('Không tải được dữ liệu trong thư mục data/. Nếu mở file trực tiếp trên máy, hãy chạy máy chủ cục bộ (xem README).')}
const API=CFG.apiUrl||CFG.formUrl;
if(API&&safeUrl(API)&&/script\.google\.com/.test(API)){try{const r=await fetch(API+(API.includes('?')?'&':'?')+'action=data');const j=await r.json();
if(j.sites)sites=j.sites;if(j.classes)classes=j.classes;if(j.products)pub=j.products.map(p=>({...p,ts:Date.parse(p.date)||0}));if(j.content)content=j.content}catch(e){ban('Chưa đọc được dữ liệu từ Google Sheet, đang hiện dữ liệu trong thư mục data/.')}}
if(CFG.formUrl&&safeUrl(CFG.formUrl))$('guilink').href=CFG.formUrl;else{$('guilink').hidden=true;$('fm').textContent='Biểu mẫu gửi sản phẩm sẽ được nhà trường cập nhật sớm.'}
renderAll();route()})();
