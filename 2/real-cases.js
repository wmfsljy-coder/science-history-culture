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
var SRC1 = "<small>자료: Dyson, Eddington & Davidson (1920), Philosophical Transactions of the Royal Society A 220, 291–333 — 태양 가장자리로 환산한 별빛의 휨. 소브랄의 다른 망원경(천체 사진기) 값 0.93″ 은 초점이 흐려져 보고서에서 덜 믿을 만하다고 했습니다.</small>";
var SRC2 = "<small>출처: 존 스노(1855) 『콜레라의 전파 방식에 대하여』 브로드 가 지도를 Tobler 가 숫자로 옮긴 자료(R 패키지 HistData), 사망자 " + S.deaths.length + "명 · 펌프 " + S.pumps.length + "개. 가까운 펌프는 직선거리로 정했습니다. 사본은 data/snow-1854.js.</small>";

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료가 과학자들의 논쟁을 어떻게 끝냈는지 적어 보세요.",
  cases: [
  {
    id: "r1", tag: "실제 자료 · 과학자의 논쟁", title: "빛이 휘었다 — 1919년 일식 관측", short: "1919년 일식",
    who: "🌘", name: "왕립 천문학회",
    say: "“태양 옆을 지나는 별빛이 휘는 각도를 두고 두 이론이 다른 값을 예측했어요. 뉴턴 역학으로는 <b>약 0.87″</b>, 아인슈타인의 일반 상대성 이론으로는 <b>약 1.75″</b>(″ = 1° 의 3600분의 1)입니다. 1919년 일식 때 두 원정대가 실제로 잰 값과 오차 범위를 보고, <b>어느 이론이 맞는지</b> 판단해 주세요.”",
    predict: {
      q: "관측값이 한 이론의 예측과 맞으면, 그 이론은 증명된 것일까요?",
      options: ["㉠ 그렇다, 영원히 참이다", "㉡ 그 이론을 강하게 지지하지만, 더 많은 관측으로 계속 검증된다", "㉢ 관측은 이론과 상관없다"],
      answer: 1
    },
    task: "두 관측값과 오차 막대를 보고, 관측과 맞는 이론을 고르세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(260), ctx = cv.ctx, W = cv.W, pick = "none";
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 80, x1 = 620, y0 = 30;
        function X(v) { return x0 + v / 2.5 * (x1 - x0); }
        [0, 0.5, 1, 1.5, 2, 2.5].forEach(function (v) { H.text(ctx, v.toFixed(1) + "″", X(v), 220, { s: 10, a: "center", c: H.v("--mist") }); });
        [[NEWTON, "뉴턴 예측", "--brand-700"], [EINSTEIN, "아인슈타인 예측", "--coral-700"]].forEach(function (t) { H.dash(ctx, X(t[0]), y0, X(t[0]), 205, H.v(t[2]), 2); H.text(ctx, t[1] + " " + t[0] + "″", X(t[0]), y0 - 8, { s: 11, w: "800", a: "center", c: H.v(t[2]) }); });
        EC.forEach(function (e, i) {
          var y = 80 + i * 70;
          H.line(ctx, [[X(e[1] - 2 * e[2]), y], [X(e[1] + 2 * e[2]), y]], H.v("--ink"), 2);
          H.dot(ctx, X(e[1]), y, 7, H.v("--amber-700"));
          H.text(ctx, e[0] + " " + e[1] + " ± " + e[2] + "″", X(e[1]), y - 14, { s: 11, w: "800", a: "center" });
        });
        H.text(ctx, "가로 막대 = 오차의 두 배 범위", x0, 245, { s: 10, c: H.v("--mist") });
        H.rows(ctx, 660, 60, [["내 판단", ({ none: "아직", n: "뉴턴", e: "아인슈타인", b: "둘 다 아님" })[pick], null, true]], 60);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "관측과 맞는 이론", value: "none", options: [{ v: "n", t: "뉴턴" }, { v: "e", t: "아인슈타인" }, { v: "b", t: "둘 다 아님" }], onPick: function (x) { pick = x; api.changed(); draw(); } });
      api.info("관측값의 오차 범위 안에 어느 예측선이 들어오는지 보세요. " + SRC1);
      draw();
      return {
        judge: function () {
          if (pick === "e") return { ok: true, msg: "두 관측값(1.98″, 1.61″)의 오차 범위가 아인슈타인의 1.75″ 를 품고, 뉴턴의 0.87″ 은 멀리 벗어납니다." };
          if (pick === "n") return { ok: false, msg: "뉴턴의 0.87″ 은 두 관측의 오차 범위 밖에 있습니다." };
          return { ok: false, msg: "두 관측의 오차 범위가 한 예측선을 함께 품고 있어요. 어느 쪽인가요?" };
        }
      };
    },
    hints: ["오차 막대가 어느 점선과 겹치는지 보세요.", "1.61 ~ 1.98″ 은 0.87″ 보다 1.75″ 에 가깝습니다."],
    solution: "<b>아인슈타인</b>(일반 상대성 이론).",
    why: "1919년 11월 영국 왕립학회는 일식 관측이 일반 상대성 이론의 예측과 맞는다고 발표했고, 아인슈타인은 하루아침에 세계적인 유명 인사가 되었습니다. 그러나 오차가 커서 관측 자료를 고르는 방법을 두고 논쟁이 이어졌고, 이후 1970년대 전파 망원경 관측에서 0.1% 수준까지 확인되며 논쟁이 끝났습니다.<br>"
      + "과학 이론은 한 번의 관측으로 ‘증명’되기보다, 새로운 예측을 내고 그것이 거듭 검증되면서 믿음을 얻습니다. 지금도 GPS 위성은 상대성 이론으로 시간을 보정해야 정확히 작동해요."
  },
  {
    id: "r2", tag: "실제 자료 · 감염병과 과학", title: "펌프의 손잡이를 떼어라", short: "스노의 지도",
    who: "🚰", name: "존 스노",
    say: "“1854년 런던 소호에서 콜레라로 열흘 만에 수백 명이 죽었어요. 의사 존 스노는 죽은 사람들의 집을 지도에 점으로 찍었습니다. 아래는 그 지도를 숫자로 옮긴 <b>실제 자료</b>예요. 각 사망자에게 <b>가장 가까운 펌프</b>를 정하면, 브로드 가 펌프가 가장 가까운 사망자는 <b>전체의 몇 %</b>일까요?”",
    predict: {
      q: "콜레라는 무엇을 통해 퍼질까요(스노의 생각)?",
      options: ["㉠ 나쁜 공기(독기)를 마셔서", "㉡ 오염된 물을 마셔서", "㉢ 환자와 눈을 마주쳐서"],
      answer: 1
    },
    task: "펌프를 골라 그 펌프가 가장 가까운 사망자 수를 보고, 브로드 가 펌프의 비율을 맞추세요(± 3 %).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(320), ctx = cv.ctx, W = cv.W, k = BROAD, g = 0;
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 30, y0 = 20, sc = 14;
        function X(x) { return x0 + (x - 3) * sc * 1.2; }
        function Y(y) { return y0 + (20 - y) * sc; }
        S.deaths.forEach(function (d, i) { H.box(ctx, X(d[0]) - 1.5, Y(d[1]) - 1.5, 3, 3, NEAR[i] === k ? H.v("--rose-700") : H.v("--mist"), 0.85); });
        S.pumps.forEach(function (p, i) { H.dot(ctx, X(p[1]), Y(p[2]), i === k ? 8 : 5, i === k ? H.v("--amber-700") : H.v("--brand")); });
        var n = NEAR.filter(function (q) { return q === k; }).length;
        H.rows(ctx, 640, 40, [["고른 펌프", S.pumps[k] ? S.pumps[k][0] : "", "--amber-700"], ["가장 가까운 사망자", n + " 명"], ["내 답 (브로드 가 비율)", g + " %", null, true]], 56);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "펌프", min: 0, max: Math.max(0, S.pumps.length - 1), step: 1, value: k, fmt: function (x) { return S.pumps[x] ? S.pumps[x][0] : ""; }, onInput: function (x) { k = x; draw(); } });
      api.slider({ label: "브로드 가 펌프의 비율", min: 0, max: 100, step: 1, value: 0, fmt: function (x) { return x + " %"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("파란 점 = 펌프, 작은 네모 = 사망자(빨강 = 고른 펌프가 가장 가까운 사람). " + SRC2
        + "<div data-link='{\"id\":\"natgeo-snow\",\"title\":\"런던 전염병 지도 그리기 (교과서 연결 자료)\",\"src\":\"내셔널지오그래픽 교육 · 비상교육 과학의 역사와 문화\",\"url\":\"https://education.nationalgeographic.org/resource/mapping-london-epidemic/\",\"ask\":\"스노가 브로드 가 펌프를 의심한 뒤 펌프에 어떤 조치를 했고, 그 뒤 무엇이 달라졌는지 한 문장으로 적어 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(g - SHARE) <= 3) return { ok: true, msg: NB + " ÷ " + S.deaths.length + " ≈ " + SHARE.toFixed(0) + "% — 사망자 대부분이 브로드 가 펌프 둘레에 몰려 있습니다." };
          return { ok: false, msg: g + "% 는 " + (g < SHARE ? "작습니다" : "큽니다") + ". 브로드 가 펌프를 골라 사망자 수를 전체로 나누세요." };
        }
      };
    },
    hints: ["펌프 슬라이더를 Broad St 에 두면 가장 가까운 사망자 수가 나옵니다.", NB + " ÷ " + S.deaths.length + " × 100 ≈ ?"],
    solution: "약 <b>" + SHARE.toFixed(0) + "%</b> (" + NB + "명 / " + S.deaths.length + "명).",
    why: "당시에는 콜레라가 나쁜 공기(독기)로 퍼진다고 믿는 사람이 많았습니다. 스노는 사망자가 브로드 가 펌프 둘레에 몰려 있고, 가까이 살아도 다른 우물을 쓰던 양조장 일꾼들은 거의 걸리지 않았다는 점 등을 들어 오염된 물이 원인이라고 주장했어요. 그의 요청으로 펌프 손잡이가 떼어졌습니다(이때 유행은 이미 잦아들던 중이었어요).<br>"
      + "자료를 지도에 찍어 보이지 않는 원인을 찾은 이 일은 역학(疫學)의 출발점으로 꼽힙니다. 콜레라균은 30년 뒤 코흐가 확인했습니다."
  }
  ]
});
})();
