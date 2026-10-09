/* 과학의 역사와 문화 Ⅲ 과학과 인류의 미래 — 실제 자료
   r1 우리나라 전기 가운데 바람이 만든 몫 — 나라별 풍력 비율 비교(2025)
   r2 태양광은 10년 동안 몇 배가 되었나 — 우리나라 태양광 발전량(2015 → 2025)
   자료: data/owid-wind-solar.js (Our World in Data 에너지 자료) */
(function () {
"use strict";
var O = window.REAL_OWID || { by: {} };
var NAME = { "South Korea": "한국", "World": "세계 전체", "Germany": "독일", "China": "중국", "Japan": "일본", "United States": "미국" };
var ORDER = ["South Korea", "Japan", "World", "United States", "China", "Germany"].filter(function (c) { return O.by[c]; });
function get(c, y, i) { var a = O.by[c] || []; for (var k = 0; k < a.length; k++) if (a[k][0] === y && a[k][i] != null) return a[k][i]; return null; }
var Y = 2025; if (get("South Korea", Y, 1) == null) Y = 2024;
var KW = get("South Korea", Y, 1) || 0.6, WW = get("World", Y, 1) || 8.5, WR = KW ? WW / KW : 14;
var S0 = get("South Korea", 2015, 4) || 4, S1 = get("South Korea", Y, 4) || 38, SR = S0 ? S1 / S0 : 9;
var SRC = "<small>출처: Our World in Data 에너지 자료(Energy Institute 『세계 에너지 통계』, Ember 등을 모은 것, CC BY 4.0) — 나라별 전기 생산 가운데 풍력·태양광의 비율(%)과 발전량(TWh, 1 TWh = 10억 kWh). 사본은 data/owid-wind-solar.js.</small>";

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 우리 지역에 풍력 발전기가 들어올 때 따져야 할 점을 설명해 보세요.",
  cases: [
  {
    id: "r1", tag: "실제 자료 · 재생 에너지", title: "우리나라 전기 가운데 바람이 만든 몫", short: "풍력 비율",
    who: "🌬️", name: "마을 공청회 준비팀",
    say: "“우리 마을 앞바다에 해상 풍력 발전 단지 계획이 나왔습니다. 판단하려면 지금 우리나라가 어디쯤인지 알아야 합니다. " + Y + "년 <b>전기 생산 가운데 풍력의 비율</b>을 나라별로 보여 드려요. <b>세계 전체는 우리나라의 몇 배</b>일까요?”",
    predict: {
      q: "우리나라 전기 가운데 풍력이 만든 비율은 대략 얼마일까요?",
      options: ["㉠ 1%도 안 된다", "㉡ 10% 쯤", "㉢ 30% 쯤"],
      answer: 0
    },
    task: "세계 전체 ÷ 우리나라 를 슬라이더로 맞추세요(± 1 배).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, g = 1;
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 110, x1 = 560, y0 = 30, rh = 34;
        ORDER.forEach(function (c, i) {
          var v = get(c, Y, 1) || 0, y = y0 + i * rh, w = v / 32 * (x1 - x0);
          H.text(ctx, NAME[c], x0 - 8, y + 16, { s: 12, w: "800", a: "right", c: c === "South Korea" ? H.v("--ink") : H.v("--mist") });
          H.box(ctx, x0, y + 4, Math.max(2, w), 20, c === "South Korea" ? H.v("--coral-700") : H.v("--brand"), 0.85);
          H.text(ctx, v.toFixed(1) + "%", x0 + Math.max(2, w) + 6, y + 18, { s: 11, w: "800" });
        });
        H.text(ctx, Y + "년 전기 생산 가운데 풍력의 비율", x0, y0 - 12, { s: 11, w: "700", c: H.v("--mist") });
        H.rows(ctx, 660, 50, [["내 답 (몇 배)", g + " 배", null, true]], 60);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "세계 전체는 우리나라의 몇 배", min: 1, max: 40, step: 1, value: 1, fmt: function (x) { return x + " 배"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info(SRC
        + "<div data-link='{\"id\":\"owid-mix\",\"title\":\"나라별 전기 생산 구성\",\"src\":\"Our World in Data\",\"url\":\"https://ourworldindata.org/grapher/electricity-mix?country=~KOR\",\"ask\":\"(그래프가 비율(%)이 아닌 발전량으로 보이면 보기 설정에서 비율로 바꿔 보세요.) 우리나라 전기 생산에서 비율이 가장 큰 에너지원 세 가지와 그 비율을 적고, 10년 전과 비교해 가장 크게 늘어난 것과 줄어든 것을 적어 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(g - WR) <= 1) return { ok: true, msg: WW.toFixed(1) + " ÷ " + KW.toFixed(2) + " ≈ " + WR.toFixed(0) + " 배 — 우리나라 풍력은 아직 아주 작습니다. 독일은 전기의 약 " + Math.round(get("Germany", Y, 1) || 27) + "%를 바람으로 만들어요." };
          return { ok: false, msg: g + " 배는 " + (g < WR ? "작습니다" : "큽니다") + ". 세계 전체 막대의 값을 한국 값으로 나누세요." };
        }
      };
    },
    hints: ["세계 전체 " + WW.toFixed(1) + "%, 한국 " + KW.toFixed(2) + "%.", WW.toFixed(1) + " ÷ " + KW.toFixed(2) + " ≈ ?"],
    solution: "약 <b>" + Math.round(WR) + " 배</b>.",
    why: "우리나라는 산이 많고 땅이 좁아 육상 풍력 터를 찾기 어렵고, 주민 동의·인허가·송전망 연결에 오랜 시간이 걸려 풍력이 늦게 자랐습니다. 대신 서해·남해의 얕은 바다에 해상 풍력을 늘리려는 계획이 나오고 있습니다.<br>"
      + "공청회에서는 ‘탄소 배출을 줄이고 에너지를 자급한다’는 이점과 함께, 소음·경관·어업·철새 같은 지역의 걱정을 자료로 함께 따져야 합니다. 과학 기술의 쟁점은 숫자와 가치 판단이 함께 들어가는 문제입니다."
  },
  {
    id: "r2", tag: "실제 자료 · 성장률", title: "태양광은 10년 동안 몇 배가 되었나", short: "태양광 성장",
    who: "☀️", name: "에너지 동아리",
    say: "“풍력은 더디지만 태양광은 빠르게 늘었어요. 우리나라 <b>태양광 발전량</b>이 <b>2015년</b>에서 <b>" + Y + "년</b>까지 <b>몇 배</b>가 되었는지 구해 주세요.”",
    predict: {
      q: "새 기술이 퍼질 때 발전량은 보통 어떤 모양으로 늘어날까요?",
      options: ["㉠ 해마다 같은 양씩(직선)", "㉡ 처음엔 느리다가 빠르게 늘고, 나중엔 다시 느려진다(S자)", "㉢ 늘지 않는다"],
      answer: 1
    },
    task: Y + "년 ÷ 2015년 을 슬라이더로 맞추세요(± 0.5 배).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, g = 1;
      var K = (O.by["South Korea"] || []).filter(function (r) { return r[0] >= 2005 && r[4] != null; });
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 60, x1 = 600, y0 = 26, y1 = cv.H - 36, bw = (x1 - x0) / Math.max(1, K.length), mx = Math.max.apply(null, K.map(function (r) { return r[4]; })) * 1.12 || 1;
        function Yv(v) { return y1 - v / mx * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        [0, 10, 20, 30, 40].forEach(function (v) { if (v < mx) H.text(ctx, v, x0 - 6, Yv(v) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        K.forEach(function (r, i) {
          var on = r[0] === 2015 || r[0] === Y;
          H.box(ctx, x0 + i * bw + 3, Yv(r[4]), bw - 6, y1 - Yv(r[4]), on ? H.v("--amber-700") : H.v("--brand"), 0.85);
          if (r[0] % 5 === 0) H.text(ctx, r[0], x0 + i * bw + bw / 2, y1 + 15, { s: 10, a: "center", c: H.v("--mist") });
        });
        H.text(ctx, "우리나라 태양광 발전량 (TWh)", x0 + 6, y0 - 10, { s: 11, w: "700", c: H.v("--mist") });
        H.rows(ctx, 640, 30, [["2015년", S0.toFixed(2) + " TWh"], [Y + "년", S1.toFixed(2) + " TWh"], ["내 답 (몇 배)", g.toFixed(1) + " 배", null, true]], 62);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "몇 배가 되었나", min: 1, max: 20, step: 0.1, value: 1, fmt: function (x) { return x.toFixed(1) + " 배"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info(SRC);
      draw();
      return {
        judge: function () {
          if (Math.abs(g - SR) <= 0.5 + 1e-9) return { ok: true, msg: S1.toFixed(1) + " ÷ " + S0.toFixed(2) + " ≈ " + SR.toFixed(1) + " 배 — 그래도 " + Y + "년 태양광은 전기의 약 " + (get("South Korea", Y, 2) || 6).toFixed(1) + "%입니다." };
          return { ok: false, msg: g.toFixed(1) + " 배는 맞지 않습니다. 오른쪽 두 값을 나누세요." };
        }
      };
    },
    hints: ["오른쪽 판의 두 값을 쓰세요.", S1.toFixed(1) + " ÷ " + S0.toFixed(2) + " ≈ ?"],
    solution: "약 <b>" + SR.toFixed(1) + " 배</b>.",
    why: "태양광 패널 값은 대량 생산과 기술 발전으로 지난 십여 년 동안 크게 내려, 세계 곳곳에서 가장 싼 전기 가운데 하나가 되었습니다. 새 기술이 퍼질 때는 이처럼 처음엔 느리다가 값이 내리며 빠르게 늘어나는 모습이 자주 나타납니다. 다만 우리나라는 2022년 뒤로 송전망 부족·출력 제한 등으로 증가가 주춤했어요(그래프의 마지막 몇 해).<br>"
      + "다만 태양광과 풍력은 날씨에 따라 발전량이 오르내려, 남는 전기를 저장하는 장치(배터리·양수 발전)와 지역을 잇는 송전망이 함께 갖춰져야 합니다. 미래 에너지는 한 가지 기술이 아니라 여러 기술과 사회적 선택이 함께 만드는 것입니다."
  }
  ]
});
})();
