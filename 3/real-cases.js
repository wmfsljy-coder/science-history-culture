/* 과학의 역사와 문화 Ⅲ 과학과 인류의 미래 — 실제 자료
   r1 우리나라 전기 가운데 바람이 만든 몫 — 나라별 풍력 비율 비교(2025)
   r2 태양광은 10년 동안 몇 배가 되었나 — 우리나라 태양광 발전량(2015 → 2025)
   r3 과학과 의사결정 — 기온 자료로 군항제 개막일 정하기
   자료: data/owid-wind-solar.js (Our World in Data 에너지 자료), data/bloom.js */
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
var ZG = (window.REAL_BLOOM || {}).rule600 || [];      /* [연도, 600 °C 법칙 날 "월-일"] */
function zI(md) { return Math.round((Date.UTC(2001, +md.slice(0, 2) - 1, +md.slice(3)) - Date.UTC(2001, 0, 1)) / 864e5); }
function zD(i) { var t = new Date(Date.UTC(2001, 0, 1) + i * 864e5); return (t.getUTCMonth() + 1) + "월 " + t.getUTCDate() + "일"; }
var ZGY = ZG.map(function (r) { var a = zI(r[1]) + 1; return { y: r[0], open: a, full: a + 6 }; });   /* 개화 ≈ 600 °C 날 + 1, 만개 ≈ 개화 + 6 */
function zOk(d) { return ZGY.filter(function (g) { return g.open <= d && g.full >= d && g.full <= d + 9; }).length; }
var Z_BEST = 0; for (var zd = zI("03-15"); zd <= zI("04-10"); zd++) Z_BEST = Math.max(Z_BEST, zOk(zd));
var SRC_Z = "<small>출처: 기상청 날씨누리 과거 관측 일별 자료, 창원(155) 날마다 최고 기온으로 해마다 ‘600 °C 법칙’ 날짜를 셈. 개화는 그 다음 날, 만개(만발)는 개화 엿새 뒤로 어림(2023년 진해: 3월 21일 개화 → 3월 27일 만발, 창원기상대). 2026년 군항제는 3월 27일 ~ 4월 5일. 사본은 data/bloom.js.</small>";

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 우리 지역에 풍력 발전기가 들어올 때 따져야 할 점을 설명해 보세요.",
  cases: [
  {
    id: "r1", sec: "04", tag: "실제 자료 · 재생 에너지", title: "우리나라 전기 가운데 바람이 만든 몫", short: "풍력 비율",
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
        var K = window.sthKit, SP = window.sthSP19, LT = K.LT, CH = cv.H;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, W, CH, { x: 780, y: 250, rx: 90, ry: 10 });
        K.card(ctx, 10, 10, 610, CH - 20, Y + "년 전기 생산 가운데 풍력의 비율");
        var x0 = 110, x1 = 560, y0 = 48, rh = 34;
        ORDER.forEach(function (c, i) {
          var v = get(c, Y, 1) || 0, y = y0 + i * rh, kr = c === "South Korea";
          K.t(ctx, NAME[c], x0 - 10, y + 16, { s: 12, w: "900", a: "right", c: kr ? LT.ink : LT.mute });
          K.bar(ctx, x0, y + 6, x1 - x0, v / 32, kr ? LT.red : LT.blue);
          K.t(ctx, v.toFixed(1) + "%", x0 + Math.max(5, v / 32 * (x1 - x0)) + 6, y + 16, { s: 11, w: "900", c: kr ? LT.red : LT.ink });
        });
        /* 작은 풍력 발전기 미니어처 */
        var tx = 780, ty = 54;
        SP.cyl(ctx, tx, 240, 26, 8, 6, "stone");
        var tg = ctx.createLinearGradient(tx - 5, 0, tx + 5, 0); tg.addColorStop(0, "#c5cedb"); tg.addColorStop(.5, "#ffffff"); tg.addColorStop(1, "#9aa5b4");
        ctx.fillStyle = tg; ctx.beginPath(); ctx.moveTo(tx - 6, 236); ctx.lineTo(tx - 3, ty + 4); ctx.lineTo(tx + 3, ty + 4); ctx.lineTo(tx + 6, 236); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#e6ebf2"; ctx.beginPath(); ctx.roundRect(tx - 6, ty - 6, 22, 12, 4); ctx.fill();
        for (var b = 0; b < 3; b++) { var an = -Math.PI / 2 + b * 2.094 + .3; ctx.save(); ctx.translate(tx - 4, ty); ctx.rotate(an); ctx.fillStyle = "#f8f9fb"; ctx.beginPath(); ctx.moveTo(0, -3); ctx.quadraticCurveTo(40, -6, 70, 0); ctx.quadraticCurveTo(40, 4, 0, 3); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "rgba(20,40,90,.25)"; ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); }
        K.planet(ctx, tx - 4, ty, 5, "#ffffff", "#8a96a8");
        SP.card(ctx, 640, 150, 246, CH - 162, null, [["내 답 (몇 배)", g + " 배", LT.blue]], null, { top: 34 });
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
    id: "r2", sec: "04", tag: "실제 자료 · 성장률", title: "태양광은 10년 동안 몇 배가 되었나", short: "태양광 성장",
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
        var KT = window.sthKit, SP = window.sthSP19, LT = KT.LT, CH = cv.H;
        ctx.clearRect(0, 0, W, CH);
        KT.studio(ctx, 0, 0, W, CH);
        KT.card(ctx, 10, 10, 610, CH - 20, "우리나라 태양광 발전량 (TWh)");
        var x0 = 60, x1 = 600, y0 = 44, y1 = CH - 40, bw = (x1 - x0) / Math.max(1, K.length), mx = Math.max.apply(null, K.map(function (r) { return r[4]; })) * 1.12 || 1, DX = 6, DY = -5;
        function Yv(v) { return y1 - v / mx * (y1 - y0); }
        ctx.strokeStyle = LT.grid; ctx.lineWidth = 1;
        [0, 10, 20, 30, 40].forEach(function (v) { if (v < mx) { ctx.beginPath(); ctx.moveTo(x0, Yv(v)); ctx.lineTo(x1, Yv(v)); ctx.stroke(); KT.t(ctx, String(v), x0 - 6, Yv(v) + 4, { s: 10, w: "600", a: "right", c: LT.mute }); } });
        K.forEach(function (r, i) {
          var on = r[0] === 2015 || r[0] === Y, xx = x0 + i * bw + 3, w = bw - 8, top = Yv(r[4]), cc = SP.mt(on ? "yellow" : "blue");
          SP.poly(ctx, [{ x: xx + w, y: y1 }, { x: xx + w + DX, y: y1 + DY }, { x: xx + w + DX, y: top + DY }, { x: xx + w, y: top }], cc[2]);
          SP.poly(ctx, [{ x: xx, y: top }, { x: xx + w, y: top }, { x: xx + w + DX, y: top + DY }, { x: xx + DX, y: top + DY }], cc[0]);
          ctx.fillStyle = cc[1]; ctx.fillRect(xx, top, w, y1 - top);
          if (r[0] % 5 === 0) KT.t(ctx, String(r[0]), xx + w / 2, y1 + 15, { s: 10, w: "600", a: "center", c: LT.mute });
        });
        KT.line(ctx, { x: x0, y: y1 }, { x: x1, y: y1 }, LT.line, 1.5);
        /* 작은 태양광 패널 미니어처 */
        var px = 690, py = 60;
        ctx.fillStyle = "#6d7788"; ctx.fillRect(px + 60, py + 40, 5, 40);
        SP.poly(ctx, [{ x: px, y: py + 40 }, { x: px + 120, y: py + 40 }, { x: px + 150, y: py }, { x: px + 30, y: py }], "#1f3a6e");
        ctx.strokeStyle = "rgba(200,225,255,.6)"; ctx.lineWidth = 1;
        for (var q = 1; q < 6; q++) { ctx.beginPath(); ctx.moveTo(px + q * 20, py + 40); ctx.lineTo(px + 30 + q * 20, py); ctx.stroke(); }
        for (q = 1; q < 3; q++) { ctx.beginPath(); ctx.moveTo(px + q * 10, py + 40 - q * 13.3); ctx.lineTo(px + 120 + q * 10, py + 40 - q * 13.3); ctx.stroke(); }
        SP.poly(ctx, [{ x: px, y: py + 40 }, { x: px + 120, y: py + 40 }, { x: px + 120, y: py + 45 }, { x: px, y: py + 45 }], "#c5cedb");
        SP.card(ctx, 640, 120, 246, CH - 132, null, [["2015년", S0.toFixed(2) + " TWh"], [Y + "년", S1.toFixed(2) + " TWh", "#b86e00"], ["내 답 (몇 배)", g.toFixed(1) + " 배", LT.blue]], null, { top: 30, gap: 30 });
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
  },
  {
    id: "r3", sec: "04", tag: "실제 자료 · 과학과 의사결정", title: "군항제 개막일은 언제가 좋을까", short: "군항제 날짜",
    who: "🌸", name: "축제 준비 위원회",
    say: "“진해군항제는 열흘 동안 열리고, 숙소 · 교통 · 공연 준비 때문에 날짜를 몇 달 전에 정해야 합니다. 바람은 두 가지예요. <b>개막 날 이미 꽃이 피어 있고, 축제 동안 만개(80 % 이상)를 볼 수 있을 것.</b> 아래 막대는 지난 " + ZGY.length + "년 동안 창원의 기온으로 어림한 해마다의 <b>개화 ~ 만개</b> 기간입니다. 두 바람을 가장 많은 해에 채우는 개막일을 찾아 주세요.”",
    predict: {
      q: "해마다 꽃 피는 날이 달라질 때, 날짜를 정하는 가장 과학적인 방법은?",
      options: ["㉠ 작년에 핀 날로 정한다", "㉡ 여러 해의 기록을 모아 가장 많은 해에 맞는 날을 고르고, 빗나갈 해가 있음을 미리 알린다", "㉢ 해마다 같은 날(4월 1일)로 고정한다"],
      answer: 1
    },
    task: "개막일을 옮겨 <b>두 바람을 모두 채우는 해가 가장 많은 날</b>을 찾으세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, d = zI("03-22");
      var x0 = 60, x1 = 640, y0 = 20, y1 = 262, a0 = zI("03-15"), a1 = zI("04-15"), n = ZGY.length || 1, bh = (y1 - y0) / n;
      function X(i) { return x0 + (i - a0) / (a1 - a0) * (x1 - x0); }
        function draw() {
        var K = window.sthKit, SP = window.sthSP19, LT = K.LT, CH = cv.H;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, W, CH, { x: 780, y: 120, rx: 70, ry: 8 });
        K.card(ctx, 10, 6, 652, CH - 12, null);
        ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        ctx.fillStyle = "rgba(245,159,0,.16)"; ctx.fillRect(X(d), y0, X(d + 10) - X(d), y1 - y0);
        ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = "#d9a400"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(X(d), y0); ctx.lineTo(X(d), y1); ctx.stroke(); ctx.restore();
        K.line(ctx, { x: x0, y: y1 }, { x: x1, y: y1 }, LT.line, 1.5); K.line(ctx, { x: x0, y: y0 }, { x: x0, y: y1 }, LT.line, 1.5);
        ["03-15", "03-22", "04-01", "04-08", "04-15"].forEach(function (md) { K.t(ctx, zD(zI(md)), X(zI(md)), y1 + 15, { s: 10, w: "600", a: "center", c: LT.mute }); });
        ZGY.forEach(function (gq, i) {
          var ok = gq.open <= d && gq.full >= d && gq.full <= d + 9, y = y0 + i * bh + 2, w = X(gq.full) - X(gq.open);
          var gg = ctx.createLinearGradient(0, y, 0, y + bh - 4); gg.addColorStop(0, ok ? "#ffc9de" : "#e3e9f1"); gg.addColorStop(1, ok ? "#e64980" : "#8a96a8");
          ctx.fillStyle = gg; ctx.beginPath(); ctx.roundRect(X(gq.open), y, w, Math.max(2, bh - 4), 3); ctx.fill();
          K.t(ctx, String(gq.y), x0 - 6, y + bh / 2 + 3, { s: 9, w: "600", a: "right", c: LT.mute });
        });
        /* 작은 벚나무 미니어처 */
        var tx = 780, ty = 110;
        ctx.fillStyle = "#6b4a2e"; ctx.fillRect(tx - 4, ty - 40, 8, 40);
        [[0, -58, 30], [-22, -46, 22], [22, -46, 22], [-10, -72, 20], [14, -70, 18]].forEach(function (c0) { var gb = ctx.createRadialGradient(tx + c0[0] - 6, ty + c0[1] - 6, 2, tx + c0[0], ty + c0[1], c0[2]); gb.addColorStop(0, "#ffe3ee"); gb.addColorStop(1, "#f06595"); ctx.fillStyle = gb; ctx.beginPath(); ctx.arc(tx + c0[0], ty + c0[1], c0[2], 0, 6.2832); ctx.fill(); });
        SP.card(ctx, 676, 140, 210, CH - 152, null, [["개막일", zD(d) + "~", "#b86e00"], ["끝", zD(d + 9)], ["두 바람을 채운 해", zOk(d) + " / " + n + "해", LT.blue]], null, { top: 30, gap: 30 });
        K.t(ctx, "■ 분홍 = 축제 기간에 개화와 만개", 690, CH - 34, { s: 10, w: "800", c: "#c2255c" });
        K.t(ctx, "■ 회색 = 못 채움", 690, CH - 18, { s: 10, w: "800", c: LT.mute });
      }
    cv.canvas._redraw = draw;
      api.slider({ label: "개막일", min: zI("03-15"), max: zI("04-08"), step: 1, value: d, fmt: function (i) { return zD(i); }, onInput: function (i) { d = i; api.changed(); draw(); } });
      api.info("막대 왼쪽 끝 = 개화(꽃이 피기 시작), 오른쪽 끝 = 만개. 노란 칸이 열흘 축제입니다. 개막 날이 막대 안에 있고, 막대 오른쪽 끝이 노란 칸 안에 있으면 초록. " + SRC_Z);
      draw();
      return {
        judge: function () {
          var c = zOk(d);
          if (c === Z_BEST) return { ok: true, msg: zD(d) + " 개막이면 " + n + "해 가운데 " + c + "해에 두 바람을 다 채웁니다. 그래도 " + (n - c) + "해는 빗나갑니다 — 이것이 자연을 상대로 한 결정의 한계입니다." };
          return { ok: false, msg: zD(d) + " 개막은 " + c + "해입니다. 더 많은 해를 채우는 날이 있습니다(가장 많으면 " + Z_BEST + "해)." };
        }
      };
    },
    hints: ["개막이 너무 이르면 꽃이 아직 안 핀 해(막대가 노란 칸 오른쪽)가 많아집니다.", "너무 늦으면 만개가 축제 전에 지나 버린 해가 많아집니다. 3월 말 쪽을 살펴보세요."],
    solution: "3월 말(약 " + (function () { var r = []; for (var i = zI("03-15"); i <= zI("04-08"); i++) if (zOk(i) === Z_BEST) r.push(zD(i)); return r.join(", "); })() + ") 개막이 " + Z_BEST + "해로 가장 많습니다.",
    why: "2026년 군항제는 3월 27일에 열렸고, 이 어림으로는 " + zOk(zI("03-27")) + "해를 채우는 날입니다. 실제로 2026년 진해 벚꽃은 3월 24일 피고 축제 기간에 만개했습니다.<br>"
      + "집단의 결정에는 과학 자료만 들어가지 않습니다. 주말 · 공휴일, 숙소와 교통, 상인과 주민의 사정, 안전이 함께 따져집니다. 과학은 ‘몇 해 가운데 몇 해쯤 맞을지’라는 근거와 불확실성을 알려 주고, 사람들은 그것을 바탕으로 의논해 정합니다. 그리고 봄이 점점 따뜻해지면(이 단원의 기후 이야기) 오래된 기록으로 정한 날짜는 차츰 맞지 않게 되므로, 근거도 새 자료로 계속 고쳐야 합니다.<br>"
      + "※ ‘600 °C 날 + 1 = 개화, 개화 + 6 = 만개’는 몇 해의 관측에서 얻은 어림이라 해마다 며칠씩 어긋날 수 있습니다."
  }
  ]
});
})();
