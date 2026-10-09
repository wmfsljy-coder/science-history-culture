/* 과학의 역사와 문화 Ⅰ 과학과 문명의 탄생과 통합 — 소단원별 이야기 네 편
   01 범람을 예언한 별 / 02 그림자로 잰 지구 / 03 지혜의 집에서 경복궁까지 / 04 8분의 오차
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("shc-1");

var FONT = "'Gothic A1','Segoe UI',sans-serif";
function $(id) { return document.getElementById(id); }
function v(name) { return window.cssVar(name); }
function done(id) { var e = $(id); if (e) e.classList.add("done"); }
function paper(ctx, W, H) { ctx.clearRect(0, 0, W, H); ctx.fillStyle = v("--panel"); ctx.fillRect(0, 0, W, H); }
function text(ctx, s, x, y, o) {
  o = o || {};
  ctx.font = (o.w || "500") + " " + (o.s || 12) + "px " + FONT;
  ctx.fillStyle = o.c || v("--ink"); ctx.textAlign = o.a || "left";
  ctx.fillText(s, x, y);
}
function axes(ctx, x0, y0, x1, y1) { ctx.strokeStyle = v("--line"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke(); }
function dot(ctx, x, y, r, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
function seg(ctx, x1, y1, x2, y2, c, w, dash) { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = w || 2; if (dash) ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); }
function segWire(id, onPick) {
  var btns = Array.prototype.slice.call($(id).querySelectorAll("button"));
  btns.forEach(function (b) {
    b.type = "button";
    b.addEventListener("click", function () { btns.forEach(function (x) { x.classList.toggle("on", x === b); }); onPick(b.getAttribute("data-v")); });
  });
}

/* =========================================================================
   이야기 ① 범람을 예언한 별
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "사건 파일 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "p1", title: "서기관의 첫 대답",
    question: "해마다 찾아오는 범람의 시기를 미리 알려면 무엇을 해야 할까?",
    options: ["㉠ 신에게 제사를 지내고 기다린다", "㉡ 범람과 함께 되풀이되는 하늘의 변화를 오랫동안 관측해 기록한다", "㉢ 해마다 날짜가 제멋대로이니 알 수 없다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 시리우스 달력 */
  (function () {
    var canvas = $("c-sir"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, yr = 0;
    var got = window.sthState("sirGot") || { a: false, b: false };
    function drift(y) { return (0.25 * y) % 365; }
    function gap(y) { var d = drift(y); return Math.min(d, 365 - d); }
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 620, by = 58;
      function X(d) { return x0 + d / 365 * (x1 - x0); }
      text(ctx, "365일 달력 한 해", x0, 22, { s: 12, w: "800" });
      [["아케트 (범람)", 0, "--cold"], ["페레트 (파종)", 120, "--green"], ["셰무 (수확)", 240, "--amber"]].forEach(function (s) {
        ctx.globalAlpha = .28; ctx.fillStyle = v(s[2]); ctx.fillRect(X(s[1]), by - 14, X(s[1] + 120) - X(s[1]), 28); ctx.globalAlpha = 1;
        text(ctx, s[0], X(s[1]) + 6, by + 4, { s: 11, w: "700", c: v("--ink") });
      });
      ctx.globalAlpha = .18; ctx.fillStyle = v("--mist"); ctx.fillRect(X(360), by - 14, X(365) - X(360), 28); ctx.globalAlpha = 1;
      var d = drift(yr);
      seg(ctx, X(0), by - 22, X(0), by + 22, v("--brand"), 3);
      text(ctx, "달력의 새해", X(0), by + 38, { s: 11, w: "800", a: "left", c: v("--brand") });
      seg(ctx, X(d), by - 22, X(d), by + 22, v("--coral"), 3);
      dot(ctx, X(d), by - 26, 5, v("--coral"));
      var lx = Math.min(Math.max(X(d), x0 + 150), x1 - 10);
      text(ctx, "★ 시리우스의 새벽", lx, by - 32, { s: 11, w: "800", a: d > 330 ? "right" : "left", c: v("--rose-700") });
      /* 아래: 햇수에 따른 어긋남 */
      var gx0 = 60, gx1 = 620, gy0 = 130, gy1 = 250;
      function GX(y) { return gx0 + y / 1600 * (gx1 - gx0); }
      function GY(dd) { return gy1 - dd / 365 * (gy1 - gy0); }
      axes(ctx, gx0, gy0, gx1, gy1);
      text(ctx, "어긋난 날 수", gx0 + 6, gy0 - 6, { s: 11, w: "700", c: v("--mist") });
      [0, 400, 800, 1200, 1600].forEach(function (y) { text(ctx, y + "년", GX(y), gy1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      [0, 180, 365].forEach(function (dd) { text(ctx, dd + "", gx0 - 6, GY(dd) + 4, { s: 10, a: "right", c: v("--mist") }); });
      ctx.strokeStyle = v("--brand"); ctx.lineWidth = 2.5; ctx.beginPath();
      var prev = null;
      for (var y = 0; y <= 1600; y += 4) { var dd2 = drift(y); if (prev !== null && dd2 < prev) { ctx.stroke(); ctx.beginPath(); ctx.moveTo(GX(y), GY(dd2)); } else if (y === 0) ctx.moveTo(GX(y), GY(dd2)); else ctx.lineTo(GX(y), GY(dd2)); prev = dd2; }
      ctx.stroke();
      dot(ctx, GX(yr), GY(d), 6, v("--coral"));
      text(ctx, yr + "년 뒤", 660, 80, { s: 16, w: "900" });
      text(ctx, "어긋남 " + gap(yr).toFixed(1) + "일", 660, 114, { s: 22, w: "900", c: gap(yr) <= 3 ? v("--green-700") : v("--ink") });
      text(ctx, "해마다 ¼일씩 밀림", 660, 142, { s: 12, c: v("--mist") });
    }
    function update() {
      draw();
      var g = gap(yr), ch = false;
      $("sir-info").innerHTML = yr + "년 동안 365일 달력을 쓰면 시리우스의 새벽이 달력보다 <b>" + (0.25 * yr).toFixed(1) + "일</b> 늦어집니다" + (yr > 0 && g <= 3 && yr >= 1000 ? " — 한 바퀴를 돌아 <b>다시 같은 날</b>이 되었습니다." : ". 이 차이가 쌓이면 ‘범람의 계절’이 달력에서 다른 계절로 옮겨 갑니다.");
      if (!got.a && Math.abs(0.25 * yr - 30) <= 1.5) { got.a = ch = true; }
      if (!got.b && yr >= 1000 && g <= 3) { got.b = ch = true; }
      if (ch) { window.sthState("sirGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-2a"); if (got.b) done("m1-2b");
      if (got.a && got.b) {
        window.sthState("sirBest", "120년에 한 달, 1,460년에 한 바퀴");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>해마다 ¼일의 차이가 <b>120년</b>이면 한 달, <b>1,460년</b>이면 1년이 됩니다. 오랜 관측 기록이 있어야 알아챌 수 있는 차이입니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("sir-y").addEventListener("input", function (e) { yr = +e.target.value; $("sir-y-val").textContent = yr + "년"; update(); });
    update(); mission();
  })();

  window.sthSort({
    mount: "s1-sort",
    buckets: [{ id: "me", label: "📜 메소포타미아" }, { id: "eg", label: "🏺 이집트" }, { id: "cn", label: "🐉 중국" }, { id: "in", label: "🕉️ 인도" }, { id: "ma", label: "🗿 마야" }],
    items: [
      { t: "물물 교환을 기록하던 물표에서 쐐기 문자가 태어났다", a: "me", why: "점토판에 새긴 쐐기 문자입니다." },
      { t: "60진법으로 천문을 기록했고, 이것이 1시간 = 60분의 뿌리가 되었다", a: "me", why: "메소포타미아의 60진법입니다." },
      { t: "강의 범람을 예측하려고 천문학이, 땅을 다시 재려고 기하학이 발달했다", a: "eg", why: "나일강의 범람이 이집트 과학을 이끌었습니다." },
      { t: "린드 파피루스에 넓이와 부피 계산법을 기록했다", a: "eg", why: "이집트의 수학 기록입니다." },
      { t: "하늘은 둥글고 땅은 네모지다는 천원지방 우주관을 세웠다", a: "cn", why: "중국의 우주관입니다." },
      { t: "나침반·종이·화약·인쇄술로 이어지는 기술이 쌓였다", a: "cn", why: "중국의 4대 발명입니다." },
      { t: "0 의 개념과 자릿값을 쓰는 십진법을 고안했다", a: "in", why: "오늘날 수 표기의 바탕입니다. 기원후 5~7세기 무렵의 일로, 같은 칸의 인더스 문명(기원전 2500년 무렵)보다 3천 년쯤 뒤입니다." },
      { t: "모헨조다로에 정교한 배수 시설을 갖춘 계획도시를 세웠다", a: "in", why: "인더스 문명의 도시입니다.", hint: "인더스강 유역의 도시입니다." },
      { t: "20진법 수 체계를 썼다", a: "ma", why: "마야는 손가락과 발가락을 모두 센 20진법을 썼습니다." },
      { t: "매우 정교한 달력으로 천문 관측과 역사를 기록했다", a: "ma", why: "마야 달력입니다.", hint: "아메리카 대륙의 문명입니다." }
    ],
    onDone: function () { window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>문명마다 자연환경과 생활의 필요가 달랐기에 발달한 과학도 달랐습니다."); ep.clear(2); }
  });
  if (ep.cleared(2)) window.sthMission("m1-3", true);

  /* 장면 4 — 매듭 12개 밧줄 */
  (function () {
    var canvas = $("c-rope"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, b = 4, a = 4;
    var got = window.sthState("ropeGot") || { a: false, q: false };
    function tri() {
      var c = 12 - a - b;
      if (c <= 0 || a + b <= c || a + c <= b || b + c <= a) return null;
      var C = Math.acos((a * a + b * b - c * c) / (2 * a * b)) * 180 / Math.PI;
      var A = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180 / Math.PI;
      return { c: c, C: C, A: A, B: 180 - A - C };
    }
    function draw() {
      paper(ctx, W, H);
      var t = tri(), u = 42, ox = 150, oy = 250;
      text(ctx, "매듭 12개 밧줄 고리 — 첫째 변 " + a + "칸 · 둘째 변 " + b + "칸 · 셋째 변 " + (12 - a - b) + "칸", 40, 26, { s: 12, w: "800" });
      if (!t) {
        seg(ctx, ox, oy, ox + 9 * u / 1.3, oy, v("--mist"), 3);
        for (var k = 0; k <= 9; k++) dot(ctx, ox + k * u / 1.3, oy, 4, v("--amber-700"));
        text(ctx, "세 변으로 삼각형을 만들 수 없어요 — 두 변의 합이 나머지 한 변보다 길어야 합니다.", 40, 140, { s: 13, w: "700", c: v("--rose-700") });
      } else {
        var P0 = [ox, oy], P1 = [ox + a * u, oy];
        var ang = Math.PI - t.B * Math.PI / 180;           // P1 에서 P2 로 가는 방향
        var P2 = [P1[0] + Math.cos(ang) * b * u, P1[1] - Math.sin(ang) * b * u];
        ctx.fillStyle = v("--amber"); ctx.globalAlpha = .12; ctx.beginPath(); ctx.moveTo(P0[0], P0[1]); ctx.lineTo(P1[0], P1[1]); ctx.lineTo(P2[0], P2[1]); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
        [[P0, P1, a], [P1, P2, b], [P2, P0, 12 - a - b]].forEach(function (s) {
          seg(ctx, s[0][0], s[0][1], s[1][0], s[1][1], v("--amber-700"), 3);
          for (var k = 0; k < s[2]; k++) dot(ctx, s[0][0] + (s[1][0] - s[0][0]) * k / s[2], s[0][1] + (s[1][1] - s[0][1]) * k / s[2], 4.5, v("--ink"));
        });
        var angs = [[P1, t.B], [P0, t.A], [P2, t.C]], big = angs.reduce(function (m, x) { return x[1] > m[1] ? x : m; });
        angs.forEach(function (x) { text(ctx, x[1].toFixed(0) + "°", x[0][0] + (x[0] === P0 ? -34 : 8), x[0][1] + (x[0] === P2 ? -8 : 18), { s: 12, w: "800", c: x === big && Math.abs(x[1] - 90) < 0.5 ? v("--green-700") : v("--mist") }); });
        if (Math.abs(big[1] - 90) < 0.5) text(ctx, "┐ 직각!", big[0][0] + 10, big[0][1] - 10, { s: 13, w: "900", c: v("--green-700") });
      }
      var ok = t && Math.abs(Math.max(t.A, t.B, t.C) - 90) < 0.5;
      text(ctx, "가장 큰 각", 640, 80, { s: 12, c: v("--mist") });
      text(ctx, t ? Math.max(t.A, t.B, t.C).toFixed(1) + "°" : "—", 640, 112, { s: 24, w: "900", c: ok ? v("--green-700") : v("--ink") });
      if (t) { var sd = [a, b, t.c].sort(function (p, q) { return p - q; }); text(ctx, sd[0] + "² + " + sd[1] + "² = " + (sd[0] * sd[0] + sd[1] * sd[1]) + " , " + sd[2] + "² = " + sd[2] * sd[2], 640, 146, { s: 12.5, w: "700", c: v("--mist") }); }
      return ok;
    }
    function update() {
      var ok = draw(), t = tri();
      $("rp-info").innerHTML = !t ? "이 매듭 위치로는 밧줄이 겹치거나 모자랍니다." : ("세 변 " + a + " · " + b + " · " + t.c + " 칸. " + (ok ? "<b>직각</b>이 생겼습니다. 이 밧줄만 있으면 들판 어디서나 반듯한 경계를 다시 그을 수 있습니다." : "모서리가 직각이 아닙니다."));
      if (ok && !got.a) { got.a = true; window.sthState("ropeGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-4a"); if (got.q) done("m1-4b");
      if (got.a && got.q) {
        window.sthState("ropeBest", "3 : 4 : 5 밧줄로 직각");
        window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>세 변이 3 : 4 : 5 이면 3² + 4² = 5² 이므로 직각 삼각형이 됩니다. 범람 뒤 땅을 다시 나누는 실용적 필요가 기하학을 키웠습니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    $("rp-a").addEventListener("input", function (e) { a = +e.target.value; $("rp-a-val").textContent = a + "칸"; update(); });
    $("rp-b").addEventListener("input", function (e) { b = +e.target.value; $("rp-b-val").textContent = b + "칸"; update(); });
    window.sthPick({
      mount: "s1-pick",
      q: "매듭 12개를 3 · 4 · 5 칸으로 나누면 직각이 생기는 까닭은?",
      options: ["밧줄이 12칸이라 우연히 맞았을 뿐이다", "짧은 두 변의 제곱의 합이 가장 긴 변의 제곱과 같기 때문이다 (9 + 16 = 25)", "어떤 밧줄이든 세 변의 길이가 모두 다르기만 하면 직각이 된다"],
      answer: 1,
      why: ["12칸이어도 4 · 4 · 4 로 나누면 60° 정삼각형이 됩니다.", "훗날 ‘피타고라스 정리’로 불리는 관계입니다. 경험으로 얻은 지혜가 나중에 증명된 수학이 되었습니다.", "매듭 13개를 3 · 4 · 6 칸으로 나누면 세 변이 모두 다르지만 9 + 16 ≠ 36 이라 직각이 되지 않습니다."],
      onDone: function () { got.q = true; window.sthState("ropeGot", got); mission(); }
    });
    update(); mission();
  })();

  function finish() { window.sthState("r1", "해결 · " + (window.sthState("sirBest") || "") + " / " + (window.sthState("ropeBest") || "")); }
  function vs() {
    var p = window.sthState("p1") || "";
    $("e1-vs").innerHTML = "<b>나의 첫 대답</b> " + (p || "기록 없음") + "<br><b>시리우스 달력</b> " + (window.sthState("sirBest") || "-") + "<br><b>밧줄 측량</b> " + (window.sthState("ropeBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[과학의 역사와 문화 Ⅰ] 이야기 ① 범람을 예언한 별",
    items: [
      { id: "w1", label: "문명이 만든 과학", hint: "고른 문명 하나에서, 그곳의 필요가 어떤 과학을 낳았는지 짝지어 쓰세요.", ph: "예: 나일강의 범람 → …" },
      { id: "e1a", label: "관측 기록이 쌓여야 보이는 것", hint: "365일 달력의 어긋남처럼, 한두 해 관측으로는 알 수 없고 오랜 기록이 있어야 알 수 있는 사실을 하나 들어 보세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 그림자로 잰 지구
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "사건 파일 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "p2", title: "새내기 연구원의 첫 대답",
    question: "땅의 모양을 알아내는 그리스 학자다운 방법은?",
    options: ["㉠ 오래된 신화에 적힌 대로 믿는다", "㉡ 여러 곳에서 관찰한 현상을 모아 논리적으로 추론한다", "㉢ 가장 높은 산에 올라가 한눈에 본다"],
    onPick: function () { ep.clear(0); }
  });

  window.sthSort({
    mount: "s2-sort",
    buckets: [{ id: "th", label: "탈레스" }, { id: "py", label: "피타고라스" }, { id: "ar", label: "아리스토텔레스" }, { id: "eu", label: "유클리드" }, { id: "pt", label: "프톨레마이오스" }],
    items: [
      { t: "만물의 근원은 물이다", a: "th", why: "자연을 신이 아닌 물질로 설명하려 한 첫 시도로 꼽힙니다." },
      { t: "신화 대신 자연현상 자체로 세계를 설명하려 했다", a: "th", why: "최초의 자연철학자로 불립니다." },
      { t: "수(數)가 만물의 근원이다", a: "py", why: "자연 속 비율과 조화를 수로 읽었습니다." },
      { t: "지구는 둥근 구 모양이라고 생각했다", a: "py", why: "구가 가장 완전한 모양이라고 보았습니다.", hint: "수와 조화를 중시한 학자입니다." },
      { t: "흙·물·불·공기의 4원소로 물질을 설명했다", a: "ar", why: "4원소설은 2천 년 가까이 이어졌습니다." },
      { t: "월식 때 지구 그림자가 둥근 것을 근거로 지구가 둥글다고 논증했다", a: "ar", why: "관찰을 근거로 한 논증입니다." },
      { t: "『원론』에서 몇 개의 공리로부터 정리를 이끌어 냈다", a: "eu", why: "공리적 방법입니다." },
      { t: "무세이온에서 기하학을 체계화했다", a: "eu", why: "알렉산드리아에서 활동했습니다.", hint: "『원론』의 저자입니다." },
      { t: "『알마게스트』에서 주전원으로 행성 운동을 계산했다", a: "pt", why: "천동설을 수학 모형으로 완성했습니다." },
      { t: "지구 중심 우주 모형을 1,400년 넘게 쓰인 표준으로 만들었다", a: "pt", why: "중세 내내 쓰인 천동설입니다." }
    ],
    onDone: function () { window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>다섯 학자 모두 자연을 관찰과 이성, 수학으로 설명하려 했습니다."); ep.clear(1); }
  });
  if (ep.cleared(1)) window.sthMission("m2-2", true);

  /* 장면 3 — 에라토스테네스 */
  (function () {
    var canvas = $("c-era"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, s = 5;
    var got = window.sthState("eraGot") || { a: false, q: false };
    function ang() { return Math.atan(s / 100) * 180 / Math.PI; }
    function circ() { return 800 * 360 / ang(); }
    function draw() {
      paper(ctx, W, H);
      var th = ang(), cx = 190, cy = 330, R = 250, ex = th * 3 * Math.PI / 180;
      ctx.strokeStyle = v("--line"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      for (var i = 0; i < 6; i++) { var rx = 70 + i * 55; seg(ctx, rx, 30, rx, 70, v("--amber"), 1.5); ctx.fillStyle = v("--amber"); ctx.beginPath(); ctx.moveTo(rx, 76); ctx.lineTo(rx - 4, 68); ctx.lineTo(rx + 4, 68); ctx.fill(); }
      text(ctx, "나란한 햇빛", 70, 22, { s: 11, w: "800", c: v("--amber-700") });
      var Sx = cx, Sy = cy - R, Ax = cx + R * Math.sin(ex), Ay = cy - R * Math.cos(ex);
      seg(ctx, cx, cy, Sx, Sy, v("--mist"), 1.2, true); seg(ctx, cx, cy, Ax, Ay, v("--mist"), 1.2, true);
      seg(ctx, Sx, Sy, Sx, Sy - 26, v("--ink"), 3);
      seg(ctx, Ax, Ay, Ax + 26 * Math.sin(ex), Ay - 26 * Math.cos(ex), v("--ink"), 3);
      text(ctx, "시에네", Sx - 4, Sy + 18, { s: 11, w: "800", a: "right" });
      text(ctx, "알렉산드리아", Ax + 6, Ay + 18, { s: 11, w: "800" });
      text(ctx, "800 km", (Sx + Ax) / 2, Math.min(Sy, Ay) - 34, { s: 11, w: "700", a: "center", c: v("--mist") });
      text(ctx, "각도는 3배로 과장해 그림", 30, 285, { s: 10.5, c: v("--mist") });
      /* 확대: 막대와 그림자 */
      var bx = 500, by = 240, L = 150, sh = s / 100 * L;
      seg(ctx, bx - 20, by, bx + 90, by, v("--line"), 2);
      seg(ctx, bx, by, bx, by - L, v("--ink"), 4);
      seg(ctx, bx, by, bx + sh, by, v("--brand"), 6);
      seg(ctx, bx + sh, by, bx, by - L, v("--amber"), 1.5, true);
      ctx.strokeStyle = v("--coral"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bx, by - L, 34, Math.PI / 2 - th * Math.PI / 180, Math.PI / 2); ctx.stroke();
      text(ctx, th.toFixed(2) + "°", bx + 14, by - L + 52, { s: 12, w: "800", c: v("--coral") });
      text(ctx, "막대 1 m", bx - 8, by - L / 2, { s: 11, w: "700", a: "right", c: v("--mist") });
      text(ctx, "그림자 " + s.toFixed(1) + " cm", bx, by + 20, { s: 11, w: "800", c: v("--brand") });
      var C = circ(), ok = C >= 39000 && C <= 41000;
      text(ctx, "그림자 각도", 640, 60, { s: 12, c: v("--mist") });
      text(ctx, th.toFixed(2) + "°", 640, 88, { s: 20, w: "900" });
      text(ctx, "지구 둘레 = 800 km × 360 ÷ 각도", 640, 124, { s: 11.5, c: v("--mist") });
      text(ctx, Math.round(C).toLocaleString() + " km", 640, 156, { s: 22, w: "900", c: ok ? v("--green-700") : v("--ink") });
      return ok;
    }
    function update() {
      var ok = draw();
      $("er-info").innerHTML = "그림자 " + s.toFixed(1) + " cm → 햇빛이 막대와 이루는 각 <b>" + ang().toFixed(2) + "°</b>. 두 도시가 지구 중심에서 벌어진 각도와 같으므로, 지구 둘레는 약 <b>" + Math.round(circ()).toLocaleString() + " km</b>. " + (ok ? "오늘날 값(약 40,000 km)과 가깝습니다!" : "");
      if (ok && !got.a) { got.a = true; got.s = s; window.sthState("eraGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m2-3a"); if (got.q) done("m2-3b");
      if (got.a && got.q) {
        window.sthState("eraBest", "그림자 " + (got.s || 12.6).toFixed(1) + " cm → 약 " + Math.round(800 * 360 / (Math.atan((got.s || 12.6) / 100) * 180 / Math.PI)).toLocaleString() + " km");
        window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("eraBest") + ". 막대 하나와 두 도시의 거리, 그리고 논리만으로 지구의 크기를 잰 것입니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("er-s").addEventListener("input", function (e) { s = Math.round(+e.target.value * 10) / 10; $("er-s-val").textContent = s.toFixed(1) + " cm"; update(); });
    window.sthPick({
      mount: "s2-pick",
      q: "만약 땅이 평평하다면, 하짓날 정오 알렉산드리아 막대의 그림자는 어떻게 될까요? (햇빛은 나란하다)",
      options: ["시에네처럼 그림자가 생기지 않는다", "시에네보다 더 긴 그림자가 생긴다", "밤이 된다"],
      answer: 0,
      why: ["평평한 땅에 나란한 햇빛이 비치면 어느 곳의 막대든 같은 각도로 빛을 받습니다. 두 도시의 그림자가 다르다는 것은 땅이 휘어 있다는 증거입니다.", "평평한 땅이라면 두 막대가 햇빛과 이루는 각이 같아야 합니다.", "같은 시각 같은 햇빛 아래에 있는 도시입니다."],
      onDone: function () { got.q = true; window.sthState("eraGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 4 — 월식의 그림자 */
  (function () {
    var canvas = $("c-ecl"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, m = "disc", t = 0;
    var got = window.sthState("eclGot") || { a: false, b: false };
    function draw() {
      paper(ctx, W, H);
      var tr = t * Math.PI / 180;
      /* 왼쪽: 옆에서 본 모습 */
      text(ctx, "옆에서 본 모습", 30, 24, { s: 12, w: "800" });
      dot(ctx, 50, 140, 26, v("--amber"));
      text(ctx, "태양", 50, 186, { s: 11, w: "700", a: "center", c: v("--amber-700") });
      for (var k = -2; k <= 2; k++) seg(ctx, 80, 140 + k * 22, 250, 140 + k * 22, v("--amber"), 1, true);
      if (m === "disc") {
        ctx.save(); ctx.translate(200, 140); ctx.rotate(tr); ctx.fillStyle = v("--cold"); ctx.fillRect(-4, -46, 8, 92); ctx.restore();
      } else dot(ctx, 200, 140, 46, v("--cold"));
      text(ctx, "지구 모형", 200, 214, { s: 11, w: "700", a: "center", c: v("--mist") });
      seg(ctx, 262, 140, 302, 140, v("--mist"), 2);
      ctx.fillStyle = v("--mist"); ctx.beginPath(); ctx.moveTo(310, 140); ctx.lineTo(300, 134); ctx.lineTo(300, 146); ctx.fill();
      /* 오른쪽: 달에 비친 그림자 */
      text(ctx, "달에 비친 지구의 그림자", 360, 24, { s: 12, w: "800" });
      var cx = 480, cy = 145, rx = 110, ry = m === "disc" ? Math.max(4, 110 * Math.cos(tr)) : 110;
      dot(ctx, cx + 118, cy - 20, 58, v("--line"));
      ctx.save(); ctx.beginPath(); ctx.arc(cx + 118, cy - 20, 58, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = v("--rose-700"); ctx.globalAlpha = .55; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      ctx.save(); ctx.strokeStyle = v("--rose-700"); ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      text(ctx, "달", cx + 118, cy + 56, { s: 11, w: "700", a: "center", c: v("--mist") });
      var round = m === "ball" || t < 15;
      text(ctx, "그림자 모양", 690, 80, { s: 12, c: v("--mist") });
      text(ctx, m === "ball" ? "언제나 원" : (t < 15 ? "원에 가까움" : (t < 60 ? "타원" : "가늘고 긴 타원")), 690, 112, { s: 20, w: "900", c: round ? v("--green-700") : v("--rose-700") });
      text(ctx, "햇빛 방향 " + t + "°", 690, 142, { s: 12, w: "700", c: v("--mist") });
    }
    function update() {
      draw(); var ch = false;
      $("ec-info").innerHTML = m === "disc" ? (t < 15 ? "원판을 정면에서 비추면 그림자가 둥급니다. 하지만 월식은 하늘 여러 방향에서 일어납니다. 햇빛 방향을 바꿔 보세요." : "원판을 비스듬히 비추면 그림자가 <b>찌그러진 타원</b>이 됩니다. 실제 월식에서는 이런 그림자가 한 번도 관측되지 않았습니다.") : "공은 어느 방향에서 비추어도 그림자가 <b>늘 원</b>입니다. 관측과 맞는 모형입니다.";
      if (t >= 60 && m === "disc" && !got.a) { got.a = ch = true; }
      if (t >= 60 && m === "ball" && !got.b) { got.b = ch = true; }
      if (ch) { window.sthState("eclGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m2-4a"); if (got.b) done("m2-4b");
      if (got.a && got.b) {
        window.sthState("eclBest", "원판은 비스듬하면 타원, 공은 늘 원");
        window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>월식 그림자가 어느 때나 둥글다는 관찰은 ‘공 모양 지구’만 설명할 수 있습니다. 아리스토텔레스의 논증입니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    segWire("ec-m", function (x) { m = x; update(); });
    $("ec-t").addEventListener("input", function (e) { t = +e.target.value; $("ec-t-val").textContent = t + "°"; update(); });
    update(); mission();
  })();

  function finish() { window.sthState("r2", "해결 · " + (window.sthState("eraBest") || "") + " / " + (window.sthState("eclBest") || "")); }
  function vs() {
    var p = window.sthState("p2") || "";
    $("e2-vs").innerHTML = "<b>나의 첫 대답</b> " + (p || "기록 없음") + "<br><b>지구 둘레</b> " + (window.sthState("eraBest") || "-") + "<br><b>월식의 그림자</b> " + (window.sthState("eclBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[과학의 역사와 문화 Ⅰ] 이야기 ② 그림자로 잰 지구",
    items: [
      { id: "e2a", label: "에라토스테네스의 가정", hint: "지구 둘레 계산에 쓰인 두 가정(나란한 햇빛, 둥근 지구)을 쓰고, 하나가 틀리면 결과가 어떻게 되는지 설명하세요." },
      { id: "e2b", label: "그리스 과학이 남긴 것", hint: "신화 대신 이성으로 자연을 설명한 태도가 이후 과학에 어떤 영향을 주었는지 한 학자를 예로 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ③ 지혜의 집에서 경복궁까지
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep3", key: "ep3", name: "사건 파일 ③", onDone: finish });

  window.sthGate({
    gate: "g3", key: "p3", title: "도슨트의 첫 대답",
    question: "‘중세에는 종교 때문에 과학이 멈췄다’는 말에 대한 가장 알맞은 대답은?",
    options: ["㉠ 맞다. 중세에는 어떤 과학도 없었다", "㉡ 지역마다 달랐다. 종교와 문화는 과학을 제약하기도, 이끌기도 했다", "㉢ 중세에는 종교가 없었다"],
    onPick: function () { ep.clear(0); }
  });

  window.sthSort({
    mount: "s3-sort",
    buckets: [{ id: "eu", label: "🏰 중세 서유럽" }, { id: "is", label: "🕌 이슬람 세계" }, { id: "ko", label: "🇰🇷 고려·조선" }],
    items: [
      { t: "아리스토텔레스 철학과 그리스도교 신학이 스콜라 철학으로 결합했다", a: "eu", why: "신앙을 이성으로 설명하려 했습니다." },
      { t: "11~13세기에 대학이 세워져 학문 공동체가 자랐다", a: "eu", why: "볼로냐(1088년 무렵)·파리·옥스퍼드 대학 등입니다." },
      { t: "자연은 신의 섭리를 드러내는 대상으로 여겨졌다", a: "eu", why: "자연 연구가 신학의 일부였습니다." },
      { t: "바그다드 ‘지혜의 집’에서 그리스·인도의 책을 아랍어로 번역했다", a: "is", why: "고대 지식을 지키고 이었습니다." },
      { t: "알콰리즈미가 방정식을 푸는 대수학을 체계화했다", a: "is", why: "algebra 라는 말이 그의 책에서 나왔습니다." },
      { t: "이븐 시나가 『의학전범』을 썼다", a: "is", why: "수백 년 동안 유럽 의과 대학의 교과서였습니다.", hint: "‘지혜의 집’ 전통을 이은 학자입니다." },
      { t: "측우기로 비의 양을 재어 전국에서 기록했다", a: "ko", why: "농사를 위한 실용적 관측입니다." },
      { t: "앙부일구와 자격루로 시각을 알렸다", a: "ko", why: "해시계와 물시계입니다." },
      { t: "『칠정산』으로 우리 하늘에 맞는 역법을 세웠다", a: "ko", why: "세종 때 완성된 독자적 역법입니다." }
    ],
    onDone: function () { window.sthMission("m3-2", true, "<span class='m-tag'>미션 완료</span>같은 시대에도 종교와 문화, 생활의 필요에 따라 과학은 서로 다른 길로 발전했습니다."); ep.clear(1); }
  });
  if (ep.cleared(1)) window.sthMission("m3-2", true);

  /* 장면 3 — 알콰리즈미의 완전제곱 */
  (function () {
    var canvas = $("c-alg"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, q = "1", x = 1;
    var Q = { "1": { b: 10, c: 39, ans: 3 }, "2": { b: 6, c: 40, ans: 4 } };
    var got = window.sthState("algGot") || { "1": false, "2": false };
    function draw() {
      paper(ctx, W, H);
      var P = Q[q], h = P.b / 2, u = 20, ox = 140, oy = 30;
      var L = x * u, Hh = h * u;
      /* x² */
      ctx.fillStyle = v("--brand"); ctx.globalAlpha = .35; ctx.fillRect(ox, oy, L, L); ctx.globalAlpha = 1;
      ctx.fillStyle = v("--teal"); ctx.globalAlpha = .3; ctx.fillRect(ox + L, oy, Hh, L); ctx.fillRect(ox, oy + L, L, Hh); ctx.globalAlpha = 1;
      ctx.save(); ctx.strokeStyle = v("--amber-700"); ctx.setLineDash([5, 4]); ctx.lineWidth = 2; ctx.strokeRect(ox + L, oy + L, Hh, Hh); ctx.restore();
      ctx.strokeStyle = v("--ink"); ctx.lineWidth = 1.5; ctx.strokeRect(ox, oy, L, L); ctx.strokeRect(ox + L, oy, Hh, L); ctx.strokeRect(ox, oy + L, L, Hh);
      if (L > 26) text(ctx, "x²", ox + L / 2, oy + L / 2 + 5, { s: 13, w: "900", a: "center" });
      if (L > 18) { text(ctx, h + "x", ox + L + Hh / 2, oy + L / 2 + 5, { s: 12, w: "800", a: "center" }); text(ctx, h + "x", ox + L / 2, oy + L + Hh / 2 + 5, { s: 12, w: "800", a: "center" }); }
      text(ctx, (h * h) + "", ox + L + Hh / 2, oy + L + Hh / 2 + 5, { s: 12, w: "800", a: "center", c: v("--amber-700") });
      text(ctx, "x = " + x, ox + L / 2, oy - 8, { s: 11, w: "800", a: "center", c: v("--brand") });
      var lhs = x * x + P.b * x, ok = Math.abs(lhs - P.c) < 1e-9;
      text(ctx, "x² + " + P.b + "x", 520, 60, { s: 13, c: v("--mist") });
      text(ctx, lhs + " " + (ok ? "= " : (lhs < P.c ? "< " : "> ")) + P.c, 520, 92, { s: 24, w: "900", c: ok ? v("--green-700") : v("--ink") });
      text(ctx, "빈칸 " + h + "×" + h + " = " + (h * h) + " 을 채우면", 520, 136, { s: 12.5, c: v("--mist") });
      text(ctx, "(x + " + h + ")² = " + P.c + " + " + (h * h) + " = " + (P.c + h * h), 520, 162, { s: 15, w: "800" });
      text(ctx, "큰 정사각형의 한 변 = " + Math.sqrt(P.c + h * h), 520, 190, { s: 13, w: "700", c: v("--mist") });
      return ok;
    }
    function update() {
      var ok = draw(), P = Q[q];
      $("al-info").innerHTML = ok ? "x = <b>" + x + "</b> 일 때 x² + " + P.b + "x = " + P.c + ". 그림으로 보면 큰 정사각형의 한 변 " + Math.sqrt(P.c + P.b * P.b / 4) + " 에서 " + P.b / 2 + " 를 뺀 값입니다." : "정사각형과 직사각형 두 개의 넓이 합이 " + P.c + " 이 되는 x 를 찾으세요.";
      if (ok && !got[q]) { got[q] = true; window.sthState("algGot", got); mission(); }
    }
    function mission() {
      if (got["1"]) done("m3-3a"); if (got["2"]) done("m3-3b");
      if (got["1"] && got["2"]) {
        window.sthState("algBest", "x²+10x=39 → 3, x²+6x=40 → 4");
        window.sthMission("m3-3", true, "<span class='m-tag'>미션 완료</span>빈칸을 채워 완전한 정사각형을 만드는 방법(완전제곱)은 알콰리즈미가 체계화한 대수학의 핵심입니다. 이 책이 라틴어로 번역되어 유럽 수학의 바탕이 되었습니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    segWire("al-q", function (k) { q = k; update(); });
    $("al-x").addEventListener("input", function (e) { x = +e.target.value; $("al-x-val").textContent = x; update(); });
    update(); mission();
  })();

  /* 장면 4 — 칠정산: 경도와 시각 */
  (function () {
    var canvas = $("c-chil"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, L = 116.5, BJ = 116.4;
    var got = window.sthState("chGot") || { a: false, q: false };
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 600, y = 110;
      function X(l) { return x0 + (l - 110) / 25 * (x1 - x0); }
      text(ctx, "경도 (동경)", x0, 26, { s: 12, w: "800" });
      seg(ctx, x0, y, x1, y, v("--line"), 3);
      [110, 115, 120, 125, 130, 135].forEach(function (l) { seg(ctx, X(l), y - 6, X(l), y + 6, v("--mist"), 1.5); text(ctx, l + "°", X(l), y + 22, { s: 10.5, a: "center", c: v("--mist") }); });
      dot(ctx, X(BJ), y, 7, v("--rose")); text(ctx, "베이징 116.4°", X(BJ), y - 16, { s: 11, w: "800", a: "center", c: v("--rose-700") });
      dot(ctx, X(127), y, 7, v("--teal")); text(ctx, "한양 127.0°", X(127), y - 16, { s: 11, w: "800", a: "center", c: v("--teal-700") });
      ctx.fillStyle = v("--amber"); ctx.beginPath(); ctx.moveTo(X(L), y + 30); ctx.lineTo(X(L) - 9, y + 46); ctx.lineTo(X(L) + 9, y + 46); ctx.fill();
      text(ctx, "관측자", X(L), y + 62, { s: 11, w: "800", a: "center", c: v("--amber-700") });
      var dm = (L - BJ) * 4;
      /* 해가 가장 높이 뜨는 시각 비교 */
      var tx = 60, ty = 220;
      text(ctx, "베이징 정오일 때 관측자의 지방시", tx, ty - 12, { s: 11.5, w: "700", c: v("--mist") });
      var mins = 12 * 60 + dm, hh = Math.floor(mins / 60), mm = Math.round(mins - hh * 60);
      if (mm === 60) { hh++; mm = 0; }
      text(ctx, hh + "시 " + (mm < 10 ? "0" : "") + mm + "분", tx, ty + 18, { s: 20, w: "900" });
      text(ctx, "경도 차이", 640, 70, { s: 12, c: v("--mist") });
      text(ctx, (L - BJ).toFixed(1) + "°", 640, 98, { s: 20, w: "900" });
      text(ctx, "시각 차이 = 경도 차 × 4분", 640, 132, { s: 11.5, c: v("--mist") });
      var ok = Math.abs(L - 127) <= 0.5;
      text(ctx, (dm >= 0 ? "+" : "") + dm.toFixed(0) + "분", 640, 166, { s: 24, w: "900", c: ok ? v("--green-700") : v("--ink") });
      return ok;
    }
    function update() {
      var ok = draw(), dm = (L - BJ) * 4;
      $("ch-info").innerHTML = "지구는 24시간에 360° 돌므로 경도 1° 마다 해가 4분씩 먼저 또는 늦게 뜹니다. 관측자는 베이징보다 <b>" + Math.abs(dm).toFixed(0) + "분</b> " + (dm >= 0 ? "먼저" : "늦게") + " 정오를 맞습니다." + (ok ? " 한양은 베이징보다 약 <b>42분</b> 앞선 시각을 씁니다." : "");
      if (ok && !got.a) { got.a = true; window.sthState("chGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m3-4a"); if (got.q) done("m3-4b");
      if (got.a && got.q) {
        window.sthState("chBest", "한양은 베이징보다 약 42분 빠름");
        window.sthMission("m3-4", true, "<span class='m-tag'>미션 완료</span>남의 하늘에 맞춘 역법의 시각을 그대로 쓰면, 한양과의 약 42분 시각 차만큼 예보가 어긋날 수 있습니다. 세종이 한양 기준의 『칠정산』을 만든 까닭입니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    $("ch-l").addEventListener("input", function (e) { L = +e.target.value; $("ch-l-val").textContent = L.toFixed(1) + "°E"; update(); });
    window.sthPick({
      mount: "s3-pick",
      q: "명나라 역법에 ‘월식이 베이징 시각으로 오후 8시에 시작한다’고 적혀 있습니다. 한양의 시각(그곳의 해를 기준으로 한 시각)으로는 월식이 언제 시작할까요?",
      options: ["한양 시각으로도 정확히 오후 8시", "한양 시각으로 오후 8시 42분쯤", "한양 시각으로 오후 7시 18분쯤"],
      answer: 1,
      why: ["월식은 달이 지구 그림자에 들어가는 현상이라 달이 보이는 모든 곳에서 같은 순간에 시작하지만, 두 도시의 시각은 서로 다릅니다.", "같은 순간이라도 동쪽에 있는 한양의 시각은 약 42분 앞서 있으므로 8시 42분쯤입니다. 베이징 시각을 그대로 쓰면 예보가 틀립니다(일식은 곳마다 시작 시각과 가려지는 정도까지 달라 계산이 더 복잡합니다).", "한양은 베이징보다 동쪽이라 해시계 시각이 늦는 것이 아니라 앞섭니다."],
      onDone: function () { got.q = true; window.sthState("chGot", got); mission(); }
    });
    update(); mission();
  })();

  function finish() { window.sthState("r3", "해결 · " + (window.sthState("algBest") || "") + " / " + (window.sthState("chBest") || "")); }
  function vs() {
    var p = window.sthState("p3") || "";
    $("e3-vs").innerHTML = "<b>나의 첫 대답</b> " + (p || "기록 없음") + "<br><b>알콰리즈미의 방정식</b> " + (window.sthState("algBest") || "-") + "<br><b>칠정산</b> " + (window.sthState("chBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk3", unitLabel: "[과학의 역사와 문화 Ⅰ] 이야기 ③ 지혜의 집에서 경복궁까지",
    items: [
      { id: "e3a", label: "종교·문화가 과학에 준 영향", hint: "서유럽, 이슬람 세계, 조선 가운데 두 곳을 골라, 종교나 문화가 과학에 어떤 방향을 주었는지 비교해 쓰세요." },
      { id: "e3b", label: "‘암흑시대’라는 이름표 바꾸기", hint: "전시관 입구의 ‘중세 = 과학의 암흑시대’를 대신할 이름표를 만들고, 그렇게 지은 근거를 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ④ 8분의 오차
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep4", key: "ep4", name: "사건 파일 ④", onDone: finish });

  window.sthGate({
    gate: "g4", key: "p4", title: "케플러의 첫 대답",
    question: "믿어 온 이론과 정밀한 관측값이 작게나마 어긋날 때, 과학자는 어떻게 해야 할까?",
    options: ["㉠ 이론이 오래되었으니 관측을 버린다", "㉡ 관측이 정확하다면 이론을 고칠 준비를 한다", "㉢ 차이가 작으니 아무 결론도 내지 않는다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 원근법 */
  (function () {
    var canvas = $("c-persp"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, d = 15;
    var got = window.sthState("psGot") || { a: false, b: false };
    function draw() {
      paper(ctx, W, H);
      var hz = 70, vx = 470;
      function col(dd, c) {
        var h = 1900 / dd, base = hz + 2100 / dd, x = vx - 3400 / dd, w = Math.max(4, 260 / dd);
        ctx.fillStyle = c; ctx.fillRect(x - w / 2, base - h, w, h);
        return { x: x, top: base - h, base: base, h: h };
      }
      ctx.fillStyle = v("--panel-2"); ctx.fillRect(0, hz, 600, H - hz);
      seg(ctx, 0, hz, 600, hz, v("--mist"), 1.2, true);
      text(ctx, "지평선 · 소실점", vx + 8, hz - 8, { s: 11, w: "700", c: v("--mist") });
      dot(ctx, vx, hz, 4, v("--rose"));
      for (var k = -3; k <= 3; k++) seg(ctx, vx, hz, vx + k * 260, H, v("--line"), 1);
      var c1 = col(10, v("--ink")), c2 = col(d, v("--brand"));
      seg(ctx, c1.x, c1.top, vx, hz, v("--rose"), 1, true); seg(ctx, c1.x, c1.base, vx, hz, v("--rose"), 1, true);
      text(ctx, "첫 기둥 10 m", c1.x, c1.base + 16, { s: 10.5, w: "800", a: "center", c: v("--ink") });
      text(ctx, "둘째 " + d + " m", c2.x, c2.top - 8, { s: 10.5, w: "800", a: "center", c: v("--brand") });
      var r = 10 / d;
      text(ctx, "그림 속 크기 비", 640, 70, { s: 12, c: v("--mist") });
      text(ctx, (r * 100).toFixed(0) + "%", 640, 102, { s: 24, w: "900", c: (Math.abs(r - 0.5) < 0.01 || Math.abs(r - 1 / 3) < 0.01) ? v("--green-700") : v("--ink") });
      text(ctx, "= 10 m ÷ " + d + " m", 640, 130, { s: 12.5, c: v("--mist") });
      return r;
    }
    function update() {
      var r = draw(), ch = false;
      $("ps-info").innerHTML = "둘째 기둥이 " + d + " m 에 있으면 그림 속 높이는 첫 기둥의 <b>" + (r * 100).toFixed(0) + "%</b>. 거리가 두 배가 되면 크기는 절반 — 모든 기둥의 윗끝과 아랫끝을 이은 선은 한 소실점으로 모입니다.";
      if (!got.a && Math.abs(r - 0.5) < 0.01) { got.a = ch = true; }
      if (!got.b && Math.abs(r - 1 / 3) < 0.01) { got.b = ch = true; }
      if (ch) { window.sthState("psGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m4-2a"); if (got.b) done("m4-2b");
      if (got.a && got.b) {
        window.sthState("psBest", "절반 20 m, 3분의 1 30 m");
        window.sthMission("m4-2", true, "<span class='m-tag'>미션 완료</span>20 m 에서 절반, 30 m 에서 3분의 1. 보이는 크기는 거리에 반비례합니다. 르네상스 화가들은 이 수학으로 평면에 깊이를 그렸고, 정밀한 관찰과 수학을 함께 쓰는 태도가 과학혁명으로 이어졌습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("ps-d").addEventListener("input", function (e) { d = +e.target.value; $("ps-d-val").textContent = d + " m"; update(); });
    update(); mission();
  })();

  /* 장면 3 — 화성 궤도의 이심률 */
  (function () {
    var canvas = $("c-kep"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, e = 0, ET = 0.0934;
    var got = window.sthState("kpGot") || { a: false, b: false };
    function nu(ee, M) { var E = M; for (var i = 0; i < 25; i++) E = E - (E - ee * Math.sin(E) - M) / (1 - ee * Math.cos(E)); return 2 * Math.atan2(Math.sqrt(1 + ee) * Math.sin(E / 2), Math.sqrt(1 - ee) * Math.cos(E / 2)); }
    function errs() { var out = [], mx = 0; for (var k = 0; k <= 360; k += 3) { var M = k * Math.PI / 180, dd = nu(e, M) - nu(ET, M); dd = Math.atan2(Math.sin(dd), Math.cos(dd)); var am = Math.abs(dd) * 180 / Math.PI * 60; out.push(am); if (am > mx) mx = am; } return { list: out, max: mx }; }
    function draw() {
      paper(ctx, W, H);
      /* 왼쪽: 궤도 */
      var cx = 150, cy = 150, a = 105;
      function orbit(ee, c, w, dash) {
        var b = a * Math.sqrt(1 - ee * ee), f = a * ee;
        ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = w; if (dash) ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.ellipse(cx - f, cy, a, b, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      }
      orbit(ET, v("--mist"), 1.5, true); orbit(e, v("--brand"), 2.5);
      dot(ctx, cx, cy, 9, v("--amber"));
      text(ctx, "태양", cx, cy + 24, { s: 10.5, w: "700", a: "center", c: v("--amber-700") });
      text(ctx, "파랑: 모형 · 점선: 관측에 맞는 궤도", 30, 24, { s: 11, w: "700", c: v("--mist") });
      /* 오른쪽: 오차 그래프 */
      var r = errs(), x0 = 330, x1 = 620, y0 = 40, y1 = 250;
      function X(k) { return x0 + k / 360 * (x1 - x0); }
      function Y(am) { return y1 - Math.min(am, 60) / 60 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      text(ctx, "관측과의 차이 (분)", x0 + 6, y0 - 8, { s: 11, w: "700", c: v("--mist") });
      [0, 10, 30, 60].forEach(function (am) { text(ctx, am + "", x0 - 6, Y(am) + 4, { s: 10, a: "right", c: v("--mist") }); });
      text(ctx, "궤도 위치 →", x1, y1 + 16, { s: 10.5, a: "right", c: v("--mist") });
      seg(ctx, x0, Y(8), x1, Y(8), v("--amber"), 1.2, true);
      text(ctx, "8분", x1 + 4, Y(8) + 4, { s: 10.5, w: "800", c: v("--amber-700") });
      seg(ctx, x0, Y(10), x1, Y(10), v("--rose"), 1.2, true);
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0 - 4, x1 - x0, y1 - y0 + 4); ctx.clip();
      ctx.strokeStyle = v("--brand"); ctx.lineWidth = 2.5; ctx.beginPath();
      r.list.forEach(function (am, i) { var k = i * 3; if (i === 0) ctx.moveTo(X(k), Y(am)); else ctx.lineTo(X(k), Y(am)); }); ctx.stroke(); ctx.restore();
      if (r.max > 60) text(ctx, "그래프 위로 넘침", x0 + 10, y0 + 14, { s: 11, w: "800", c: v("--rose-700") });
      var ok = r.max < 10;
      text(ctx, "이심률 " + e.toFixed(3), 650, 70, { s: 14, w: "800" });
      text(ctx, "가장 큰 차이", 650, 104, { s: 12, c: v("--mist") });
      text(ctx, r.max >= 60 ? (r.max / 60).toFixed(1) + "°" : r.max.toFixed(1) + "분", 650, 136, { s: 24, w: "900", c: ok ? v("--green-700") : v("--rose-700") });
      return r.max;
    }
    function update() {
      var mx = draw(), ch = false;
      $("kp-info").innerHTML = e === 0 ? "완전한 원 궤도로는 관측과 최대 <b>" + (mx / 60).toFixed(1) + "°</b> 나 어긋납니다. 이심률을 조금씩 키워 보세요." : (mx < 10 ? "✅ 최대 차이 <b>" + mx.toFixed(1) + "분</b> — 관측 정밀도 안으로 들어왔습니다. 화성은 약간 찌그러진 <b>타원</b>을 돕니다." : "최대 차이 " + (mx >= 60 ? (mx / 60).toFixed(1) + "°" : mx.toFixed(1) + "분") + ". " + (e < ET ? "이심률을 조금 더 키워 보세요." : "이심률이 너무 큽니다. 조금 줄여 보세요."));
      if (!got.a && e === 0) { got.a = ch = true; }
      if (!got.b && mx < 10) { got.b = ch = true; got.e = e; }
      if (ch) { window.sthState("kpGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m4-3a"); if (got.b) done("m4-3b");
      if (got.a && got.b) {
        window.sthState("kpBest", "원 버리고 이심률 " + (got.e || 0.093).toFixed(3) + " 의 타원");
        window.sthMission("m4-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("kpBest") + ". 케플러는 ‘8분을 무시할 수 없다’며 2천 년 된 원 궤도를 버리고 행성 운동 제1법칙(타원 궤도)을 찾았습니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("kp-e").addEventListener("input", function (ev) { e = Math.round(+ev.target.value * 1000) / 1000; $("kp-e-val").textContent = e.toFixed(3); update(); });
    update(); mission();
  })();

  window.sthSort({
    mount: "s4-sort",
    buckets: [{ id: "go", label: "🧭 새 이론의 길잡이" }, { id: "no", label: "🧱 새 이론의 걸림돌" }],
    items: [
      { t: "케플러 — 우주는 수학적 조화로 이루어졌다는 믿음으로 행성 법칙을 끝까지 찾았다", a: "go", why: "조화에 대한 믿음이 끈질긴 계산의 원동력이었습니다." },
      { t: "코페르니쿠스 — 우주는 단순하고 아름다워야 한다는 믿음으로 태양 중심 체계를 택했다", a: "go", why: "단순함을 추구한 세계관이 지동설로 이끌었습니다." },
      { t: "갈릴레이 — 자연이라는 책은 수학의 언어로 쓰여 있다고 보았다", a: "go", why: "실험과 수학으로 자연을 읽는 태도를 열었습니다." },
      { t: "뉴턴 — 하늘과 땅의 운동이 하나의 원리를 따른다고 믿었다", a: "go", why: "만유인력 법칙으로 통합했습니다." },
      { t: "아리스토텔레스 이후 — 천체는 완전한 원을 그려야 한다는 믿음", a: "no", why: "2천 년 동안 주전원을 덧붙이며 원을 지켰습니다." },
      { t: "갈릴레이 — 원운동이 완전하다고 믿어 케플러의 타원 궤도를 받아들이지 않았다", a: "no", why: "혁신가도 자신의 세계관에 갇힐 수 있습니다.", hint: "같은 과학자도 두 쪽 모두에 있을 수 있습니다." },
      { t: "티코 브라헤 — 무거운 지구가 움직일 리 없다고 보아 지구 중심의 절충 체계를 세웠다", a: "no", why: "정밀한 관측가였지만 지구 정지의 믿음을 버리지 못했습니다." },
      { t: "아인슈타인 — 우주는 변하지 않는다고 믿어 방정식에 우주 상수를 넣었다", a: "no", why: "뒤에 우주 팽창이 관측되자 이를 ‘가장 큰 실수’라 불렀다고 전해집니다." }
    ],
    onDone: function () { window.sthState("blBest", "길잡이 4 · 걸림돌 4"); window.sthMission("m4-4", true, "<span class='m-tag'>미션 완료</span>같은 신념이 어떤 때는 길잡이, 어떤 때는 걸림돌이 됩니다. 신념은 이론의 출발점이 되지만 최종 판단은 증거가 내립니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m4-4", true);

  function finish() { window.sthState("r4", "해결 · " + (window.sthState("psBest") || "") + " / " + (window.sthState("kpBest") || "")); }
  function vs() {
    var p = window.sthState("p4") || "";
    $("e4-vs").innerHTML = "<b>나의 첫 대답</b> " + (p || "기록 없음") + "<br><b>원근법</b> " + (window.sthState("psBest") || "-") + "<br><b>화성 궤도</b> " + (window.sthState("kpBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk4", unitLabel: "[과학의 역사와 문화 Ⅰ] 이야기 ④ 8분의 오차",
    items: [
      { id: "w2", label: "신념이 관측을 이긴 순간", hint: "과학자의 세계관이 결론에 영향을 준 사례를 하나 들고, 어디서 그것이 드러나는지 쓰세요." },
      { id: "e4a", label: "과학과 예술이 만난 자리", hint: "원근법이나 해부학처럼 르네상스 예술과 과학이 서로 도운 사례를 하나 들어, 무엇을 주고받았는지 쓰세요." }
    ]
  });
})();

/* ========================================================================= 07 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[과학의 역사와 문화 Ⅰ] 과학과 문명의 탄생과 통합 — 정리",
  recap: [
    { key: "r1", label: "① 범람을 예언한 별" },
    { key: "r2", label: "② 그림자로 잰 지구" },
    { key: "r3", label: "③ 지혜의 집에서 경복궁까지" },
    { key: "r4", label: "④ 8분의 오차" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "네 사건을 꿰는 한 문장", hint: "이집트의 달력, 그리스의 지구 둘레, 중세의 대수학과 역법, 케플러의 타원. 네 이야기를 ‘필요’, ‘관측’, ‘신념’이라는 말을 넣어 한 문장으로 이어 보세요." },
    { id: "w3", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 08 우리 반 */
window.sthShare({
  mount: "share", unit: "shc-1", unitLabel: "[과학의 역사와 문화 Ⅰ] 과학과 문명의 탄생과 통합",
  rows: [
    { key: "r1", label: "① 범람을 예언한 별" },
    { key: "r2", label: "② 그림자로 잰 지구" },
    { key: "r3", label: "③ 지혜의 집에서 경복궁까지" },
    { key: "r4", label: "④ 8분의 오차" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "네 사건을 꿰는 한 문장" }
});

})();
