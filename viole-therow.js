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
    if (/[?&#]viole=1/.test(href)) { document.cookie='viole_preview=1; path=/; max-age=86400'; }
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
      function cat(n){ var a=Array.prototype.filter.call(document.querySelectorAll('a'),function(x){return (x.textContent||'').trim()===n && (x.getAttribute('href')||'').indexOf('list.html')>-1;})[0]; return a?a.getAttribute('href'):'/product/list.html'; }
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

    function proof(){ if(document.getElementById('vj-proof'))return; var d=document.createElement('div'); d.id='vj-proof'; d.textContent='VIOLE JU × THE ROW — preview'; document.body.appendChild(d); }

    function run(){ try{ buildHeader(); buildHome(); proof(); }catch(e){} }
    if(document.readyState!=='loading') run(); else document.addEventListener('DOMContentLoaded', run);
  } catch(e){ /* 스토어프론트 절대 안 깨뜨림 */ }
})();
