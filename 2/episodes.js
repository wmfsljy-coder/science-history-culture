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

/* ── 무대 그림 도구 (../assets/kit.js) ── */
var K = window.sthKit, KC = K.C, REDUCE = K.REDUCE;
/* ── 스튜디오 부품(s19) — 재질 상자·원통·피라미드·판정 카드·큰 제목. 같은 단원의 lab-cases·real-cases 도 window.sthSP19 로 쓴다 ── */
var SP = (function () {
  var LT = K.LT;
  var MAT = {
    wood: ["#e4bd86", "#b47e45", "#835729"], dark: ["#a2703f", "#744a26", "#52331a"], brass: ["#f7de8e", "#d3a23d", "#966b1c"],
    stone: ["#eee8db", "#cbc0ab", "#a19680"], iron: ["#d6dce5", "#9aa5b4", "#6d7788"], clay: ["#eaa97c", "#c4734b", "#924e30"],
    grass: ["#97c872", "#a97b4b", "#7b5734"], sand: ["#eedcac", "#d0b47b", "#aa8f59"], paper: ["#fdf8ec", "#ebe1ca", "#cdbfa1"],
    blue: ["#94c7f1", "#4189ca", "#2c629a"], green: ["#93dfbc", "#31a97e", "#20795a"], red: ["#f5a8a8", "#d9534f", "#a8352f"],
    white: ["#ffffff", "#e7ecf3", "#c5cedb"], slate: ["#6d7787", "#465062", "#30384a"], navy: ["#3a4f86", "#22325e", "#172244"],
    yellow: ["#ffe08a", "#f0b429", "#c2870f"], violet: ["#c9b6ff", "#7a5bd6", "#5a3fab"]
  };
  function mt(c) {
    if (typeof c !== "string") return c;
    if (MAT[c]) return MAT[c];
    return [K.tint(c, 1.12), c, K.tint(c, 0.72)];
  }
  function poly(ctx, pts, fill, stroke, lw) {
    ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
  }
  function box(ctx, I, x0, y0, z0, x1, y1, z1, m, o) {
    var c = mt(m); o = o || {};
    I.box(ctx, x0, y0, z0, x1, y1, z1, c[0], c[1], c[2]);
    var a = I.P(x0, y1, z1), b = I.P(x1, y1, z0), g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    g.addColorStop(0, "rgba(255,255,255,.16)"); g.addColorStop(1, "rgba(0,0,0,.10)");
    I.quad(ctx, I.P(x0, y1, z0), I.P(x1, y1, z0), I.P(x1, y1, z1), I.P(x0, y1, z1), g);
    if (o.grain) {
      var R = K.rng(o.seed || 3), k, n = Math.max(2, Math.round((z1 - z0) / 5));
      ctx.strokeStyle = "rgba(70,40,15,.22)"; ctx.lineWidth = .8;
      for (k = 1; k < n; k++) {
        var zz = z0 + (z1 - z0) * k / n + (R() - .5) * 2, p1 = I.P(x0, y1, zz), p2 = I.P(x1, y1, zz), p3 = I.P(x1, y0, zz);
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.stroke();
      }
    }
    if (o.edge !== false) {
      ctx.strokeStyle = o.edgeCol || "rgba(255,255,255,.55)"; ctx.lineWidth = 1;
      var e1 = I.P(x0, y1, z1), e2 = I.P(x1, y1, z1), e3 = I.P(x1, y0, z1), e4 = I.P(x1, y1, z0);
      ctx.beginPath(); ctx.moveTo(e1.x, e1.y); ctx.lineTo(e2.x, e2.y); ctx.lineTo(e3.x, e3.y); ctx.moveTo(e2.x, e2.y); ctx.lineTo(e4.x, e4.y); ctx.stroke();
    }
  }
  function glass(ctx, I, x0, y0, z0, x1, y1, z1, tint) {
    var t = tint || "200,230,255";
    I.box(ctx, x0, y0, z0, x1, y1, z1, "rgba(" + t + ",.20)", "rgba(" + t + ",.22)", "rgba(" + t + ",.30)");
    ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1.2;
    [[I.P(x0, y1, z0), I.P(x1, y1, z0), I.P(x1, y0, z0)], [I.P(x0, y1, z1), I.P(x1, y1, z1), I.P(x1, y0, z1), I.P(x0, y0, z1), I.P(x0, y1, z1)],
     [I.P(x0, y1, z0), I.P(x0, y1, z1)], [I.P(x1, y1, z0), I.P(x1, y1, z1)], [I.P(x1, y0, z0), I.P(x1, y0, z1)]].forEach(function (s) {
      ctx.beginPath(); s.forEach(function (p, i) { if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke();
    });
  }
  /* 화면 좌표 원통: (cx, cy) = 윗면 가운데, 아래로 h. o.top 윗면 색, o.open 이면 속이 빈 그릇 */
  function cyl(ctx, cx, cy, rx, ry, h, m, o) {
    var c = mt(m); o = o || {};
    var g = ctx.createLinearGradient(cx - rx, 0, cx + rx, 0);
    g.addColorStop(0, c[1]); g.addColorStop(.3, c[0]); g.addColorStop(.55, c[1]); g.addColorStop(1, c[2]);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx + rx, cy + h); ctx.ellipse(cx, cy + h, rx, ry, 0, 0, Math.PI);
    ctx.lineTo(cx - rx, cy); ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, 2 * Math.PI); ctx.closePath(); ctx.fill();
    ctx.fillStyle = o.top || c[0]; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.2832); ctx.fill();
    if (o.open) { ctx.fillStyle = o.open; ctx.beginPath(); ctx.ellipse(cx, cy, rx * .86, ry * .82, 0, 0, 6.2832); ctx.fill(); }
    ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.2832); ctx.stroke();
  }
  /* 월드 좌표 원통(I): 바닥 가운데 (x, y, z), 반지름 r, 높이 h */
  function icyl(ctx, I, x, y, z, r, h, m, o) { var p = I.P(x, y, z + h); cyl(ctx, p.x, p.y, 1.2247 * r * I.s, .7071 * r * I.s, h * I.s, m, o); }
  function pyramid(ctx, I, x, y, z, w, h, m) {
    var c = mt(m || "sand"), ap = I.P(x + w / 2, y + w / 2, z + h);
    poly(ctx, [I.P(x, y + w, z), I.P(x + w, y + w, z), ap], c[1]);
    poly(ctx, [I.P(x + w, y, z), I.P(x + w, y + w, z), ap], c[2]);
    ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 1; var q = I.P(x + w, y + w, z);
    ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(ap.x, ap.y); ctx.stroke();
  }
  function head(ctx, big, sub, ok, o) {
    o = o || {};
    K.bigText(ctx, big, o.x || 22, o.y || 50, o.s || 28, ok ? "#ffd35a" : "#ffffff");
    if (sub) K.bigText(ctx, sub, o.x || 22, (o.y || 50) + 34, o.s2 || 17, ok ? "#ffffff" : "#ffd35a");
  }
  /* 흰 판정 카드: rows = [[이름, 값, 색]], tip = [글, 좋음] */
  function card(ctx, x, y, w, h, title, rows, tip, o) {
    o = o || {};
    K.card(ctx, x, y, w, h, title);
    var yy = y + (o.top || 56), gap = o.gap || 26;
    (rows || []).forEach(function (r) {
      if (!r) { yy += gap * .5; return; }
      K.row(ctx, r[0], r[1], x + 16, x + w - 16, yy, r[2]); yy += gap;
    });
    if (tip) K.tip(ctx, tip[0], x + 12, y + h - 44, w - 24, tip[1]);
    return yy;
  }
  function chart(ctx, o) { o.light = true; return K.chart(ctx, o); }
  function plot(ctx, g, pts, col, o) { o = o || {}; o.light = true; K.plot(ctx, g, pts, col, o); }
  /* 밝은 바탕에서도 보이는 별: 남색 테두리 + 빛 */
  function star(ctx, x, y, r) {
    ctx.fillStyle = "rgba(20,30,70,.85)"; ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, 6.2832); ctx.fill();
    K.glow(ctx, x, y, r, "rgba(200,228,255,.98)", 4); K.spikes(ctx, x, y, r * 4, .8);
  }
  function lbl(ctx, s, x, y, o) { o = o || {}; K.t(ctx, s, x, y, { s: o.s || 11.5, w: o.w || "800", a: o.a, c: o.c || LT.ink }); }
  return { MAT: MAT, mt: mt, poly: poly, box: box, glass: glass, cyl: cyl, icyl: icyl, pyramid: pyramid, head: head, card: card, chart: chart, plot: plot, star: star, lbl: lbl, LT: LT };
})();
window.sthSP19 = SP;
var LT = K.LT;
function put(id, html) { var e = $(id); if (e) e.innerHTML = html; }
/* 읽음판: rows = [[이름, 값, 색(b·y·g·r), 보조]], ok = [통과?, 문구] */
function readout(id, rows, ok) {
  var h = "";
  rows.forEach(function (r) { h += "<span class='k'>" + r[0] + "</span><span class='v " + (r[2] || "b") + "'>" + r[1] + "</span>" + (r[3] ? "<span class='sub'>" + r[3] + "</span>" : ""); });
  if (ok) h += "<span class='ok " + (ok[0] ? "g" : "r") + "'>" + ok[1] + "</span>";
  put(id, h);
}
function parch(ctx, x, y, w, h, seed) {
  var g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, "#efdcb0"); g.addColorStop(.5, "#e4cc98"); g.addColorStop(1, "#cfae73");
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fill();
  var R = K.rng(seed || 5); ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.clip();
  for (var i = 0; i < 26; i++) { ctx.strokeStyle = "rgba(120,80,30," + (.05 + R() * .07) + ")"; ctx.lineWidth = 1; var yy = y + R() * h; ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy + (R() - .5) * 6); ctx.stroke(); }
  var vg = ctx.createRadialGradient(x + w / 2, y + h / 2, Math.min(w, h) * .3, x + w / 2, y + h / 2, Math.max(w, h) * .7); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(90,50,10,.35)"); ctx.fillStyle = vg; ctx.fillRect(x, y, w, h);
  ctx.restore();
}

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
    var ANG = [0.5, -0.75, 2.1, -2.5, 3.5];   /* 사진 속 별 다섯의 방향(라디안) */
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var r = rms(k), ok = k >= 1.6 - 1e-9 && k <= 1.95 + 1e-9, i;
      K.studio(ctx, 0, 0, W, H, { x: 190, y: 346, rx: 180, ry: 16 });
      /* ── 왼쪽: 나무 틀에 끼운 유리 사진 건판(1919) ── */
      var PX = 22, PY = 102, PW = 330, PH = 238, sx = PX + PW / 2, sy = PY + PH / 2, SR = 18, SC = 32;
      ctx.fillStyle = "#5a3a1e"; ctx.beginPath(); ctx.roundRect(PX + 8, PY + 8, PW, PH, 10); ctx.fill();
      var fr = ctx.createLinearGradient(PX, PY, PX + PW, PY + PH); fr.addColorStop(0, "#d9a868"); fr.addColorStop(1, "#8a5a2c");
      ctx.fillStyle = fr; ctx.beginPath(); ctx.roundRect(PX, PY, PW, PH, 10); ctx.fill();
      var gx0 = PX + 12, gy0 = PY + 12, gw = PW - 24, gh = PH - 24;
      ctx.save(); ctx.beginPath(); ctx.rect(gx0, gy0, gw, gh); ctx.clip();
      ctx.fillStyle = "#06070f"; ctx.fillRect(gx0, gy0, gw, gh);
      var Rr = K.rng(5);
      for (i = 0; i < 420; i++) { ctx.globalAlpha = Rr() * .14; ctx.fillStyle = "#cfd8ff"; ctx.fillRect(gx0 + Rr() * gw, gy0 + Rr() * gh, 1, 1); }
      ctx.globalAlpha = 1;
      var co = ctx.createRadialGradient(sx, sy, SR, sx, sy, SR * 4.2);
      co.addColorStop(0, "rgba(255,255,255,.95)"); co.addColorStop(.12, "rgba(220,230,255,.55)"); co.addColorStop(.45, "rgba(160,180,255,.14)"); co.addColorStop(1, "rgba(160,180,255,0)");
      ctx.fillStyle = co; ctx.beginPath(); ctx.arc(sx, sy, SR * 4.2, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "rgba(235,240,255,.35)"; ctx.lineWidth = 1;
      for (i = 0; i < 24; i++) { var aa = i / 24 * 6.2832 + Rr() * .2, ll = SR * (1.6 + Rr() * 1.6); ctx.beginPath(); ctx.moveTo(sx + Math.cos(aa) * SR, sy + Math.sin(aa) * SR); ctx.lineTo(sx + Math.cos(aa) * ll, sy + Math.sin(aa) * ll); ctx.stroke(); }
      ctx.fillStyle = "#03040c"; ctx.beginPath(); ctx.arc(sx, sy, SR, 0, 6.2832); ctx.fill();
      B.forEach(function (b, j) {
        var ux = Math.cos(ANG[j]), uy = Math.sin(ANG[j]), px = sx + ux * b * SR, py = sy + uy * b * SR;
        var mx = px + ux * D[j] * SC, my = py + uy * D[j] * SC, kx = px + ux * k / b * SC, ky = py + uy * k / b * SC;
        ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.arc(px, py, 4, 0, 6.2832); ctx.stroke(); ctx.setLineDash([]);
        K.arrow(ctx, { x: px, y: py }, { x: mx, y: my }, "rgba(255,140,110,.95)", 1.6, 7);
        K.glow(ctx, mx, my, 2.4, "rgba(255,200,170,.98)", 3.5);
        ctx.strokeStyle = KC.blue; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(kx, ky, 6, 0, 6.2832); ctx.stroke();
      });
      var hl = ctx.createLinearGradient(gx0, gy0, gx0 + gw, gy0 + gh); hl.addColorStop(0, "rgba(255,255,255,.14)"); hl.addColorStop(.35, "rgba(255,255,255,0)");
      ctx.fillStyle = hl; ctx.fillRect(gx0, gy0, gw, gh);
      ctx.restore();
      [[PX + 6, PY + 6], [PX + PW - 6, PY + 6], [PX + 6, PY + PH - 6], [PX + PW - 6, PY + PH - 6]].forEach(function (q) { K.planet(ctx, q[0], q[1], 4, "#ffe9a8", "#7a5010"); });
      K.pill(ctx, "가려진 태양", sx, sy + SR + 22, { s: 11, a: "center", c: KC.ink });
      K.pill(ctx, "→ 별이 옮겨 간 방향  ○ 모형의 예측", PX + 18, PY + PH - 20, { s: 10.5, c: "#ffd2c4" });
      K.warn(ctx, PX + PW - 12, PY + 34, "⚠ 옮겨 간 폭 1,000배 넘게 과장", "right");
      /* ── 오른쪽 흰 카드: 거리에 따른 휘어짐 ── */
      var cxr = 368, cw = W - cxr - 14;
      K.card(ctx, cxr, 14, cw, H - 28, "태양에서 멀수록 덜 휜다");
      var g = SP.chart(ctx, { x: cxr + 6, y: 58, w: cw - 14, h: 226, x0: 1, x1: 7, y0: 0, y1: 2, xt: 6, yt: 4, xl: "태양 중심에서의 거리 (태양 반지름의 몇 배)", yl: "휘는 각도(″)" });
      function curve(kk) { var pts = []; for (var b = 1; b <= 7.001; b += 0.05) pts.push([b, Math.min(kk / b, 2.05)]); return pts; }
      ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T - 2, g.R - g.L, g.B - g.T + 2); ctx.clip();
      SP.plot(ctx, g, curve(0.87), LT.dim, { dash: [6, 5], w: 1.6, glow: false });
      SP.plot(ctx, g, curve(1.75), LT.yellow, { dash: [6, 5], w: 1.8, glow: false });
      SP.plot(ctx, g, curve(k), ok ? LT.green : LT.blue, { w: 3 });
      ctx.restore();
      B.forEach(function (b, j) { ctx.fillStyle = LT.orange; ctx.beginPath(); ctx.arc(g.X(b), g.Y(D[j]), 5, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke(); });
      SP.lbl(ctx, "아인슈타인 1.75″", g.X(1.14), g.Y(1.75 / 1.14) - 6, { s: 11, c: "#b86e00" });
      SP.lbl(ctx, "뉴턴 0.87″", g.X(1.8), g.Y(0.87 / 1.8) - 10, { s: 11, c: LT.mute });
      SP.lbl(ctx, "● 사진 속 별 다섯 개", g.R - 6, g.T + 14, { s: 11, a: "right", c: LT.orange });
      SP.lbl(ctx, "— 내 모형 " + k.toFixed(2) + "″", g.R - 6, g.T + 32, { s: 11, a: "right", c: ok ? LT.green : LT.blue });
      K.tip(ctx, "평균 차이 " + r.toFixed(3) + "″ · " + (ok ? "측정값에 가장 잘 맞는다" : "점에서 멀리 지난다"), cxr + 12, H - 54, cw - 24, ok);
      SP.head(ctx, "태양 가장자리 " + k.toFixed(2) + "″", ok ? "아인슈타인 쪽 — 측정값과 맞는다" : "측정값과의 평균 차이 " + r.toFixed(3) + "″", ok);
      readout("df-read", [
        ["모형(태양 가장자리)", k.toFixed(2) + "″", "b"],
        ["측정값과의 평균 차이", r.toFixed(3) + "″", ok ? "g" : "y"]
      ], ok ? [true, "측정값에 가장 잘 맞는 범위"] : [false, "점에서 멀리 지납니다"]);
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
      why: ["측정값은 뉴턴 예측의 약 두 배입니다.", "태양 근처에서 공간이 휘어 빛의 경로가 휜다는 일반 상대성 이론의 예측과 맞습니다.", "측정값 모두 0보다 분명히 큽니다."],
      onDone: function () { got.q = true; window.sthState("dfGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 위성 시계 */
  (function () {
    var canvas = $("c-gps"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, d = 1, on = false;
    var got = window.sthState("gpGot") || { a: false, b: false };
    function err(dd) { return on ? 0.01 * dd : 38e-6 * 3e5 * dd; }
    var ph = 0, playing = !REDUCE;
    function sat(x, y, tilt) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(tilt);
      [-1, 1].forEach(function (sd) {
        var pg = ctx.createLinearGradient(0, -8, 0, 8); pg.addColorStop(0, "#5aa0ff"); pg.addColorStop(1, "#1a3f8a");
        ctx.fillStyle = pg; ctx.fillRect(sd > 0 ? 12 : -40, -7, 28, 14);
        ctx.strokeStyle = "rgba(200,230,255,.6)"; ctx.lineWidth = .8;
        for (var q = 1; q < 4; q++) { var xx = (sd > 0 ? 12 : -40) + q * 7; ctx.beginPath(); ctx.moveTo(xx, -7); ctx.lineTo(xx, 7); ctx.stroke(); }
      });
      var bg = ctx.createLinearGradient(-10, -10, 10, 10); bg.addColorStop(0, "#fff1b8"); bg.addColorStop(.5, "#d9a441"); bg.addColorStop(1, "#7a5010");
      ctx.fillStyle = bg; ctx.fillRect(-11, -10, 22, 20);
      ctx.fillStyle = "#e8ecff"; ctx.beginPath(); ctx.moveTo(-5, 10); ctx.lineTo(5, 10); ctx.lineTo(0, 17); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var e = err(d), i;
      var LW = 470, ex = 200, ey = 560, ER = 330, OR = 460, rcv = { x: ex, y: ey - ER };
      K.studio(ctx, 0, 0, W, H);
      /* ── 왼쪽: 지구본 모형 + 위성 세 대 ── */
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var at = ctx.createRadialGradient(ex, ey, ER - 4, ex, ey, ER + 24); at.addColorStop(0, "rgba(90,170,255,.45)"); at.addColorStop(1, "rgba(90,170,255,0)");
      ctx.fillStyle = at; ctx.beginPath(); ctx.arc(ex, ey, ER + 24, 0, 6.2832); ctx.fill();
      var eg = ctx.createRadialGradient(ex - 90, ey - ER + 30, 20, ex, ey, ER);
      eg.addColorStop(0, "#8cc8ff"); eg.addColorStop(.45, "#2f7ad0"); eg.addColorStop(1, "#123f80");
      ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(ex, ey, ER, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "rgba(110,190,110,.75)"; ctx.beginPath(); ctx.ellipse(ex + 40, ey - ER + 38, 118, 24, -.1, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "rgba(20,40,90,.35)"; ctx.setLineDash([5, 6]); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(ex, ey, OR, Math.PI * 1.25, Math.PI * 1.75); ctx.stroke(); ctx.setLineDash([]);
      for (i = 0; i < 3; i++) {
        var th = -0.42 + ((ph + i / 3) % 1) * 0.84, sxp = ex + OR * Math.sin(th), syp = ey - OR * Math.cos(th);
        var dx = rcv.x - sxp, dy = rcv.y - syp;
        K.line(ctx, { x: sxp, y: syp }, rcv, "rgba(28,126,214,.25)", 1);
        for (var w = 0; w < 3; w++) {
          var u = ((ph * 6 + w / 3 + i * .17) % 1), cxp = sxp + dx * u, cyp = syp + dy * u;
          ctx.strokeStyle = "rgba(28,126,214," + (0.85 * (1 - u)) + ")"; ctx.lineWidth = 1.8;
          var an = Math.atan2(dy, dx); ctx.beginPath(); ctx.arc(cxp, cyp, 9, an - .9, an + .9); ctx.stroke();
        }
        ctx.fillStyle = "rgba(20,30,50,.18)"; ctx.beginPath(); ctx.ellipse(sxp + 4, syp + 22, 22, 4, 0, 0, 6.2832); ctx.fill();
        sat(sxp, syp, th);
      }
      ctx.restore();
      K.glow(ctx, rcv.x, rcv.y - 4, 3, "rgba(80,230,160,.95)", 4);
      K.pill(ctx, "내 전화(신호 받기)", rcv.x + 12, rcv.y - 10, { s: 11, c: "#a8ffd8" });
      K.pill(ctx, on ? "위성 시계 · 보정됨" : "위성 시계 · 하루 +38 μs 빨라짐", LW - 14, 112, { s: 11.5, a: "right", c: on ? "#7ff0c4" : "#ffc78a" });
      /* 손에 든 전화 화면(지도) */
      var mx = 166, my = 256, mw = LW - 182, mh = 72, sc = 0.8;
      ctx.save(); ctx.shadowColor = "rgba(20,30,60,.35)"; ctx.shadowBlur = 12; ctx.fillStyle = "#1c2230"; ctx.beginPath(); ctx.roundRect(mx - 6, my - 6, mw + 12, mh + 12, 14); ctx.fill(); ctx.restore();
      ctx.fillStyle = "#eef1e6"; ctx.beginPath(); ctx.roundRect(mx, my, mw, mh, 8); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.roundRect(mx, my, mw, mh, 8); ctx.clip();
      ctx.fillStyle = "rgba(140,200,120,.35)"; ctx.fillRect(mx + 260, my, 120, mh);
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 5;
      for (i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(mx + i * 56 + 10, my); ctx.lineTo(mx + i * 56 - 20, my + mh); ctx.stroke(); }
      ctx.strokeStyle = "#f5d36b"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(mx, my + 40); ctx.lineTo(mx + mw, my + 34); ctx.stroke();
      ctx.restore();
      var tx = mx + 44, ty = my + 50, cxk = Math.min(tx + e * sc, mx + mw - 18);
      if (e * sc > 2) K.line(ctx, { x: tx, y: ty }, { x: cxk, y: ty }, "rgba(224,49,49,.85)", 2, [4, 3]);
      function pin(x, y, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y - 14, 6.5, Math.PI * .85, Math.PI * .15); ctx.lineTo(x, y); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x, y - 14, 2.4, 0, 6.2832); ctx.fill(); }
      pin(tx, ty, LT.green); pin(cxk, ty, e > 100 ? LT.red : LT.orange);
      SP.lbl(ctx, "실제 위치", tx, my + 72, { s: 10.5, a: "center", c: LT.green });
      if (e * sc > 70) SP.lbl(ctx, "계산된 위치" + (tx + e * sc > mx + mw - 18 ? " → 밖" : ""), cxk, my + 72, { s: 10.5, a: "right", c: e > 100 ? LT.red : LT.orange });
      ctx.strokeStyle = LT.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx + mw - 92, my + 14); ctx.lineTo(mx + mw - 92 + 100 * sc, my + 14); ctx.stroke();
      SP.lbl(ctx, "100 km", mx + mw - 92 + 50 * sc, my + 28, { s: 10, a: "center" });
      /* ── 오른쪽 흰 카드: 날수에 따른 위치 오차 ── */
      var cxr = LW + 8, cw = W - cxr - 14;
      K.card(ctx, cxr, 14, cw, H - 28, "날이 갈수록 쌓이는 오차");
      var g = SP.chart(ctx, { x: cxr + 4, y: 58, w: cw - 12, h: 214, x0: 0, x1: 30, y0: 0, y1: 350, xt: 6, yt: 7, xl: "지난 날수(일)", yl: "위치 오차(km)" });
      ctx.save(); ctx.strokeStyle = LT.red; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(g.L, g.Y(100)); ctx.lineTo(g.R, g.Y(100)); ctx.stroke(); ctx.restore();
      SP.lbl(ctx, "100 km", g.R - 4, g.Y(100) - 5, { s: 10.5, a: "right", c: LT.red });
      SP.plot(ctx, g, [[0, 0], [30, Math.min(err(30), 350)]], on ? LT.green : LT.orange);
      K.line(ctx, { x: g.X(d), y: g.B }, { x: g.X(d), y: g.Y(Math.min(e, 350)) }, "rgba(20,40,90,.4)", 1, [3, 3]);
      ctx.fillStyle = e > 100 ? LT.red : LT.blue; ctx.beginPath(); ctx.arc(g.X(d), g.Y(Math.min(e, 350)), 5, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
      K.tip(ctx, e > 100 ? "100 km를 넘었다 · 지도를 못 쓴다" : (on ? "보정하면 오차가 쌓이지 않는다" : "아직 100 km 안"), cxr + 12, H - 54, cw - 24, e > 100 ? false : true);
      SP.head(ctx, "위치 오차 " + (e < 1 ? e.toFixed(2) : e.toFixed(0)) + " km", d + "일 · 시계 보정 " + (on ? "켬" : "끔"), e <= 100);
      readout("gp-read", [
        ["지난 날수", d + "일", "b", "보정 " + (on ? "켬" : "끔")],
        ["시계 오차", on ? "거의 0" : (38 * d) + " μs", "y"],
        ["위치 오차", (e < 1 ? e.toFixed(2) : e.toFixed(1)) + " km", e > 100 ? "r" : "g", "= 빛의 속력 × 시계 오차"]
      ], e > 100 ? [false, "100 km를 넘었습니다 · 지도를 못 씁니다"] : null);
    }
    function update() {
      draw(); var ch = false, e = err(d);
      $("gp-info").innerHTML = on ? "위성 시계를 상대성 이론으로 미리 보정하면 오차가 쌓이지 않습니다. 오늘날 위성 항법은 이 보정을 기본으로 합니다." : "하루 38 μs의 시계 오차 × 빛의 속력(30만 km/s) = 하루 약 <b>11.4 km</b>의 위치 오차(단순화한 계산). " + d + "일이면 약 " + e.toFixed(0) + " km입니다.";
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
    $("gp-play").addEventListener("click", function () { playing = !playing; this.textContent = playing ? "⏸ 위성 멈추기" : "▶ 위성 돌리기"; });
    if (REDUCE) $("gp-play").textContent = "▶ 위성 돌리기";
    K.animate(canvas, function (dt) { if (playing) { ph = (ph + dt / 24000) % 1; draw(); } });
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
    /* 물감 색(고정): 빨강·노랑·파랑 */
    var PIG = { r: [226, 58, 52], y: [246, 200, 30], b: [44, 98, 214] };
    function cols() { return pair === "ry" ? [PIG.r, PIG.y] : [PIG.b, PIG.y]; }
    var LC = { x: 222, y: 178, r: 124 }, SPOTS = [];
    (function () { var R = K.rng(31); for (var yy = -LC.r; yy <= LC.r; yy += 19) for (var xx = -LC.r; xx <= LC.r; xx += 21) { var ox = xx + ((Math.round(yy / 19)) % 2 ? 10.5 : 0); if (Math.hypot(ox, yy) < LC.r - 10) SPOTS.push([LC.x + ox + (R() - .5) * 4, LC.y + yy + (R() - .5) * 4, R() * 3, .8 + R() * .4]); } })();
    var NS = SPOTS.length, ORD2 = SPOTS.map(function (s, i) { return (i * 53) % NS; });
    function css(c, k) { return "rgb(" + c.map(function (x) { return Math.max(0, Math.min(255, Math.round(x * k))); }).join(",") + ")"; }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var c = cols(), n1 = Math.round(p / 100 * NS), ok = pair === "ry" && p >= 40 && p <= 60, i;
      var LW = 444, mixed = mix(c[0], c[1], p / 100);
      K.studio(ctx, 0, 0, W, H, { x: 230, y: 318, rx: 200, ry: 16 });
      /* ── 왼쪽: 캔버스 위에 놓인 돋보기(미니어처) ── */
      ctx.save(); ctx.translate(232, 202); ctx.scale(.88, .88); ctx.translate(-LC.x, -LC.y);
      ctx.fillStyle = "rgba(20,30,50,.22)"; ctx.beginPath(); ctx.ellipse(LC.x + 18, LC.y + LC.r + 14, LC.r * 1.1, 16, 0, 0, 6.2832); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(LC.x, LC.y, LC.r, 0, 6.2832); ctx.clip();
      var lg = ctx.createLinearGradient(LC.x - LC.r, LC.y - LC.r, LC.x + LC.r, LC.y + LC.r); lg.addColorStop(0, "#f4ecda"); lg.addColorStop(1, "#d8ccb0");
      ctx.fillStyle = lg; ctx.fillRect(LC.x - LC.r, LC.y - LC.r, LC.r * 2, LC.r * 2);
      ctx.strokeStyle = "rgba(120,100,70,.18)"; ctx.lineWidth = 1;
      for (i = -LC.r; i < LC.r; i += 4) { ctx.beginPath(); ctx.moveTo(LC.x - LC.r, LC.y + i); ctx.lineTo(LC.x + LC.r, LC.y + i); ctx.stroke(); ctx.beginPath(); ctx.moveTo(LC.x + i, LC.y - LC.r); ctx.lineTo(LC.x + i, LC.y + LC.r); ctx.stroke(); }
      SPOTS.forEach(function (s, j) {
        var col = ORD2[j] < n1 ? c[0] : c[1], gg = ctx.createRadialGradient(s[0] - 2, s[1] - 2, 1, s[0], s[1], 9);
        gg.addColorStop(0, css(col, 1.18)); gg.addColorStop(.7, css(col, 1)); gg.addColorStop(1, css(col, .78));
        ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(s[0], s[1], 8.5 * s[3], 7, s[2], 0, 6.2832); ctx.fill();
      });
      var gl = ctx.createRadialGradient(LC.x - 50, LC.y - 60, 5, LC.x - 50, LC.y - 60, 120); gl.addColorStop(0, "rgba(255,255,255,.35)"); gl.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gl; ctx.fillRect(LC.x - LC.r, LC.y - LC.r, LC.r * 2, LC.r * 2);
      ctx.restore();
      ctx.save(); ctx.lineCap = "round";
      ctx.strokeStyle = "#3e2410"; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(LC.x + 96, LC.y + 96); ctx.lineTo(LC.x + 166, LC.y + 144); ctx.stroke();
      var hg = ctx.createLinearGradient(LC.x + 90, LC.y + 80, LC.x + 140, LC.y + 160); hg.addColorStop(0, "#b07a44"); hg.addColorStop(1, "#5a3418");
      ctx.strokeStyle = hg; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(LC.x + 94, LC.y + 92); ctx.lineTo(LC.x + 162, LC.y + 138); ctx.stroke(); ctx.restore();
      ctx.strokeStyle = "#6e4810"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(LC.x + 2, LC.y + 3, LC.r + 4, 0, 6.2832); ctx.stroke();
      var rg = ctx.createLinearGradient(LC.x - LC.r, LC.y - LC.r, LC.x + LC.r, LC.y + LC.r); rg.addColorStop(0, "#fff1bf"); rg.addColorStop(.5, "#d3a23d"); rg.addColorStop(1, "#7a5010");
      ctx.strokeStyle = rg; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(LC.x, LC.y, LC.r + 3, 0, 6.2832); ctx.stroke();
      ctx.restore();
      K.pill(ctx, "돋보기로 가까이 본 그림", 380, 96, { s: 11.5, a: "right", c: KC.ink });
      /* ── 오른쪽: 밝은 전시실 벽에 걸린 그림 ── */
      var RX = LW + 8, RW = W - RX - 6;
      ctx.save(); ctx.beginPath(); ctx.roundRect(RX, 6, RW, H - 12, 14); ctx.clip();
      var wl = ctx.createLinearGradient(0, 0, 0, H); wl.addColorStop(0, "#f6efe3"); wl.addColorStop(1, "#e3d6c0"); ctx.fillStyle = wl; ctx.fillRect(RX, 0, RW, H);
      var spg = ctx.createRadialGradient(RX + 170, 30, 10, RX + 170, 140, 220); spg.addColorStop(0, "rgba(255,240,200,.75)"); spg.addColorStop(1, "rgba(255,240,200,0)"); ctx.fillStyle = spg; ctx.fillRect(RX, 0, RW, H);
      var fg = ctx.createLinearGradient(0, H - 46, 0, H); fg.addColorStop(0, "#b8875a"); fg.addColorStop(1, "#8a5e38"); ctx.fillStyle = fg; ctx.fillRect(RX, H - 46, RW, 46);
      ctx.fillStyle = "#d9c6a8"; ctx.fillRect(RX, H - 52, RW, 6);
      ctx.restore();
      var fx = RX + 54, fy = 70, fw = 220, fh = 176;
      ctx.fillStyle = "rgba(60,40,20,.28)"; ctx.fillRect(fx + 8, fy + 10, fw, fh);
      var fr = ctx.createLinearGradient(fx, fy, fx + fw, fy + fh); fr.addColorStop(0, "#fff1bf"); fr.addColorStop(.4, "#c9922e"); fr.addColorStop(1, "#6e4810");
      ctx.fillStyle = fr; ctx.fillRect(fx, fy, fw, fh);
      ctx.fillStyle = mixed; ctx.fillRect(fx + 14, fy + 14, fw - 28, fh - 28);
      var shg = ctx.createLinearGradient(fx, fy, fx + fw, fy + fh); shg.addColorStop(0, "rgba(255,255,255,.18)"); shg.addColorStop(1, "rgba(0,0,0,.16)"); ctx.fillStyle = shg; ctx.fillRect(fx + 14, fy + 14, fw - 28, fh - 28);
      K.pill(ctx, "첫째 색 점 " + p + "%", fx + fw / 2, fy + fh + 30, { s: 12, a: "center", c: KC.ink });
      if (pair === "ry") {
        var tx = RX + RW - 112, ty = 84;
        K.card(ctx, tx - 10, ty - 30, 106, 150, "목표 색");
        ctx.fillStyle = mix(c[0], c[1], 0.5); ctx.beginPath(); ctx.roundRect(tx + 4, ty, 78, 76, 10); ctx.fill();
        ctx.strokeStyle = ok ? LT.green : "rgba(20,40,90,.25)"; ctx.lineWidth = ok ? 3 : 1.5; ctx.stroke();
        SP.lbl(ctx, ok ? "✔ 맞음" : "주황", tx + 43, ty + 104, { s: 12.5, a: "center", c: ok ? LT.green : LT.orange });
      } else K.pill(ctx, "물감이면 초록 · 점이면?", RX + RW - 12, 92, { s: 11.5, a: "right", c: "#ffe08a" });
      SP.head(ctx, pair === "ry" ? (ok ? "멀리서 보면 주황!" : "점 비율 " + p + " : " + (100 - p)) : "파랑 + 노랑 점", pair === "ry" ? "빨강 + 노랑 점" : "물감처럼 초록이 될까?", ok, { s: 26 });
      readout("dt-read", [
        ["점의 짝", pair === "ry" ? "빨강 + 노랑" : "파랑 + 노랑", "b"],
        ["첫째 색 점", p + "%", "y", "나머지 " + (100 - p) + "%"],
        ["멀리서 본 색", "<span style='color:" + mixed + "'>■■■</span>", "b"]
      ], pair === "ry" ? (ok ? [true, "눈 속에서 주황으로 섞였습니다"] : [false, "목표 색과 다릅니다"]) : null);
      return ok;
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
      ctx.clearRect(0, 0, W, H);
      var h = hgt(a), ok = Math.abs(h - 10) <= 0.3, i, x;
      function yA(xx) { return h - a * (Math.cosh(xx / a) - 1); }
      var LW = 520, gx = 252, gy = 296, s = 11, DX = 14, DY = -10;
      function X(xx) { return gx + xx * s; }
      function Y(yy) { return gy - yy * s; }
      K.studio(ctx, 0, 0, W, H, { x: 260, y: 326, rx: 240, ry: 16 });
      /* ── 왼쪽: 돌 바닥판 위의 입체 돌 아치 ── */
      SP.poly(ctx, [{ x: 30, y: gy + 4 }, { x: 470, y: gy + 4 }, { x: 470 + DX * 1.6, y: gy + 4 + DY * 1.6 }, { x: 30 + DX * 1.6, y: gy + 4 + DY * 1.6 }], "#ddd3c0");
      SP.poly(ctx, [{ x: 30, y: gy + 4 }, { x: 470, y: gy + 4 }, { x: 470, y: gy + 20 }, { x: 30, y: gy + 20 }], "#a89a80");
      SP.poly(ctx, [{ x: 470, y: gy + 4 }, { x: 470 + DX * 1.6, y: gy + 4 + DY * 1.6 }, { x: 470 + DX * 1.6, y: gy + 20 + DY * 1.6 }, { x: 470, y: gy + 20 }], "#857860");
      K.line(ctx, { x: X(-12), y: Y(10) }, { x: X(12), y: Y(10) }, "rgba(232,89,12,.85)", 1.4, [6, 4]);
      K.pill(ctx, "목표 10 m", X(12) + 6, Y(10) + 4, { s: 11, c: "#ffd2a8" });
      ctx.save(); ctx.beginPath(); ctx.rect(0, 40, LW, gy - 36); ctx.clip();
      var pts = []; for (x = -10; x <= 10.001; x += 0.05) pts.push([X(x), Y(yA(x))]);
      var acc = 0, cuts = [0];
      for (i = 1; i < pts.length; i++) { acc += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (acc > 20) { cuts.push(i); acc = 0; } }
      if (cuts[cuts.length - 1] !== pts.length - 1) cuts.push(pts.length - 1);
      var stones = [];
      for (var c = 0; c < cuts.length - 1; c++) {
        var poly = [], q;
        for (q = cuts[c]; q <= cuts[c + 1]; q++) {
          var p0 = pts[Math.max(0, q - 1)], p1 = pts[Math.min(pts.length - 1, q + 1)], tx = p1[0] - p0[0], ty = p1[1] - p0[1], tl = Math.hypot(tx, ty) || 1;
          poly.push([pts[q][0] - ty / tl * 10, pts[q][1] + tx / tl * 10, pts[q][0] + ty / tl * 10, pts[q][1] - tx / tl * 10]);
        }
        stones.push({ poly: poly, mid: pts[Math.round((cuts[c] + cuts[c + 1]) / 2)] });
      }
      function stonePath(poly, ox, oy) { ctx.beginPath(); ctx.moveTo(poly[0][0] + ox, poly[0][1] + oy); poly.forEach(function (pp) { ctx.lineTo(pp[0] + ox, pp[1] + oy); }); for (var q2 = poly.length - 1; q2 >= 0; q2--) ctx.lineTo(poly[q2][2] + ox, poly[q2][3] + oy); ctx.closePath(); }
      stones.forEach(function (st) { stonePath(st.poly, DX, DY); ctx.fillStyle = ok ? "#7f9f86" : "#8f7a5a"; ctx.fill(); });
      stones.forEach(function (st) {
        var pl = st.poly, a0 = pl[0], a1 = pl[pl.length - 1];
        SP.poly(ctx, [{ x: a0[2], y: a0[3] }, { x: a1[2], y: a1[3] }, { x: a1[2] + DX, y: a1[3] + DY }, { x: a0[2] + DX, y: a0[3] + DY }], ok ? "#a9c7b0" : "#cbb48c");
      });
      stones.forEach(function (st) {
        var mid = st.mid, sg = ctx.createRadialGradient(mid[0] - 4, mid[1] - 4, 1, mid[0], mid[1], 18);
        sg.addColorStop(0, ok ? "#effaf0" : "#f6ead2"); sg.addColorStop(1, ok ? "#9cc4a6" : "#b49c74");
        stonePath(st.poly, 0, 0); ctx.fillStyle = sg; ctx.fill(); ctx.strokeStyle = "rgba(70,50,25,.6)"; ctx.lineWidth = 1.1; ctx.stroke();
      });
      [-6.5, 6.5].forEach(function (xx) {
        var sd = xx > 0 ? 1 : -1, d1 = 1.6 * sd, aP = { x: X(xx), y: Y(yA(xx)) }, bP = { x: X(xx + d1), y: Y(yA(xx + d1)) };
        var Ln = Math.hypot(bP.x - aP.x, bP.y - aP.y) || 1, ux = (bP.x - aP.x) / Ln, uy = (bP.y - aP.y) / Ln;
        K.arrow(ctx, { x: aP.x - uy * 18 * sd - ux * 14, y: aP.y + ux * 18 * sd - uy * 14 }, { x: aP.x - uy * 18 * sd + ux * 18, y: aP.y + ux * 18 * sd + uy * 18 }, LT.orange, 2.6, 9);
      });
      ctx.restore();
      K.bracket(ctx, X(-10), X(10), gy + 34, LT.mute, "폭 20 m", true);
      if (h > 22) K.pill(ctx, "▲ 너무 높아 화면을 넘음", LW - 16, 118, { s: 11, a: "right", c: "#ffb3bd" });
      else { K.line(ctx, { x: X(10) + 30, y: gy }, { x: X(10) + 30, y: Y(h) }, "rgba(20,40,90,.55)", 1.4); K.pill(ctx, "높이 " + h.toFixed(2) + " m", X(10) + 36, (gy + Y(h)) / 2 + 26, { s: 11, c: ok ? "#7ff0c4" : KC.ink, box: [0, LW] }); }
      /* ── 오른쪽: 나무 판에 거꾸로 매단 사슬 모형 ── */
      var RX = LW + 8, RW = W - RX, cx = RX + RW / 2, by = 70, s2 = 8;
      SP.poly(ctx, [{ x: cx - 130, y: by - 16 }, { x: cx + 130, y: by - 16 }, { x: cx + 144, y: by - 26 }, { x: cx - 116, y: by - 26 }], "#d9a868");
      var wg = ctx.createLinearGradient(0, by - 16, 0, by); wg.addColorStop(0, "#a8743e"); wg.addColorStop(1, "#6a4220");
      ctx.fillStyle = wg; ctx.fillRect(cx - 130, by - 16, 260, 16);
      SP.poly(ctx, [{ x: cx + 130, y: by - 16 }, { x: cx + 144, y: by - 26 }, { x: cx + 144, y: by - 10 }, { x: cx + 130, y: by }], "#5a3618");
      ctx.save(); ctx.beginPath(); ctx.rect(RX, by, RW, H - by - 6); ctx.clip();
      var cp = []; for (x = -10; x <= 10.001; x += 0.25) cp.push({ x: cx + x * s2, y: by + yA(x) * s2 });
      for (i = 0; i < cp.length - 1; i++) {
        var m1 = { x: (cp[i].x + cp[i + 1].x) / 2, y: (cp[i].y + cp[i + 1].y) / 2 }, an = Math.atan2(cp[i + 1].y - cp[i].y, cp[i + 1].x - cp[i].x);
        ctx.save(); ctx.translate(m1.x, m1.y); ctx.rotate(an);
        ctx.strokeStyle = i % 2 ? "#8a94a8" : "#4a5468"; ctx.lineWidth = 2;
        ctx.beginPath(); if (i % 2) ctx.ellipse(0, 0, 3.6, 1.2, 0, 0, 6.2832); else ctx.ellipse(0, 0, 3.6, 2.6, 0, 0, 6.2832); ctx.stroke(); ctx.restore();
      }
      [-6, -2, 2, 6].forEach(function (xx) {
        var pP = { x: cx + xx * s2, y: by + yA(xx) * s2 };
        K.line(ctx, pP, { x: pP.x, y: pP.y + 14 }, "rgba(90,70,40,.7)", 1);
        var bgd = ctx.createRadialGradient(pP.x - 2, pP.y + 18, 1, pP.x, pP.y + 20, 7); bgd.addColorStop(0, "#f0dcae"); bgd.addColorStop(1, "#9a7444");
        ctx.fillStyle = bgd; ctx.beginPath(); ctx.ellipse(pP.x, pP.y + 20, 5.5, 6.5, 0, 0, 6.2832); ctx.fill();
      });
      [-1, 1].forEach(function (sd) {
        var aP = { x: cx + sd * 8.5 * s2, y: by + yA(sd * 8.5) * s2 }, bP = { x: cx + sd * 10 * s2, y: by };
        var Ln = Math.hypot(bP.x - aP.x, bP.y - aP.y) || 1, ux = (bP.x - aP.x) / Ln, uy = (bP.y - aP.y) / Ln;
        K.arrow(ctx, { x: aP.x + uy * 14 * sd, y: aP.y - ux * 14 * sd }, { x: aP.x + uy * 14 * sd + ux * 26, y: aP.y - ux * 14 * sd + uy * 26 }, LT.green, 2.4, 8);
      });
      ctx.restore();
      [-1, 1].forEach(function (sd) { K.planet(ctx, cx + sd * 10 * s2, by, 4, "#e0e6f0", "#5a6070"); });
      K.pill(ctx, "가우디의 사슬 모형 (거꾸로)", cx, 26, { s: 12, a: "center", c: KC.ink, box: [RX, W] });
      K.pill(ctx, "당기는 힘만 받는 사슬", cx, H - 44, { s: 11, a: "center", c: "#7ff0c4", box: [RX, W] });
      K.pill(ctx, "뒤집으면 왼쪽 아치와 같은 곡선", cx, H - 16, { s: 11, a: "center", c: KC.ink, box: [RX, W] });
      SP.head(ctx, ok ? "높이 10 m 아치 완성" : "아치 높이 " + (h > 99 ? "99+" : h.toFixed(1)) + " m", "a = " + a.toFixed(1) + " · 폭 20 m", ok, { s: 26 });
      readout("ct-read", [
        ["매개변수 a", a.toFixed(1), "b", "y = a(cosh(x/a) − 1)"],
        ["아치 높이", h.toFixed(2) + " m", ok ? "g" : "y", "폭 20 m"]
      ], ok ? [true, "목표 높이 10 m(± 0.3 m)"] : [false, h > 10 ? "너무 높습니다 · a를 키워 보세요" : "너무 낮습니다 · a를 줄여 보세요"]);
      return ok;
    }
    function update() {
      var ok = draw(), h = hgt(a);
      $("ct-info").innerHTML = "a가 작을수록 곡선이 가파르고 높아지며, 클수록 납작해집니다. 지금 높이 <b>" + h.toFixed(2) + " m</b>." + (ok ? " 누르는 힘이 곡선을 따라 땅으로 곧게 전해지는 아치입니다." : "");
      if (ok && !got) { got = true; window.sthState("ctGot", true); window.sthState("ctA", a); mission(); }
    }
    function mission() {
      if (!got) return;
      window.sthState("ctBest", "a ≈ " + (+window.sthState("ctA") || 6.2).toFixed(1) + " 인 현수선 아치");
      window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("ctBest") + ". 가우디는 사슬 모형을 거꾸로 매달아 계산 없이도 이 곡선을 찾았고, <span data-place=41.4035,2.1744,18,s>사그라다 파밀리아</span>의 기둥과 아치를 설계했습니다.");
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
    function pump(x, y, off) {
      ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(x + 3, y + 12, 10, 4, 0, 0, 6.2832); ctx.fill();
      var ig = ctx.createLinearGradient(x - 6, 0, x + 6, 0); ig.addColorStop(0, "#5a6470"); ig.addColorStop(.45, "#c8d0da"); ig.addColorStop(1, "#2a3038");
      ctx.fillStyle = ig; ctx.beginPath(); ctx.roundRect(x - 6, y - 16, 12, 28, 3); ctx.fill();
      ctx.fillStyle = "#3a424c"; ctx.beginPath(); ctx.arc(x, y - 17, 7, Math.PI, 0); ctx.fill();
      ctx.strokeStyle = "#2a3038"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x - 6, y - 4); ctx.lineTo(x - 13, y + 2); ctx.stroke();
      if (!off) { ctx.strokeStyle = "#4a525c"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + 5, y - 12); ctx.lineTo(x + 18, y - 22); ctx.stroke(); ctx.lineCap = "butt"; }
      else { ctx.strokeStyle = KC.green; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 10, y - 26); ctx.lineTo(x + 22, y - 14); ctx.moveTo(x + 22, y - 26); ctx.lineTo(x + 10, y - 14); ctx.stroke(); }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var i;
      K.studio(ctx, 0, 0, W, H, { x: 330, y: 280, rx: 300, ry: 22 });
      /* ── 1854년 소호 거리 블록 모형: 지도 좌표(x, y) 를 그대로 월드 좌표로 ── */
      var I = K.iso({ ox: 318, oy: 40, s: 0.55, L: 610, D: 296 }), Z = 10;
      SP.box(ctx, I, 0, 0, 0, I.L, I.D, Z, ["#b9b2a4", "#8d8676", "#6f6a5e"], { edge: false });
      ["front", "right"].forEach(function (sd) { I.face(ctx, sd, function (Lw) { ctx.fillStyle = "#6b4f38"; ctx.fillRect(0, 0, Lw, 5); ctx.fillStyle = "#857060"; ctx.fillRect(0, 5, Lw, 3); }); });
      I.shade(ctx, "front", function () { return Z; }); I.shade(ctx, "right", function () { return Z; });
      I.plane(ctx, Z, "#c9c2b2");
      var XS = [0, 215, 400, I.L], YS = [0, 115, 200, I.D], blocks = [];
      for (var a2 = 0; a2 < 3; a2++) for (var b2 = 0; b2 < 3; b2++) blocks.push([XS[a2] + 9, YS[b2] + 9, XS[a2 + 1] - 9, YS[b2 + 1] - 9]);
      blocks.forEach(function (bk, n) { SP.box(ctx, I, bk[0], bk[1], Z, bk[2], bk[3], Z + 7, ["#c98a6a", "#a8664a", "#7e4a34"]); });
      ctx.strokeStyle = "rgba(90,45,25,.35)"; ctx.lineWidth = .8;
      blocks.forEach(function (bk) { for (var k2 = bk[0] + 22; k2 < bk[2]; k2 += 22) { var p1 = I.P(k2, bk[1], Z + 7), p2 = I.P(k2, bk[3], Z + 7); ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); } });
      /* 사망자(검은 막대)와 펌프(쇠기둥)를 앞뒤 순서대로 */
      var items = cases.map(function (c) { return { x: c[0], y: c[1], t: 0 }; });
      P.forEach(function (pp, j) { items.push({ x: pp[0], y: pp[1], t: 1, j: j }); });
      items.sort(function (p, q) { return (p.x + p.y) - (q.x + q.y); });
      items.forEach(function (it) {
        if (it.t === 0) I.box(ctx, it.x - 3, it.y - 3, Z + 7, it.x + 3, it.y + 3, Z + 19, "#3a3a44", "#16161c", "#0a0a10");
        else {
          var off = it.j === pick;
          SP.icyl(ctx, I, it.x, it.y, Z + 7, 6, 34, "iron");
          var tp = I.P(it.x, it.y, Z + 41);
          ctx.fillStyle = "#3a424c"; ctx.beginPath(); ctx.arc(tp.x, tp.y, 5, Math.PI, 0); ctx.fill();
          if (!off) { ctx.strokeStyle = "#2a3038"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(tp.x + 3, tp.y + 6); ctx.lineTo(tp.x + 15, tp.y - 4); ctx.stroke(); ctx.lineCap = "butt"; }
          else { ctx.strokeStyle = LT.green; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tp.x + 8, tp.y - 12); ctx.lineTo(tp.x + 18, tp.y - 2); ctx.moveTo(tp.x + 18, tp.y - 12); ctx.lineTo(tp.x + 8, tp.y - 2); ctx.stroke(); }
        }
      });
      P.forEach(function (pp, j) {
        var tp = I.P(pp[0], pp[1], Z + 44);
        K.pill(ctx, "펌프 " + pp[2], tp.x + 10, tp.y - 8, { s: 11.5, c: j === pick ? (j === 0 ? "#7ff0c4" : "#ffb3bd") : "#cfe6ff", box: [0, 610] });
      });
      K.pill(ctx, "■ 검은 막대 = 사망자가 나온 집 (1854년 런던 소호)", 16, H - 12, { s: 11, c: KC.ink });
      K.warn(ctx, 16, 28, "⚠ 거리와 집은 단순하게 줄여 그림");
      /* ── 오른쪽 흰 카드: 가장 가까운 펌프별 사망자 ── */
      var RX = 616, RW = W - RX - 14, mx = Math.max.apply(null, CNT), bw = RW - 96;
      K.card(ctx, RX, 14, RW, H - 28, "가장 가까운 펌프별 사망자");
      P.forEach(function (pp, j) {
        var y = 58 + j * 44, len = CNT[j] / mx * bw, hot = j === 0;
        K.t(ctx, pp[2].split(" ")[0], RX + 22, y + 15, { s: 16, w: "900", c: LT.ink });
        K.bar(ctx, RX + 44, y + 5, bw, CNT[j] / mx, hot ? LT.red : "#8a96a8");
        K.t(ctx, CNT[j] + "명", RX + 50 + Math.max(6, len), y + 15, { s: 12, w: "800", c: hot ? LT.red : LT.mute });
        if (j === pick) { ctx.strokeStyle = j === 0 ? LT.green : LT.red; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(RX + 10, y - 8, RW - 20, 34, 8); ctx.stroke(); }
      });
      if (pick >= 0) K.tip(ctx, "펌프 " + P[pick][2].split(" ")[0] + " 손잡이 제거 → " + (pick === 0 ? "사망자가 몰린 펌프" : "유행은 계속"), RX + 12, H - 54, RW - 24, pick === 0);
      else K.tip(ctx, "의심 가는 펌프를 골라 보세요", RX + 12, H - 54, RW - 24, null);
      readout("sn-read", [
        ["고른 펌프", pick < 0 ? "아직 없음" : P[pick][2], "b"],
        ["그 펌프 주변 사망자", pick < 0 ? "—" : CNT[pick] + "명", pick === 0 ? "r" : "y", "전체 " + cases.length + "명 가운데"]
      ], pick < 0 ? null : (pick === 0 ? [true, "사망자가 몰린 펌프"] : [false, "이 펌프를 막아도 유행은 계속됩니다"]));
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
    /* 사람 120명의 마을: 한 번의 예시(무작위) 퍼짐 */
    var NP = 120, PPL = [], sim = null, playing = !REDUCE, acc = 0, seed0 = 11;
    (function () { var R = K.rng(4); for (var i = 0; i < NP; i++) PPL.push({ x: 36 + (i % 12) * 34 + (R() - .5) * 8, y: 74 + Math.floor(i / 12) * 24 + (R() - .5) * 6 }); })();
    function reset() {
      var R = K.rng(seed0), rank = PPL.map(function (p, i) { return [R(), i]; }).sort(function (p, q) { return p[0] - q[0]; });
      var st = []; for (var i = 0; i < NP; i++) st.push(0);
      var nIm = Math.round(vc / 100 * NP); rank.forEach(function (r, k) { if (k < nIm) st[r[1]] = 1; });
      var cand = []; for (i = 0; i < NP; i++) if (!st[i]) cand.push(i);
      sim = { R: R, st: st, cur: [], links: [], gen: 0, tot: 0, end: false, hold: 0 };
      if (cand.length) { var p0 = cand[Math.floor(R() * cand.length)]; st[p0] = 2; sim.cur = [p0]; sim.tot = 1; } else sim.end = true;
    }
    function step() {
      if (!sim || sim.end) return;
      var nw = [], links = [], R = sim.R;
      sim.cur.forEach(function (i) {
        var nC = Math.floor(R0) + (R() < R0 - Math.floor(R0) ? 1 : 0);
        for (var c = 0; c < nC; c++) {
          var j = Math.floor(R() * NP); if (j === i) continue;
          if (sim.st[j] === 0) { sim.st[j] = 2; nw.push(j); links.push([i, j, 1]); } else if (sim.st[j] === 1) links.push([i, j, 0]);
        }
        sim.st[i] = 3;
      });
      sim.cur = nw; sim.links = links; sim.gen++; sim.tot += nw.length;
      if (!nw.length || sim.gen >= 8) sim.end = true;
    }
    function person(x, y, s) {
      var col = s === 1 ? "#3fd3a3" : s === 2 ? "#ff6b81" : s === 3 ? "#8a4a58" : "#9fb0e0";
      if (s === 2) K.glow(ctx, x, y - 4, 4, "rgba(255,120,140,.9)", 3.2);
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y - 6, 3.6, 0, 6.2832); ctx.fill();
      ctx.beginPath(); ctx.roundRect(x - 5, y - 1.5, 10, 9, [5, 5, 2, 2]); ctx.fill();
      if (s === 1) { ctx.strokeStyle = "rgba(63,211,163,.6)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y - 1, 10, 0, 6.2832); ctx.stroke(); }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var re = reff(), good = re <= 1 + 1e-9, i;
      if (!sim) reset();
      var LW = 440;
      K.studio(ctx, 0, 0, W, H, { x: 220, y: 304, rx: 210, ry: 20 });
      /* ── 마을 블록: 풀밭 위의 120명 ── */
      var I = K.iso({ ox: 196, oy: 104, s: 0.6, L: 410, D: 250 }), Z = 14;
      function Wp(p) { return [p.x - 20, p.y - 58]; }
      SP.box(ctx, I, 0, 0, 0, I.L, I.D, Z, "grass", { edge: false });
      ["front", "right"].forEach(function (sd) { I.face(ctx, sd, function (Lw) { ctx.fillStyle = "#6fa04a"; ctx.fillRect(0, Z - 3, Lw, 3); }); });
      I.shade(ctx, "front", function () { return Z; }); I.shade(ctx, "right", function () { return Z; });
      I.plane(ctx, Z, "#a9d27e");
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 6; var r1 = I.P(0, 120, Z), r2 = I.P(I.L, 120, Z); ctx.beginPath(); ctx.moveTo(r1.x, r1.y); ctx.lineTo(r2.x, r2.y); ctx.stroke();
      [[12, 10], [395, 10], [12, 238], [395, 238]].forEach(function (t2) { I.tree(ctx, t2[0], t2[1], Z, .9); });
      sim.links.forEach(function (l) {
        var a1 = Wp(PPL[l[0]]), b1 = Wp(PPL[l[1]]), pa = I.P(a1[0], a1[1], Z + 8), pb = I.P(b1[0], b1[1], Z + 8);
        K.line(ctx, pa, pb, l[2] ? "rgba(224,49,49,.85)" : "rgba(15,159,118,.6)", l[2] ? 1.8 : 1.2, l[2] ? null : [3, 3]);
      });
      var order = PPL.map(function (p, j) { return j; }).sort(function (p, q) { var A = Wp(PPL[p]), B2 = Wp(PPL[q]); return (A[0] + A[1]) - (B2[0] + B2[1]); });
      order.forEach(function (j) {
        var w = Wp(PPL[j]), s0 = sim.st[j], col = s0 === 1 ? "#16b383" : s0 === 2 ? "#ef3b52" : s0 === 3 ? "#8a4a58" : "#7d8fc0";
        if (s0 === 1) { var pc = I.P(w[0], w[1], Z); ctx.strokeStyle = "rgba(15,159,118,.75)"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(pc.x, pc.y, 8, 4, 0, 0, 6.2832); ctx.stroke(); }
        if (s0 === 2) { var pg = I.P(w[0], w[1], Z + 10); K.glow(ctx, pg.x, pg.y, 3, "rgba(255,120,140,.9)", 3); }
        I.person(ctx, w[0], w[1], Z, col, 1.15);
      });
      var nInf = 0; sim.st.forEach(function (s) { if (s >= 2) nInf++; });
      K.pill(ctx, sim.gen + "세대 · 환자 " + nInf + "명" + (sim.end ? (sim.cur.length ? "" : " · 더 못 퍼짐") : ""), LW - 10, H - 12, { s: 11.5, a: "right", c: nInf > 30 ? "#ffb3bd" : KC.ink });
      K.pill(ctx, "● 면역", 16, H - 12, { s: 11, c: "#7ff0c4" });
      K.pill(ctx, "● 환자", 84, H - 12, { s: 11, c: "#ffb3bd" });
      /* ── 오른쪽 흰 카드: 세대별 새 환자 수(기댓값) ── */
      var RX = LW + 8, cw = W - RX - 14;
      K.card(ctx, RX, 14, cw, H - 28, "세대별 새 환자 (처음 100명에서)");
      var LAB = ["1", "10", "100", "1천", "1만", "10만", "100만"];
      var g = SP.chart(ctx, { x: RX + 4, y: 56, w: cw - 12, h: 206, x0: -0.5, x1: 8.5, y0: 0, y1: 6, xt: 9, yt: 6, xf: function () { return ""; }, yf: function (q) { return LAB[Math.round(q)] || ""; }, xl: "세대", yl: "새 환자(로그 눈금)" });
      for (var gg = 0; gg <= 8; gg++) {
        var n = 100 * Math.pow(re, gg), l = Math.max(0, Math.min(6, Math.log(Math.max(n, 1)) / Math.LN10)), bx = g.X(gg) - 13, top = g.Y(l);
        var bg2 = ctx.createLinearGradient(0, top, 0, g.B); bg2.addColorStop(0, good ? "#5fd6a8" : "#ff8a9a"); bg2.addColorStop(1, good ? "#0f9f76" : "#c0304a");
        ctx.fillStyle = bg2; ctx.beginPath(); ctx.roundRect(bx, top, 26, Math.max(1, g.B - top), [5, 5, 0, 0]); ctx.fill();
        K.t(ctx, String(gg), g.X(gg), g.B + 16, { s: 10.5, a: "center", c: LT.mute, w: "600" });
      }
      K.tip(ctx, (good ? "유행이 번지지 못한다" : "유행이 커진다") + " · 실제 전파 수 " + re.toFixed(2) + "명", RX + 12, H - 54, cw - 24, good);
      SP.head(ctx, "실제 전파 수 " + re.toFixed(2) + "명", "R0 " + R0 + " · 면역 " + vc + "%", good, { s: 24, s2: 15 });
      readout("hd-read", [
        ["R0 · 면역 비율", R0 + " · " + vc + "%", "b"],
        ["실제 전파 수", re.toFixed(2) + "명", good ? "g" : "r", "= R0 × (1 − 면역 비율)"]
      ], good ? [true, "1 이하 · 유행이 번지지 못합니다"] : [false, "1보다 큽니다 · 유행이 커집니다"]);
    }
    function update() {
      draw(); var re = reff(), ch = false;
      $("hd-info").innerHTML = "R0 = " + R0 + " 인 감염병에서 인구의 " + vc + "%가 면역이면 환자 한 명이 실제로 옮기는 수는 <b>" + re.toFixed(2) + "명</b>입니다. " + (re < 1 - 1e-9 ? "1보다 작으므로 세대가 지날수록 환자가 줄어듭니다." : re <= 1 + 1e-9 ? "정확히 1이라 환자 수가 더 늘지 않고 그대로 유지됩니다(1보다 작아지면 줄어듭니다)." : "1보다 크므로 세대마다 환자가 불어납니다.");
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
    function fresh() { reset(); if (REDUCE || !playing) { while (!sim.end) step(); } }
    segWire("hd-d", function (x) { R0 = +x; fresh(); update(); });
    $("hd-v").addEventListener("input", function (e) { vc = +e.target.value; $("hd-v-val").textContent = vc + "%"; fresh(); update(); });
    $("hd-play").addEventListener("click", function () { playing = !playing; this.textContent = playing ? "⏸ 퍼지는 모습 멈추기" : "▶ 퍼지는 모습 보기"; });
    if (REDUCE) $("hd-play").textContent = "▶ 퍼지는 모습 보기";
    fresh();
    K.animate(canvas, function (dt) {
      if (!playing) return;
      acc += dt;
      if (sim.end) { if (acc > 2600) { acc = 0; seed0++; reset(); draw(); } }
      else if (acc > 900) { acc = 0; step(); draw(); }
    });
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
    var el = 0, playing = !REDUCE;
    /* ── 잘라 보는 모형: 서울(왼쪽 뒤) → 부산(오른쪽 앞)으로 이어진 땅 블록과 경부선 ──
       x = 노선 방향(0~L), y = 깊이(0 뒤 ~ D 앞), z = 높이(그림 단위). 철길은 앞쪽 골짜기(y = YR)를 따라간다. */
    var MH = 420;                                            /* 모형 칸 높이(아래는 시간 막대) */
    var I = K.iso({ ox: 352, oy: 136, s: 0.62, L: 700, D: 170 });
    var L = I.L, D = I.D, ZB = 54, YR = D - 30, RX0 = 34, RX1 = L - 56;
    var STN = [[RX0, "서울"], [RX0 + (RX1 - RX0) * 0.38, "대전"], [RX0 + (RX1 - RX0) * 0.76, "대구"], [RX1, "부산"]];
    function mtn(x) {                                        /* 노선 방향의 산줄기 높이(소백산맥 쪽이 가장 높다) */
      var a = (x - 330) / 120, b = (x - 520) / 70;
      return 78 * Math.exp(-a * a) + 34 * Math.exp(-b * b) + 14 + 8 * Math.sin(x / 37) * Math.sin(x / 23);
    }
    function hgt(x, y) {                                     /* 땅 높이(해수면 0) */
      var back = Math.max(0, Math.min(1, (YR - 12 - y) / 80));   /* 철길에서 멀어질수록 산이 높아진다 */
      var h = 4 + 3 * Math.sin(x / 41 + y / 29) + mtn(x) * back * back;
      var r = Math.hypot((x - L) / 120, y / 95);                /* 부산 앞바다: 오른쪽 뒤 모서리가 바다 */
      if (r < 1) h = Math.min(h, 4 - (1 - r) * 26);
      return h;
    }
    function zOf(x, y) { return ZB + hgt(x, y); }
    function railZ(x) { return ZB + 5 + 3 * Math.sin(x / 41 + YR / 29) * 0.4 + Math.max(0, mtn(x) - 14) * 0.18; }
    function landCol(x, y, z, light) {
      var m = z - ZB, c;
      if (m < -0.5) c = "#c9b58a";                            /* 바다 밑 모래 */
      else if (m < 6) c = "#9cbd62";                          /* 들판 */
      else if (m < 30) c = "#79a552";                         /* 언덕 */
      else if (m < 62) c = "#5b8c43";                         /* 숲 */
      else c = "#8b8a74";                                     /* 높은 산 바위 */
      return K.tint(c, light);
    }
    function kindOf() { return sp < 10 ? "walk" : sp < 45 ? "steam" : sp < 200 ? "elec" : "ktx"; }
    var KNAME = { walk: "🚶 걸어서", steam: "🚂 증기 기관차", elec: "🚃 디젤·전기 열차", ktx: "🚄 고속 열차" };

    function drawTrain(xh, kind, tt) {
      var zr = railZ(xh);
      if (kind === "walk") {
        I.person(ctx, xh, YR, zr, "#c0553f", 1.5);
        var p = I.P(xh - 2, YR - 2, zr + 14); ctx.fillStyle = "#8a5a33"; ctx.beginPath(); ctx.roundRect(p.x - 7, p.y - 4, 8, 8, 2); ctx.fill();
        return;
      }
      var n = kind === "steam" ? 4 : kind === "elec" ? 5 : 6, len = kind === "ktx" ? 26 : 22, i;
      xh = Math.max(xh, 6 + n * (len + 2));                  /* 출발 전에도 열차 전체가 블록 위에 있게 */
      var CS = { steam: ["#4b4f57", "#2a2d33", "#1b1d22"], elec: ["#7fa6d8", "#2f6fb0", "#1e4c80"], ktx: ["#ffffff", "#e9edf5", "#b9c3d6"] };
      for (i = n - 1; i >= 0; i--) {
        var x1 = xh - i * (len + 2), x0 = x1 - len, z0 = railZ(x0) + 1.5, loco = i === 0;
        var cc = CS[kind];
        if (kind === "steam" && !loco) cc = ["#8a5a3a", "#6a3f26", "#4a2b19"];
        I.box(ctx, x0, YR - 6, z0, x1, YR + 6, z0 + (loco && kind === "ktx" ? 10 : 12), cc[0], cc[1], cc[2]);
        /* 창문 줄 */
        var w0 = I.P(x0 + 3, YR + 6, z0 + 8), w1 = I.P(x1 - 3, YR + 6, z0 + 8);
        ctx.strokeStyle = kind === "steam" ? "rgba(255,210,120,.9)" : "rgba(190,230,255,.95)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(w0.x, w0.y); ctx.lineTo(w1.x, w1.y); ctx.stroke();
        if (kind === "ktx") { var s0 = I.P(x0, YR + 6, z0 + 3), s1 = I.P(x1, YR + 6, z0 + 3); ctx.strokeStyle = "#2a62d8"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(s0.x, s0.y); ctx.lineTo(s1.x, s1.y); ctx.stroke(); }
        if (kind === "steam" && loco) {
          I.box(ctx, x1 - 7, YR - 2, z0 + 12, x1 - 3, YR + 2, z0 + 19, "#2a2d33", "#1b1d22", "#111");
          for (var q = 0; q < 5; q++) {
            var a = ((tt / 700 + q / 5) % 1), sp0 = I.P(x1 - 5 - a * 34, YR - a * 6, z0 + 20 + a * 26);
            ctx.fillStyle = "rgba(235,235,240," + (0.6 * (1 - a)).toFixed(2) + ")"; ctx.beginPath(); ctx.arc(sp0.x, sp0.y, 3 + a * 8, 0, 6.2832); ctx.fill();
          }
        }
      }
    }
    function drawModel(t, u, tt) {
      var kind = kindOf(), xh = RX0 + (RX1 - RX0) * u + (kind === "walk" ? 0 : 6), box = [0, W], wz = ZB;
      K.studio(ctx, 0, 0, W, MH, { x: I.P(L, D, 0).x - 170, y: I.P(L, D, 0).y - 20, rx: 340, ry: 46 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, MH, 14); ctx.clip();
      /* 땅 + 바다(칸마다) */
      I.field(ctx, zOf, landCol, 70, 17, function (c, x0, y0, x1, y1, zMax, zMin) {
        if (wz > zMin + 0.2) {
          var depth = wz - zMin, al = Math.min(.8, .35 + depth / 40);
          I.quad(c, I.P(x0, y0, wz), I.P(x1, y0, wz), I.P(x1, y1, wz), I.P(x0, y1, wz), "rgba(60,140,210," + al.toFixed(2) + ")");
        }
      });
      /* 앞면·오른쪽 면: 땅속 단면 */
      ["front", "right"].forEach(function (side) {
        var zf = function (uu) { return side === "front" ? zOf(uu, D) : zOf(L, uu); };
        I.face(ctx, side, function (Lw) {
          I.profile(ctx, side, zf, 0);
          var g = ctx.createLinearGradient(0, 0, 0, 160); g.addColorStop(0, "#5e4a36"); g.addColorStop(.5, "#8a6d4c"); g.addColorStop(1, "#b89466");
          ctx.fillStyle = g; ctx.fill();
          ctx.save(); I.profile(ctx, side, zf, 0); ctx.clip();
          var R = K.rng(side === "front" ? 51 : 57);
          for (var k2 = 0; k2 < Lw * 1.2; k2++) { ctx.fillStyle = R() > .5 ? "rgba(255,255,255,.16)" : "rgba(40,25,10,.22)"; ctx.fillRect(R() * Lw, R() * 150, 1.6, 1.6); }
          ctx.strokeStyle = "rgba(50,30,15,.25)"; ctx.lineWidth = 1;
          for (var yy = 10; yy < 150; yy += 13) { ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(Lw, yy + 4 * Math.sin(yy)); ctx.stroke(); }
          ctx.restore();
        });
      });
      I.water(ctx, wz, function (uu, side) { return side === "front" ? zOf(uu, D) : zOf(L, uu); }, { surface: false });
      I.shade(ctx, "front", function (uu) { return Math.max(zOf(uu, D), wz); });
      I.shade(ctx, "right", function (uu) { return Math.max(zOf(L, uu), wz); });
      I.edges(ctx, zOf(L, D), zOf(L, D));
      /* 도시: 서울은 높은 건물, 부산은 항구, 대전·대구는 작은 마을 */
      [[12, 30, 20], [26, 52, 34], [14, 70, 26], [40, 34, 44], [46, 62, 28], [62, 46, 22]].forEach(function (b, i) {
        var z0 = zOf(b[0] + 5, b[1] + 5);
        I.box(ctx, b[0], b[1], z0, b[0] + 10, b[1] + 10, z0 + b[2], "#e6ebf2", ["#c9d2df", "#d7c9b6", "#c0cbe0"][i % 3], "#9aa6ba");
      });
      [[STN[1][0] - 10, 96], [STN[1][0] + 8, 104], [STN[2][0] - 8, 98], [STN[2][0] + 10, 108], [RX1 - 30, 112], [RX1 - 12, 100]].forEach(function (h, i) {
        I.house(ctx, h[0], h[1], zOf(h[0] + 4, h[1] + 4), 10, 9, 7, ["#c0553f", "#3f6fb5", "#d08a2e"][i % 3]);
      });
      [[L - 70, 40, "#e2533f"], [L - 50, 18, "#2f6fb0"]].forEach(function (s) { I.box(ctx, s[0], s[1], wz, s[0] + 16, s[1] + 6, wz + 4, "#f1f1f1", s[2], "#555"); });
      /* 나무 */
      var TR = K.rng(91);
      for (var tI = 0; tI < 26; tI++) { var tx = 90 + TR() * (L - 200), ty = 8 + TR() * (YR - 40); if (hgt(tx, ty) > 8 && hgt(tx, ty) < 64) I.tree(ctx, tx, ty, zOf(tx, ty), 0.7 + TR() * .3); }
      /* 철길: 침목 + 레일 두 줄 */
      var xx;
      for (xx = RX0 - 10; xx <= RX1 + 14; xx += 7) { var a1 = I.P(xx, YR - 6, railZ(xx)), a2 = I.P(xx, YR + 6, railZ(xx)); ctx.strokeStyle = "#6b5236"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y); ctx.stroke(); }
      [-3, 3].forEach(function (o) {
        ctx.strokeStyle = "#d8dde6"; ctx.lineWidth = 1.6; ctx.beginPath();
        for (xx = RX0 - 10; xx <= RX1 + 14; xx += 6) { var p = I.P(xx, YR + o, railZ(xx) + .6); if (xx === RX0 - 10) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }
        ctx.stroke();
      });
      /* 역 승강장 */
      STN.forEach(function (s) { I.box(ctx, s[0] - 9, YR - 16, railZ(s[0]), s[0] + 9, YR - 8, railZ(s[0]) + 3, "#d9c7a0", "#b9a67e", "#9a8862"); });
      /* 지나온 길(노란 띠) */
      var xe = RX0 + (RX1 - RX0) * u;
      if (u > 0.002) {
        ctx.save(); ctx.strokeStyle = "rgba(255,211,107,.85)"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath();
        for (xx = RX0; xx <= xe; xx += 5) { var pp = I.P(Math.min(xx, xe), YR + 9, railZ(xx) + .5); if (xx === RX0) ctx.moveTo(pp.x, pp.y); else ctx.lineTo(pp.x, pp.y); }
        ctx.stroke(); ctx.restore();
      }
      drawTrain(xh, kind, tt);
      ctx.restore();
      /* 이름표 */
      I.label(ctx, STN[0][0], YR - 12, railZ(STN[0][0]) + 3, "서울", -36, -34, "#f4f0e6", box);
      I.label(ctx, STN[1][0], YR - 12, railZ(STN[1][0]) + 3, "대전", -30, 42, "#f4f0e6", box);
      I.label(ctx, STN[2][0], YR - 12, railZ(STN[2][0]) + 3, "대구", -30, 42, "#f4f0e6", box);
      I.label(ctx, STN[3][0], YR - 12, railZ(STN[3][0]) + 3, "부산", 30, 24, "#f4f0e6", box);
      I.label(ctx, 330, 30, zOf(330, 30), "소백산맥 — 철길은 골짜기를 따라 넘는다", 50, -46, "#e8e2cf", box);
      K.pill(ctx, "지금 탈것: " + KNAME[kind], 22, 116, { s: 12, c: KC.yellow, box: box });
      var fp = I.P(L / 2, D, 0);
      K.pill(ctx, "서울 → 부산 약 400 km", fp.x - 40, fp.y + 22, { s: 11.5, a: "center", c: "#ffffff", box: box });
      /* 큰 제목 */
      var rt = 2 * t, ok = rt <= 6 + 1e-9;
      if (kind === "walk") { K.bigText(ctx, "걸어서 가는 먼 길", 22, 50, 28, "#ffffff"); K.bigText(ctx, "편도 " + t.toFixed(0) + "시간 · 하루 8시간씩 약 " + Math.ceil(t / 8) + "일", 22, 84, 17, "#ffd35a"); }
      else if (ok) { K.bigText(ctx, "아침에 가서 저녁에 온다", 22, 50, 28, "#ffd35a"); K.bigText(ctx, "평균 " + sp + " km/h · 왕복 " + rt.toFixed(1) + "시간 — 하루 생활권", 22, 84, 17, "#ffffff"); }
      else { K.bigText(ctx, t > 10 ? "기차 안에서 하룻밤" : "하루에 다녀오기엔 멀다", 22, 50, 28, "#ffffff"); K.bigText(ctx, "평균 " + sp + " km/h · 편도 " + t.toFixed(1) + "시간", 22, 84, 17, "#ffd35a"); }
      K.warn(ctx, W - 14, 28, "⚠ 높이는 크게 과장 · 실제 노선은 굽이져 있음", "right");
      K.pill(ctx, "출발 후 " + (u * t).toFixed(1) + "시간", W - 16, 56, { s: 12, a: "right", c: u >= 1 ? KC.green : KC.ink });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var t = 400 / sp, rt = 2 * t, ok = rt <= 6 + 1e-9;
      var u = Math.min(1, el / Math.max(1500, Math.min(12000, 1500 + t * 260)));
      drawModel(t, u, el);

      /* ── 아래: 탈것별 편도 시간(로그 눈금) ── */
      var BY = MH + 8, BH = H - BY, bx0 = 200, bx1 = W - 30;
      K.stage(ctx, 0, BY, W, BH, "lab", { seed: 3 });
      function X(h) { return bx0 + Math.log(h) / Math.log(120) * (bx1 - bx0); }
      [1, 3, 10, 30, 100].forEach(function (h) { K.line(ctx, { x: X(h), y: BY + 14 }, { x: X(h), y: H - 26 }, "rgba(160,175,255,.2)", 1, [3, 4]); K.t(ctx, h + "시간", X(h), H - 10, { s: 10.5, a: "center", c: KC.mute }); });
      ctx.save(); ctx.strokeStyle = KC.green; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(X(3), BY + 10); ctx.lineTo(X(3), H - 26); ctx.stroke(); ctx.restore();
      REF.concat([["지금 고른 속력", t]]).forEach(function (r, j) {
        var yy = BY + 34 + j * 24, me = j === REF.length, len = Math.max(3, X(r[1]) - bx0);
        K.t(ctx, r[0], bx0 - 10, yy + 13, { s: 11.5, a: "right", c: me ? KC.yellow : KC.ink, w: me ? "900" : "700" });
        var gb = ctx.createLinearGradient(bx0, 0, bx0 + len, 0); gb.addColorStop(0, me ? "#ffd36b" : "#4a5a9a"); gb.addColorStop(1, me ? (ok ? "#3fd3a3" : "#ffb35c") : "#8a9ad0");
        ctx.save(); if (me) { ctx.shadowColor = KC.yellow; ctx.shadowBlur = 8; } ctx.fillStyle = gb; ctx.beginPath(); ctx.roundRect(bx0, yy + 2, len, 15, 5); ctx.fill(); ctx.restore();
      });
      K.pill(ctx, "당일 출장 한계(편도 3시간)", X(3) + 8, BY + 24, { s: 10.5, c: KC.green });
      K.t(ctx, "편도 시간 (로그 눈금)", 16, BY + 24, { s: 11.5, c: KC.mute });
      readout("tp-read", [
        ["평균 속력", sp + " km/h", "b"],
        ["편도", t.toFixed(1) + "시간", "y", "= 400 km ÷ " + sp + " km/h"],
        ["왕복", rt.toFixed(1) + "시간", ok ? "g" : "r"]
      ], ok ? [true, "당일에 다녀올 수 있습니다"] : [false, "당일 출장은 어렵습니다"]);
    }
    function update() {
      draw(); var t = 400 / sp, ch = false;
      $("tp-info").innerHTML = "평균 " + sp + " km/h로 400 km를 가면 <b>" + t.toFixed(1) + "시간</b>. " + (2 * t <= 6 + 1e-9 ? "당일에 부산에서 일을 보고 돌아올 수 있습니다." : "당일 출장은 어렵습니다.");
      if (!got.a && Math.abs(t - 14) <= 0.5) { got.a = ch = true; }
      if (!got.b && 800 / sp <= 6 + 1e-9 && sp <= 140) { got.b = ch = true; }
      if (ch) { window.sthState("tpGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m4-2a"); if (got.b) done("m4-2b");
      if (got.a && got.b) {
        window.sthState("tpBest", "1905년 기차 약 29 km/h, 당일 출장은 약 134 km/h부터");
        window.sthMission("m4-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("tpBest") + ". 속력이 빨라지자 전국이 ‘하루 생활권’이 되었고, 일하는 방식과 도시의 모습도 달라졌습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("tp-v").addEventListener("input", function (e) { sp = +e.target.value; $("tp-v-val").textContent = sp + " km/h"; el = 0; update(); });
    $("tp-play").addEventListener("click", function () { playing = !playing; this.textContent = playing ? "⏸ 멈추기" : "▶ 달리기"; });
    if (REDUCE) { $("tp-play").textContent = "▶ 달리기"; el = 1e9; }
    K.animate(canvas, function (dt) {
      if (!playing) return;
      var dur = Math.max(1500, Math.min(12000, 1500 + (400 / sp) * 260));
      el += dt; if (el > dur + 1400) el = 0;
      draw();
    });
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
    var day = 0, playing = !REDUCE, SPOT = [];
    (function () { var R = K.rng(17); for (var i = 0; i < 200; i++) { var rr = 118 * Math.sqrt(R()), aa = R() * 6.2832; SPOT.push([Math.cos(aa) * rr, Math.sin(aa) * rr, R() * 3.14]); } })();
    function rod(x, y, an, res) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(an);
      var g = ctx.createLinearGradient(0, -3, 0, 3); g.addColorStop(0, res ? "#ffb0b8" : "#cfe0ff"); g.addColorStop(1, res ? "#c0304a" : "#4a6aa8");
      ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-6, -2.6, 12, 5.2, 2.6); ctx.fill(); ctx.restore();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var s = sim(n), e = s[n], tot = e[0] + e[1], share = tot > 0 ? e[1] / tot * 100 : 0, cured = tot === 0, i;
      var di = Math.max(0, Math.min(20, Math.floor(day))), cur = s[di];
      var LW = 400, cx = 176, cy = 212, rr = 108;
      K.studio(ctx, 0, 0, W, H, { x: 200, y: 330, rx: 190, ry: 14 });
      /* ── 왼쪽: 현미경 접안렌즈로 본 세균 + 작은 현미경 모형 ── */
      ctx.fillStyle = "rgba(20,30,50,.25)"; ctx.beginPath(); ctx.ellipse(cx + 8, cy + rr + 12, rr, 10, 0, 0, 6.2832); ctx.fill();
      var ring = ctx.createLinearGradient(cx - rr, cy - rr, cx + rr, cy + rr); ring.addColorStop(0, "#eef2f8"); ring.addColorStop(.5, "#8a96a8"); ring.addColorStop(1, "#3d4452");
      ctx.fillStyle = ring; ctx.beginPath(); ctx.arc(cx, cy, rr + 14, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#1a1e28"; ctx.beginPath(); ctx.arc(cx, cy, rr + 3, 0, 6.2832); ctx.fill();
      var ag = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, rr); ag.addColorStop(0, "#f2e9c8"); ag.addColorStop(1, "#c9b98a");
      ctx.fillStyle = ag; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 6.2832); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 6.2832); ctx.clip();
      var nS = Math.round(Math.max(0, Math.log(cur[0] + 1) / Math.LN10) / 6 * 90), nR = Math.round(Math.max(0, Math.log(cur[1] + 1) / Math.LN10) / 6 * 90);
      ctx.translate(cx, cy); ctx.scale(rr / 128, rr / 128); ctx.translate(-cx, -cy);
      for (i = 0; i < nS; i++) rod(cx + SPOT[i][0], cy + SPOT[i][1], SPOT[i][2], false);
      for (i = 0; i < nR; i++) { var sp2 = SPOT[199 - i]; rod(cx + sp2[0], cy + sp2[1], sp2[2], true); }
      ctx.restore();
      if (di >= 1 && di <= n) { ctx.fillStyle = "rgba(28,126,214,.10)"; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 6.2832); ctx.fill(); }
      var gl = ctx.createRadialGradient(cx - 50, cy - 60, 4, cx - 50, cy - 60, 90); gl.addColorStop(0, "rgba(255,255,255,.35)"); gl.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 6.2832); ctx.fill();
      if (!nS && !nR) K.pill(ctx, "세균이 모두 사라짐", cx, cy + 5, { s: 12.5, a: "center", c: "#7ff0c4" });
      /* 작은 현미경(놋쇠·검은 쇠) */
      var mx0 = 342, mb = 318;
      SP.cyl(ctx, mx0, mb - 10, 34, 10, 10, "slate");
      ctx.fillStyle = "#2a303b"; ctx.beginPath(); ctx.moveTo(mx0 + 6, mb - 14); ctx.quadraticCurveTo(mx0 + 40, mb - 90, mx0 + 8, mb - 150); ctx.lineTo(mx0 - 4, mb - 146); ctx.quadraticCurveTo(mx0 + 24, mb - 90, mx0 - 6, mb - 14); ctx.closePath(); ctx.fill();
      SP.cyl(ctx, mx0 - 14, mb - 70, 22, 6, 5, "iron");
      ctx.save(); ctx.translate(mx0 - 18, mb - 120); ctx.rotate(-.35);
      var tg = ctx.createLinearGradient(-9, 0, 9, 0); tg.addColorStop(0, "#966b1c"); tg.addColorStop(.4, "#f7de8e"); tg.addColorStop(1, "#7a5010");
      ctx.fillStyle = tg; ctx.fillRect(-9, -46, 18, 62); ctx.fillStyle = "#2a303b"; ctx.fillRect(-10, 16, 20, 10); ctx.fillRect(-7, -54, 14, 10); ctx.restore();
      K.pill(ctx, di >= 1 && di <= n ? "💊 약 먹는 중 · " + di + "일째" : (di === 0 ? "처음" : "약을 끊은 뒤 · " + di + "일째"), 312, 112, { s: 11.5, a: "center", c: di >= 1 && di <= n ? "#bfe6ff" : "#ffd2a8", box: [0, LW] });
      K.pill(ctx, "▬ 보통 세균", 16, H - 12, { s: 11, c: "#cfe0ff" });
      K.pill(ctx, "▬ 내성균", 112, H - 12, { s: 11, c: "#ffb0b8" });
      /* ── 오른쪽 흰 카드: 날짜별 세균 수 ── */
      var RX = LW + 8, cw = W - RX - 14;
      K.card(ctx, RX, 14, cw, H - 28, "날짜별 세균 수 (로그 눈금)");
      var LAB = ["1", "10", "100", "1천", "1만", "10만", "100만"];
      var g = SP.chart(ctx, { x: RX + 4, y: 56, w: cw - 12, h: 216, x0: 0, x1: 20, y0: 0, y1: 6, xt: 4, yt: 6, yf: function (q) { return LAB[Math.round(q)] || ""; }, xl: "날짜(일)", yl: "세균 수" });
      ctx.fillStyle = "rgba(28,126,214,.10)"; ctx.fillRect(g.X(0), g.T, g.X(n) - g.X(0), g.B - g.T);
      SP.lbl(ctx, "약 먹는 기간", Math.max(g.X(n / 2), g.L + 40), g.B - 8, { s: 10.5, a: "center", c: LT.blue });
      function L10(c) { return c < 1 ? -0.2 : Math.log(c) / Math.LN10; }
      ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T - 4, g.R - g.L, g.B - g.T + 4); ctx.clip();
      SP.plot(ctx, g, s.map(function (p, d) { return [d, L10(p[0])]; }), "#4a6aa8");
      SP.plot(ctx, g, s.map(function (p, d) { return [d, L10(p[1])]; }), LT.red);
      ctx.restore();
      K.line(ctx, { x: g.X(di), y: g.T }, { x: g.X(di), y: g.B }, "rgba(245,159,0,.8)", 1.3, [3, 3]);
      SP.lbl(ctx, "— 보통 세균", g.R - 6, g.T + 14, { s: 11, a: "right", c: "#4a6aa8" });
      SP.lbl(ctx, "— 내성균", g.R - 6, g.T + 32, { s: 11, a: "right", c: LT.red });
      K.tip(ctx, cured ? "완치 — 세균이 모두 사라졌다" : n + "일째 남은 세균 중 내성균 " + share.toFixed(1) + "%", RX + 12, H - 54, cw - 24, cured);
      SP.head(ctx, cured ? "완치!" : "내성균 " + share.toFixed(1) + "%", "약을 " + n + "일 먹고 끊으면", cured, { s: 26 });
      readout("ab-read", [
        ["약을 먹은 날수", n + "일", "b"],
        [n + "일째 남은 세균", (tot < 1 ? "0" : Math.round(tot).toLocaleString()) + "마리", cured ? "g" : "y"],
        ["그중 내성균", cured ? "—" : share.toFixed(1) + "%", cured ? "g" : "r", "처음에는 0.005%"]
      ], cured ? [true, "완치"] : [false, "20일째: 다시 불어납니다"]);
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
    { key: "rInq", label: "교과서 실험" },
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
    { key: "rInq", label: "교과서 실험" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "네 사건을 꿰는 한 문장" }
});

})();
