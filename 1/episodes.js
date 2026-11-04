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

/* ── 무대 그림 도구 (../assets/kit.js) ── */
var K = window.sthKit, KC = K.C, REDUCE = K.REDUCE;
function put(id, html) { var e = $(id); if (e) e.innerHTML = html; }
/* 읽음판: rows = [[이름, 값, 색(b·y·g·r), 보조]], ok = [통과?, 문구] */
function readout(id, rows, ok) {
  var h = "";
  rows.forEach(function (r) { h += "<span class='k'>" + r[0] + "</span><span class='v " + (r[2] || "b") + "'>" + r[1] + "</span>" + (r[3] ? "<span class='sub'>" + r[3] + "</span>" : ""); });
  if (ok) h += "<span class='ok " + (ok[0] ? "g" : "r") + "'>" + ok[1] + "</span>";
  put(id, h);
}
/* 재질: 놋쇠·나무·양피지 */
function brassG(ctx, x0, y0, x1, y1) { var g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, "#fff1bf"); g.addColorStop(.35, "#e0b04e"); g.addColorStop(.7, "#a8741f"); g.addColorStop(1, "#6e4810"); return g; }
function parch(ctx, x, y, w, h, seed) {
  var g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, "#efdcb0"); g.addColorStop(.5, "#e4cc98"); g.addColorStop(1, "#cfae73");
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fill();
  var R = K.rng(seed || 5); ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.clip();
  for (var i = 0; i < 26; i++) { ctx.strokeStyle = "rgba(120,80,30," + (.05 + R() * .07) + ")"; ctx.lineWidth = 1; var yy = y + R() * h; ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy + (R() - .5) * 6); ctx.stroke(); }
  var vg = ctx.createRadialGradient(x + w / 2, y + h / 2, Math.min(w, h) * .3, x + w / 2, y + h / 2, Math.max(w, h) * .7); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(90,50,10,.35)"); ctx.fillStyle = vg; ctx.fillRect(x, y, w, h);
  ctx.restore();
}
function ink(ctx, s, x, y, o) { o = o || {}; K.t(ctx, s, x, y, { s: o.s || 13, w: o.w || "700", a: o.a, c: o.c || "#3a2410" }); }

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
      ctx.clearRect(0, 0, W, H);
      var d = drift(yr), g = gap(yr), i, R;
      /* ── 왼쪽: 나일강의 새벽 ── */
      var LW = 300, hy = 230;
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 3 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var sk = ctx.createLinearGradient(0, 0, 0, hy);
      sk.addColorStop(0, "#080c2a"); sk.addColorStop(.55, "#222457"); sk.addColorStop(.85, "#7a4a6a"); sk.addColorStop(1, "#e89a5c");
      ctx.fillStyle = sk; ctx.fillRect(0, 0, LW, hy);
      R = K.rng(21);
      for (i = 0; i < 46; i++) { ctx.globalAlpha = .25 + R() * .55; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(R() * LW, 40 + R() * (hy - 110), R() > .9 ? 1.2 : .7, 0, 6.2832); ctx.fill(); }
      ctx.globalAlpha = 1;
      var sg = ctx.createRadialGradient(236, hy + 26, 4, 236, hy + 26, 170);
      sg.addColorStop(0, "rgba(255,200,120,.75)"); sg.addColorStop(.4, "rgba(255,150,80,.25)"); sg.addColorStop(1, "rgba(255,140,70,0)");
      ctx.fillStyle = sg; ctx.fillRect(0, 0, LW, H);
      /* 피라미드 실루엣 */
      ctx.fillStyle = "#1c1324";
      [[52, 170, 66], [128, 190, 44]].forEach(function (p) { ctx.beginPath(); ctx.moveTo(p[0] - p[2], hy); ctx.lineTo(p[0], p[1]); ctx.lineTo(p[0] + p[2], hy); ctx.closePath(); ctx.fill(); });
      ctx.fillStyle = "rgba(255,170,110,.18)"; ctx.beginPath(); ctx.moveTo(52, 170); ctx.lineTo(118, hy); ctx.lineTo(96, hy); ctx.closePath(); ctx.fill();
      /* 땅과 나일강 */
      var gd = ctx.createLinearGradient(0, hy, 0, H); gd.addColorStop(0, "#3b2a20"); gd.addColorStop(1, "#120b08");
      ctx.fillStyle = gd; ctx.fillRect(0, hy, LW, H - hy);
      var nl = ctx.createLinearGradient(0, hy + 30, 0, hy + 70); nl.addColorStop(0, "#2a5b8c"); nl.addColorStop(1, "#0d2a4c");
      ctx.fillStyle = nl; ctx.beginPath(); ctx.moveTo(0, hy + 40); ctx.bezierCurveTo(90, hy + 24, 180, hy + 58, LW, hy + 34); ctx.lineTo(LW, hy + 66); ctx.bezierCurveTo(180, hy + 90, 90, hy + 58, 0, hy + 76); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(255,190,120,.45)"; ctx.lineWidth = 1.2;
      for (i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(200 + i * 6, hy + 44 + i * 5); ctx.lineTo(240 + i * 4, hy + 44 + i * 5); ctx.stroke(); }
      ctx.restore();
      /* 시리우스 */
      K.glow(ctx, 196, hy - 22, 3.4, "rgba(200,228,255,.98)", 5.5); K.spikes(ctx, 196, hy - 22, 16, .6);
      K.pill(ctx, "나일강의 새벽 · 동쪽 하늘", 16, 28, { s: 13, c: KC.blue });
      K.pill(ctx, "★ 시리우스", 210, hy - 40, { s: 12, c: "#dbe9ff", box: [0, LW] });
      K.t(ctx, "해 뜨기 직전", 236, hy + 18, { s: 10.5, a: "center", c: "#ffd2a0" });
      K.pill(ctx, "이 새벽의 달력 날짜 · 새해 + " + Math.round(d) + "일", LW / 2, H - 16, { s: 12, a: "center", c: g <= 3 ? KC.green : KC.yellow, box: [0, LW] });

      /* ── 가운데: 365일 달력 바퀴 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "night", { seed: 8 });
      K.pill(ctx, "365일 달력 바퀴", RX + 16, 28, { s: 13, c: KC.blue });
      var cx = RX + 128, cy = 182, rr = 98;
      function A(day) { return -Math.PI / 2 + day / 365 * 2 * Math.PI; }
      ctx.fillStyle = "rgba(255,255,255,.04)"; ctx.beginPath(); ctx.arc(cx, cy, rr + 16, 0, 6.2832); ctx.fill();
      [[0, 120, KC.blue, "범람"], [120, 240, KC.green, "파종"], [240, 360, KC.orange, "수확"], [360, 365, KC.violet, ""]].forEach(function (s) {
        ctx.strokeStyle = s[2]; ctx.globalAlpha = .55; ctx.lineWidth = 20; ctx.beginPath(); ctx.arc(cx, cy, rr, A(s[0]) + .01, A(s[1]) - .01); ctx.stroke(); ctx.globalAlpha = 1;
        if (s[3]) { var am = A((s[0] + s[1]) / 2); K.pill(ctx, s[3], cx + Math.cos(am) * (rr - 44), cy + Math.sin(am) * (rr - 44) + 5, { s: 11, a: "center", c: s[2] }); }
      });
      ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 1;
      for (i = 0; i < 12; i++) { var at = A(i * 30); ctx.beginPath(); ctx.moveTo(cx + Math.cos(at) * (rr - 10), cy + Math.sin(at) * (rr - 10)); ctx.lineTo(cx + Math.cos(at) * (rr + 10), cy + Math.sin(at) * (rr + 10)); ctx.stroke(); }
      /* 새해 표시 */
      ctx.fillStyle = KC.yellow; ctx.beginPath(); ctx.moveTo(cx, cy - rr - 12); ctx.lineTo(cx - 7, cy - rr - 24); ctx.lineTo(cx + 7, cy - rr - 24); ctx.closePath(); ctx.fill();
      K.pill(ctx, "달력의 새해", cx + 14, cy - rr - 22, { s: 11, c: KC.yellow });
      /* 시리우스 바늘 */
      var as = A(d), sx = cx + Math.cos(as) * rr, sy = cy + Math.sin(as) * rr;
      if (d > 0.5) { ctx.strokeStyle = "rgba(220,235,255,.85)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, rr + 16, A(0), as); ctx.stroke(); }
      K.line(ctx, { x: cx, y: cy }, { x: sx, y: sy }, "rgba(220,235,255,.7)", 2);
      K.glow(ctx, sx, sy, 4, "rgba(200,228,255,.98)", 5);
      ctx.fillStyle = "#0b1030"; ctx.beginPath(); ctx.arc(cx, cy, 30, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "rgba(220,235,255,.4)"; ctx.lineWidth = 1.5; ctx.stroke();
      K.t(ctx, "+" + Math.round(d) + "일", cx, cy + 6, { s: 16, w: "900", a: "center", c: g <= 3 ? KC.green : "#dbe9ff" });
      K.pill(ctx, "★ = 시리우스가 새벽에 돌아오는 날", cx, H - 16, { s: 11, a: "center", c: "#dbe9ff", box: [RX, RX + 262] });

      /* ── 오른쪽: 햇수에 따른 늦어짐 ── */
      var gr = K.chart(ctx, { x: RX + 262, y: 44, w: W - RX - 270, h: H - 58, x0: 0, x1: 1600, y0: 0, y1: 365, xt: 4, yt: 4, pl: 40, yf: function (q) { return String(Math.round(q)); }, xl: "달력을 쓴 햇수(년)", yl: "새해보다 늦은 날(일)" });
      ctx.save(); ctx.strokeStyle = KC.yellow; ctx.globalAlpha = .7; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.moveTo(gr.L, gr.Y(30)); ctx.lineTo(gr.R, gr.Y(30)); ctx.stroke(); ctx.restore();
      K.pill(ctx, "한 달 = 30일", gr.R - 4, gr.Y(30) - 8, { s: 10.5, a: "right", c: KC.yellow });
      var seg1 = [], segs = [];
      for (var y = 0; y <= 1600; y += 4) { var dd2 = drift(y); if (seg1.length && dd2 < seg1[seg1.length - 1][1]) { segs.push(seg1); seg1 = []; } seg1.push([y, dd2]); }
      segs.push(seg1);
      segs.forEach(function (sgm) { K.plot(ctx, gr, sgm, KC.blue); });
      var px = gr.X(yr), py = gr.Y(d);
      K.line(ctx, { x: px, y: py }, { x: px, y: gr.B }, "rgba(255,255,255,.4)", 1, [3, 3]);
      K.line(ctx, { x: gr.L, y: py }, { x: px, y: py }, "rgba(255,255,255,.4)", 1, [3, 3]);
      K.glow(ctx, px, py, 4.5, "rgba(200,228,255,.98)", 3.5);
    }
    function update() {
      draw();
      var g = gap(yr), ch = false, back = yr >= 1000 && g <= 3, month = Math.abs(0.25 * yr - 30) <= 1.5;
      readout("sir-read", [
        ["달력을 쓴 햇수", yr.toLocaleString() + "년", "b"],
        ["쌓인 늦어짐", (0.25 * yr).toFixed(1) + "일", "y", "= 햇수 × ¼일"],
        ["달력 날짜로 본 차이", g.toFixed(1) + "일", g <= 3 ? "g" : "r"]
      ], back ? [true, "한 바퀴를 돌아 다시 같은 날"] : (month ? [true, "딱 한 달이 벌어졌습니다"] : null));
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
      { t: "0의 개념과 자릿값을 쓰는 십진법을 고안했다", a: "in", why: "오늘날 수 표기의 바탕입니다. 기원후 5~7세기 무렵의 일로, 같은 칸의 인더스 문명(기원전 2500년 무렵)보다 3천 년쯤 뒤입니다." },
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
    /* 밧줄 한 도막: 꼬인 삼끜 + 매듭 */
    function rope(p, q, n, hot) {
      ctx.save(); ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(0,0,0,.35)"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(p[0] + 2, p[1] + 3); ctx.lineTo(q[0] + 2, q[1] + 3); ctx.stroke();
      ctx.strokeStyle = hot ? "#e9cf86" : "#c9a466"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      ctx.strokeStyle = "#7a5528"; ctx.lineWidth = 6; ctx.setLineDash([2, 5]); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
      for (var k = 0; k < n; k++) { var kx = p[0] + (q[0] - p[0]) * k / n, ky = p[1] + (q[1] - p[1]) * k / n; K.planet(ctx, kx, ky, 6, "#e6c98e", "#5e3f1a"); }
    }
    function peg(x, y) {
      ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.beginPath(); ctx.ellipse(x + 3, y + 5, 10, 5, 0, 0, 6.2832); ctx.fill();
      K.planet(ctx, x, y, 9, "#b07a44", "#3e2410");
      ctx.strokeStyle = "rgba(255,220,170,.35)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 6.2832); ctx.stroke();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var t = tri(), u = 42, i;
      K.stage(ctx, 0, 0, W, H, "earth", { seed: 4 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, H, 14); ctx.clip();
      /* 물 빠진 밭: 젖은 실트 위의 갈라진 자국과 남은 물웅덩이 */
      var sl = ctx.createLinearGradient(0, 0, 0, H); sl.addColorStop(0, "#4a3624"); sl.addColorStop(1, "#24170e");
      ctx.fillStyle = sl; ctx.fillRect(0, 0, W, H);
      var R = K.rng(12);
      ctx.strokeStyle = "rgba(20,10,4,.45)"; ctx.lineWidth = 1;
      for (i = 0; i < 46; i++) { var cx0 = R() * W, cy0 = R() * H; ctx.beginPath(); ctx.moveTo(cx0, cy0); for (var j = 0; j < 4; j++) { cx0 += (R() - .5) * 40; cy0 += (R() - .5) * 26; ctx.lineTo(cx0, cy0); } ctx.stroke(); }
      [[90, 280, 70, 18], [800, 70, 80, 22], [700, 290, 50, 12]].forEach(function (p) {
        var pg = ctx.createRadialGradient(p[0], p[1], 2, p[0], p[1], p[2]); pg.addColorStop(0, "rgba(120,170,210,.45)"); pg.addColorStop(1, "rgba(60,110,150,0)");
        ctx.fillStyle = pg; ctx.beginPath(); ctx.ellipse(p[0], p[1], p[2], p[3], 0, 0, 6.2832); ctx.fill();
      });
      ctx.strokeStyle = "rgba(130,170,90,.18)"; ctx.lineWidth = 2;
      for (i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(0, 60 + i * 38); ctx.lineTo(W, 40 + i * 38); ctx.stroke(); }
      ctx.restore();
      K.pill(ctx, "물이 빠진 밭 — 매듭 12개 밧줄 고리", 16, 28, { s: 13, c: KC.orange });
      K.pill(ctx, "변 " + a + " · " + b + " · " + (12 - a - b) + "칸", W - 16, 28, { s: 12, a: "right", c: KC.ink });
      if (!t) {
        /* 삼각형이 안 되는 밧줄: 늘어진 채 놓인다 */
        var y0 = 200, x0 = 450 - 6 * 34;
        rope([x0, y0], [x0 + 12 * 34, y0], 12, false);
        peg(x0, y0); peg(x0 + a * 34, y0); peg(x0 + (a + b) * 34, y0);
        K.pill(ctx, "⚠ 세 변으로 삼각형을 만들 수 없어요", 450, 120, { s: 14, a: "center", c: KC.red });
        K.pill(ctx, "두 변의 합이 나머지 한 변보다 길어야 합니다", 450, 150, { s: 12, a: "center", c: KC.ink });
        return false;
      }
      var ang = Math.PI - t.B * Math.PI / 180;
      var P0 = [0, 0], P1 = [a * u, 0], P2 = [P1[0] + Math.cos(ang) * b * u, -Math.sin(ang) * b * u];
      var minx = Math.min(P0[0], P1[0], P2[0]), maxx = Math.max(P0[0], P1[0], P2[0]), miny = Math.min(0, P2[1]);
      var ox = 450 - (minx + maxx) / 2, oy = 188 - miny / 2;
      [P0, P1, P2].forEach(function (p) { p[0] += ox; p[1] += oy; });
      var ok = Math.abs(Math.max(t.A, t.B, t.C) - 90) < 0.5;
      ctx.fillStyle = ok ? "rgba(63,211,163,.14)" : "rgba(255,211,107,.10)";
      ctx.beginPath(); ctx.moveTo(P0[0], P0[1]); ctx.lineTo(P1[0], P1[1]); ctx.lineTo(P2[0], P2[1]); ctx.closePath(); ctx.fill();
      /* 각 표시 */
      var V = [[P0, P1, P2, t.A], [P1, P2, P0, t.B], [P2, P0, P1, t.C]];
      var big = V.reduce(function (m, x) { return x[3] > m[3] ? x : m; });
      V.forEach(function (q) {
        var a1 = Math.atan2(q[1][1] - q[0][1], q[1][0] - q[0][0]), a2 = Math.atan2(q[2][1] - q[0][1], q[2][0] - q[0][0]);
        var d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        var isR = q === big && ok, col = isR ? KC.green : (q === big ? KC.yellow : KC.blue);
        if (isR) {
          var s = 16, ux = Math.cos(a1), uy = Math.sin(a1), vx = Math.cos(a1 + d), vy = Math.sin(a1 + d);
          ctx.fillStyle = "rgba(63,211,163,.3)"; ctx.strokeStyle = KC.green; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); ctx.lineTo(q[0][0] + ux * s, q[0][1] + uy * s); ctx.lineTo(q[0][0] + (ux + vx) * s, q[0][1] + (uy + vy) * s); ctx.lineTo(q[0][0] + vx * s, q[0][1] + vy * s); ctx.closePath(); ctx.fill(); ctx.stroke();
        } else {
          var lo = d > 0 ? a1 : a1 + d, hi = d > 0 ? a1 + d : a1;
          K.wedge(ctx, q[0][0], q[0][1], lo, hi, 26, col === KC.yellow ? "rgba(255,211,107,.22)" : "rgba(127,211,255,.18)", col);
        }
        var bis = a1 + d / 2, lx = q[0][0] - Math.cos(bis) * 30, ly = q[0][1] - Math.sin(bis) * 30 + 5;
        K.pill(ctx, q[3].toFixed(0) + "°" + (isR ? " 직각!" : ""), lx, ly, { s: 12, a: "center", c: col });
      });
      /* 밧줄과 말뚝 */
      rope(P0, P1, a, ok); rope(P1, P2, b, ok); rope(P2, P0, t.c, ok);
      [P0, P1, P2].forEach(function (p) { peg(p[0], p[1]); });
      /* 변 길이 이름표(삼각형 바깥쪽) */
      var cxT = (P0[0] + P1[0] + P2[0]) / 3, cyT = (P0[1] + P1[1] + P2[1]) / 3;
      [[P0, P1, a, "첫째"], [P1, P2, b, "둘째"], [P2, P0, t.c, "셋째"]].forEach(function (s) {
        var mx = (s[0][0] + s[1][0]) / 2, my = (s[0][1] + s[1][1]) / 2, dx = mx - cxT, dy = my - cyT, dl = Math.hypot(dx, dy) || 1;
        K.pill(ctx, s[3] + " " + s[2] + "칸", mx + dx / dl * 34, my + dy / dl * 30 + 5, { s: 11, a: "center", c: "#f3dcae" });
      });
      return ok;
    }
    function update() {
      var ok = draw(), t = tri();
      if (t) {
        var sd = [a, b, t.c].sort(function (p, q) { return p - q; }), s2 = sd[0] * sd[0] + sd[1] * sd[1];
        readout("rp-read", [
          ["세 변", a + " · " + b + " · " + t.c + " 칸", "b"],
          ["가장 큰 각", Math.max(t.A, t.B, t.C).toFixed(1) + "°", ok ? "g" : "y"],
          ["짧은 두 변", sd[0] + "² + " + sd[1] + "² = " + s2, "b", "긴 변 " + sd[2] + "² = " + sd[2] * sd[2]]
        ], ok ? [true, "직각! " + s2 + " = " + sd[2] * sd[2]] : [false, "아직 직각이 아닙니다"]);
      } else readout("rp-read", [["세 변", a + " · " + b + " · " + (12 - a - b) + " 칸", "r"]], [false, "삼각형이 만들어지지 않습니다"]);
      $("rp-info").innerHTML = !t ? "이 매듭 위치로는 밧줄이 겹치거나 모자랍니다." : ("세 변 " + a + " · " + b + " · " + t.c + " 칸. " + (ok ? "<b>직각</b>이 생겼습니다. 이 밧줄만 있으면 들판 어디서나 반듯한 경계를 다시 그을 수 있습니다." : "모서리가 직각이 아닙니다."));
      if (ok && !got.a) { got.a = true; window.sthState("ropeGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-4a"); if (got.q) done("m1-4b");
      if (got.a && got.q) {
        window.sthState("ropeBest", "3 : 4 : 5 밧줄로 직각");
        window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>세 변이 3 : 4 : 5이면 3² + 4² = 5²이므로 직각 삼각형이 됩니다. 범람 뒤 땅을 다시 나누는 실용적 필요가 기하학을 키웠습니다.");
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
      why: ["12칸이어도 4 · 4 · 4로 나누면 60° 정삼각형이 됩니다.", "훗날 ‘피타고라스 정리’로 불리는 관계입니다. 경험으로 얻은 지혜가 나중에 증명된 수학이 되었습니다.", "매듭 13개를 3 · 4 · 6 칸으로 나누면 세 변이 모두 다르지만 9 + 16 ≠ 36이라 직각이 되지 않습니다."],
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
    /* 돌 기둥(오벨리스크): 밑동 (x, y), 방향 dir(위쪽 단위벡터), 높이 L */
    function obelisk(x, y, ux, uy, L, wd) {
      var px = -uy, py = ux, w0 = wd, w1 = wd * .62;
      var g = ctx.createLinearGradient(x - px * w0, y - py * w0, x + px * w0, y + py * w0);
      g.addColorStop(0, "#f2d9a6"); g.addColorStop(.5, "#c99b5c"); g.addColorStop(1, "#7d5a2e");
      ctx.fillStyle = g; ctx.beginPath();
      ctx.moveTo(x - px * w0, y - py * w0); ctx.lineTo(x + px * w0, y + py * w0);
      ctx.lineTo(x + ux * L * .92 + px * w1, y + uy * L * .92 + py * w1); ctx.lineTo(x + ux * L, y + uy * L); ctx.lineTo(x + ux * L * .92 - px * w1, y + uy * L * .92 - py * w1);
      ctx.closePath(); ctx.fill();
    }
    /* ── 아이소메트릭 블록 모형: 시에네(왼쪽 위)에서 알렉산드리아(오른쪽 아래)까지 이집트 땅을 잘라 낸 블록 ──
       땅의 굽음은 학생이 잰 그림자에서 나온다(중심각 × EXG 만큼 휘게 그림). 햇빛은 위에서 곧게(나란하게) 내려온다. */
    var DH = 432, EXG = 1.5, XS = 90, XA = 470, ZT = 175, YO = 120, HO = 140;
    var I = K.iso({ ox: 440, oy: 150, s: 0.66, L: 560, D: 150 });
    var BL = I.L, BD = I.D, ph = 0, playing = !REDUCE;
    function exR() { return Math.min(EXG * ang(), 40) * Math.PI / 180; }
    function geo() {
      var e = exR(), Rd = e > 1e-5 ? (XA - XS) / e : 1e9;
      return { e: e, Rd: Rd, zc: ZT - Rd };
    }
    var G = geo();
    function surf(x) { var dx = x - XS, r = G.Rd * G.Rd - dx * dx; return G.zc + Math.sqrt(Math.max(0, r)); }
    function landCol(x, y, z, light) {
      var c;
      if (y > 52 && y < 74) c = "#3f86c4";                 /* 나일강 */
      else if (y > 40 && y < 86) c = "#6f9e4a";            /* 강가의 밭 */
      else c = ((Math.floor(x / 40) + Math.floor(y / 30)) % 2) ? "#dcc28a" : "#d4b77c"; /* 사막 */
      return K.tint(c, light);
    }
    var STRATA = ["#d9bd86", "#c7a774", "#b48f5e", "#9f7b4f", "#8a6843", "#76583a"];
    function faceFill(side, zf, Lw) {
      I.profile(ctx, side, zf, 0); ctx.save(); ctx.clip();
      for (var k = 0; k < 9; k++) {
        ctx.beginPath(); var u, st = Math.max(2, Lw / 80);
        for (u = 0; u <= Lw + .01; u += st) ctx.lineTo(Math.min(u, Lw), zf(Math.min(u, Lw)) - k * 26);
        for (u = Lw; u >= -.01; u -= st) ctx.lineTo(Math.max(u, 0), zf(Math.max(u, 0)) - (k + 1) * 26 - 1);
        ctx.closePath(); ctx.fillStyle = STRATA[k % STRATA.length]; ctx.fill();
      }
      var R = K.rng(side === "front" ? 41 : 43); ctx.fillStyle = "rgba(60,35,15,.22)";
      for (var i = 0; i < Lw * 1.4; i++) ctx.fillRect(R() * Lw, R() * 200, 1.6, 1.6);
      ctx.restore();
    }
    /* 기울어진 오벨리스크(막대): 밑동 (x0, y0, z0), 높이 H, 기울기 e(+x 쪽으로) */
    function obelisk3d(x0, y0, z0, H, e) {
      var ce = Math.cos(e), se = Math.sin(e), w = 7, w1 = 4.5, Hb = H * .9;
      function f(a, b, h) { return I.P(x0 + a * ce + h * se, y0 + b, z0 - a * se + h * ce); }
      I.quad(ctx, f(-w, w, 0), f(w, w, 0), f(w1, w1, Hb), f(-w1, w1, Hb), "#dcbb88");
      I.quad(ctx, f(w, -w, 0), f(w, w, 0), f(w1, w1, Hb), f(w1, -w1, Hb), "#a9844f");
      var tip = f(0, 0, H);
      I.quad(ctx, f(-w1, w1, Hb), f(w1, w1, Hb), tip, tip, "#f3dca6");
      I.quad(ctx, f(w1, -w1, Hb), f(w1, w1, Hb), tip, tip, "#c49a52");
      return { top: tip, mid: f(0, 0, H * .55), tx: x0 + H * se };
    }
    function drawModel(th, C, ok) {
      G = geo();
      var zS = surf(XS), zA = surf(XA), i, rx, p, q;
      K.studio(ctx, 0, 0, W, DH, { x: I.P(BL, BD, 0).x - 190, y: I.P(BL, BD, 0).y - 20, rx: 330, ry: 48 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, DH, 14); ctx.clip();
      /* 윗면: 사막·나일강 */
      I.field(ctx, function (x) { return surf(x); }, landCol, 56, 12);
      /* 앞면·오른쪽 면: 지층 단면 */
      I.face(ctx, "front", function (Lw) {
        faceFill("front", surf, Lw);
        /* 시에네 우물 갱도와 바닥까지 닿는 햇빛 */
        var bot = zS - 74;
        ctx.fillStyle = "#24170b"; ctx.fillRect(XS - 9, bot, 18, zS - bot);
        ctx.fillStyle = "#3d86c6"; ctx.fillRect(XS - 9, bot, 18, 9);
        ctx.fillStyle = "rgba(255,226,140,.62)"; ctx.fillRect(XS - 3.5, bot + 9, 7, zS - bot - 9);
        /* 땅에 수직인 선(연직선) — 아래로 이으면 지구 중심에서 만난다 */
        ctx.save(); ctx.setLineDash([7, 6]); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(255,255,255,.9)";
        ctx.beginPath(); ctx.moveTo(XS, zS); ctx.lineTo(XS, 0); ctx.stroke();
        var t = zA / (zA - G.zc);
        ctx.beginPath(); ctx.moveTo(XA, zA); ctx.lineTo(XA + t * (XS - XA), 0); ctx.stroke();
        ctx.restore();
      });
      I.face(ctx, "right", function (Lw) { faceFill("right", function () { return surf(BL); }, Lw); });
      I.shade(ctx, "front", surf);
      I.shade(ctx, "right", function () { return surf(BL); });
      I.edges(ctx, surf(BL), surf(BL));
      /* 시에네 우물 머리 */
      var wc = I.P(XS, BD - 11, zS);
      ctx.fillStyle = "#b9a17c"; ctx.beginPath(); ctx.ellipse(wc.x, wc.y - 3, 12, 6.5, 0, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#1c1208"; ctx.beginPath(); ctx.ellipse(wc.x, wc.y - 3, 7.5, 4, 0, 0, 6.2832); ctx.fill();
      K.glow(ctx, wc.x, wc.y - 2, 2.4, "rgba(255,226,150,.95)", 3);
      /* 마을 */
      [[22, 36, "#c0553f"], [48, 18, "#d08a2e"], [18, 92, "#c0553f"], [44, 104, "#3f6fb5"]].forEach(function (h) { I.house(ctx, h[0], h[1], surf(h[0] + 7), 14, 12, 10, h[2]); });
      [[498, 14, "#3f6fb5"], [526, 30, "#c0553f"], [500, 96, "#d08a2e"], [528, 112, "#c0553f"]].forEach(function (h) { I.house(ctx, h[0], h[1], surf(h[0] + 7), 14, 12, 10, h[2]); });
      [[140, 30], [180, 92], [260, 34], [330, 96], [400, 30], [445, 90]].forEach(function (t2, k) { I.tree(ctx, t2[0], t2[1], surf(t2[0]), .75 + (k % 3) * .1); });
      /* 알렉산드리아의 막대: 땅에 수직으로 서 있으니 시에네 쪽에서 보면 기울어 있다 */
      var tx = XA + HO * Math.sin(G.e);
      ctx.fillStyle = "rgba(40,25,10,.6)";
      p = [I.P(XA, YO - 7, zA), I.P(XA, YO + 7, zA), I.P(tx, YO + 1.5, surf(tx)), I.P(tx, YO - 1.5, surf(tx))];
      ctx.beginPath(); ctx.moveTo(p[0].x, p[0].y); for (i = 1; i < 4; i++) ctx.lineTo(p[i].x, p[i].y); ctx.closePath(); ctx.fill();
      var ob = obelisk3d(XA, YO, zA, HO, G.e);
      I.person(ctx, XA - 16, YO + 18, surf(XA - 16), "#f1e3c0", 1.15);
      /* 나란한 햇빛 */
      var rays = [[XS, BD - 11]];
      for (rx = 30; rx <= 540; rx += 64) rays.push([rx, 70]);
      rays.push([tx, YO]);
      rays.forEach(function (r, k) {
        q = I.P(r[0], r[1], surf(r[0])); var y0 = 34;
        ctx.save(); ctx.shadowColor = KC.yellow; ctx.shadowBlur = 5;
        K.arrow(ctx, { x: q.x, y: y0 }, { x: q.x, y: q.y - 2 }, "rgba(255,190,60,.62)", 1.5, 7); ctx.restore();
        var f = (ph * .45 + k * .37) % 1;
        K.glow(ctx, q.x, y0 + f * (q.y - y0 - 4), 2, "rgba(255,214,110,.95)", 2.6);
      });
      ctx.restore();
      /* 이름표 */
      var box = [0, W];
      I.label(ctx, XS, BD - 11, zS, "시에네 · 우물 바닥까지 햇빛", -64, 34, "#ffe7b0", box);
      K.pill(ctx, "알렉산드리아 · 막대", ob.mid.x + 54, ob.mid.y - 34, { s: 12, c: "#ffe7b0", box: box });
      K.line(ctx, ob.mid, { x: ob.mid.x + 50, y: ob.mid.y - 38 }, "rgba(20,25,40,.75)", 1.2);
      I.label(ctx, (XA + tx) / 2, YO, surf((XA + tx) / 2), "그림자 " + s.toFixed(1) + " cm", 58, 40, KC.yellow, box);
      I.label(ctx, 270, 63, surf(270), "나일강", -30, -36, "#bfe6ff", box);
      I.label(ctx, XS, BD, zS * .3, "땅에 수직인 선 → 아래로 이으면 지구 중심", -40, 46, "#ffffff", box);
      var mid = I.P((XS + XA) / 2, BD, 0);
      K.pill(ctx, "두 도시 사이 약 800 km", mid.x - 40, mid.y + 26, { s: 11.5, c: KC.ink, a: "center", box: box });
      K.pill(ctx, "☀ 하짓날 정오 · 나란한 햇빛", 470, 22, { s: 11.5, c: KC.yellow, box: box });
      /* 큰 글자 */
      var line2 = "그림자 " + s.toFixed(1) + " cm → 둘레 약 " + Math.round(C).toLocaleString() + " km";
      if (ok) { K.bigText(ctx, "막대 그림자로 잰 지구", 22, 50, 27, "#ffd35a"); K.bigText(ctx, line2, 22, 84, 17, "#ffffff"); }
      else if (C > 41000) { K.bigText(ctx, "이대로면 지구가 너무 크다", 22, 50, 26, "#ffffff"); K.bigText(ctx, line2, 22, 84, 17, "#ffd35a"); }
      else { K.bigText(ctx, "이대로면 지구가 너무 작다", 22, 50, 26, "#ffffff"); K.bigText(ctx, line2, 22, 84, 17, "#ffd35a"); }
      K.warn(ctx, 14, DH - 12, "⚠ 땅의 굽음과 막대의 기울기는 1.5배 과장 · 거리는 줄임");
    }
    function drawBottom(th, C, ok) {
      var y0 = DH + 8, h = H - y0, i;
      /* ── 왼쪽: 지구의 단면 ── */
      var LW = 444, ex = th * EXG * Math.PI / 180, cx = 214, cy = H - 14, R = 150;
      K.stage(ctx, 0, y0, LW, h, "space", { seed: 6 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, y0, LW, h, 14); ctx.clip();
      var at = ctx.createRadialGradient(cx, cy, R - 4, cx, cy, R + 20); at.addColorStop(0, "rgba(120,190,255,.45)"); at.addColorStop(1, "rgba(120,190,255,0)");
      ctx.fillStyle = at; ctx.beginPath(); ctx.arc(cx, cy, R + 20, 0, 6.2832); ctx.fill();
      var eg = ctx.createRadialGradient(cx - 50, cy - 110, 16, cx, cy, R);
      eg.addColorStop(0, "#3f8fe0"); eg.addColorStop(.7, "#1a4f9a"); eg.addColorStop(1, "#0d2c66");
      ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "#c9a35f"; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(cx, cy, R - 3, -Math.PI / 2 - .14, -Math.PI / 2 + ex + .12); ctx.stroke();
      ctx.restore();
      for (i = 0; i < 7; i++) {
        var rx = 40 + i * 52, dy = R * R - (rx - cx) * (rx - cx), yEnd = dy > 0 ? cy - Math.sqrt(dy) - 4 : H - 8;
        K.arrow(ctx, { x: rx, y: y0 + 34 }, { x: rx, y: Math.min(yEnd, H - 8) }, "rgba(255,211,107,.7)", 1.4, 7);
      }
      var S = { x: cx, y: cy - R }, A = { x: cx + R * Math.sin(ex), y: cy - R * Math.cos(ex) };
      K.line(ctx, { x: cx, y: cy }, S, "rgba(255,255,255,.6)", 1.3, [4, 4]); K.line(ctx, { x: cx, y: cy }, A, "rgba(255,255,255,.6)", 1.3, [4, 4]);
      K.wedge(ctx, cx, cy, -Math.PI / 2, -Math.PI / 2 + ex, 44, "rgba(127,211,255,.35)", KC.blue);
      K.glow(ctx, S.x, S.y, 3, "rgba(255,226,150,.95)", 3); K.glow(ctx, A.x, A.y, 3, "rgba(255,226,150,.95)", 3);
      K.pill(ctx, "지구 단면으로 보면", 14, y0 + 22, { s: 12.5, c: KC.blue });
      K.pill(ctx, "시에네", S.x - 12, S.y - 8, { s: 11, a: "right", c: "#ffe7b0", box: [0, LW] });
      K.pill(ctx, "알렉산드리아", A.x + 12, A.y - 4, { s: 11, c: "#ffe7b0", box: [0, LW] });
      K.pill(ctx, "중심각 " + th.toFixed(2) + "°", cx + 52, cy - 38, { s: 11.5, c: KC.blue, box: [0, LW] });
      K.pill(ctx, "지구 중심", cx - 12, cy - 4, { s: 10.5, a: "right", c: KC.mute, box: [0, LW] });
      K.t(ctx, "각은 1.5배로 그림", LW - 12, y0 + 22, { s: 10.5, a: "right", c: KC.mute });
      /* ── 오른쪽: 막대 확대 ── */
      var RX = LW + 8, RW = W - RX, gy = H - 36, bx = RX + 180, L = 140, sh = s / 100 * L;
      K.stage(ctx, RX, y0, RW, h, "sky", { seed: 2 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(RX, y0, RW, h, 14); ctx.clip();
      var sd = ctx.createLinearGradient(0, gy, 0, H); sd.addColorStop(0, "#e2bf7c"); sd.addColorStop(1, "#a77c3e");
      ctx.fillStyle = sd; ctx.fillRect(RX, gy, RW, H - gy);
      ctx.restore();
      var tip = { x: bx + sh, y: gy }, tp = { x: bx, y: gy - L }, ky = y0 + 24, k = (tp.y - ky) / L, sun = { x: tp.x - sh * k, y: ky };
      K.sun(ctx, sun.x, sun.y, 10);
      K.line(ctx, sun, tip, "rgba(255,170,40,.95)", 1.8, [6, 4]);
      ctx.fillStyle = "rgba(40,25,10,.75)"; ctx.fillRect(bx, gy - 1, Math.max(1, sh), 6);
      obelisk(bx, gy, 0, -1, L, 7);
      K.wedge(ctx, tp.x, tp.y, Math.PI / 2 - th * Math.PI / 180, Math.PI / 2, 56, "rgba(255,140,80,.35)", "#ff8a50");
      K.pill(ctx, "햇빛과 막대의 각 " + th.toFixed(2) + "°", tp.x + 22, tp.y + 34, { s: 11.5, c: "#ffb08a", box: [RX, W] });
      K.pill(ctx, "막대 1 m", bx - 14, gy - L / 2, { s: 11, a: "right", c: KC.ink, box: [RX, W] });
      K.pill(ctx, "그림자 " + s.toFixed(1) + " cm", bx + Math.max(sh, 4) + 12, gy + 20, { s: 11.5, c: KC.yellow, box: [RX, W] });
      K.pill(ctx, "알렉산드리아 막대 확대", RX + 14, y0 + 22, { s: 12.5, c: KC.blue, box: [RX, W] });
      K.pill(ctx, "막대 끝의 각 = 중심각 (엇각)", W - 14, y0 + 22, { s: 11, a: "right", c: KC.ink, box: [RX, W] });
    }
    function paint() {
      var th = ang(), C = circ(), ok = C >= 39000 && C <= 41000;
      ctx.clearRect(0, 0, W, H);
      drawModel(th, C, ok);
      drawBottom(th, C, ok);
      return ok;
    }
    function draw() {
      var ok = paint(), C = circ(), th = ang();
      readout("er-read", [
        ["햇빛과 막대의 각", th.toFixed(2) + "°", "y", "= 두 도시의 중심각"],
        ["지구 둘레", Math.round(C).toLocaleString() + " km", ok ? "g" : "b", "= 800 km × 360 ÷ " + th.toFixed(2)]
      ], ok ? [true, "오늘날 값(약 40,000 km)과 가깝습니다"] : [false, C > 41000 ? "너무 큽니다 · 그림자가 짧아요" : "너무 작습니다 · 그림자가 길어요"]);
      return ok;
    }
    var pbtn = $("er-play");
    function pLabel() { if (pbtn) pbtn.textContent = playing ? "⏸ 햇빛 멈추기" : "▶ 햇빛 흐름 보기"; }
    if (pbtn) pbtn.addEventListener("click", function () { playing = !playing; pLabel(); paint(); });
    pLabel();
    K.animate(canvas, function (dt) { if (!playing) return; ph += dt / 1000; paint(); }, 24);
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
      ctx.clearRect(0, 0, W, H);
      var tr = t * Math.PI / 180, i, R;
      /* ── 왼쪽: 옆에서 본 모습 ── */
      var LW = 430, ey = 168, ex = 214, half = m === "disc" ? Math.max(3, 52 * Math.cos(tr)) : 52;
      K.stage(ctx, 0, 0, LW, H, "space", { seed: 13 });
      K.pill(ctx, "옆에서 본 모습", 16, 28, { s: 13, c: KC.blue });
      K.sun(ctx, 52, ey, 20);
      for (i = -2; i <= 2; i++) K.line(ctx, { x: 92, y: ey + i * 24 }, { x: ex - 20, y: ey + i * 24 }, "rgba(255,211,107,.6)", 1.2, [5, 5]);
      /* 그림자 기둥 */
      var sg = ctx.createLinearGradient(ex, 0, LW, 0); sg.addColorStop(0, "rgba(5,5,15,.85)"); sg.addColorStop(1, "rgba(5,5,15,.35)");
      ctx.fillStyle = sg; ctx.fillRect(ex, ey - half, LW - ex - 6, half * 2);
      ctx.strokeStyle = "rgba(255,107,129,.6)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(ex, ey - half); ctx.lineTo(LW - 6, ey - half); ctx.moveTo(ex, ey + half); ctx.lineTo(LW - 6, ey + half); ctx.stroke(); ctx.setLineDash([]);
      if (m === "disc") {
        ctx.save(); ctx.translate(ex, ey); ctx.rotate(tr);
        var dg = ctx.createLinearGradient(-7, 0, 7, 0); dg.addColorStop(0, "#7fc0ff"); dg.addColorStop(.5, "#2a6fc0"); dg.addColorStop(1, "#123a7a");
        ctx.fillStyle = dg; ctx.beginPath(); ctx.ellipse(0, 0, 7, 52, 0, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = "rgba(190,225,255,.7)"; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
      } else K.earth(ctx, ex, ey, 52);
      K.pill(ctx, m === "disc" ? "지구 모형 · 원판" : "지구 모형 · 공", ex, ey + 82, { s: 11.5, a: "center", c: "#cfe6ff" });
      K.pill(ctx, "태양", 52, ey + 52, { s: 11.5, a: "center", c: KC.yellow });
      K.planet(ctx, 384, ey, 16, "#d8d2c4", "#4a463e");
      ctx.fillStyle = "rgba(110,30,20,.55)"; ctx.beginPath(); ctx.arc(384, ey, 16, 0, 6.2832); ctx.fill();
      K.pill(ctx, "달", 384, ey - 30, { s: 11.5, a: "center", c: KC.ink });
      K.pill(ctx, "지구의 그림자", 320, ey + Math.max(half, 22) + 24, { s: 11, a: "center", c: KC.red, box: [0, LW] });
      if (m === "disc" && t > 0) {
        K.wedge(ctx, ex, ey, -Math.PI / 2, -Math.PI / 2 + tr, 70, "rgba(255,211,107,.15)", KC.yellow);
        K.pill(ctx, "기울기 " + t + "°", ex + 18, ey - 76, { s: 11, c: KC.yellow });
      }

      /* ── 오른쪽: 달 위의 그림자 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "space", { seed: 31 });
      K.pill(ctx, "달에 비친 지구의 그림자", RX + 16, 28, { s: 13, c: KC.blue });
      var mx = RX + 290, my = 176, mr = 112, sx = RX + 140, sy = 186, rx = 176, ry = m === "disc" ? Math.max(5, 176 * Math.cos(tr)) : 176;
      var mg = ctx.createRadialGradient(mx, my, mr * .9, mx, my, mr * 1.5); mg.addColorStop(0, "rgba(230,225,210,.18)"); mg.addColorStop(1, "rgba(230,225,210,0)");
      ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, my, mr * 1.5, 0, 6.2832); ctx.fill();
      K.planet(ctx, mx, my, mr, "#e4ded0", "#55524a");
      R = K.rng(77);
      ctx.save(); ctx.beginPath(); ctx.arc(mx, my, mr, 0, 6.2832); ctx.clip();
      for (i = 0; i < 16; i++) { var qx = mx + (R() - .5) * mr * 1.7, qy = my + (R() - .5) * mr * 1.7, qr = 4 + R() * 16; ctx.fillStyle = "rgba(70,66,58,.28)"; ctx.beginPath(); ctx.arc(qx, qy, qr, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(qx + 1, qy + 1, qr, 3.6, 5.6); ctx.stroke(); }
      var ug = ctx.createRadialGradient(sx, sy, 10, sx, sy, Math.max(rx, ry));
      ug.addColorStop(0, "rgba(90,18,10,.92)"); ug.addColorStop(.85, "rgba(140,40,22,.85)"); ug.addColorStop(1, "rgba(200,80,40,.7)");
      ctx.fillStyle = ug; ctx.beginPath(); ctx.ellipse(sx, sy, rx, ry, 0, 0, 6.2832); ctx.fill();
      ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.roundRect(RX, 0, W - RX, H, 14); ctx.clip();
      ctx.strokeStyle = "rgba(255,107,129,.75)"; ctx.setLineDash([6, 5]); ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.ellipse(sx, sy, rx, ry, 0, 0, 6.2832); ctx.stroke(); ctx.restore();
      var round = m === "ball" || t < 15;
      K.pill(ctx, "달", mx + mr - 10, my + mr - 4, { s: 11.5, c: KC.ink, box: [RX, W] });
      K.pill(ctx, "그림자 가장자리 · " + (m === "ball" ? "언제나 원" : (t < 15 ? "원에 가까움" : (t < 60 ? "타원" : "가늘고 긴 타원"))), RX + 16, H - 16, { s: 12, c: round ? KC.green : KC.red });
      readout("ec-read", [
        ["지구 모형", m === "disc" ? "평평한 원판" : "둥근 공", "b"],
        ["햇빛 방향", t + "°", "y"],
        ["그림자 모양", m === "ball" ? "언제나 원" : (t < 15 ? "원에 가까움" : (t < 60 ? "타원" : "가늘고 긴 타원")), round ? "g" : "r"]
      ], round ? [true, "관측(늘 둥글다)과 맞습니다"] : [false, "이런 그림자는 관측된 적이 없습니다"]);
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
      { t: "알콰리즈미가 방정식을 푸는 대수학을 체계화했다", a: "is", why: "algebra라는 말이 그의 책에서 나왔습니다." },
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
    function tile(x0, y0, w, h, c0, c1) {
      if (w <= 0 || h <= 0) return;
      var g = ctx.createLinearGradient(x0, y0, x0 + w, y0 + h); g.addColorStop(0, c0); g.addColorStop(1, c1);
      ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
      ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(x0, y0, w, Math.min(4, h));
      ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1.5; ctx.strokeRect(x0 + .5, y0 + .5, w - 1, h - 1);
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var P = Q[q], h = P.b / 2, u = 20, ox = 96, oy = 74;
      var L = x * u, Hh = h * u, lhs = x * x + P.b * x, ok = Math.abs(lhs - P.c) < 1e-9;
      /* ── 왼쪽: 넓이로 푸는 방정식 ── */
      var LW = 500;
      K.stage(ctx, 0, 0, LW, H, "lab", { seed: 5, gridStep: 20 });
      K.pill(ctx, "넓이로 푸는 방정식", 16, 28, { s: 13, c: KC.blue });
      /* 완성될 큰 정사각형 윤곽 */
      var Sd = Math.sqrt(P.c + h * h) * u;
      ctx.save(); ctx.strokeStyle = "rgba(63,211,163,.55)"; ctx.setLineDash([3, 4]); ctx.lineWidth = 1.5; ctx.strokeRect(ox, oy, Sd, Sd); ctx.restore();
      tile(ox, oy, L, L, "#4f86ec", "#1a3a8a");
      tile(ox + L, oy, Hh, L, "#35c29c", "#136150");
      tile(ox, oy + L, L, Hh, "#35c29c", "#136150");
      ctx.fillStyle = "rgba(255,211,107,.16)"; ctx.fillRect(ox + L, oy + L, Hh, Hh);
      ctx.save(); ctx.strokeStyle = KC.yellow; ctx.setLineDash([5, 4]); ctx.lineWidth = 2; ctx.shadowColor = KC.yellow; ctx.shadowBlur = 8; ctx.strokeRect(ox + L, oy + L, Hh, Hh); ctx.restore();
      if (L > 34) K.pill(ctx, "x²", ox + L / 2, oy + L / 2 + 5, { s: 13, a: "center", c: "#dbe7ff" });
      if (L > 26) { K.pill(ctx, h + "x", ox + L + Hh / 2, oy + L / 2 + 5, { s: 12, a: "center", c: "#c8ffe9" }); K.pill(ctx, h + "x", ox + L / 2, oy + L + Hh / 2 + 5, { s: 12, a: "center", c: "#c8ffe9" }); }
      K.pill(ctx, "빈칸 " + (h * h), ox + L + Hh / 2, oy + L + Hh / 2 + 5, { s: 12, a: "center", c: KC.yellow });
      /* 치수 */
      if (L > 0) K.bracket(ctx, ox, ox + L, oy - 10, KC.blue, "x = " + x, true);
      K.bracket(ctx, ox + L, ox + L + Hh, oy - 10, KC.green, String(h), true);
      ctx.strokeStyle = KC.blue; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox - 4, oy); ctx.lineTo(ox - 10, oy); ctx.lineTo(ox - 10, oy + L); ctx.lineTo(ox - 4, oy + L); ctx.stroke();
      ctx.strokeStyle = KC.green; ctx.beginPath(); ctx.moveTo(ox - 4, oy + L); ctx.lineTo(ox - 10, oy + L); ctx.lineTo(ox - 10, oy + L + Hh); ctx.lineTo(ox - 4, oy + L + Hh); ctx.stroke();
      K.pill(ctx, "점선 = 완성된 큰 정사각형", LW - 16, 28, { s: 11.5, a: "right", c: KC.green });

      /* ── 오른쪽: 양피지 풀이 노트 ── */
      var RX = LW + 8, RW = W - RX;
      K.stage(ctx, RX, 0, RW, H, "night", { seed: 9 });
      parch(ctx, RX + 14, 14, RW - 28, H - 28, 17);
      ctx.strokeStyle = "rgba(110,60,20,.55)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(RX + 22, 22, RW - 44, H - 44, 6); ctx.stroke();
      var px = RX + 40;
      ink(ctx, "알콰리즈미의 풀이 노트", px, 52, { s: 14, w: "900", c: "#6a2a10" });
      ink(ctx, "문제  x² + " + P.b + "x = " + P.c, px, 86, { s: 15, w: "800" });
      ink(ctx, "① 모서리 빈칸 " + h + " × " + h + " = " + (h * h) + " 을 더한다", px, 118, { s: 13 });
      ink(ctx, "② (x + " + h + ")² = " + P.c + " + " + (h * h) + " = " + (P.c + h * h), px, 146, { s: 14, w: "800" });
      ink(ctx, "③ 큰 정사각형의 한 변 = " + Math.sqrt(P.c + h * h), px, 174, { s: 13 });
      ctx.strokeStyle = "rgba(110,60,20,.35)"; ctx.beginPath(); ctx.moveTo(px, 196); ctx.lineTo(RX + RW - 40, 196); ctx.stroke();
      ink(ctx, "지금 x = " + x + " 을 넣으면", px, 224, { s: 13, c: "#5a3a1a" });
      ink(ctx, "x² + " + P.b + "x = " + lhs + " " + (ok ? "=" : (lhs < P.c ? "<" : ">")) + " " + P.c, px, 256, { s: 18, w: "900", c: ok ? "#1d7a4a" : "#8a2a1a" });
      ink(ctx, ok ? "✔ 두 넓이가 같다" : (lhs < P.c ? "넓이가 모자라다" : "넓이가 넘친다"), px, 284, { s: 12.5, c: ok ? "#1d7a4a" : "#8a2a1a" });
      readout("al-read", [
        ["x", String(x), "b"],
        ["x² + " + P.b + "x", String(lhs), ok ? "g" : "y", "목표 " + P.c]
      ], ok ? [true, "넓이가 꼭 맞습니다"] : [false, lhs < P.c ? "아직 모자랍니다" : "넘쳤습니다"]);
      return ok;
    }
    function update() {
      var ok = draw(), P = Q[q];
      $("al-info").innerHTML = ok ? "x = <b>" + x + "</b> 일 때 x² + " + P.b + "x = " + P.c + ". 그림으로 보면 큰 정사각형의 한 변 " + Math.sqrt(P.c + P.b * P.b / 4) + " 에서 " + P.b / 2 + " 를 뺀 값입니다." : "정사각형과 직사각형 두 개의 넓이 합이 " + P.c + " 이 되는 x를 찾으세요.";
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
    function hm(mins) { var hh = Math.floor(mins / 60), mm = Math.round(mins - hh * 60); if (mm === 60) { hh++; mm = 0; } return hh + ":" + (mm < 10 ? "0" : "") + mm; }
    /* 놋쇠 해시계(위에서 본 모습, 위쪽이 북쪽): 그림자는 오전에 서쪽(왼쪽), 오후에 동쪽(오른쪽) */
    function dial(cx, cy, r, mins, col) {
      ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.arc(cx + 3, cy + 4, r + 6, Math.PI, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = brassG(ctx, cx - r, cy - r, cx + r, cy); ctx.beginPath(); ctx.arc(cx, cy, r + 6, Math.PI, 0); ctx.closePath(); ctx.fill();
      var ig = ctx.createRadialGradient(cx, cy, 4, cx, cy, r); ig.addColorStop(0, "#f7e3a8"); ig.addColorStop(1, "#c8964a");
      ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(cx, cy, r - 4, Math.PI, 0); ctx.closePath(); ctx.fill();
      for (var h = 6; h <= 18; h++) {
        var a = -Math.PI / 2 + (h - 12) * Math.PI / 12, big = h % 3 === 0;
        ctx.strokeStyle = "rgba(70,40,8,.8)"; ctx.lineWidth = big ? 2 : 1;
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (r - (big ? 18 : 12)), cy + Math.sin(a) * (r - (big ? 18 : 12))); ctx.lineTo(cx + Math.cos(a) * (r - 5), cy + Math.sin(a) * (r - 5)); ctx.stroke();
      }
      var sa = -Math.PI / 2 + (mins / 60 - 12) * Math.PI / 12;
      ctx.save(); ctx.strokeStyle = "rgba(30,16,4,.85)"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 4;
      ctx.beginPath(); ctx.moveTo(cx, cy - 2); ctx.lineTo(cx + Math.cos(sa) * (r - 8), cy + Math.sin(sa) * (r - 8)); ctx.stroke(); ctx.restore();
      ctx.strokeStyle = "#fff3c4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - r * .42); ctx.stroke();
      K.planet(ctx, cx, cy - 2, 5, "#ffe9a8", "#7a5010");
      [6, 9, 12, 15, 18].forEach(function (h) {
        var a = -Math.PI / 2 + (h - 12) * Math.PI / 12, ex = h === 12 ? 16 : 0, ey = (h === 6 || h === 18) ? -12 : 0;
        K.pill(ctx, String(h), cx + Math.cos(a) * (r - 32) + ex, cy + Math.sin(a) * (r - 32) + 4 + ey, { s: 10, a: "center", c: "#4a2a06", bg: "rgba(255,240,200,.8)" });
      });
      ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r + 9, Math.PI, 0); ctx.stroke();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var dm = (L - BJ) * 4, ok = Math.abs(L - 127) <= 0.5, i;
      /* ── 왼쪽: 북극 위에서 본 지구 ── */
      var LW = 440, cx = 404, cy = 168, Re = 300, rl = 238;
      function ang(lon) { return Math.PI - (lon - BJ) * Math.PI / 180; }
      function pt(lon, r) { var a = ang(lon); return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r }; }
      K.stage(ctx, 0, 0, LW, H, "space", { seed: 15 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var eg = ctx.createRadialGradient(cx - 120, cy, 30, cx, cy, Re);
      eg.addColorStop(0, "#3d8be0"); eg.addColorStop(.75, "#1f5fb0"); eg.addColorStop(1, "#123c7c");
      ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(cx, cy, Re, 0, 6.2832); ctx.fill();
      var ng = ctx.createLinearGradient(cx - 30, 0, cx + 40, 0); ng.addColorStop(0, "rgba(3,6,20,0)"); ng.addColorStop(1, "rgba(3,6,20,.7)");
      ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(cx, cy, Re, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "rgba(200,225,255,.22)"; ctx.lineWidth = 1;
      for (var lon = 0; lon < 360; lon += 15) { var pp = pt(lon, Re); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(pp.x, pp.y); ctx.stroke(); }
      ctx.setLineDash([4, 4]); ctx.strokeStyle = "rgba(200,225,255,.35)"; ctx.beginPath(); ctx.arc(cx, cy, rl, 0, 6.2832); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(170,220,255,.6)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, Re, 0, 6.2832); ctx.stroke();
      ctx.restore();
      /* 햇빛 */
      for (i = 0; i < 6; i++) K.arrow(ctx, { x: 10, y: 52 + i * 50 }, { x: 70, y: 52 + i * 50 }, "rgba(255,211,107,.8)", 1.6, 8);
      K.pill(ctx, "북극 위에서 본 지구", 16, 28, { s: 13, c: KC.blue });
      K.pill(ctx, "북극", cx - 8, cy + 26, { s: 10.5, a: "right", c: KC.mute });
      K.glow(ctx, cx, cy, 2, "rgba(255,255,255,.9)", 3);
      /* 경도 차 부채꼴 */
      var BJp = pt(BJ, rl), HYp = pt(127, rl), OBp = pt(L, rl);
      K.line(ctx, { x: cx, y: cy }, BJp, "rgba(255,107,129,.8)", 1.4); K.line(ctx, { x: cx, y: cy }, OBp, "rgba(255,211,107,.9)", 1.4);
      if (Math.abs(L - BJ) > .2) { K.wedge(ctx, cx, cy, ang(BJ), ang(L), 110, "rgba(255,211,107,.25)", KC.yellow); var mid = pt((L + BJ) / 2, 150); K.pill(ctx, "경도 차 " + Math.abs(L - BJ).toFixed(1) + "°", mid.x + 6, mid.y + (L > BJ ? 18 : -24), { s: 11, c: KC.yellow, box: [0, LW] }); }
      K.glow(ctx, BJp.x, BJp.y, 3.5, "rgba(255,140,150,.95)", 3.5);
      K.glow(ctx, HYp.x, HYp.y, 3.5, "rgba(120,240,200,.95)", 3.5);
      K.pill(ctx, "베이징 116.4°E · 정오", BJp.x + 14, BJp.y - 8, { s: 11, c: "#ff9aa8", box: [0, LW] });
      K.pill(ctx, "한양 127.0°E", HYp.x + 14, HYp.y + 18, { s: 11, c: "#7ff0c4", box: [0, LW] });
      ctx.fillStyle = KC.yellow; ctx.beginPath(); ctx.moveTo(OBp.x - 6, OBp.y); ctx.lineTo(OBp.x - 20, OBp.y - 8); ctx.lineTo(OBp.x - 20, OBp.y + 8); ctx.closePath(); ctx.fill();
      K.pill(ctx, "관측자 " + L.toFixed(1) + "°E", OBp.x - 26, OBp.y + 5, { s: 11, a: "right", c: KC.yellow, box: [0, LW] });
      K.pill(ctx, "↻ 자전: 1시간에 15° (동쪽이 먼저 정오)", 16, H - 14, { s: 11, c: KC.ink });

      /* ── 오른쪽: 같은 순간의 두 해시계 ── */
      var RX = LW + 8, RW = W - RX;
      K.stage(ctx, RX, 0, RW, H, "night", { seed: 22 });
      K.pill(ctx, "같은 순간, 두 곳의 해시계", RX + 16, 28, { s: 13, c: KC.blue });
      var d1 = RX + RW * .25 + 2, d2 = RX + RW * .75 - 2, dy = 232;
      dial(d1, dy, 90, 720, "rgba(255,107,129,.8)");
      dial(d2, dy, 90, 720 + dm, ok ? KC.green : KC.yellow);
      K.pill(ctx, "베이징", d1, 120, { s: 12, a: "center", c: "#ff9aa8" });
      K.pill(ctx, "관측자 " + L.toFixed(1) + "°E", d2, 120, { s: 12, a: "center", c: KC.yellow });
      K.pill(ctx, "12:00", d1, dy + 40, { s: 18, a: "center", c: "#ff9aa8" });
      K.pill(ctx, hm(720 + dm), d2, dy + 40, { s: 18, a: "center", c: ok ? KC.green : KC.yellow });
      K.t(ctx, "위 = 북쪽 · 그림자 끝이 가리키는 시각", RX + RW / 2, H - 14, { s: 10.5, a: "center", c: KC.mute });
      readout("ch-read", [
        ["경도 차이", (L - BJ >= 0 ? "+" : "") + (L - BJ).toFixed(1) + "°", "b"],
        ["시각 차이", (dm >= 0 ? "+" : "−") + Math.abs(dm).toFixed(0) + "분", ok ? "g" : "y", "= 경도 차 × 4분"],
        ["관측자의 지방시", hm(720 + dm), "y", "베이징이 정오일 때"]
      ], ok ? [true, "한양은 약 42분 앞서습니다"] : null);
      return ok;
    }
    function update() {
      var ok = draw(), dm = (L - BJ) * 4;
      $("ch-info").innerHTML = "지구는 24시간에 360° 돌므로 경도 1°마다 해가 4분씩 먼저 또는 늦게 뜹니다. 관측자는 베이징보다 <b>" + Math.abs(dm).toFixed(0) + "분</b> " + (dm >= 0 ? "먼저" : "늦게") + " 정오를 맞습니다." + (ok ? " 한양은 베이징보다 약 <b>42분</b> 앞선 시각을 씁니다." : "");
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
      ctx.clearRect(0, 0, W, H);
      var hz = 70, vx = 470, i, z;
      var r = 10 / d, hit = Math.abs(r - 0.5) < 0.01 || Math.abs(r - 1 / 3) < 0.01;
      /* 대리석 기둥: 밑동·기둥몸·머리 */
      function col(dd, tint) {
        var h = 1900 / dd, base = hz + 2100 / dd, x = vx - 3400 / dd, w = Math.max(4, 260 / dd);
        ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(x + w * .6, base, w * 1.3, w * .25, 0, 0, 6.2832); ctx.fill();
        var g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
        g.addColorStop(0, "#8d8478"); g.addColorStop(.35, tint); g.addColorStop(.6, "#f4ede0"); g.addColorStop(1, "#7a7266");
        ctx.fillStyle = g; ctx.fillRect(x - w / 2, base - h, w, h);
        ctx.strokeStyle = "rgba(90,80,70,.35)"; ctx.lineWidth = Math.max(.5, w / 26);
        for (var f = 1; f < 4; f++) { ctx.beginPath(); ctx.moveTo(x - w / 2 + w * f / 4, base - h); ctx.lineTo(x - w / 2 + w * f / 4, base); ctx.stroke(); }
        ctx.fillStyle = g; ctx.fillRect(x - w * .75, base - h - w * .35, w * 1.5, w * .35); ctx.fillRect(x - w * .7, base - w * .3, w * 1.4, w * .3);
        return { x: x, top: base - h - w * .35, base: base, h: h, w: w };
      }
      /* 하늘(해 질 녘의 피렌체) */
      K.stage(ctx, 0, 0, W, H, "night", { seed: 2 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, H, 14); ctx.clip();
      var sk = ctx.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, "#1b2350"); sk.addColorStop(.6, "#6a4a78"); sk.addColorStop(1, "#e8a070");
      ctx.fillStyle = sk; ctx.fillRect(0, 0, W, hz);
      ctx.fillStyle = "#3a2c40"; ctx.beginPath(); ctx.moveTo(0, hz);
      for (i = 0; i <= 18; i++) ctx.lineTo(i * 50, hz - 6 - Math.abs(Math.sin(i * 1.7)) * 14);
      ctx.lineTo(W, hz); ctx.closePath(); ctx.fill();
      /* 대리석 바닥(체크무늬) */
      var fl = ctx.createLinearGradient(0, hz, 0, H); fl.addColorStop(0, "#4a4250"); fl.addColorStop(1, "#2a2430");
      ctx.fillStyle = fl; ctx.fillRect(0, hz, W, H - hz);
      var Zs = [], Ls = [];
      for (z = 6; z <= 60; z += 2.5) Zs.push(z);
      for (var Lx = -9; Lx <= 9; Lx++) Ls.push(Lx * 1000);
      for (var zi = 0; zi < Zs.length - 1; zi++) {
        for (var li = 0; li < Ls.length - 1; li++) {
          if ((zi + li) % 2) continue;
          var z0 = Zs[zi], z1 = Zs[zi + 1], a0 = Ls[li], a1 = Ls[li + 1];
          ctx.fillStyle = "rgba(235,225,205," + (0.10 + 0.18 * (6 / z0)) + ")";
          ctx.beginPath(); ctx.moveTo(vx + a0 / z0, hz + 2100 / z0); ctx.lineTo(vx + a1 / z0, hz + 2100 / z0); ctx.lineTo(vx + a1 / z1, hz + 2100 / z1); ctx.lineTo(vx + a0 / z1, hz + 2100 / z1); ctx.closePath(); ctx.fill();
        }
      }
      var fog = ctx.createLinearGradient(0, hz, 0, hz + 40); fog.addColorStop(0, "rgba(232,160,112,.35)"); fog.addColorStop(1, "rgba(232,160,112,0)");
      ctx.fillStyle = fog; ctx.fillRect(0, hz, W, 40);
      ctx.restore();
      /* 소실점으로 모이는 선 */
      K.line(ctx, { x: 0, y: hz }, { x: W, y: hz }, "rgba(255,220,180,.6)", 1.2, [5, 4]);
      var c1 = col(10, "#e9e0cf"), c2 = col(d, hit ? "#c9f5df" : "#d9ecff");
      K.line(ctx, { x: c1.x, y: c1.top }, { x: vx, y: hz }, "rgba(255,107,129,.85)", 1.3, [5, 4]);
      K.line(ctx, { x: c1.x, y: c1.base }, { x: vx, y: hz }, "rgba(255,107,129,.85)", 1.3, [5, 4]);
      K.glow(ctx, vx, hz, 3.5, "rgba(255,140,150,.95)", 4);
      K.pill(ctx, "소실점 · 지평선", vx + 12, hz - 10, { s: 11, c: "#ffc2c8" });
      K.pill(ctx, "화가의 공방 — 한 점으로 모이는 선", 16, 28, { s: 13, c: KC.blue });
      K.pill(ctx, "첫 기둥 · 10 m", c1.x + c1.w + 6, c1.base - 10, { s: 11.5, c: KC.ink });
      K.pill(ctx, "둘째 · " + d + " m", c2.x, c2.top - 10, { s: 11.5, a: "center", c: hit ? KC.green : KC.blue });
      /* 오른쪽: 그림 속 높이 견주기 */
      var bx = 760, bb = H - 22, s1 = 190 / 190 * 180, s2 = s1 * r;
      ctx.fillStyle = "rgba(9,12,34,.6)"; ctx.beginPath(); ctx.roundRect(bx - 34, bb - s1 - 46, 160, s1 + 60, 12); ctx.fill();
      K.t(ctx, "그림 속 높이", bx + 46, bb - s1 - 26, { s: 11.5, a: "center", c: KC.mute });
      var g1 = ctx.createLinearGradient(0, bb - s1, 0, bb); g1.addColorStop(0, "#f4ede0"); g1.addColorStop(1, "#8d8478");
      ctx.fillStyle = g1; ctx.fillRect(bx - 14, bb - s1, 28, s1);
      var g2 = ctx.createLinearGradient(0, bb - s2, 0, bb); g2.addColorStop(0, hit ? "#7ff0c4" : "#bfe6ff"); g2.addColorStop(1, hit ? "#1f8a66" : "#2f6fb0");
      ctx.fillStyle = g2; ctx.fillRect(bx + 62, bb - s2, 28, s2);
      K.line(ctx, { x: bx - 18, y: bb - s1 / 2 }, { x: bx + 94, y: bb - s1 / 2 }, "rgba(255,255,255,.35)", 1, [3, 3]);
      K.line(ctx, { x: bx - 18, y: bb - s1 / 3 }, { x: bx + 94, y: bb - s1 / 3 }, "rgba(255,255,255,.25)", 1, [2, 4]);
      K.t(ctx, "½", bx + 108, bb - s1 / 2 + 4, { s: 11, c: KC.mute }); K.t(ctx, "⅓", bx + 108, bb - s1 / 3 + 4, { s: 11, c: KC.mute });
      K.t(ctx, "첫", bx, bb + 14, { s: 11, a: "center", c: KC.ink }); K.t(ctx, "둘째", bx + 76, bb + 14, { s: 11, a: "center", c: hit ? KC.green : KC.blue });
      readout("ps-read", [
        ["둘째 기둥까지", d + " m", "b"],
        ["그림 속 크기 비", (r * 100).toFixed(0) + "%", hit ? "g" : "y", "= 10 m ÷ " + d + " m"]
      ], hit ? [true, Math.abs(r - 0.5) < 0.01 ? "정확히 절반!" : "정확히 3분의 1!"] : null);
      return r;
    }
    function update() {
      var r = draw(), ch = false;
      $("ps-info").innerHTML = "둘째 기둥이 " + d + " m에 있으면 그림 속 높이는 첫 기둥의 <b>" + (r * 100).toFixed(0) + "%</b>. 거리가 두 배가 되면 크기는 절반 — 모든 기둥의 윗끝과 아랫끝을 이은 선은 한 소실점으로 모입니다.";
      if (!got.a && Math.abs(r - 0.5) < 0.01) { got.a = ch = true; }
      if (!got.b && Math.abs(r - 1 / 3) < 0.01) { got.b = ch = true; }
      if (ch) { window.sthState("psGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m4-2a"); if (got.b) done("m4-2b");
      if (got.a && got.b) {
        window.sthState("psBest", "절반 20 m, 3분의 1 30 m");
        window.sthMission("m4-2", true, "<span class='m-tag'>미션 완료</span>20 m에서 절반, 30 m에서 3분의 1. 보이는 크기는 거리에 반비례합니다. 르네상스 화가들은 이 수학으로 평면에 깊이를 그렸고, 정밀한 관찰과 수학을 함께 쓰는 태도가 과학혁명으로 이어졌습니다.");
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
    var Mm = 0.6, playing = !REDUCE, cache = { e: -1, r: null };
    function draw() {
      ctx.clearRect(0, 0, W, H);
      if (cache.e !== e) { cache.e = e; cache.r = errs(); }
      var r = cache.r, ok = r.max < 10;
      /* ── 왼쪽: 위에서 본 화성 궤도 ── */
      var LW = 430, cx = 236, cy = 182, a = 142;
      K.stage(ctx, 0, 0, LW, H, "space", { seed: 19 });
      K.pill(ctx, "위에서 본 화성 궤도", 16, 28, { s: 13, c: KC.blue });
      function orb(ee, col, w, dash, glow) {
        var b = a * Math.sqrt(1 - ee * ee), f = a * ee;
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash); if (glow) { ctx.shadowColor = col; ctx.shadowBlur = 8; }
        ctx.beginPath(); ctx.ellipse(cx - f, cy, a, b, 0, 0, 6.2832); ctx.stroke(); ctx.restore();
      }
      function pos(ee, nuv) { var rr = a * (1 - ee * ee) / (1 + ee * Math.cos(nuv)); return { x: cx + rr * Math.cos(nuv), y: cy - rr * Math.sin(nuv) }; }
      orb(ET, "rgba(255,140,90,.8)", 1.6, [5, 4]);
      orb(e, KC.blue, 2.4, null, true);
      var nT = nu(ET, Mm), nM = nu(e, Mm), pT = pos(ET, nT), pM = pos(e, nM);
      K.line(ctx, { x: cx, y: cy }, pT, "rgba(255,140,90,.7)", 1.2); K.line(ctx, { x: cx, y: cy }, pM, "rgba(127,211,255,.7)", 1.2);
      var aT = Math.atan2(pT.y - cy, pT.x - cx), aM = Math.atan2(pM.y - cy, pM.x - cx), dA = aM - aT;
      while (dA > Math.PI) dA -= 2 * Math.PI; while (dA < -Math.PI) dA += 2 * Math.PI;
      if (Math.abs(dA) > .004) K.wedge(ctx, cx, cy, aT, aT + dA, 64, "rgba(255,211,107,.28)", KC.yellow);
      K.sun(ctx, cx, cy, 11);
      K.planet(ctx, pT.x, pT.y, 8, "#ff9a6a", "#7a2a10");
      ctx.save(); ctx.globalAlpha = .9; K.planet(ctx, pM.x, pM.y, 7, "#bfe6ff", "#1e4a8a"); ctx.restore();
      ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(pM.x, pM.y, 10, 0, 6.2832); ctx.stroke();
      K.pill(ctx, "태양", cx, cy + 36, { s: 11, a: "center", c: KC.yellow });
      K.pill(ctx, "● 티코가 관측한 화성", 16, H - 40, { s: 11, c: "#ffb08a" });
      K.pill(ctx, "○ 모형이 예측한 화성", 16, H - 14, { s: 11, c: KC.blue });
      var dMin = Math.abs(dA) * 180 / Math.PI * 60;
      K.pill(ctx, "지금 차이 " + (dMin >= 60 ? (dMin / 60).toFixed(1) + "°" : dMin.toFixed(1) + "분"), LW - 16, H - 14, { s: 11.5, a: "right", c: KC.yellow });

      /* ── 오른쪽: 한 바퀴 도는 동안의 차이 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 4 });
      K.pill(ctx, "관측과 모형의 차이", RX + 16, 28, { s: 13, c: KC.blue });
      var g = K.chart(ctx, { x: RX + 8, y: 50, w: W - RX - 16, h: H - 56, x0: 0, x1: 360, y0: 0, y1: 60, xt: 4, yt: 6, xl: "궤도 위치(°)", yl: "차이(분)" });
      ctx.save(); ctx.setLineDash([5, 4]); ctx.lineWidth = 1.4;
      ctx.strokeStyle = KC.orange; ctx.beginPath(); ctx.moveTo(g.L, g.Y(8)); ctx.lineTo(g.R, g.Y(8)); ctx.stroke();
      ctx.strokeStyle = KC.red; ctx.beginPath(); ctx.moveTo(g.L, g.Y(10)); ctx.lineTo(g.R, g.Y(10)); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T - 2, g.R - g.L, g.B - g.T + 2); ctx.clip();
      K.plot(ctx, g, r.list.map(function (am, i) { return [i * 3, Math.min(am, 61)]; }), ok ? KC.green : KC.blue);
      ctx.restore();
      K.pill(ctx, "10분 목표", g.R - 4, g.Y(10) - 9, { s: 10.5, a: "right", c: KC.red });
      K.pill(ctx, "8분", g.L + 8, g.Y(8) + 4, { s: 10, c: KC.orange });
      var mk = ((Mm * 180 / Math.PI) % 360 + 360) % 360, mx = g.X(mk);
      K.line(ctx, { x: mx, y: g.T }, { x: mx, y: g.B }, "rgba(255,211,107,.6)", 1.2, [3, 3]);
      K.glow(ctx, mx, g.Y(Math.min(dMin, 60)), 3.5, "rgba(255,226,150,.95)", 3.5);
      if (r.max > 60) K.pill(ctx, "최대 " + (r.max / 60).toFixed(1) + "° · 그래프 위로 넘침", W - 16, 28, { s: 11, a: "right", c: KC.red });
      readout("kp-read", [
        ["모형의 이심률", e.toFixed(3), "b", e === 0 ? "완전한 원" : "타원"],
        ["가장 큰 차이", r.max >= 60 ? (r.max / 60).toFixed(1) + "°" : r.max.toFixed(1) + "분", ok ? "g" : "r"]
      ], ok ? [true, "관측 정밀도 안으로 들어왔습니다"] : [false, "10분을 넘게 어긋납니다"]);
      return r.max;
    }
    function update() {
      var mx = draw(), ch = false;
      $("kp-info").innerHTML = e === 0 ? "완전한 원 궤도로는 관측과 최대 <b>" + (mx / 60).toFixed(1) + "°</b>나 어긋납니다. 이심률을 조금씩 키워 보세요." : (mx < 10 ? "✅ 최대 차이 <b>" + mx.toFixed(1) + "분</b> — 관측 정밀도 안으로 들어왔습니다. 화성은 약간 찌그러진 <b>타원</b>을 돕니다." : "최대 차이 " + (mx >= 60 ? (mx / 60).toFixed(1) + "°" : mx.toFixed(1) + "분") + ". " + (e < ET ? "이심률을 조금 더 키워 보세요." : "이심률이 너무 큽니다. 조금 줄여 보세요."));
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
    $("kp-play").addEventListener("click", function () { playing = !playing; this.textContent = playing ? "⏸ 화성 멈추기" : "▶ 화성 돌리기"; });
    if (REDUCE) $("kp-play").textContent = "▶ 화성 돌리기";
    K.animate(canvas, function (dt) { if (playing) { Mm = (Mm + dt * 2 * Math.PI / 12000) % (2 * Math.PI); draw(); } });
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
