# viole-storefront

VIOLE JU 자사몰(Cafe24, viole-ju.com)에 **The Row 스타일**을 입히는 오버레이 에셋.
Cafe24 **Script Tags API**로 라이브 스토어프론트 전 페이지에 로드된다.

- `viole-therow.js` — 로더(Script Tag `src`). DEV 게이트(`?viole=1`)일 때만 활성 → 개발 중 일반 고객엔 무영향.
- `viole-therow.css` — The Row 오버레이 디자인.

서빙: jsDelivr CDN
`https://cdn.jsdelivr.net/gh/jwl199464-ai/viole-storefront@main/viole-therow.js`

수정 후: `git push` → `https://purge.jsdelivr.net/gh/jwl199464-ai/viole-storefront@main/viole-therow.js` 로 캐시 퍼지.

> 비밀키 절대 커밋 금지 (이 repo엔 CSS/JS만).
