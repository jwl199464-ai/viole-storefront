/* ============================================================
   VIOLE JU × The Row — storefront overlay loader
   Cafe24 Script Tags API 로 라이브 전 페이지에 로드됨.
   DEV 게이트: 개발 중에는 ?viole=1 (또는 viole_preview 쿠키)일 때만 활성 → 일반 고객엔 무영향.
   preview 진입: 주소 끝에 ?viole=1  /  preview 해제: ?viole=0
   완성 후 게이트 해제 = 아래 DEV 라인을 true 로 바꾸거나 게이트 제거.
   ============================================================ */
(function () {
  try {
    var href = location.href;

    // preview on/off (쿠키로 페이지 이동 간 유지)
    if (/[?&#]viole=0/.test(href)) { document.cookie = 'viole_preview=; path=/; max-age=0'; return; }
    if (/[?&#]viole=1/.test(href)) { document.cookie = 'viole_preview=1; path=/; max-age=86400'; }
    var DEV = /[?&#]viole=1/.test(href) || document.cookie.indexOf('viole_preview=1') > -1;
    if (!DEV) return;                              // 일반 고객: 아무 것도 안 함 (개발 중)

    var H = document.documentElement;
    if (H.getAttribute('data-viole') === 'on') return;   // 중복 주입 방지
    H.setAttribute('data-viole', 'on');

    var BASE = 'https://cdn.jsdelivr.net/gh/jwl199464-ai/viole-storefront@main/';

    function link(id, url) {
      if (document.getElementById(id)) return;
      var l = document.createElement('link');
      l.id = id; l.rel = 'stylesheet'; l.href = url;
      document.head.appendChild(l);
    }
    // 폰트 + The Row 오버레이 CSS (preview 중엔 캐시버스트로 항상 최신 CSS)
    link('vj-font', 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
    link('vj-css', BASE + 'viole-therow.css?t=' + Date.now());

    // preview 확인용 하단 띠 (게이트 해제 시 자동 제거하도록 CSS가 data-viole 의존)
    function proof() {
      if (document.getElementById('vj-proof')) return;
      var d = document.createElement('div');
      d.id = 'vj-proof';
      d.textContent = 'VIOLE JU × THE ROW — preview';
      document.body.appendChild(d);
    }
    if (document.body) proof();
    else document.addEventListener('DOMContentLoaded', proof);

    console.log('%c[VIOLE JU] The Row preview active', 'color:#1c1b1b;font-weight:700');

    // (다음 단계) DOM 재구성 — 라이브 스킨 DOM 분석 후 단계적으로 추가:
    //   · 헤더를 The Row 3분할(.hd)로
    //   · PLP 카드 그리드(.plp-grid/.card) 매핑
    //   · PDP 2단(.pdp / 이미지 2:3 세로스택 / sticky 정보)
  } catch (e) { /* 스토어프론트는 절대 깨뜨리지 않음 */ }
})();
