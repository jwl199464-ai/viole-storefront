/* ============================================================
   VIOLE JU × The Row — storefront overlay loader
   Cafe24 Script Tags API 로 로드. DEV 게이트(?viole=1 / 쿠키)일 때만 활성 → 일반 고객 무영향.
   기능: 폰트/CSS 주입 · 헤더 텍스트네비 교체(전 페이지) · 홈(메인)=목업 구성 교체.
   이미지는 BASE(자기 위치)에서 로드: hero.jpg p2~p5.jpg ed.jpg
   preview on: ?viole=1 / off: ?viole=0
   ============================================================ */
(function () {
  try {
    var href = location.href;
    if (/[?&#]viole=0/.test(href)) { document.cookie='viole_preview=; path=/; max-age=0'; return; }
    if (/[?&#]viole=1/.test(href)) { document.cookie='viole_preview=1; path=/; max-age=2592000'; }
    var DEV = /[?&#]viole=1/.test(href) || document.cookie.indexOf('viole_preview=1')>-1;
    if (!DEV) return;                                  // 일반 고객: 아무 동작 안 함

    var H=document.documentElement;
    if (H.getAttribute('data-viole')==='on') return;
    H.setAttribute('data-viole','on');

    // 자기 src 기준으로 CSS·이미지 위치 자동 도출
    var me = document.currentScript || (function(){var s=document.querySelectorAll('script[src*="viole-therow.js"]');return s[s.length-1];})();
    var BASE = (me&&me.src)? me.src.replace(/viole-therow\.js.*$/,'') : 'https://jwl199464-ai.github.io/viole-storefront/';

    function link(id,url){ if(document.getElementById(id))return; var l=document.createElement('link'); l.id=id; l.rel='stylesheet'; l.href=url; document.head.appendChild(l); }
    link('vj-font','https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
    link('vj-css', BASE+'viole-therow.css?t='+Date.now());

    // ── 헤더 → The Row 텍스트 3분할 (모든 페이지) ──
    function buildHeader(){
      var logo = Array.prototype.filter.call(document.querySelectorAll('a,h1,div,span,strong,p'), function(e){
        return /^\s*Viole[\s\-]?ju\s*$/i.test((e.textContent||'').replace(/\s+/g,' ')) && e.getBoundingClientRect().top<110 && e.getBoundingClientRect().width>0 && e.children.length<2;
      })[0];
      if(!logo) return;
      var hdr=logo;
      while(hdr.parentElement){ var r=hdr.getBoundingClientRect(); if(r.width>=window.innerWidth*0.9 && r.height<140) break; hdr=hdr.parentElement; }
      if(hdr.getAttribute('data-vjhd')) return;
      hdr.setAttribute('data-vjhd','1');
      function cat(n){ var a=Array.prototype.filter.call(document.querySelectorAll('a[href*="/category/"],a[href*="cate_no="]'),function(x){var t=(x.textContent||'').trim().replace(/^\([^)]*\)\s*/,'');return t.toLowerCase()===n.toLowerCase();})[0]; return a?a.getAttribute('href'):'/product/list.html'; }
      var nav=[['New','/product/list.html'],['Outerwear',cat('Outerwear')],['Tops',cat('Tops')],['Knitwear','/product/list.html'],['Dresses','/product/list.html'],['Trousers','/product/list.html'],['Sale','/product/list.html']].map(function(p){return '<a href="'+p[1]+'">'+p[0]+'</a>';}).join('');
      var util=[['Search','/product/search.html'],['Stores','#'],['Saved','/myshop/wish_list.html'],['Login','/member/login.html'],['Bag (0)','/order/basket.html']].map(function(p){return '<a href="'+p[1]+'">'+p[0]+'</a>';}).join('');
      hdr.classList.add('vj-hd');
      hdr.innerHTML='<nav class="vj-nav">'+nav+'</nav><a class="vj-logo" href="/">VIOLE&nbsp;JU</a><div class="vj-util">'+util+'</div>';
    }

    // ── 홈(메인) = 목업 구성(히어로+NEW ARRIVALS+EDITORIAL), 잡다한 섹션 제거 ──
    function buildHome(){
      if(!/^\/(index\.html)?$/.test(location.pathname)) return;
      var main=document.querySelector('main#top')||document.querySelector('main');
      if(!main || main.getAttribute('data-vjhome')) return;
      main.setAttribute('data-vjhome','1');
      function sw(){var s='';for(var i=0;i<arguments.length;i++)s+='<i style="background:'+arguments[i]+'"></i>';return s;}
      function card(img,nm,pr,s){return '<a class="vj-pcard" href="/product/list.html"><img class="vj-ph" src="'+BASE+img+'"><div class="vj-nm">'+nm+'</div><div class="vj-pr">'+pr+'</div><div class="vj-sw">'+s+'</div></a>';}
      var cards=[
        card('hero.jpg','린넨 크롭 재킷','<span class="vj-was">189,000원</span>151,200원',sw('#b8b1a4','#efece6')),
        card('p2.jpg','울 더블 코트','320,000원',sw('#3a3a3a','#b8a98f')),
        card('p3.jpg','울 테일러드 슬랙스','142,000원',sw('#b8a98f','#2c2c2c')),
        card('p4.jpg','실크 슬립 드레스','<span class="vj-was">238,000원</span>190,400원',sw('#efece6')),
        card('p5.jpg','코튼 보트넥 톱','98,000원',sw('#ffffff','#1c1b1b'))
      ].join('');
      main.innerHTML =
        '<section class="vj-hero"><img src="'+BASE+'hero.jpg"><a class="vj-cue" href="/product/list.html">Shop New Arrivals ↓</a></section>'
       +'<section class="vj-sec"><div class="vj-sec-h"><h2>NEW ARRIVALS</h2><a href="/product/list.html">전체 보기 →</a></div><div class="vj-car">'+cards+'</div></section>'
       +'<section class="vj-feat-wrap"><div class="vj-feat"><img src="'+BASE+'ed.jpg"><div class="vj-feat-tx"><div class="vj-k">EDITORIAL</div><h3>여백이 만드는<br>단정한 하루</h3><p>과하지 않은 디테일과 자연스러운 실루엣. 매일 입어도 질리지 않는, 오래 곁에 두는 옷을 제안합니다.</p><a href="/product/list.html">컬렉션 보기</a></div></div></section>';
    }

    // ── PLP(상품목록): 빈 카테고리 배너 섹션 숨김(여백 정리) ──
    function buildPLP(){
      if(location.pathname.indexOf('/product/list')<0 && location.pathname.indexOf('/product/category')<0) return;
      var pkg=document.querySelector('.normalpackage_box')||document.querySelector('.xans-product-normalpackage');
      if(!pkg) return;
      var el=pkg.previousElementSibling, n=0;
      while(el && n<10){ n++;
        var hasImg=el.querySelector('img'); var txt=(el.textContent||'').trim();
        if(!hasImg && txt.length<3 && (''+(el.className||'')).indexOf('headcategory')<0) el.classList.add('vj-hidden');
        el=el.previousElementSibling;
      }
    }

    // ── PDP(상품상세): 네이티브 갤러리는 CSS로 숨기고, 별도 스택을 주입(카페24 JS와 안 싸움) ──
    // 화보 매핑: product_no → 컷 수. Pages 의 pdp/<no>/1..N.jpg 를 직접 로드(카페24 추가이미지 API 우회).
    var VJ_GALLERY = {"12": 14};
    // 상품별 아코디언 콘텐츠(상품설명·상품정보). 배송/취소는 매장공통 상수.
    var VJ_PDP_INFO = {
      "12": {
        desc: "가볍게 걸치는, 단정한 여름 린넨 한 벌.<br><br>슬럽감 있는 린넨으로 가볍고 통기성이 좋아 여름에 잘 어울립니다. V넥 라인과 3버튼 여밈, 앞면 패치 포켓 2개의 절제된 디테일이 단정한 실루엣을 완성합니다.",
        info: "소재 린넨 100%<br>색상 브라운<br>핏 세미 오버핏<br>디테일 V넥 · 3버튼 · 패치 포켓 2"
      }
    };
    var VJ_SHIP = "택배 배송. 배송비 2,500원 (50,000원 이상 구매 시 무료).<br>평균 2~3 영업일 내 출고 (주말·공휴일 제외). 거래처 사정에 따라 지연될 수 있습니다.";
    var VJ_RETURN = "<b>취소</b> 출고 전 마이페이지·채널로 요청해 주세요. 출고 후에는 취소가 불가합니다.<br><br><b>교환·반품</b> 상품 수령 후 7일 이내 접수. 단순 변심 시 왕복 배송비는 고객 부담입니다. 착용 흔적(향 포함)·택 제거·상품 변형이 있을 경우 불가합니다. 세일·품절 상품은 교환·반품이 불가합니다.";
    function vjPno(){ var m=location.href.match(/product_no=(\d+)/)||location.pathname.match(/\/(\d+)\/(?:category|display)\//); return m&&m[1]; }
    function buildPDP(){
      var area=document.querySelector('.xans-product-image'); if(!area) return;
      // ① 화보 직접 로드: 매핑된 상품이면 Pages 화보를 스택
      var pno = vjPno();
      if(pno && VJ_GALLERY[pno] && !area.getAttribute('data-vjpdp')){
        var n=VJ_GALLERY[pno], html='';
        for(var i=1;i<=n;i++) html += '<img class="vj-pdp-img" src="'+BASE+'pdp/'+pno+'/'+i+'.jpg" onerror="this.remove()">';
        var st=document.createElement('div'); st.className='vj-pdp-stack'; st.innerHTML=html;
        area.insertBefore(st, area.firstChild); area.setAttribute('data-vjpdp','1');
        return;
      }
      // ② 매핑 없으면 네이티브 갤러리에서 수집(폴백)
      function tryBuild(){
        if(area.getAttribute('data-vjpdp')) return true;
        var rw=area.querySelector('.RW'); if(!rw) return false;
        var urls=[], seen={};
        Array.prototype.forEach.call(rw.querySelectorAll('img'), function(im){
          var s=im.getAttribute('src')||'';
          if(!s || /btn_|txt_|icon|loading|spr_|common|btn|blank|\.gif(\?|$)/i.test(s)) return;
          var big=s.replace(/\/(tiny|small|medium|micro|smaller|thumb)\//i,'/big/');
          if(big.indexOf('//')===0) big='https:'+big;
          var key=big.split('?')[0]; if(!seen[key]){ seen[key]=1; urls.push(big); }
        });
        if(!urls.length) return false;
        var stack=document.createElement('div'); stack.className='vj-pdp-stack';
        stack.innerHTML=urls.map(function(u){return '<img class="vj-pdp-img" src="'+u+'" onerror="this.remove()">';}).join('');
        area.insertBefore(stack, area.firstChild);
        area.setAttribute('data-vjpdp','1');   // CSS가 이 표시로 네이티브 .RW / .RTMB 숨김
        return true;
      }
      if(tryBuild()) return;
      var obs=new MutationObserver(function(){ if(tryBuild()) obs.disconnect(); });
      obs.observe(area,{childList:true,subtree:true});
      setTimeout(function(){ try{obs.disconnect();}catch(e){} }, 8000);
    }

    // ── PDP 오른쪽 정보패널 = 목업 .pdp__info 이식 (네이티브 표 숨김 / 폼·버튼은 살려서 .click() 연결) ──
    function buildInfo(){
      var info=document.querySelector('.infoArea'); if(!info) return;
      if(info.getAttribute('data-vjinfo')) return;
      var t=info.innerText||'';
      function m(re){var x=t.match(re);return x?(x[1]||'').trim():'';}
      var hA=info.querySelector('.headingArea');
      var name=((hA?hA.innerText:document.title)||'').replace(/\s+/g,' ').trim().split('|')[0].trim().slice(0,80);
      if(!name) return;
      var was=m(/소비자가\s*([\d,]+원)/), now=m(/판매가\s*([\d,]+원)/)||m(/([\d,]+원)/), off=m(/(\d{1,2}%)/);
      var summary=m(/상품요약정보\s*([^\n\t]+)/), ship=m(/배송비\s*([^\n]+)/);
      var crumbRaw=((document.querySelector('.xans-product-headcategory, .path')||{}).textContent||'').replace(/\s+/g,' ').trim();
      var crumbCat=crumbRaw.replace(/현재\s*위치|홈|HOME|home|＞|>|·|\|/g,' ').replace(/\s+/g,' ').trim().slice(0,24);
      var crumb=crumbCat?('여성 · '+crumbCat):'';
      var cart=info.querySelector('.actionCart'), wish=info.querySelector('.actionWish'), buy=info.querySelector('a.btnSubmit');
      var priceHtml=(was&&was!==now?'<span class="vj-was">'+was+'</span>':'')+(now||'')+(off?'<span class="vj-off">'+off+'</span>':'');
      var pinfo=VJ_PDP_INFO[vjPno()]||{};
      var accItems=[['상품 설명', pinfo.desc||summary||name, true]];
      if(pinfo.info) accItems.push(['상품 정보', pinfo.info, false]);
      accItems.push(['배송 안내', VJ_SHIP, false], ['취소 / 교환 / 반품', VJ_RETURN, false]);
      var accHtml='<div class="vj-acc">'+accItems.map(function(it){return '<div class="vj-acc-item'+(it[2]?' open':'')+'"><button class="vj-acc-h">'+it[0]+' <span>'+(it[2]?'−':'+')+'</span></button><div class="vj-acc-b">'+it[1]+'</div></div>';}).join('')+'</div>';
      var p=document.createElement('div'); p.className='vj-info';
      p.innerHTML=
        (crumb?'<div class="vj-crumb">'+crumb+'</div>':'')+
        '<div class="vj-pname-row"><h1 class="vj-pname">'+name+'</h1><button class="vj-wish" title="찜">♡</button></div>'+
        '<div class="vj-price">'+priceHtml+'</div>'+
        (ship?'<div class="vj-ship">배송 · <b>'+ship+'</b></div>':'')+
        '<button class="vj-cta">Add to Bag</button>'+
        '<button class="vj-save">♡ Add to Saved</button>'+
        accHtml;
      info.insertBefore(p, info.firstChild);
      info.setAttribute('data-vjinfo','1');
      var cta=p.querySelector('.vj-cta'); if(cta)cta.addEventListener('click',function(){var b=cart||buy;if(b)b.click();});
      var sv=p.querySelector('.vj-save'); if(sv)sv.addEventListener('click',function(){if(wish)wish.click();});
      var wb=p.querySelector('.vj-wish'); if(wb)wb.addEventListener('click',function(){if(wish)wish.click();});
      Array.prototype.forEach.call(p.querySelectorAll('.vj-acc-h'),function(h){h.addEventListener('click',function(){var it=h.parentElement;it.classList.toggle('open');var s=h.querySelector('span');if(s)s.textContent=it.classList.contains('open')?'−':'+';});});
    }

    function proof(){ if(document.getElementById('vj-proof'))return; var d=document.createElement('div'); d.id='vj-proof'; d.textContent='VIOLE JU × THE ROW — preview'; document.body.appendChild(d); }

    function run(){ try{ buildHeader(); buildHome(); buildPLP(); buildPDP(); buildInfo(); proof(); }catch(e){} }
    if(document.readyState!=='loading') run(); else document.addEventListener('DOMContentLoaded', run);
  } catch(e){ /* 스토어프론트 절대 안 깨뜨림 */ }
})();
