/* 과학의 역사와 문화 Ⅱ 변화하는 과학과 세계 — 실제 자료
   r1 빛이 휘었다 — 1919년 일식 관측값으로 뉴턴과 아인슈타인 중 누가 맞았는지 가리기
   r2 펌프의 손잡이를 떼어라 — 존 스노의 1854년 콜레라 사망자 지도
   자료: 1919년 관측값(Dyson, Eddington & Davidson 1920)은 이 파일 안에, data/snow-1854.js (HistData) */
(function () {
"use strict";
/* 태양 가장자리를 스치는 별빛이 휘는 각(초, ″) — 영국 원정대의 1919년 5월 29일 일식 관측 */
var EC = [["소브랄(브라질) 4인치 망원경", 1.98, 0.12], ["프린시페(아프리카) 망원경", 1.61, 0.30]];
var NEWTON = 0.87, EINSTEIN = 1.75;
var S = window.REAL_SNOW || { deaths: [], pumps: [] };
function nearest(x, y) { var b = 0, bd = 1e9; S.pumps.forEach(function (p, i) { var d = (p[1] - x) * (p[1] - x) + (p[2] - y) * (p[2] - y); if (d < bd) { bd = d; b = i; } }); return b; }
var NEAR = S.deaths.map(function (d) { return nearest(d[0], d[1]); });
var BROAD = S.pumps.map(function (p) { return p[0]; }).indexOf("Broad St");
var NB = NEAR.filter(function (k) { return k === BROAD; }).length, SHARE = S.deaths.length ? NB / S.deaths.length * 100 : 0;
var SRC1 = "<small>자료: Dyson, Eddington & Davidson (1920), Philosophical Transactions of the Royal Society A 220, 291–333 — 태양 가장자리로 환산한 별빛의 휨. 소브랄의 다른 망원경(천체 사진기) 값 0.93″ 은 초점이 흐려져 보고서에서 덜 믿을 만하다고 했습니다. ± 값은 당시 보고서의 ‘확률 오차’(표준 편차의 약 2/3)입니다.</small>";
var SRC2 = "<small>출처: 존 스노(1855) 『콜레라의 전파 방식에 대하여』 브로드 가 지도를 Tobler가 숫자로 옮긴 자료(R 패키지 HistData), 사망자 " + S.deaths.length + "명 · 펌프 " + S.pumps.length + "개. 가까운 펌프는 직선거리로 정했습니다. 사본은 data/snow-1854.js.</small>";

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료가 과학자들의 논쟁을 어떻게 끝냈는지 적어 보세요.",
  cases: [
  {
    id: "r1", sec: "01", tag: "실제 자료 · 과학자의 논쟁", title: "빛이 휘었다 — 1919년 일식 관측", short: "1919년 일식",
    who: "🌘", name: "왕립 천문학회",
    say: "“태양 옆을 지나는 별빛이 휘는 각도를 두고 두 이론이 다른 값을 예측했어요. 뉴턴 역학으로는 <b>약 0.87″</b>, 아인슈타인의 일반 상대성 이론으로는 <b>약 1.75″</b>(″ = 1°의 3600분의 1)입니다. 1919년 일식 때 두 원정대가 실제로 잰 값과 오차 범위를 보고, <b>어느 이론이 맞는지</b> 판단해 주세요.”",
    predict: {
      q: "관측값이 한 이론의 예측과 맞으면, 그 이론은 증명된 것일까요?",
      options: ["㉠ 그렇다, 영원히 참이다", "㉡ 그 이론을 강하게 지지하지만, 더 많은 관측으로 계속 검증된다", "㉢ 관측은 이론과 상관없다"],
      answer: 1
    },
    task: "두 관측값과 오차 막대를 보고, 관측과 맞는 이론을 고르세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(260), ctx = cv.ctx, W = cv.W, pick = "none";
        function draw() {
        var K = window.sthKit, SP = window.sthSP19, LT = K.LT, CH = cv.H;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, W, CH);
        var cw = 610;
        K.card(ctx, 10, 10, cw, CH - 20, "1919년 일식 원정대의 측정값 (태양 가장자리)");
        var g = SP.chart(ctx, { x: 18, y: 50, w: cw - 20, h: CH - 72, x0: 0, x1: 2.5, y0: 0, y1: 3, xt: 5, yt: 3, yf: function () { return ""; }, xf: function (v) { return v.toFixed(1) + "″"; }, xl: "휘는 각도", pl: 20 });
        [[NEWTON, "뉴턴 예측", LT.blue], [EINSTEIN, "아인슈타인 예측", LT.orange]].forEach(function (t) {
          ctx.save(); ctx.setLineDash([6, 4]); ctx.strokeStyle = t[2]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(g.X(t[0]), g.T); ctx.lineTo(g.X(t[0]), g.B); ctx.stroke(); ctx.restore();
          SP.lbl(ctx, t[1] + " " + t[0] + "″", g.X(t[0]) + 6, g.T + 14, { s: 11, c: t[2] });
        });
        EC.forEach(function (e, i) {
          var y = g.Y(2 - i * 1.1), xa = g.X(e[1] - 2 * e[2]), xb = g.X(e[1] + 2 * e[2]);
          ctx.strokeStyle = LT.ink; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xb, y); ctx.moveTo(xa, y - 6); ctx.lineTo(xa, y + 6); ctx.moveTo(xb, y - 6); ctx.lineTo(xb, y + 6); ctx.stroke();
          K.planet(ctx, g.X(e[1]), y, 7, "#ffd27a", "#a85a00");
          SP.lbl(ctx, e[0] + " " + e[1] + " ± " + e[2].toFixed(2) + "″", g.X(e[1]), y - 14, { s: 11, a: "center" });
        });
        SP.lbl(ctx, "가로 막대 = 보고한 오차(확률 오차)의 두 배 범위", 30, CH - 22, { s: 10, c: LT.mute, w: "600" });
        /* 작은 망원경 미니어처 */
        var tx = 760, ty = 70;
        ctx.save(); ctx.translate(tx, ty); ctx.rotate(-.45);
        var tg = ctx.createLinearGradient(0, -10, 0, 10); tg.addColorStop(0, "#f7de8e"); tg.addColorStop(.5, "#c9962f"); tg.addColorStop(1, "#7a5010");
        ctx.fillStyle = tg; ctx.fillRect(-60, -10, 110, 20); ctx.fillStyle = "#3d4452"; ctx.fillRect(50, -12, 10, 24); ctx.fillRect(-66, -7, 8, 14); ctx.restore();
        ctx.strokeStyle = "#5a3a1e"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tx, ty + 6); ctx.lineTo(tx - 22, ty + 56); ctx.moveTo(tx, ty + 6); ctx.lineTo(tx + 22, ty + 56); ctx.moveTo(tx, ty + 6); ctx.lineTo(tx + 2, ty + 60); ctx.stroke();
        SP.card(ctx, 636, 134, 250, CH - 146, null, [["내 판단", ({ none: "아직", n: "뉴턴", e: "아인슈타인", b: "둘 다 아님" })[pick], pick === "none" ? LT.mute : LT.blue]], null, { top: 40 });
      }
    cv.canvas._redraw = draw;
      api.seg({ label: "관측과 맞는 이론", value: "none", options: [{ v: "n", t: "뉴턴" }, { v: "e", t: "아인슈타인" }, { v: "b", t: "둘 다 아님" }], onPick: function (x) { pick = x; api.changed(); draw(); } });
      api.info("관측값의 오차 범위 안에 어느 예측선이 들어오는지 보세요. " + SRC1);
      draw();
      return {
        judge: function () {
          if (pick === "e") return { ok: true, msg: "두 관측값(1.98″, 1.61″)은 모두 아인슈타인의 1.75″ 쪽에 있습니다. 특히 오차가 작은 소브랄 값은 뉴턴의 0.87″ 과 크게 다르고, 오차가 큰 프린시페 값만으로는 둘을 가르기 어려웠습니다." };
          if (pick === "n") return { ok: false, msg: "뉴턴의 0.87″ 은 두 관측의 오차 범위 밖에 있습니다." };
          return { ok: false, msg: "두 관측의 오차 범위가 한 예측선을 함께 품고 있어요. 어느 쪽인가요?" };
        }
      };
    },
    hints: ["오차 막대가 어느 점선과 겹치는지 보세요.", "1.61~1.98″ 은 0.87″ 보다 1.75″ 에 가깝습니다."],
    solution: "<b>아인슈타인</b>(일반 상대성 이론).",
    why: "1919년 11월 6일 영국 왕립학회와 왕립천문학회의 합동 회의에서 일식 관측이 일반 상대성 이론의 예측과 맞는다고 발표했고, 아인슈타인은 하루아침에 세계적인 유명 인사가 되었습니다. 그러나 오차가 커서 관측 자료를 고르는 방법을 두고 논쟁이 이어졌고, 이후 1970년대 전파 망원경 관측이 약 1% 정밀도로 아인슈타인의 값을 확인했고, 2000년대에는 0.1%보다도 정밀하게 맞아 논쟁이 끝났습니다.<br>"
      + "과학 이론은 한 번의 관측으로 ‘증명’되기보다, 새로운 예측을 내고 그것이 거듭 검증되면서 믿음을 얻습니다. 지금도 GPS 위성은 상대성 이론으로 시간을 보정해야 정확히 작동합니다."
  },
  {
    id: "r2", sec: "03", tag: "실제 자료 · 감염병과 과학", title: "펌프의 손잡이를 떼어라", short: "스노의 지도",
    who: "🚰", name: "존 스노",
    say: "“1854년 런던 소호에서 콜레라로 열흘 만에 수백 명이 죽었어요. 의사 존 스노는 죽은 사람들의 집을 지도에 막대(표시)로 찍었습니다. 아래는 그 지도를 숫자로 옮긴 <b>실제 자료</b>예요. 각 사망자에게 <b>가장 가까운 펌프</b>를 정하면, 브로드 가 펌프가 가장 가까운 사망자는 <b>전체의 몇 %</b>일까요?”",
    predict: {
      q: "콜레라는 무엇을 통해 퍼질까요(스노의 생각)?",
      options: ["㉠ 나쁜 공기(독기)를 마셔서", "㉡ 오염된 물을 마셔서", "㉢ 환자와 눈을 마주쳐서"],
      answer: 1
    },
    task: "펌프를 골라 그 펌프가 가장 가까운 사망자 수를 보고, 브로드 가 펌프의 비율을 맞추세요(± 3 %).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(320), ctx = cv.ctx, W = cv.W, k = BROAD, g = 0;
        function draw() {
        var K = window.sthKit, SP = window.sthSP19, LT = K.LT, CH = cv.H;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, W, CH, { x: 320, y: 300, rx: 300, ry: 20 });
        /* 소호 거리 블록 모형: 실제 사망자(검은 막대)와 펌프(쇠기둥) */
        function WX(x) { return (x - 8) * 46; }
        function WY(y) { return (19 - y) * 22; }
        var I = K.iso({ ox: 300, oy: 34, s: 0.5, L: 620, D: 330 }), Z = 10;
        SP.box(ctx, I, 0, 0, 0, I.L, I.D, Z, ["#c9c2b2", "#8d8676", "#6f6a5e"], { edge: false });
        I.shade(ctx, "front", function () { return Z; }); I.shade(ctx, "right", function () { return Z; });
        ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1;
        for (var gx = 60; gx < I.L; gx += 60) { var a1 = I.P(gx, 0, Z), b1 = I.P(gx, I.D, Z); ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(b1.x, b1.y); ctx.stroke(); }
        for (var gy = 55; gy < I.D; gy += 55) { var a2 = I.P(0, gy, Z), b2 = I.P(I.L, gy, Z); ctx.beginPath(); ctx.moveTo(a2.x, a2.y); ctx.lineTo(b2.x, b2.y); ctx.stroke(); }
        var items = S.deaths.map(function (d, i) { return { x: WX(d[0]), y: WY(d[1]), t: 0, hot: NEAR[i] === k }; });
        S.pumps.forEach(function (p, i) { items.push({ x: WX(p[1]), y: WY(p[2]), t: 1, i: i }); });
        items = items.filter(function (it) { return it.x >= 2 && it.x <= I.L - 2 && it.y >= 2 && it.y <= I.D - 2; });
        items.sort(function (p, q) { return (p.x + p.y) - (q.x + q.y); });
        items.forEach(function (it) {
          if (it.t === 0) I.box(ctx, it.x - 2.5, it.y - 2.5, Z, it.x + 2.5, it.y + 2.5, Z + 9, it.hot ? "#ff8a8a" : "#4a4a55", it.hot ? "#d9363e" : "#22222a", it.hot ? "#a8262c" : "#121218");
          else { SP.icyl(ctx, I, it.x, it.y, Z, 6, it.i === k ? 40 : 28, it.i === k ? "brass" : "iron"); }
        });
        S.pumps.forEach(function (p, i) { if (i !== k) return; var tp = I.P(WX(p[1]), WY(p[2]), Z + 44); K.pill(ctx, "고른 펌프 · " + p[0], tp.x + 8, tp.y - 6, { s: 11.5, c: "#ffe08a", box: [0, 616] }); });
        K.pill(ctx, "빨간 막대 = 고른 펌프가 가장 가까운 사망자", 16, CH - 12, { s: 11, c: "#ffb3bd" });
        var n = NEAR.filter(function (q) { return q === k; }).length;
        SP.card(ctx, 626, 14, 260, CH - 28, "존 스노의 지도 (1854)", [
          ["고른 펌프", S.pumps[k] ? S.pumps[k][0] : "", "#b86e00"],
          ["가장 가까운 사망자", n + " 명"],
          null,
          ["내 답 (브로드 가 비율)", g + " %", LT.blue]
        ], null, { top: 62, gap: 32 });
      }
    cv.canvas._redraw = draw;
      api.slider({ label: "펌프", min: 0, max: Math.max(0, S.pumps.length - 1), step: 1, value: k, fmt: function (x) { return S.pumps[x] ? S.pumps[x][0] : ""; }, onInput: function (x) { k = x; draw(); } });
      api.slider({ label: "브로드 가 펌프의 비율", min: 0, max: 100, step: 1, value: 0, fmt: function (x) { return x + " %"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("파란 점 = 펌프, 작은 네모 = 사망자(빨강 = 고른 펌프가 가장 가까운 사람). " + SRC2
        + "<div data-link='{\"id\":\"natgeo-snow\",\"title\":\"런던 전염병 지도 그리기 (교과서 연결 자료)\",\"src\":\"내셔널지오그래픽 교육 · 비상교육 과학의 역사와 문화\",\"url\":\"https://education.nationalgeographic.org/resource/mapping-a-london-epidemic/\",\"ask\":\"‘죽음의 펌프’에서 먼 곳에 살던 사람도 콜레라로 죽은 까닭을 이 자료가 어떻게 설명하는지 한 문장으로 적어 오세요(번역기를 써도 좋아요).\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(g - SHARE) <= 3) return { ok: true, msg: NB + " ÷ " + S.deaths.length + " ≈ " + SHARE.toFixed(0) + "% — 사망자 대부분이 브로드 가 펌프 둘레에 몰려 있습니다." };
          return { ok: false, msg: g + "%는 " + (g < SHARE ? "작습니다" : "큽니다") + ". 브로드 가 펌프를 골라 사망자 수를 전체로 나누세요." };
        }
      };
    },
    hints: ["펌프 슬라이더를 Broad St에 두면 가장 가까운 사망자 수가 나옵니다.", NB + " ÷ " + S.deaths.length + " × 100 ≈ ?"],
    solution: "약 <b>" + SHARE.toFixed(0) + "%</b> (" + NB + "명 / " + S.deaths.length + "명).",
    why: "당시에는 콜레라가 나쁜 공기(독기)로 퍼진다고 믿는 사람이 많았습니다. 스노는 사망자가 브로드 가 펌프 둘레에 몰려 있고, 가까이 살아도 다른 우물을 쓰던 양조장 일꾼들은 거의 걸리지 않았다는 점 등을 들어 오염된 물이 원인이라고 주장했습니다. 그의 요청으로 펌프 손잡이가 떼어졌습니다(이때 유행은 이미 잦아들던 중이었어요).<br>"
      + "자료를 지도에 찍어 보이지 않는 원인을 찾은 이 일은 역학(疫學)의 출발점으로 꼽힙니다. 콜레라균은 30년 뒤 코흐가 확인했습니다."
  }
  ]
});
})();
