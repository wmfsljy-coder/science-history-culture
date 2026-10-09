/* 과학의 역사와 문화 Ⅱ 변화하는 과학과 세계 — 소단원별 이야기 네 편
   01 빛이 휘었다 / 02 모네의 점, 가우디의 사슬 / 03 보이지 않는 적과의 싸움 / 04 경부선 400 km
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("shc-2");

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
function rgb(name) {
  var s = String(v(name)).trim(), m;
  if (s.charAt(0) === "#") {
    if (s.length === 4) s = "#" + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
    return [parseInt(s.substr(1, 2), 16), parseInt(s.substr(3, 2), 16), parseInt(s.substr(5, 2), 16)];
  }
  m = s.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  return m ? [+m[1], +m[2], +m[3]] : [128, 128, 128];
}
function mix(a, b, p) { return "rgb(" + [0, 1, 2].map(function (i) { return Math.round(a[i] * p + b[i] * (1 - p)); }).join(",") + ")"; }

/* =========================================================================
   이야기 ① 빛이 휘었다
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "사건 파일 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "p1", title: "기자의 첫 판단",
    question: "새 이론이 오래된 이론을 대신하려면 무엇이 필요할까?",
    options: ["㉠ 더 유명한 과학자의 주장", "㉡ 두 이론의 예측이 갈리는 현상을 관측해, 어느 쪽이 맞는지 보여 주는 증거", "㉢ 신문에 크게 실리는 것"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 빛의 휘어짐 */
  (function () {
    var canvas = $("c-defl"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, k = 0.5;
    var B = [2, 3, 4, 5, 6], D = [0.92, 0.55, 0.46, 0.33, 0.31];
    var got = window.sthState("dfGot") || { a: false, q: false };
    function rms(kk) { var s = 0; B.forEach(function (b, i) { var e = D[i] - kk / b; s += e * e; }); return Math.sqrt(s / B.length); }
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 580, y0 = 30, y1 = 240;
      function X(b) { return x0 + (b - 1) / 6 * (x1 - x0); }
      function Y(d) { return y1 - Math.min(d, 2) / 2 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      text(ctx, "별빛이 휘는 각도 (초)", x0 + 6, y0 - 10, { s: 11, w: "700", c: v("--mist") });
      [1, 2, 3, 4, 5, 6, 7].forEach(function (b) { text(ctx, b + "", X(b), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      text(ctx, "태양 중심에서 떨어진 거리 (태양 반지름의 몇 배)", x1, y1 + 34, { s: 10.5, a: "right", c: v("--mist") });
      [0, 0.5, 1, 1.5, 2].forEach(function (d) { text(ctx, d.toFixed(1), x0 - 6, Y(d) + 4, { s: 10, a: "right", c: v("--mist") }); });
      function curve(kk, c, w, dash) {
        var pts = []; for (var b = 1; b <= 7; b += 0.05) pts.push([X(b), Y(kk / b)]);
        ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = w; if (dash) ctx.setLineDash([5, 4]); ctx.beginPath();
        pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.stroke(); ctx.restore();
      }
      curve(0.87, v("--mist"), 1.5, true); curve(1.75, v("--amber-700"), 1.5, true);
      text(ctx, "- - 아인슈타인의 예측 1.75″", 620, 190, { s: 11, w: "800", c: v("--amber-700") });
      text(ctx, "- - 뉴턴의 예측 0.87″", 620, 210, { s: 11, w: "800", c: v("--mist") });
      text(ctx, "● 사진 속 별 다섯 개", 620, 230, { s: 11, w: "800", c: v("--coral") });
      curve(k, v("--brand"), 3);
      B.forEach(function (b, i) { dot(ctx, X(b), Y(D[i]), 6, v("--coral")); });
      var r = rms(k), ok = k >= 1.6 - 1e-9 && k <= 1.95 + 1e-9;
      text(ctx, "모형 " + k.toFixed(2) + "″", 620, 70, { s: 16, w: "900", c: v("--brand") });
      text(ctx, "측정값과의 평균 차이", 620, 104, { s: 12, c: v("--mist") });
      text(ctx, r.toFixed(3) + "″", 620, 136, { s: 22, w: "900", c: ok ? v("--green-700") : v("--ink") });
      return ok;
    }
    function update() {
      var ok = draw();
      $("df-info").innerHTML = "태양 가장자리에서 " + k.toFixed(2) + "″ 휘는 모형과 측정값의 평균 차이는 " + rms(k).toFixed(3) + "″ 입니다. " + (ok ? "측정값에 가장 잘 맞는 범위입니다." : "주황 점에 곡선이 더 가깝게 지나도록 조절해 보세요.");
      if (ok && !got.a) { got.a = true; got.k = k; window.sthState("dfGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-2a"); if (got.q) done("m1-2b");
      if (got.a && got.q) {
        window.sthState("dfBest", "측정값은 약 " + (got.k || 1.75).toFixed(2) + "″ — 아인슈타인 쪽");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("dfBest") + ". 두 이론의 예측이 두 배나 갈리는 현상을 골라 관측한 것이 결정적이었습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("df-k").addEventListener("input", function (e) { k = Math.round(+e.target.value * 100) / 100; $("df-k-val").textContent = k.toFixed(2) + "″"; update(); });
    window.sthPick({
      mount: "s1-pick",
      q: "측정값에 맞는 곡선은 누구의 예측에 가까운가요?",
      options: ["뉴턴 (0.87″)", "아인슈타인 (1.75″)", "빛은 전혀 휘지 않는다 (0″)"],
      answer: 1,
      why: ["측정값은 뉴턴 예측의 약 두 배입니다.", "태양 근처에서 공간이 휘어 빛의 경로가 휜다는 일반 상대성 이론의 예측과 맞습니다.", "측정값 모두 0 보다 분명히 큽니다."],
      onDone: function () { got.q = true; window.sthState("dfGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 위성 시계 */
  (function () {
    var canvas = $("c-gps"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, d = 1, on = false;
    var got = window.sthState("gpGot") || { a: false, b: false };
    function err(dd) { return on ? 0.01 * dd : 38e-6 * 3e5 * dd; }
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 560, y0 = 30, y1 = 220;
      function X(dd) { return x0 + dd / 30 * (x1 - x0); }
      function Y(km) { return y1 - Math.min(km, 350) / 350 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      text(ctx, "위치 오차 (km)", x0 + 6, y0 - 10, { s: 11, w: "700", c: v("--mist") });
      [0, 10, 20, 30].forEach(function (dd) { text(ctx, dd + "일", X(dd), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      [0, 100, 200, 300].forEach(function (km) { text(ctx, km + "", x0 - 6, Y(km) + 4, { s: 10, a: "right", c: v("--mist") }); });
      seg(ctx, x0, Y(100), x1, Y(100), v("--rose"), 1.2, true);
      text(ctx, "100 km", x1 - 4, Y(100) - 6, { s: 10.5, w: "800", a: "right", c: v("--rose-700") });
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
      ctx.strokeStyle = v("--brand"); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(30), Y(err(30))); ctx.stroke(); ctx.restore();
      dot(ctx, X(d), Y(err(d)), 7, v("--coral"));
      var e = err(d);
      text(ctx, "보정 " + (on ? "켬" : "끔") + " · " + d + "일 뒤", 600, 70, { s: 14, w: "800" });
      text(ctx, "시계 오차 " + (on ? "거의 0" : (38 * d) + " μs"), 600, 100, { s: 12.5, c: v("--mist") });
      text(ctx, (e < 1 ? e.toFixed(2) : e.toFixed(1)) + " km", 600, 136, { s: 24, w: "900", c: e > 100 ? v("--rose-700") : v("--green-700") });
      text(ctx, "= 빛의 속력 × 시계 오차", 600, 162, { s: 11.5, c: v("--mist") });
    }
    function update() {
      draw(); var ch = false, e = err(d);
      $("gp-info").innerHTML = on ? "위성 시계를 상대성 이론으로 미리 보정하면 오차가 쌓이지 않습니다. 오늘날 위성 항법은 이 보정을 기본으로 합니다." : "하루 38 μs 의 시계 오차 × 빛의 속력(30만 km/s) = 하루 약 <b>11.4 km</b> 의 위치 오차(단순화한 계산). " + d + "일이면 약 " + e.toFixed(0) + " km 입니다.";
      if (!on && d === 9 && !got.a) { got.a = ch = true; }
      if (on && d >= 30 && !got.b) { got.b = ch = true; }
      if (ch) { window.sthState("gpGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-3a"); if (got.b) done("m1-3b");
      if (got.a && got.b) {
        window.sthState("gpBest", "보정 없으면 9일 만에 100 km 넘게 틀림");
        window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("gpBest") + ". 100년 전 논쟁거리였던 이론이 오늘은 휴대 전화 지도를 움직입니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    segWire("gp-c", function (x) { on = x === "on"; update(); });
    $("gp-d").addEventListener("input", function (e) { d = +e.target.value; $("gp-d-val").textContent = d + "일"; update(); });
    update(); mission();
  })();

  window.sthSort({
    mount: "s1-sort",
    buckets: [{ id: "rel", label: "🌌 상대성 이론 논쟁" }, { id: "qm", label: "🎲 양자 역학 논쟁 (아인슈타인–보어)" }, { id: "cd", label: "🌍 대륙 이동설 논쟁" }],
    items: [
      { t: "시간과 공간이 관찰자에 따라 달라진다는 주장이 상식과 충돌했다", a: "rel", why: "특수 상대성 이론의 내용입니다." },
      { t: "일식 때 태양 근처 별빛의 휘어짐으로 두 이론을 시험했다", a: "rel", why: "1919년 관측입니다." },
      { t: "신문들이 ‘과학의 혁명’이라 보도해 한 과학자가 대중 스타가 되었다", a: "rel", why: "현대 과학이 사회문화에 끼친 영향입니다." },
      { t: "‘신은 주사위를 던지지 않는다’며 확률적 해석에 반대했다", a: "qm", why: "아인슈타인의 말로 전해집니다." },
      { t: "측정하기 전 입자의 상태는 확률로만 말할 수 있다고 주장했다", a: "qm", why: "보어를 중심으로 한 코펜하겐 해석입니다." },
      { t: "솔베이 회의에서 사고 실험을 주고받으며 수년간 토론했다", a: "qm", why: "과학자들의 대표적인 토론 사례입니다.", hint: "아인슈타인과 보어가 만난 학회입니다." },
      { t: "대서양 양쪽의 해안선 모양과 화석 분포가 들어맞는다는 증거를 제시했다", a: "cd", why: "베게너의 증거입니다." },
      { t: "대륙을 움직이는 힘을 설명하지 못해 수십 년간 외면받았다", a: "cd", why: "메커니즘이 없는 주장은 받아들여지기 어려웠습니다." },
      { t: "해저 확장의 증거가 발견된 뒤 판 구조론으로 받아들여졌다", a: "cd", why: "새 증거가 논쟁을 정리했습니다." }
    ],
    onDone: function () { window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>세 논쟁 모두 권위가 아닌 새로운 증거와 토론으로 정리되었습니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m1-4", true);

  function finish() { window.sthState("r1", "해결 · " + (window.sthState("dfBest") || "") + " / " + (window.sthState("gpBest") || "")); }
  function vs() {
    var p = window.sthState("p1") || "";
    $("e1-vs").innerHTML = "<b>나의 첫 판단</b> " + (p || "기록 없음") + "<br><b>일식 사진</b> " + (window.sthState("dfBest") || "-") + "<br><b>위성 시계</b> " + (window.sthState("gpBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[과학의 역사와 문화 Ⅱ] 이야기 ① 빛이 휘었다",
    items: [
      { id: "w1", label: "논쟁이 남긴 것", hint: "과학자들의 논쟁 사례를 하나 골라, 무엇을 두고 갈렸고 어떻게 정리되었는지 쓰세요." },
      { id: "e1a", label: "상대성 이론이 바꾼 사회", hint: "상대성 이론의 등장이 과학 밖의 사회·문화(신문, 철학, 예술, 기술)에 준 영향을 하나 골라 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 모네의 점, 가우디의 사슬
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "사건 파일 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "p2", title: "해설사의 첫 대답",
    question: "예술가가 과학을 공부한 까닭으로 가장 알맞은 것은?",
    options: ["㉠ 과학 시험을 보기 위해", "㉡ 빛·색·힘의 원리를 알면 새로운 표현과 구조를 만들 수 있어서", "㉢ 예술과 과학은 아무 관계가 없다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 점묘법 */
  (function () {
    var canvas = $("c-dots"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, pair = "ry", p = 20;
    var got = window.sthState("dtGot") || { a: false, q: false };
    var ORDER = []; for (var i = 0; i < 120; i++) ORDER.push((i * 53) % 120);
    function cols() { return pair === "ry" ? [rgb("--rose"), rgb("--amber")] : [rgb("--brand"), rgb("--amber")]; }
    function draw() {
      paper(ctx, W, H);
      var c = cols(), n1 = Math.round(p / 100 * 120);
      text(ctx, "가까이서 본 그림", 40, 26, { s: 12, w: "800" });
      for (var i = 0; i < 120; i++) {
        var r = Math.floor(i / 15), q = i % 15, first = ORDER[i] < n1;
        dot(ctx, 50 + q * 22, 50 + r * 25, 8.5, "rgb(" + (first ? c[0] : c[1]).join(",") + ")");
      }
      text(ctx, "멀리서 본 색", 440, 26, { s: 12, w: "800" });
      ctx.fillStyle = mix(c[0], c[1], p / 100); ctx.fillRect(440, 40, 150, 150);
      if (pair === "ry") {
        text(ctx, "목표: 주황", 620, 26, { s: 12, w: "800", c: v("--mist") });
        ctx.fillStyle = mix(c[0], c[1], 0.5); ctx.fillRect(620, 40, 70, 70);
      }
      text(ctx, "첫째 색 점 " + p + "%", 440, 214, { s: 13, w: "800" });
      return pair === "ry" && p >= 40 && p <= 60;
    }
    function update() {
      var ok = draw();
      $("dt-info").innerHTML = pair === "ry" ? (ok ? "✅ 빨강과 노랑 점이 비슷하게 섞이면 멀리서 <b>주황</b>으로 보입니다. 색은 팔레트가 아니라 눈 속에서 섞였습니다." : "빨강 점의 비율을 바꿔 오른쪽 목표 색에 가깝게 만들어 보세요.") : "파랑과 노랑 점을 섞으면 멀리서 어떤 색으로 보이나요? 물감을 섞을 때와 비교해 보세요.";
      if (ok && !got.a) { got.a = true; window.sthState("dtGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m2-2a"); if (got.q) done("m2-2b");
      if (got.a && got.q) {
        window.sthState("dtBest", "빨강·노랑 반반 → 주황, 파랑·노랑 → 회색빛");
        window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("dtBest") + ". 빛과 색에 대한 광학 연구가 점묘법이라는 새로운 그림 기법을 낳았습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    segWire("dt-p", function (x) { pair = x; update(); });
    $("dt-r").addEventListener("input", function (e) { p = +e.target.value; $("dt-r-val").textContent = p + "%"; update(); });
    window.sthPick({
      mount: "s2-pick",
      q: "물감으로 파랑과 노랑을 섞으면 초록이 됩니다. 그런데 파랑 점과 노랑 점을 반반 찍어 멀리서 보면 어떻게 보일까요?",
      options: ["물감처럼 선명한 초록", "두 색의 중간인 밝은 회색빛", "완전한 검정"],
      answer: 1,
      why: ["물감은 서로 빛을 흡수해 없애며 섞이지만(감법 혼합), 점은 각각 반사한 빛이 눈에서 합쳐집니다.", "눈에서 두 빛이 합쳐지면 두 색의 평균 쪽으로 보입니다. 파랑과 노랑은 서로 보색이라 합치면 회색빛이 됩니다. 화가들은 이 차이를 알고 점의 색을 골랐습니다.", "빛이 합쳐지므로 어두워지지 않습니다."],
      onDone: function () { got.q = true; window.sthState("dtGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 현수선 아치 */
  (function () {
    var canvas = $("c-cat"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, a = 10;
    var got = window.sthState("ctGot") || false;
    function hgt(aa) { return aa * (Math.cosh(10 / aa) - 1); }
    function draw() {
      paper(ctx, W, H);
      var gx = 300, gy = 270, s = 11;
      function X(x) { return gx + x * s; }
      function Y(y) { return gy - y * s; }
      seg(ctx, 40, gy, 580, gy, v("--line"), 2);
      var h = hgt(a);
      seg(ctx, X(-10), Y(10), X(10), Y(10), v("--amber"), 1.5, true);
      text(ctx, "목표 높이 10 m", X(10) + 8, Y(10) + 4, { s: 11, w: "800", c: v("--amber-700") });
      ctx.save(); ctx.beginPath(); ctx.rect(0, 20, W, gy - 18); ctx.clip();
      ctx.strokeStyle = v("--brand"); ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath();
      for (var x = -10; x <= 10.001; x += 0.25) { var y = h - a * (Math.cosh(x / a) - 1); if (x === -10) ctx.moveTo(X(x), Y(y)); else ctx.lineTo(X(x), Y(y)); }
      ctx.stroke(); ctx.restore();
      text(ctx, "폭 20 m", gx, gy + 18, { s: 11, w: "700", a: "center", c: v("--mist") });
      if (h > 22) text(ctx, "▲ 너무 높아 화면을 넘음", gx, 34, { s: 11, w: "800", a: "center", c: v("--rose-700") });
      var ok = Math.abs(h - 10) <= 0.3;
      text(ctx, "y = a (cosh(x/a) − 1)", 620, 60, { s: 12, w: "700", c: v("--mist") });
      text(ctx, "a = " + a.toFixed(1), 620, 92, { s: 16, w: "900" });
      text(ctx, "아치 높이", 620, 124, { s: 12, c: v("--mist") });
      text(ctx, h.toFixed(2) + " m", 620, 156, { s: 24, w: "900", c: ok ? v("--green-700") : v("--ink") });
      return ok;
    }
    function update() {
      var ok = draw(), h = hgt(a);
      $("ct-info").innerHTML = "a 가 작을수록 곡선이 가파르고 높아지며, 클수록 납작해집니다. 지금 높이 <b>" + h.toFixed(2) + " m</b>." + (ok ? " 누르는 힘이 곡선을 따라 땅으로 곧게 전해지는 아치입니다." : "");
      if (ok && !got) { got = true; window.sthState("ctGot", true); window.sthState("ctA", a); mission(); }
    }
    function mission() {
      if (!got) return;
      window.sthState("ctBest", "a ≈ " + (+window.sthState("ctA") || 6.2).toFixed(1) + " 인 현수선 아치");
      window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("ctBest") + ". 가우디는 사슬 모형을 거꾸로 매달아 계산 없이도 이 곡선을 찾았고, 사그라다 파밀리아의 기둥과 아치를 설계했습니다.");
      ep.clear(2);
    }
    canvas._redraw = draw;
    $("ct-a").addEventListener("input", function (e) { a = Math.round(+e.target.value * 10) / 10; $("ct-a-val").textContent = a.toFixed(1); update(); });
    update(); mission();
  })();

  window.sthSort({
    mount: "s2-sort",
    buckets: [{ id: "im", label: "🎨 인상주의·점묘법" }, { id: "cu", label: "🔷 입체주의" }, { id: "op", label: "🌀 옵아트" }, { id: "dg", label: "💻 디지털 아트" }, { id: "ar", label: "🏗️ 현대 건축" }],
    items: [
      { t: "빛이 눈에 만드는 순간의 인상을 그리려 했다", a: "im", why: "야외의 빛을 좇은 인상주의입니다." },
      { t: "광학·색채 연구의 영향으로 순수한 색 점을 나란히 찍었다", a: "im", why: "쇠라의 점묘법입니다." },
      { t: "한 그림에 여러 시점에서 본 모습을 동시에 담았다", a: "cu", why: "피카소·브라크의 입체주의입니다." },
      { t: "눈에 보이지 않는 4차원 공간과 비유클리드 기하학에 관심을 보였다", a: "cu", why: "당시 유행한 4차원 공간과 새로운 기하학 이야기가 영향을 주었습니다(상대성 이론이 대중에 널리 알려진 것은 입체주의가 시작된 뒤인 1919년 무렵입니다).", hint: "여러 시점을 한 화면에 담은 사조입니다." },
      { t: "기하학적 무늬만으로 화면이 움직이는 듯한 착시를 만든다", a: "op", why: "옵티컬 아트입니다." },
      { t: "눈과 뇌가 형태를 받아들이는 시지각 연구에서 영감을 얻었다", a: "op", why: "과학이 예술의 재료가 되었습니다." },
      { t: "알고리즘과 컴퓨터로 이미지를 생성한다", a: "dg", why: "생성 예술입니다." },
      { t: "인공지능이 학습한 데이터로 새로운 작품을 만든다", a: "dg", why: "저작권 같은 새로운 쟁점도 생겼습니다." },
      { t: "거꾸로 매단 사슬 모형으로 누르는 힘만 받는 아치를 설계했다", a: "ar", why: "가우디의 현수선 아치입니다." },
      { t: "철골을 삼각형 트러스로 짜 가볍고도 높은 탑을 세웠다", a: "ar", why: "에펠탑처럼 삼각형은 모양이 잘 변하지 않는 구조입니다." }
    ],
    onDone: function () { window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>새로운 과학 이론과 기술은 예술가와 건축가에게 새로운 표현 방식을 열어 주었습니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m2-4", true);

  function finish() { window.sthState("r2", "해결 · " + (window.sthState("dtBest") || "") + " / " + (window.sthState("ctBest") || "")); }
  function vs() {
    var p = window.sthState("p2") || "";
    $("e2-vs").innerHTML = "<b>나의 첫 대답</b> " + (p || "기록 없음") + "<br><b>점묘법</b> " + (window.sthState("dtBest") || "-") + "<br><b>현수선 아치</b> " + (window.sthState("ctBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[과학의 역사와 문화 Ⅱ] 이야기 ② 모네의 점, 가우디의 사슬",
    items: [
      { id: "e2a", label: "과학이 들어간 작품 소개", hint: "현대 예술 작품이나 건축물 하나를 골라, 어떤 과학 원리가 쓰였는지 전시 설명문처럼 쓰세요." },
      { id: "e2b", label: "예술이 과학에 주는 것", hint: "과학이 예술에 준 것뿐 아니라, 예술이 과학에 줄 수 있는 것은 무엇인지 생각해 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ③ 보이지 않는 적과의 싸움
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep3", key: "ep3", name: "사건 파일 ③", onDone: finish });

  window.sthGate({
    gate: "g3", key: "p3", title: "스노의 첫 계획",
    question: "병이 무엇을 통해 퍼지는지 밝히려면 먼저 무엇을 해야 할까?",
    options: ["㉠ 거리의 나쁜 냄새를 없앤다", "㉡ 환자가 어디에서 어떻게 생겼는지 자료를 모아 공통점을 찾는다", "㉢ 소문을 모아 가장 많이 들리는 원인을 믿는다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 스노의 지도 */
  (function () {
    var canvas = $("c-snow"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, pick = -1;
    var P = [[300, 150, "A 브로드 거리"], [130, 80, "B"], [470, 235, "C"], [520, 70, "D"]];
    var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    var cases = [];
    [[0, 34, 55], [1, 4, 40], [2, 3, 35], [3, 3, 35]].forEach(function (g) {
      for (var i = 0; i < g[1]; i++) { var r = g[2] * Math.sqrt(rnd()), t = rnd() * Math.PI * 2; cases.push([P[g[0]][0] + r * Math.cos(t), P[g[0]][1] + r * Math.sin(t) * 0.8]); }
    });
    function nearest(c) { var best = 0, bd = 1e9; P.forEach(function (p, i) { var d = Math.hypot(c[0] - p[0], c[1] - p[1]); if (d < bd) { bd = d; best = i; } }); return best; }
    var CNT = [0, 0, 0, 0]; cases.forEach(function (c) { CNT[nearest(c)]++; });
    var got = window.sthState("snGot") || { a: false, q: false };
    function draw() {
      paper(ctx, W, H);
      ctx.strokeStyle = v("--line"); ctx.lineWidth = 8;
      [[40, 115, 600, 115], [40, 200, 600, 200], [215, 25, 215, 285], [400, 25, 400, 285]].forEach(function (l) { ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.lineTo(l[2], l[3]); ctx.stroke(); });
      cases.forEach(function (c) { ctx.fillStyle = v("--ink"); ctx.fillRect(c[0] - 3, c[1] - 3, 6, 6); });
      P.forEach(function (p, i) {
        dot(ctx, p[0], p[1], 9, i === pick ? v("--mist") : v("--brand"));
        text(ctx, "🚰 " + p[2], p[0] + 12, p[1] - 10, { s: 11.5, w: "900", c: i === pick ? v("--mist") : v("--brand") });
      });
      text(ctx, "■ 사망자가 나온 집", 40, 20, { s: 11, w: "700", c: v("--mist") });
      text(ctx, "가장 가까운 펌프별 사망자", 630, 40, { s: 12, w: "800" });
      P.forEach(function (p, i) {
        var y = 70 + i * 40;
        text(ctx, p[2].split(" ")[0], 630, y + 12, { s: 13, w: "900" });
        ctx.fillStyle = i === 0 ? v("--rose") : v("--mist"); ctx.fillRect(660, y, CNT[i] * 5, 16);
        text(ctx, CNT[i] + "명", 666 + CNT[i] * 5, y + 13, { s: 11.5, w: "800" });
      });
      if (pick >= 0) text(ctx, "펌프 " + P[pick][2].split(" ")[0] + " 손잡이 제거", 630, 250, { s: 13, w: "900", c: pick === 0 ? v("--green-700") : v("--rose-700") });
    }
    function update() {
      draw();
      $("sn-info").innerHTML = pick < 0 ? "지도의 사망자 집마다 가장 가까운 펌프를 따져 세면 오른쪽 막대가 됩니다. 어느 펌프가 수상한가요?" : (pick === 0 ? "✅ 브로드 거리 펌프입니다. 손잡이를 뗄 무렵 유행은 이미 줄고 있었지만, 스노의 분석은 콜레라가 오염된 물로 퍼진다는 강력한 근거가 되었습니다. 뒤에 이 우물이 오물 구덩이와 가까이 있어 오염되었음이 밝혀졌습니다." : "펌프 " + P[pick][2] + " 주변의 사망자는 " + CNT[pick] + "명뿐입니다. 이 펌프를 막아도 유행은 계속됩니다.");
      if (pick === 0 && !got.a) { got.a = true; window.sthState("snGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m3-2a"); if (got.q) done("m3-2b");
      if (got.a && got.q) {
        window.sthState("snBest", "사망자 " + CNT[0] + "명이 몰린 브로드 거리 펌프");
        window.sthMission("m3-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("snBest") + ". 자료의 공간 분포로 원인을 찾는 역학 조사가 이렇게 시작되었습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    segWire("sn-p", function (x) { pick = +x; update(); });
    window.sthPick({
      mount: "s3-pick",
      q: "스노의 조사가 오늘날까지 높이 평가받는 까닭으로 가장 알맞은 것은?",
      options: ["세균을 현미경으로 직접 찾아냈기 때문에", "원인을 모르는 상태에서도 환자의 분포 자료를 분석해 전파 경로를 찾고 대책을 세웠기 때문에", "나쁜 공기가 병을 옮긴다는 설을 증명했기 때문에"],
      answer: 1,
      why: ["콜레라균은 그 뒤에 확인되었습니다. 스노는 지도와 통계로 원인을 좁혔습니다.", "자료를 모으고 분포를 분석해 원인을 추론하는 방법은 오늘날 역학 조사와 방역의 기본이 되었습니다.", "오히려 스노는 공기 전파설(미아스마설)에 반대했습니다."],
      onDone: function () { got.q = true; window.sthState("snGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 집단 면역 */
  (function () {
    var canvas = $("c-herd"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, R0 = 2.5, vc = 30;
    var got = window.sthState("hdGot") || { a: false, b: false };
    function reff() { return R0 * (1 - vc / 100); }
    function draw() {
      paper(ctx, W, H);
      var re = reff(), x0 = 60, x1 = 560, y0 = 30, y1 = 230, G = 8;
      axes(ctx, x0, y0, x1, y1);
      text(ctx, "세대별 새 환자 수 (처음 100명, 로그 눈금)", x0 + 6, y0 - 10, { s: 11, w: "700", c: v("--mist") });
      function Y(n) { var l = Math.log(Math.max(n, 1)) / Math.LN10; return y1 - Math.min(l, 6) / 6 * (y1 - y0); }
      [1, 100, 10000, 1000000].forEach(function (n) { text(ctx, n >= 10000 ? (n / 10000) + "만" : n + "", x0 - 6, Y(n) + 4, { s: 10, a: "right", c: v("--mist") }); });
      for (var g = 0; g <= G; g++) {
        var n = 100 * Math.pow(re, g), bx = x0 + 12 + g * (x1 - x0 - 24) / (G + 1), bw = (x1 - x0) / (G + 2);
        ctx.fillStyle = re <= 1 + 1e-9 ? v("--green") : v("--rose"); ctx.globalAlpha = .7; ctx.fillRect(bx, Y(n), bw, y1 - Y(n)); ctx.globalAlpha = 1;
        text(ctx, g + "세대", bx + bw / 2, y1 + 16, { s: 10, a: "center", c: v("--mist") });
      }
      text(ctx, "R0 = " + R0, 600, 60, { s: 14, w: "800" });
      text(ctx, "면역 " + vc + "%", 600, 86, { s: 14, w: "800", c: v("--mist") });
      text(ctx, "실제 전파 수 = R0 × (1 − 면역 비율)", 600, 116, { s: 11.5, c: v("--mist") });
      text(ctx, re.toFixed(2), 600, 150, { s: 26, w: "900", c: re <= 1 + 1e-9 ? v("--green-700") : v("--rose-700") });
      text(ctx, re <= 1 + 1e-9 ? "유행이 번지지 못함" : "유행이 커짐", 600, 176, { s: 12.5, w: "800", c: re <= 1 + 1e-9 ? v("--green-700") : v("--rose-700") });
    }
    function update() {
      draw(); var re = reff(), ch = false;
      $("hd-info").innerHTML = "R0 = " + R0 + " 인 감염병에서 인구의 " + vc + "% 가 면역이면 환자 한 명이 실제로 옮기는 수는 <b>" + re.toFixed(2) + "명</b>입니다. " + (re < 1 - 1e-9 ? "1 보다 작으므로 세대가 지날수록 환자가 줄어듭니다." : re <= 1 + 1e-9 ? "정확히 1 이라 환자 수가 더 늘지 않고 그대로 유지됩니다(1 보다 작아지면 줄어듭니다)." : "1 보다 크므로 세대마다 환자가 불어납니다.");
      if (re <= 1 + 1e-9 && R0 === 2.5 && !got.a) { got.a = ch = true; }
      if (re <= 1 + 1e-9 && R0 === 9 && !got.b) { got.b = ch = true; }
      if (ch) { window.sthState("hdGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m3-3a"); if (got.b) done("m3-3b");
      if (got.a && got.b) {
        window.sthState("hdBest", "R0 2.5 → 60%, R0 9 → 89% 이상");
        window.sthMission("m3-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("hdBest") + ". 필요한 면역 비율은 1 − 1/R0. 잘 퍼지는 감염병일수록 훨씬 많은 사람이 면역을 가져야 합니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    segWire("hd-d", function (x) { R0 = +x; update(); });
    $("hd-v").addEventListener("input", function (e) { vc = +e.target.value; $("hd-v-val").textContent = vc + "%"; update(); });
    update(); mission();
  })();

  (function () {
    var STEPS = ["14세기 흑사병 — 격리와 검역이 자리 잡다", "1854년 런던 콜레라 — 역학 조사가 시작되고 상하수도가 정비되다", "1918년 스페인 독감 — 바이러스학과 국제 보건 협력이 자라다", "1980년대 HIV/AIDS — 항바이러스제 개발과 함께 낙인·인권 문제가 떠오르다", "2020년 COVID-19 — mRNA 백신이 1년 안에 보급되고 필수 노동자의 안전이 쟁점이 되다"];
    function ok() { window.sthMission("m3-4", true, "<span class='m-tag'>미션 완료</span>감염병은 사회를 흔들었지만 그때마다 과학과 제도가 한 걸음씩 나아갔습니다."); ep.clear(3); ep.clear(4); }
    if (ep.cleared(3)) { $("s3-order").innerHTML = "<div class='order sort'><div class='slots'>" + STEPS.map(function (s) { return "<div class='slot filled'>" + s + "</div>"; }).join("") + "</div></div>"; window.sthMission("m3-4", true); }
    else window.sthOrder({ mount: "s3-order", steps: STEPS, onDone: ok });
  })();

  function finish() { window.sthState("r3", "해결 · " + (window.sthState("snBest") || "") + " / " + (window.sthState("hdBest") || "")); }
  function vs() {
    var p = window.sthState("p3") || "";
    $("e3-vs").innerHTML = "<b>나의 첫 계획</b> " + (p || "기록 없음") + "<br><b>스노의 지도</b> " + (window.sthState("snBest") || "-") + "<br><b>집단 면역</b> " + (window.sthState("hdBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk3", unitLabel: "[과학의 역사와 문화 Ⅱ] 이야기 ③ 보이지 않는 적과의 싸움",
    items: [
      { id: "e3a", label: "감염병이 바꾼 사회", hint: "감염병 하나를 골라, 그것이 사회에 준 영향과 과학이 문제 해결에 기여한 점을 함께 쓰세요." },
      { id: "e3b", label: "과학만으로 풀 수 없는 것", hint: "COVID-19 때 드러난 필수 노동자의 안전처럼, 감염병 대응에서 과학 밖의 문제 하나를 들고 어떻게 풀면 좋을지 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ④ 경부선 400 km
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep4", key: "ep4", name: "사건 파일 ④", onDone: finish });

  window.sthGate({
    gate: "g4", key: "p4", title: "나의 첫 대답",
    question: "과학기술이 가져온 변화를 평가할 때 가장 알맞은 태도는?",
    options: ["㉠ 좋아진 점만 보면 된다", "㉡ 나빠진 점만 보면 된다", "㉢ 긍정적 효과와 부정적 영향을 함께, 같은 무게로 따진다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 서울–부산 */
  (function () {
    var canvas = $("c-trip"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, sp = 60;
    var got = window.sthState("tpGot") || { a: false, b: false };
    var REF = [["걷기 (하루 8시간씩)", 100], ["1905년 경부선 직통 급행", 14], ["1936년 특급 열차", 6.75], ["1970년 고속버스", 5], ["2004년 KTX", 2.67]];
    function draw() {
      paper(ctx, W, H);
      var x0 = 190, x1 = 580, y = 40;
      function X(h) { return x0 + Math.log(h / 1) / Math.log(120) * (x1 - x0); }
      text(ctx, "서울 → 부산 400 km 이동 시간 (로그 눈금)", 30, 22, { s: 12, w: "800" });
      [1, 3, 10, 30, 100].forEach(function (h) { seg(ctx, X(h), y - 6, X(h), 236, v("--line"), 1, true); text(ctx, h + "시간", X(h), 252, { s: 10, a: "center", c: v("--mist") }); });
      REF.forEach(function (r, i) {
        var yy = y + i * 34;
        text(ctx, r[0], x0 - 8, yy + 14, { s: 11.5, w: "700", a: "right", c: v("--mist") });
        ctx.fillStyle = v("--mist"); ctx.globalAlpha = .35; ctx.fillRect(x0, yy + 2, X(r[1]) - x0, 16); ctx.globalAlpha = 1;
      });
      var t = 400 / sp, yy = y + REF.length * 34;
      text(ctx, "지금 고른 속력", x0 - 8, yy + 14, { s: 11.5, w: "900", a: "right", c: v("--brand") });
      ctx.fillStyle = v("--brand"); ctx.fillRect(x0, yy + 2, Math.max(2, X(t) - x0), 16);
      text(ctx, sp + " km/h", 620, 70, { s: 16, w: "900" });
      text(ctx, "편도", 620, 102, { s: 12, c: v("--mist") });
      text(ctx, t.toFixed(1) + "시간", 620, 132, { s: 24, w: "900" });
      text(ctx, "왕복 " + (2 * t).toFixed(1) + "시간", 620, 162, { s: 14, w: "800", c: 2 * t <= 6 + 1e-9 ? v("--green-700") : v("--mist") });
    }
    function update() {
      draw(); var t = 400 / sp, ch = false;
      $("tp-info").innerHTML = "평균 " + sp + " km/h 로 400 km 를 가면 <b>" + t.toFixed(1) + "시간</b>. " + (2 * t <= 6 + 1e-9 ? "당일에 부산에서 일을 보고 돌아올 수 있습니다." : "당일 출장은 어렵습니다.");
      if (!got.a && Math.abs(t - 14) <= 0.5) { got.a = ch = true; }
      if (!got.b && 800 / sp <= 6 + 1e-9 && sp <= 140) { got.b = ch = true; }
      if (ch) { window.sthState("tpGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m4-2a"); if (got.b) done("m4-2b");
      if (got.a && got.b) {
        window.sthState("tpBest", "1905년 기차 약 29 km/h, 당일 출장은 약 134 km/h 부터");
        window.sthMission("m4-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("tpBest") + ". 속력이 빨라지자 전국이 ‘하루 생활권’이 되었고, 일하는 방식과 도시의 모습도 달라졌습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("tp-v").addEventListener("input", function (e) { sp = +e.target.value; $("tp-v-val").textContent = sp + " km/h"; update(); });
    update(); mission();
  })();

  window.sthSort({
    mount: "s4-sort",
    buckets: [{ id: "li", label: "💡 빛" }, { id: "sh", label: "🌑 그림자" }],
    items: [
      { t: "원자력 — 적은 연료로 막대한 전기를 만들고 이산화탄소 배출이 적다", a: "li", why: "원자력의 긍정적 효과입니다." },
      { t: "원자력 — 대형 사고의 피해가 크고 방사성 폐기물 처리 문제가 따른다", a: "sh", why: "체르노빌·후쿠시마 사고가 그 예입니다." },
      { t: "화학 비료 — 수확량을 크게 늘려 녹색 혁명을 이끌었다", a: "li", why: "세계 인구 증가를 뒷받침했습니다." },
      { t: "화학 비료·농약 — 토양·수질 오염과 생태계 교란을 일으킬 수 있다", a: "sh", why: "지나치게 쓸 때 생기는 문제입니다." },
      { t: "항생제 — 세균 감염으로 인한 사망을 크게 줄였다", a: "li", why: "평균 수명을 늘린 20세기의 대표 기술입니다." },
      { t: "항생제 — 오남용으로 약이 듣지 않는 내성균이 늘어난다", a: "sh", why: "새로운 위협이 되었습니다." },
      { t: "화석 연료 — 값싸고 강력한 에너지로 산업화를 이끌었다", a: "li", why: "산업혁명의 원동력입니다." },
      { t: "화석 연료 — 온실 기체로 기후 변화와 대기 오염을 일으킨다", a: "sh", why: "오늘날 가장 큰 그림자 가운데 하나입니다." },
      { t: "철도·자동차 — 사람과 물자가 빠르게 오가 하루 생활권이 생겼다", a: "li", why: "교통수단의 발달이 가져온 변화입니다." },
      { t: "철도·자동차 — 교통사고와 소음, 도시의 무분별한 확장이 생겼다", a: "sh", why: "교통수단의 부정적 영향입니다.", hint: "좋은 점이 아닌 새로 생긴 문제입니다." }
    ],
    onDone: function () { window.sthMission("m4-3", true, "<span class='m-tag'>미션 완료</span>같은 기술이 빛과 그림자를 함께 가집니다. 한쪽만 보면 올바르게 판단할 수 없습니다."); ep.clear(2); }
  });
  if (ep.cleared(2)) window.sthMission("m4-3", true);

  /* 장면 4 — 항생제와 내성균 */
  (function () {
    var canvas = $("c-abx"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, n = 3;
    var got = window.sthState("abGot") || { a: false, b: false };
    function sim(nn) {
      var S = 1e6, R = 50, out = [[S, R]];
      for (var d = 1; d <= 20; d++) {
        if (d <= nn) { S *= 0.25; R *= 0.6; if (S < 1) S = 0; if (R < 1) R = 0; }
        else { var tot = S + R; if (tot > 0) { var g = Math.min(2, 1e6 / tot); S *= g; R *= g; } }
        out.push([S, R]);
      }
      return out;
    }
    function draw() {
      paper(ctx, W, H);
      var s = sim(n), x0 = 70, x1 = 560, y0 = 30, y1 = 240;
      function X(d) { return x0 + d / 20 * (x1 - x0); }
      function Y(c) { var l = c < 1 ? -0.3 : Math.log(c) / Math.LN10; return y1 - (l + 0.3) / 6.3 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      ctx.fillStyle = v("--brand"); ctx.globalAlpha = .1; ctx.fillRect(X(0), y0, X(n) - X(0), y1 - y0); ctx.globalAlpha = 1;
      text(ctx, "약 먹는 기간", Math.max(X(n / 2), x0 + 40), y1 - 8, { s: 10.5, w: "800", a: "center", c: v("--brand") });
      [1, 100, 10000, 1000000].forEach(function (c) { text(ctx, c >= 10000 ? (c / 10000) + "만" : c + "", x0 - 6, Y(c) + 4, { s: 10, a: "right", c: v("--mist") }); });
      [0, 5, 10, 15, 20].forEach(function (d) { text(ctx, d + "일", X(d), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      [[0, v("--mist"), "보통 세균"], [1, v("--rose"), "내성균"]].forEach(function (k) {
        ctx.strokeStyle = k[1]; ctx.lineWidth = 3; ctx.beginPath();
        s.forEach(function (p, d) { if (d) ctx.lineTo(X(d), Y(p[k[0]])); else ctx.moveTo(X(d), Y(p[k[0]])); }); ctx.stroke();
      });
      text(ctx, "— 보통 세균", 600, 214, { s: 11, w: "800", c: v("--mist") });
      text(ctx, "— 내성균", 600, 232, { s: 11, w: "800", c: v("--rose-700") });
      var e = s[n], tot = e[0] + e[1], share = tot > 0 ? e[1] / tot * 100 : 0, cured = tot === 0;
      text(ctx, n + "일째에 끊음", 600, 60, { s: 14, w: "900" });
      text(ctx, "남은 세균 " + (tot < 1 ? "0" : Math.round(tot).toLocaleString()) + "마리", 600, 90, { s: 12.5, c: v("--mist") });
      text(ctx, "그중 내성균", 600, 120, { s: 12, c: v("--mist") });
      text(ctx, cured ? "—" : share.toFixed(1) + "%", 600, 150, { s: 24, w: "900", c: cured ? v("--green-700") : v("--rose-700") });
      text(ctx, cured ? "완치" : "20일째: 다시 불어남", 600, 178, { s: 13, w: "900", c: cured ? v("--green-700") : v("--rose-700") });
      return { cured: cured, share: share };
    }
    function update() {
      var r = draw(), ch = false;
      $("ab-info").innerHTML = r.cured ? "✅ " + n + "일 동안 먹자 보통 세균과 내성균이 모두 사라졌습니다." : n + "일째에 끊으면 살아남은 세균 가운데 내성균이 <b>" + r.share.toFixed(1) + "%</b> — 처음(0.005%)보다 훨씬 높습니다. 다시 불어난 세균에는 같은 약이 잘 듣지 않습니다.";
      if (!got.a && n >= 4 && n <= 7) { got.a = ch = true; }
      if (!got.b && r.cured && n === 10) { got.b = ch = true; }
      if (ch) { window.sthState("abGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m4-4a"); if (got.b) done("m4-4b");
      if (got.a && got.b) {
        window.sthState("abBest", "10일을 채워야 완치, 도중에 끊으면 내성균이 늘어남");
        window.sthMission("m4-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("abBest") + ". 약을 먹다 끊으면 약한 세균만 죽고 강한 세균이 살아남아 퍼집니다. 같은 기술도 쓰는 방법에 따라 빛이 되거나 그림자가 됩니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    $("ab-n").addEventListener("input", function (e) { n = +e.target.value; $("ab-n-val").textContent = n + "일"; update(); });
    update(); mission();
  })();

  function finish() { window.sthState("r4", "해결 · " + (window.sthState("tpBest") || "") + " / " + (window.sthState("abBest") || "")); }
  function vs() {
    var p = window.sthState("p4") || "";
    $("e4-vs").innerHTML = "<b>나의 첫 대답</b> " + (p || "기록 없음") + "<br><b>서울–부산</b> " + (window.sthState("tpBest") || "-") + "<br><b>항생제</b> " + (window.sthState("abBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk4", unitLabel: "[과학의 역사와 문화 Ⅱ] 이야기 ④ 경부선 400 km",
    items: [
      { id: "w2", label: "빛과 그림자", hint: "한 기술을 골라 긍정적 효과와 부정적 영향을 각각 하나씩, 같은 무게로 쓰세요.", ph: "긍정: … / 부정: …" },
      { id: "e4a", label: "교통이 바꾼 우리 동네", hint: "고속철도·고속도로·지하철 같은 교통수단이 우리 지역의 생활이나 모습을 어떻게 바꾸었는지 쓰세요." }
    ]
  });
})();

/* ========================================================================= 07 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[과학의 역사와 문화 Ⅱ] 변화하는 과학과 세계 — 정리",
  recap: [
    { key: "r1", label: "① 빛이 휘었다" },
    { key: "r2", label: "② 모네의 점, 가우디의 사슬" },
    { key: "r3", label: "③ 보이지 않는 적과의 싸움" },
    { key: "r4", label: "④ 경부선 400 km" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "네 사건을 꿰는 한 문장", hint: "상대성 이론, 예술, 감염병, 교통과 항생제. 네 이야기를 ‘현대 과학’과 ‘사회’라는 말을 넣어 한 문장으로 이어 보세요." },
    { id: "w3", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 08 우리 반 */
window.sthShare({
  mount: "share", unit: "shc-2", unitLabel: "[과학의 역사와 문화 Ⅱ] 변화하는 과학과 세계",
  rows: [
    { key: "r1", label: "① 빛이 휘었다" },
    { key: "r2", label: "② 모네의 점, 가우디의 사슬" },
    { key: "r3", label: "③ 보이지 않는 적과의 싸움" },
    { key: "r4", label: "④ 경부선 400 km" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "네 사건을 꿰는 한 문장" }
});

})();
