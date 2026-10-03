/* 과학의 역사와 문화 Ⅰ 과학과 문명의 탄생과 통합 — 실제 자료
   r1 그림자로 잰 지구 — 2025년 하짓날 아스완과 알렉산드리아의 실제 태양 고도로 에라토스테네스 따라 하기
   r2 각도 8′의 오차 — 화성의 실제 궤도는 원일까 타원일까(케플러 제1법칙)
   자료: data/history-sky.js (NASA JPL Horizons) */
(function () {
"use strict";
var S = window.REAL_HSKY || { sun2025: {}, sites: {}, mars: [] };
var NA = "시에네(아스완)", NB = "알렉산드리아";
var EA = (S.sun2025[NA] || ["", 89.35])[1], EB = (S.sun2025[NB] || ["", 82.24])[1];
var DANG = EA - EB, LA = (S.sites[NA] || [24.0889])[0], LB = (S.sites[NB] || [31.2001])[0];
var DKM = (function () { var a = S.sites[NA] || [24.0889, 32.8998], b = S.sites[NB] || [31.2001, 29.9187], r = Math.PI / 180, x = Math.pow(Math.sin((b[0] - a[0]) * r / 2), 2) + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.pow(Math.sin((b[1] - a[1]) * r / 2), 2); return 2 * 6371 * Math.asin(Math.sqrt(x)); })();   /* 두 도시 사이의 실제 거리(대원 거리, km) */
var DNS = (LB - LA) * 111.19;                                         /* 남북 방향 몫(km) */
var CIRC = DKM * 360 / DANG;
var M = S.mars.map(function (r) { return [r[1], r[2], Math.sqrt(r[1] * r[1] + r[2] * r[2])]; });
var RMIN = Math.min.apply(null, M.map(function (r) { return r[2]; })), RMAX = Math.max.apply(null, M.map(function (r) { return r[2]; }));
var ECC = (RMAX - RMIN) / (RMAX + RMIN);
var SRC1 = "<small>출처: NASA 제트추진연구소(JPL) Horizons — 2025년 6월 21일 아스완(북위 " + LA + "°)과 알렉산드리아(북위 " + LB + "°)에서 본 태양의 가장 높은 고도(2분 간격 계산 가운데 최대). 두 도시 사이 거리는 좌표로 구한 대원 거리. 사본은 data/history-sky.js.</small>";
var SRC2 = "<small>출처: NASA JPL Horizons — 2020 ~ 2023년 화성의 태양 중심 위치(황도면, 10일 간격). 사본은 data/history-sky.js.</small>";

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 옛 과학자들의 방법이 얼마나 정확했는지 적어 보세요.",
  cases: [
  {
    id: "r1", tag: "실제 자료 · 고대 그리스의 과학", title: "그림자로 잰 지구", short: "에라토스테네스",
    who: "📏", name: "알렉산드리아 도서관",
    say: "“기원전 3세기 에라토스테네스는 하짓날 정오 시에네(지금의 아스완)에서는 우물 바닥까지 해가 비치는데, 알렉산드리아에서는 막대에 그림자가 생긴다는 것으로 지구의 둘레를 쟀어요. NASA 가 계산한 <b>2025년 하짓날 두 도시의 실제 태양 고도</b>와 두 도시 사이의 <b>실제 거리 약 " + Math.round(DKM) + " km</b> 로 지구의 둘레를 구해 주세요. 결과가 실제 둘레(약 4만 km)와 다르다면 왜일까요?”",
    predict: {
      q: "두 도시에서 태양 고도가 다른 까닭은?",
      options: ["㉠ 태양이 가까워 햇빛이 퍼져 오기 때문", "㉡ 햇빛은 거의 나란한데 지구가 둥글어 두 곳의 땅이 기울어진 각도가 다르기 때문", "㉢ 두 도시의 시각이 달라서"],
      answer: 1
    },
    task: "태양 고도 차이를 구하고, 지구 둘레 = 거리 × 360 ÷ 고도 차이 로 계산해 슬라이더로 맞추세요(± 1,000 km).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, g = 20000;
      function draw() {
        H.paper(ctx, W, cv.H);
        var cx = 200, cy = 330, R = 230;
        ctx.save(); ctx.strokeStyle = H.v("--line"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); ctx.restore();
        [[0, NA, EA, "--coral-700"], [-DANG * 3, NB, EB, "--brand-700"]].forEach(function (p) {
          var a = (-90 + p[0]) * Math.PI / 180, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a), nx = Math.cos(a), ny = Math.sin(a);
          H.line(ctx, [[x, y], [x + nx * 40, y + ny * 40]], H.v(p[3]), 3);
          H.text(ctx, p[1] + " " + p[2].toFixed(2) + "°", x + nx * 46, y + ny * 46 - 4, { s: 11.5, w: "800", a: "center", c: H.v(p[3]) });
        });
        for (var k = 0; k < 4; k++) H.arrow(ctx, 40 + k * 90, 4, 40 + k * 90, 32, H.v("--amber-700"), 2, 7);
        H.text(ctx, "햇빛(거의 나란함)", 400, 24, { s: 11, w: "800", c: H.v("--amber-700") });
        H.text(ctx, "※ 그림의 각도는 3배로 키움", 20, cv.H - 8, { s: 10, c: H.v("--mist") });
        H.rows(ctx, 520, 60, [["태양 고도 차이", DANG.toFixed(2) + "°"], ["두 도시 사이 거리", Math.round(DKM) + " km"], ["내 답 (지구 둘레)", g.toLocaleString() + " km", null, true]], 58);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "지구의 둘레", min: 10000, max: 80000, step: 100, value: 20000, fmt: function (x) { return x.toLocaleString() + " km"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("고도 차이(°) : 360° = 남북 거리 : 지구 둘레. " + SRC1
        + "<div data-map='{\"id\":\"aswan\",\"name\":\"아스완(옛 시에네)과 나일강\",\"lat\":24.09,\"lng\":32.90,\"zoom\":11,\"ask\":\"아스완은 북회귀선(북위 23.44°) 바로 북쪽에 있습니다. 하짓날 정오에 해가 거의 머리 위에 오는 까닭을 위치와 연결해 적어 보세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(g - CIRC) <= 1000) return { ok: true, msg: Math.round(DKM) + " × 360 ÷ " + DANG.toFixed(2) + " ≈ " + Math.round(CIRC).toLocaleString() + " km — 실제 둘레(약 40,000 km)보다 약 " + Math.round((CIRC / 40030 - 1) * 100) + "% 큽니다. 두 도시가 같은 경선 위에 있지 않기 때문이에요(아래 설명)." };
          return { ok: false, msg: g.toLocaleString() + " km 는 " + (g < CIRC ? "작습니다" : "큽니다") + ". 고도 차이를 먼저 구한 뒤 비례식을 세우세요." };
        }
      };
    },
    hints: [EA.toFixed(2) + " − " + EB.toFixed(2) + " ≈ " + DANG.toFixed(2) + "° 입니다.", Math.round(DKM) + " × 360 ÷ " + DANG.toFixed(2) + " = ?"],
    solution: "약 <b>" + (Math.round(CIRC / 100) * 100).toLocaleString() + " km</b> (실제 약 40,000 km — 남북 거리 " + Math.round(DNS) + " km 를 쓰면 약 40,000 km).",
    why: "에라토스테네스는 두 도시의 그림자 각도 차이를 약 7.2°(원의 50분의 1), 거리를 5,000 스타디온으로 보고 지구 둘레를 25만 스타디온으로 구했습니다. 스타디온의 길이가 확실하지 않아, 어떤 스타디온 값을 쓰느냐에 따라 실제와 2 ~ 16 % 쯤 차이가 납니다. 막대와 그림자, 기하학만으로 행성의 크기를 잰 셈이에요.<br>"
      + "이 방법의 바탕에는 ‘햇빛은 나란하다(태양이 매우 멀다)’와 ‘지구는 둥글다’는 두 가정이 있습니다. 관측과 가정과 논리로 직접 갈 수 없는 것을 재는 것 — 고대 그리스 과학의 힘입니다.<br>※ 이 계산은 두 도시가 같은 경선(남북으로 이은 선) 위에 있다고 가정합니다. 실제로는 알렉산드리아가 경도로 약 3° 서쪽에 있어, 두 도시 사이 거리 " + Math.round(DKM) + " km 가운데 남북 방향 몫은 " + Math.round(DNS) + " km 뿐입니다. 이 값을 쓰면 둘레가 약 40,000 km 로 나와요. 에라토스테네스는 같은 경선 위에 있다고 보고 거리를 여행 기록으로 어림했습니다."
  },
  {
    id: "r2", tag: "실제 자료 · 과학혁명", title: "각도 8′의 오차 — 화성 궤도는 원일까", short: "케플러의 타원",
    who: "🔭", name: "케플러의 연구실",
    say: "“케플러는 튀코 브라헤의 화성 관측과 원 궤도의 예측이 각도로 <b>8분(0.13°)</b> 어긋나는 것을 무시하지 않았어요. 아래는 NASA 가 계산한 화성의 <b>실제 궤도</b>(2020 ~ 2023)입니다. 태양에서 가장 멀 때와 가장 가까울 때의 거리로 <b>이심률</b> e = (먼 거리 − 가까운 거리) ÷ (먼 거리 + 가까운 거리)를 구해 주세요.”",
    predict: {
      q: "화성의 궤도는 어떤 모양일까요?",
      options: ["㉠ 태양이 한가운데 있는 완전한 원", "㉡ 태양이 한 초점에 있는, 원에 가깝지만 조금 찌그러진 타원", "㉢ 길쭉한 달걀 모양"],
      answer: 1
    },
    task: "가장 먼 거리와 가장 가까운 거리를 읽고 이심률을 슬라이더로 맞추세요(± 0.005).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, e = 0;
      function draw() {
        H.paper(ctx, W, cv.H);
        var cx = 230, cy = 150, sc = 80;
        ctx.save(); ctx.strokeStyle = H.v("--line"); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(cx, cy, 1.524 * sc, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        H.line(ctx, M.map(function (r) { return [cx + r[0] * sc, cy - r[1] * sc]; }), H.v("--coral-700"), 2.2);
        H.dot(ctx, cx, cy, 8, "#f5b400"); H.text(ctx, "태양", cx + 10, cy + 4, { s: 11, w: "800" });
        H.text(ctx, "점선 = 같은 크기의 원(태양 한가운데)", 20, 20, { s: 10.5, c: H.v("--mist") });
        H.rows(ctx, 500, 50, [["가장 가까울 때", RMIN.toFixed(3) + " au"], ["가장 멀 때", RMAX.toFixed(3) + " au"], ["내 답 (이심률)", e.toFixed(3), null, true]], 62);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "이심률 e", min: 0, max: 0.3, step: 0.001, value: 0, fmt: function (x) { return x.toFixed(3); }, onInput: function (x) { e = x; api.changed(); draw(); } });
      api.info("빨간 곡선이 화성의 실제 궤도입니다. 점선 원과 견주면 태양이 한가운데가 아니라 한쪽으로 치우쳐 있어요. " + SRC2);
      draw();
      return {
        judge: function () {
          if (Math.abs(e - ECC) <= 0.005 + 1e-9) return { ok: true, msg: "(" + RMAX.toFixed(3) + " − " + RMIN.toFixed(3) + ") ÷ (" + RMAX.toFixed(3) + " + " + RMIN.toFixed(3) + ") ≈ " + ECC.toFixed(3) + " — 지구(0.017)보다 다섯 배 넘게 찌그러진 타원입니다." };
          return { ok: false, msg: e.toFixed(3) + " 는 " + (e < ECC ? "작습니다" : "큽니다") + ". 오른쪽 두 거리로 식을 계산하세요." };
        }
      };
    },
    hints: ["먼 거리 − 가까운 거리 ≈ 0.28 au.", "0.28 ÷ 3.05 ≈ ?"],
    solution: "약 <b>" + ECC.toFixed(3) + "</b>.",
    why: "이심률 0.09 는 눈으로 보면 거의 원이지만, 태양이 한가운데에서 비켜나 있어 화성이 보이는 방향이 원 궤도의 예측과 어긋납니다. 튀코의 관측은 각도 2분 안팎까지 정확했기에, 케플러는 8분의 어긋남을 관측 오차로 넘기지 않고 원 궤도를 버렸어요. 그리고 ‘행성은 태양을 한 초점으로 하는 타원 궤도를 돈다’(제1법칙)를 찾아냈습니다.<br>"
      + "2천 년 동안 이어진 ‘천체는 완전한 원을 돈다’는 믿음을 정밀한 관측 자료가 무너뜨린 것 — 과학혁명의 중요한 장면입니다."
  }
  ]
});
})();
