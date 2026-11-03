/* 과학의 역사와 문화 Ⅲ 과학과 인류의 미래 — 소단원별 이야기 네 편
   01 양자 샴푸의 비밀 / 02 같은 ‘라’, 다른 소리 / 03 멀미 나는 가상 교실 / 04 풍력 발전기가 들어온다면
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("shc-3");

var FONT = "'Gothic A1','Segoe UI',sans-serif";
function $(id) { return document.getElementById(id); }
function v(name) { return window.cssVar(name); }
function done(id) { var e = $(id); if (e) e.classList.add("done"); }
function put(id, html) { var e = $(id); if (e) e.innerHTML = html; }
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
function A(hex, a) {
  hex = String(hex || "#888").trim();
  if (hex.charAt(0) !== "#") return hex;
  if (hex.length === 4) hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  return "rgba(" + parseInt(hex.substr(1, 2), 16) + "," + parseInt(hex.substr(3, 2), 16) + "," + parseInt(hex.substr(5, 2), 16) + "," + a + ")";
}
function V(n) { return v(n); }
function segWire(id, attr, onPick) {
  var btns = Array.prototype.slice.call($(id).querySelectorAll("button"));
  btns.forEach(function (b) {
    b.type = "button";
    b.addEventListener("click", function () { btns.forEach(function (x) { x.classList.toggle("on", x === b); }); onPick(b.getAttribute(attr)); });
  });
}
function mulberry(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/* ── 무대 그림 도구 (../assets/kit.js) ── */
var K = window.sthKit, KC = K.C, REDUCE = K.REDUCE;
/* 읽음판: rows = [[이름, 값, 색(b·y·g·r), 보조]], ok = [통과?, 문구] */
function readout(id, rows, ok) {
  var h = "";
  rows.forEach(function (r) { h += "<span class='k'>" + r[0] + "</span><span class='v " + (r[2] || "b") + "'>" + r[1] + "</span>" + (r[3] ? "<span class='sub'>" + r[3] + "</span>" : ""); });
  if (ok) h += "<span class='ok " + (ok[0] ? "g" : "r") + "'>" + ok[1] + "</span>";
  put(id, h);
}
function playBtn(id, cv, label, on) {
  var b = $(id), st = { on: !REDUCE && on !== false };
  function lab() { b.textContent = st.on ? "⏸ " + label + " 멈추기" : "▶ " + label + " 보기"; }
  b.type = "button"; b.addEventListener("click", function () { st.on = !st.on; lab(); }); lab();
  return st;
}
var audio = null;
function actx() {
  try {
    if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === "suspended") audio.resume();
    return audio;
  } catch (e) { return null; }
}

/* =========================================================================
   이야기 ① 양자 샴푸의 비밀
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "사건 파일 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "quantum", title: "위원의 첫 판단",
    question: "일상에서 ‘양자 도약(quantum leap)’은 엄청나게 큰 도약을 뜻합니다. 물리학에서 양자 도약의 크기는 어느 정도일까요?",
    options: ["㉠ 우주에서 가장 큰 변화", "㉡ 사람 키만 한 크기", "㉢ 원자 안에서 일어나는 아주 작은 변화", "㉣ 정해져 있지 않다"],
    onPick: function (i) { window.sthState("quantumOK", i === 2 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 수소 원자의 양자 도약 */
  (function () {
    var canvas = $("a-c-lv"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, n = 6;
    var got = window.sthState("lvGot") || { a: false, q: false };
    function E(k) { return -13.6 / (k * k); }
    function dE(k) { return E(k) - E(2); }
    function lam(k) { return 1240 / dE(k); }
    function color(l) {
      if (l > 620) return "#ff4b3a"; if (l > 570) return "#ffd23a"; if (l > 495) return "#3ad17a";
      if (l > 450) return "#3ab8ff"; return "#8a5bff";
    }
    var ph = REDUCE ? 0.78 : 0, play = null;
    function rgbOf(l) { return color(l); }
    function cname(l) { return l > 620 ? "빨강" : l > 570 ? "노랑" : l > 495 ? "초록" : l > 450 ? "파랑" : "보라"; }
    function sup(x) { var m = x.toExponential(1).split("e+"), d = "⁰¹²³⁴⁵⁶⁷⁸⁹"; return m[0] + " × 10" + m[1].split("").map(function (c) { return d[+c]; }).join(""); }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var l = lam(n), d = dE(n), col = rgbOf(l), ok = Math.abs(l - 656) < 3, i;
      /* ── 왼쪽: 수소 원자(보어 모형) ── */
      var LW = 300, cx = 150, cy = 192;
      function rn(k) { return 10 + k * k * 3.3; }
      K.stage(ctx, 0, 0, LW, H, "space", { seed: 33 });
      K.pill(ctx, "수소 원자 속 전자", 16, 28, { s: 13, c: KC.blue });
      for (var k = 2; k <= 6; k++) { ctx.strokeStyle = k === n || k === 2 ? "rgba(200,215,255,.6)" : "rgba(200,215,255,.2)"; ctx.lineWidth = k === n || k === 2 ? 1.6 : 1; ctx.setLineDash(k === 2 || k === n ? [] : [3, 4]); ctx.beginPath(); ctx.arc(cx, cy, rn(k), 0, 6.2832); ctx.stroke(); }
      ctx.setLineDash([]);
      K.glow(ctx, cx, cy, 5, "rgba(255,140,120,.95)", 3.5);
      var u = ph % 1, ang = -0.6 + ph * 1.4, re;
      if (u < .35) re = rn(n); else if (u < .55) re = rn(n) + (rn(2) - rn(n)) * ((u - .35) / .2); else re = rn(2);
      var ex = cx + Math.cos(ang) * re, ey = cy + Math.sin(ang) * re;
      if (u >= .55) {
        var q = (u - .55) / .45, dx = .82, dy = -.57, sx = ex + dx * q * 190, sy = ey + dy * q * 190;
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.globalAlpha = 1 - q * .6; ctx.beginPath();
        for (i = 0; i <= 40; i++) { var t = i / 40, px = sx - dx * t * 46, py = sy - dy * t * 46, w = Math.sin(t * 6 * Math.PI) * 6 * Math.sin(t * Math.PI); if (i) ctx.lineTo(px - dy * w, py + dx * w); else ctx.moveTo(px - dy * w, py + dx * w); }
        ctx.stroke(); ctx.restore();
      }
      K.glow(ctx, ex, ey, 3.5, "rgba(170,220,255,.98)", 4);
      K.pill(ctx, "n = 2", cx + rn(2) * .7 + 4, cy + rn(2) * .7 + 14, { s: 10.5, c: KC.ink, box: [0, LW] });
      K.pill(ctx, "n = " + n, cx - rn(n) * .72 - 4, cy + rn(n) * .69 + 4, { s: 10.5, a: "right", c: KC.yellow, box: [0, LW] });
      K.warn(ctx, 14, H - 12, "⚠ 괤도 크기는 실제 비율이 아님");

      /* ── 가운데: 에너지 준위 ── */
      var MX = LW + 8, MW = 252, x0 = MX + 58, x1 = MX + MW - 50, y0 = 60, y1 = H - 40;
      function Y(e) { return y0 + (e - (-0.1)) / (-3.6 + 0.1) * (y1 - y0); }
      K.stage(ctx, MX, 0, MW, H, "lab", { seed: 4 });
      K.pill(ctx, "에너지 준위", MX + 16, 28, { s: 13, c: KC.blue });
      for (k = 2; k <= 6; k++) {
        var on = k === n || k === 2;
        ctx.save(); if (on) { ctx.shadowColor = "#cfe0ff"; ctx.shadowBlur = 6; } K.line(ctx, { x: x0, y: Y(E(k)) }, { x: x1, y: Y(E(k)) }, on ? "#e8ecff" : "rgba(200,210,255,.35)", on ? 2.4 : 1.3); ctx.restore();
        if (k <= 4 || k === n) K.t(ctx, "n=" + k, x1 + 6, Y(E(k)) + 4, { s: 10.5, c: on ? KC.ink : KC.mute });
      }
      K.line(ctx, { x: x0, y: Y(0) }, { x: x1, y: Y(0) }, "rgba(200,210,255,.25)", 1, [3, 3]);
      K.t(ctx, "0 eV", x0 - 6, Y(0) + 4, { s: 10, a: "right", c: KC.mute });
      K.t(ctx, "−3.40", x0 - 6, Y(E(2)) + 4, { s: 10, a: "right", c: KC.mute });
      K.t(ctx, "eV", x0 - 6, Y(E(2)) + 18, { s: 10, a: "right", c: KC.mute });
      ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 8; K.arrow(ctx, { x: (x0 + x1) / 2, y: Y(E(n)) }, { x: (x0 + x1) / 2, y: Y(E(2)) - 3 }, col, 3, 11); ctx.restore();
      K.glow(ctx, (x0 + x1) / 2, Y(E(n)), 3.5, "rgba(170,220,255,.98)", 3.5);
      K.pill(ctx, "ΔE = " + d.toFixed(2) + " eV", (x0 + x1) / 2 + 10, (Y(E(n)) + Y(E(2))) / 2 + 30, { s: 11.5, c: col, box: [MX, MX + MW] });

      /* ── 오른쪽: 빛의 색과 일상 에너지 ── */
      var RX = MX + MW + 8, RW = W - RX;
      K.stage(ctx, RX, 0, RW, H, "night", { seed: 6 });
      K.pill(ctx, "나오는 빛의 색", RX + 16, 28, { s: 13, c: KC.blue });
      var sx0 = RX + 20, sx1 = W - 20, sy0 = 48, sh = 26;
      function SX(lm) { return sx0 + (lm - 380) / (750 - 380) * (sx1 - sx0); }
      var sg = ctx.createLinearGradient(sx0, 0, sx1, 0);
      [[380, "#5a1a8a"], [430, "#6a3aff"], [470, "#2a8aff"], [500, "#2ad1c0"], [530, "#3ad17a"], [575, "#ffe23a"], [600, "#ffa23a"], [650, "#ff3a2a"], [750, "#5a0a0a"]].forEach(function (s2) { sg.addColorStop((s2[0] - 380) / 370, s2[1]); });
      ctx.globalAlpha = .35; ctx.fillStyle = sg; ctx.fillRect(sx0, sy0, sx1 - sx0, sh); ctx.globalAlpha = 1;
      [656, 486, 434, 410].forEach(function (lm) { ctx.fillStyle = Math.abs(lm - l) < 3 ? "#fff" : "rgba(255,255,255,.35)"; ctx.fillRect(SX(lm) - 1, sy0, 2, sh); });
      ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.fillStyle = col; ctx.fillRect(SX(l) - 3, sy0 - 4, 6, sh + 8); ctx.restore();
      K.t(ctx, "380 nm", sx0, sy0 + sh + 14, { s: 10, c: KC.mute }); K.t(ctx, "750 nm", sx1, sy0 + sh + 14, { s: 10, a: "right", c: KC.mute });
      K.pill(ctx, l.toFixed(0) + " nm · " + cname(l), SX(l), sy0 + sh + 34, { s: 11.5, a: "center", c: col, box: [RX, W] });
      /* 종이 클립과 로그 막대 */
      K.t(ctx, "에너지 견주기 (눈금 한 칸 = 10배)", RX + 20, 152, { s: 11.5, c: KC.mute });
      var lx0 = RX + 24, lx1 = W - 24, ly = 196;
      function LX(e) { return lx0 + Math.log(e) / Math.LN10 / 15 * (lx1 - lx0); }
      ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.beginPath(); ctx.roundRect(lx0, ly - 6, lx1 - lx0, 12, 6); ctx.fill();
      for (i = 0; i <= 15; i++) { ctx.fillStyle = "rgba(200,210,255,.35)"; ctx.fillRect(lx0 + i / 15 * (lx1 - lx0) - .5, ly - 9, 1, 18); }
      K.t(ctx, "1 eV", lx0, ly + 26, { s: 10, c: KC.mute }); K.t(ctx, "10¹⁵ eV", lx1, ly + 26, { s: 10, a: "right", c: KC.mute });
      K.glow(ctx, LX(d), ly, 4.5, "rgba(255,255,255,.95)", 3); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(LX(d), ly, 4, 0, 6.2832); ctx.fill();
      K.pill(ctx, "양자 도약 " + d.toFixed(2) + " eV", LX(d) - 4, ly - 18, { s: 11, c: col, box: [RX, W] });
      var cX = LX(6.1e14);
      K.glow(ctx, cX, ly, 4.5, "rgba(255,211,107,.95)", 3);
      K.pill(ctx, "클립 1 cm 들기 ≈ 6.1 × 10¹⁴ eV", cX, ly + 50, { s: 11, a: "right", c: KC.yellow, box: [RX, W] });
      /* 클립 그림 */
      var px = RX + 40, py = 270;
      ctx.save(); ctx.strokeStyle = "#c8d0dc"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.shadowColor = "rgba(200,220,255,.6)"; ctx.shadowBlur = 4;
      ctx.beginPath(); ctx.moveTo(px, py + 30); ctx.lineTo(px, py + 6); ctx.arc(px + 8, py + 6, 8, Math.PI, 0); ctx.lineTo(px + 16, py + 34); ctx.arc(px + 10, py + 34, 6, 0, Math.PI); ctx.lineTo(px + 4, py + 14); ctx.stroke(); ctx.restore();
      K.arrow(ctx, { x: px + 34, y: py + 34 }, { x: px + 34, y: py + 4 }, KC.yellow, 2, 8);
      K.t(ctx, "1 cm", px + 42, py + 24, { s: 10.5, c: KC.yellow });
      K.pill(ctx, "클립이 약 " + sup(6.1e14 / d) + "배 큽니다", px + 80, py + 26, { s: 12, c: KC.orange, box: [RX, W] });
      readout("a-lv-read", [
        ["도약", n + " → 2", "b"],
        ["나오는 빛의 에너지", d.toFixed(2) + " eV", "y", "= −13.6/" + (n * n) + " − (−13.6/4)"],
        ["파장", l.toFixed(0) + " nm", ok ? "g" : "b", "= 1240 ÷ " + d.toFixed(2)]
      ], ok ? [true, "수소의 붉은빛 Hα (656 nm)"] : null);
      return ok;
    }
    function update() {
      var ok = draw();
      put("a-lv-info", "전자가 n = " + n + " 에서 n = 2로 옮겨 가며 " + dE(n).toFixed(2) + " eV의 빛(파장 " + lam(n).toFixed(0) + " nm)을 냅니다. " + (ok ? "✅ 수소가 내는 붉은빛(Hα, 656 nm)입니다." : "656 nm 붉은빛이 나오는 출발 준위를 찾아보세요."));
      if (ok && !got.a) { got.a = true; window.sthState("lvGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-2a"); if (got.q) done("m1-2b");
      if (got.a && got.q) {
        window.sthState("lvBest", "3 → 2 도약 = 1.89 eV(656 nm), 클립 들기의 약 3×10¹⁴ 분의 1");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("lvBest") + ". 과학에서 ‘양자 도약’은 가장 작은 축의 변화입니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    play = playBtn("a-lv-play", canvas, "전자의 도약");
    K.animate(canvas, function (dt) { if (play.on) { ph += dt / 2600; draw(); } });
    $("a-lv-n").addEventListener("input", function (e) { n = +e.target.value; $("a-lv-n-val").textContent = n; update(); });
    window.sthPick({
      mount: "a-lv-pick",
      q: "계산해 보니 양자 도약은 일상의 에너지와 비교해 어떤가요?",
      options: ["상상할 수 없이 큰 변화이다", "종이 클립 하나를 1 cm 들어 올리는 에너지보다도 10¹⁴ 배 넘게 작은 변화이다", "사람이 느낄 수 있을 만큼의 변화이다"],
      answer: 1,
      why: ["계산 결과는 정반대입니다.", "양자 도약은 원자 하나 안에서 일어나는 아주 작은 변화입니다. ‘엄청난 도약’이라는 일상의 뜻과 크기가 정반대로 뒤집혔습니다.", "원자 하나의 변화는 사람의 감각으로 느낄 수 없을 만큼 작습니다."],
      onDone: function () { got.q = true; window.sthState("lvGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 과학 용어 지도 */
  (function () {
    var canvas = $("a-c-term"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var TERMS = [
      { w: "양자", sci: "더 이상 나눌 수 없는 최소 단위. 원자 속 전자가 옮겨 가는 ‘양자 도약’은 아주 작은 변화다.",
        life: "‘양자 도약’ = 엄청나게 큰 도약. 크기가 정반대로 뒤집혔다.", drift: 0.95, use: 0.55 },
      { w: "진화", sci: "집단의 유전적 구성이 세대를 거치며 변하는 것. 더 나아진다는 뜻도, 목적도 없다.",
        life: "‘진화했다’ = 더 나아졌다. 방향과 목적이 붙었다.", drift: 0.85, use: 0.9 },
      { w: "에너지", sci: "일을 할 수 있는 능력. 단위가 있고 보존된다.",
        life: "‘에너지가 좋다’ = 기운·분위기. 재거나 보존되지 않는다.", drift: 0.8, use: 0.95 },
      { w: "파동", sci: "매질이나 장의 진동이 퍼져 나가는 현상. 진동수와 파장으로 잰다.",
        life: "‘좋은 파동’ = 느낌·기운. 광고에 자주 쓰인다.", drift: 0.9, use: 0.5 },
      { w: "촉매", sci: "반응 속도를 바꾸되 자신은 소모되지 않는 물질.",
        life: "‘촉매가 되었다’ = 계기. ‘소모되지 않는다’는 핵심이 빠졌다.", drift: 0.45, use: 0.7 },
      { w: "관성", sci: "운동 상태를 유지하려는 성질. 질량에만 관계하고 속도와는 무관하다.",
        life: "‘관성적으로’ = 습관적으로. 뜻이 비교적 잘 옮겨 갔다.", drift: 0.3, use: 0.75 },
      { w: "스펙트럼", sci: "빛을 파장에 따라 펼쳐 놓은 것.",
        life: "‘정치적 스펙트럼’ = 연속적인 범위. 구조는 살아남았다.", drift: 0.25, use: 0.8 },
      { w: "임계점", sci: "상태가 급격히 바뀌는 특정한 조건. 값이 정해져 있다.",
        life: "‘임계점에 다다랐다’ = 한계. 정해진 값이라는 점이 흐려졌다.", drift: 0.5, use: 0.6 },
      { w: "유전자", sci: "단백질을 만드는 정보가 담긴 DNA 구간.",
        life: "‘장인의 유전자’ = 타고난 기질. 환경의 몫이 지워졌다.", drift: 0.75, use: 0.85 },
      { w: "시너지", sci: "여러 요인이 함께 작용해 각각의 합보다 큰 효과를 내는 것.",
        life: "‘시너지가 난다’ = 그냥 잘 어울린다. 합보다 크다는 조건이 빠졌다.", drift: 0.6, use: 0.9 }
    ];
    var sel = 0, seen = window.sthState("termSeen") || [];
    var got = window.sthState("termGot") || { a: false, q: false };
    $("a-terms").innerHTML = TERMS.map(function (t, i) {
      return '<button class="chip' + (i === 0 ? " on" : "") + '" type="button" data-i="' + i + '">' + t.w + '</button>';
    }).join("");
    function wrap(s, x, y, maxW, lh) {
      var line = "", i;
      for (i = 0; i < s.length; i++) {
        var test = line + s[i];
        if (ctx.measureText(test).width > maxW) { ctx.fillText(line, x, y); line = s[i]; y += lh; }
        else line = test;
      }
      ctx.fillText(line, x, y);
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var t = TERMS[sel], boxW = 330, boxH = 132, ly = 30, lx = 40, rx = W - 40 - boxW;
      var dc = t.drift > 0.7 ? KC.red : (t.drift > 0.4 ? KC.yellow : KC.green);
      K.stage(ctx, 0, 0, W, H, "night", { seed: 18 });
      function card(x, title, body, col, g0, g1) {
        ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 14;
        var g = ctx.createLinearGradient(x, ly, x + boxW, ly + boxH); g.addColorStop(0, g0); g.addColorStop(1, g1);
        ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, ly, boxW, boxH, 14); ctx.fill(); ctx.restore();
        ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.roundRect(x, ly, boxW, boxH, 14); ctx.stroke();
        K.t(ctx, title, x + 16, ly + 24, { s: 12.5, w: "800", c: col });
        ctx.fillStyle = KC.ink; ctx.font = "600 12.5px " + FONT; ctx.textAlign = "left";
        wrap(body, x + 16, ly + 50, boxW - 32, 19);
      }
      card(lx, "🔬 과학에서의 뜻", t.sci, KC.blue, "#10204a", "#0b1430");
      card(rx, "💬 일상에서의 쓰임", t.life, KC.orange, "#3a2410", "#22140a");
      var ay = ly + boxH / 2;
      var ag = ctx.createLinearGradient(lx + boxW + 12, 0, rx - 12, 0); ag.addColorStop(0, KC.blue); ag.addColorStop(1, KC.orange);
      ctx.save(); ctx.shadowColor = dc; ctx.shadowBlur = 8; K.arrow(ctx, { x: lx + boxW + 12, y: ay }, { x: rx - 12, y: ay }, ag, 3, 12); ctx.restore();
      K.pill(ctx, t.w, W / 2, ay - 14, { s: 15, a: "center", c: KC.ink });
      K.pill(ctx, t.drift > 0.7 ? "크게 달라짐" : (t.drift > 0.4 ? "일부 달라짐" : "거의 그대로"), W / 2, ay + 30, { s: 11.5, a: "center", c: dc });
      var gx = 70, gy = ly + boxH + 56, gw = W - 140, gh = H - gy - 54;
      ctx.fillStyle = "rgba(255,255,255,.03)"; ctx.fillRect(gx, gy, gw, gh);
      var zg = ctx.createLinearGradient(0, gy, 0, gy + gh * .3); zg.addColorStop(0, "rgba(255,107,129,.16)"); zg.addColorStop(1, "rgba(255,107,129,.05)");
      ctx.fillStyle = zg; ctx.fillRect(gx, gy, gw, gh * .3);
      ctx.strokeStyle = KC.grid; ctx.lineWidth = 1;
      for (var gi = 1; gi < 4; gi++) { ctx.beginPath(); ctx.moveTo(gx + gw * gi / 4, gy); ctx.lineTo(gx + gw * gi / 4, gy + gh); ctx.stroke(); ctx.beginPath(); ctx.moveTo(gx, gy + gh * gi / 4); ctx.lineTo(gx + gw, gy + gh * gi / 4); ctx.stroke(); }
      ctx.strokeStyle = KC.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy + gh); ctx.lineTo(gx + gw, gy + gh); ctx.stroke();
      K.t(ctx, "크게 달라진 구역", gx + 8, gy + 16, { s: 10.5, c: "#ff9aa8" });
      K.t(ctx, "일상에서 쓰이는 정도 →", gx + gw / 2, gy + gh + 24, { s: 11.5, a: "center", c: KC.mute });
      ctx.save(); ctx.translate(30, gy + gh / 2); ctx.rotate(-Math.PI / 2);
      K.t(ctx, "원래 뜻에서 멀어진 정도 →", 0, 0, { s: 11.5, a: "center", c: KC.mute }); ctx.restore();
      TERMS.forEach(function (q, i) {
        var px = gx + gw * q.use, py = gy + gh - gh * q.drift, on = (i === sel), was = seen.indexOf(i) >= 0;
        if (on) K.glow(ctx, px, py, 6, "rgba(127,211,255,.98)", 3.4);
        else if (was) K.glow(ctx, px, py, 4, "rgba(63,211,163,.95)", 3);
        else { ctx.fillStyle = "rgba(160,175,220,.5)"; ctx.beginPath(); ctx.arc(px, py, 4, 0, 6.2832); ctx.fill(); }
        K.t(ctx, q.w, px, py - (on ? 16 : 11), { s: on ? 12.5 : 11, w: on ? "800" : "600", a: "center", c: on ? KC.ink : (was ? "#9ff0d4" : KC.mute) });
      });
    }
    function big() { return seen.filter(function (i) { return TERMS[i].drift > 0.7; }).length; }
    function refresh() {
      var t = TERMS[sel];
      if (seen.indexOf(sel) < 0) { seen.push(sel); window.sthState("termSeen", seen); }
      put("a-term-info", "<b>" + t.w + "</b> — 과학에서는 " + t.sci + " 일상에서는 " + t.life
        + (t.drift > 0.7 ? " 이 말을 근거로 쓴 주장을 만나면, <b>어느 쪽 뜻으로 쓴 것인지</b> 먼저 확인해야 합니다." : "")
        + " <span style='color:var(--mist)'>(뜻이 크게 달라진 말 " + big() + "개 찾음)</span>");
      draw();
      if (big() >= 3 && !got.a) { got.a = true; window.sthState("termGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-3a"); if (got.q) done("m1-3b");
      if (got.a && got.q) {
        window.sthState("termBest", "뜻이 크게 달라진 말 " + Math.max(3, big()) + "개 확인");
        window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("termBest") + ". 과학 용어가 근거로 쓰일 때는 과학에서의 뜻인지, 측정할 수 있는 근거가 있는지를 따져야 합니다.");
        ep.clear(2);
      }
    }
    Array.prototype.forEach.call(document.querySelectorAll("#a-terms .chip"), function (b) {
      b.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#a-terms .chip"), function (o) { o.classList.remove("on"); });
        b.classList.add("on"); sel = +b.getAttribute("data-i"); refresh();
      });
    });
    window.sthPick({
      mount: "a-ad-pick",
      q: "‘양자 파동 에너지 팔찌 — 몸의 에너지 균형을 맞춰 줍니다’라는 광고를 과학적으로 판단하는 가장 좋은 방법은?",
      options: ["과학 용어가 많이 들어 있으니 믿을 만하다고 본다", "용어가 과학에서의 뜻으로 쓰였는지, 효과를 측정해 확인한 근거가 있는지 따져 본다", "유명인이 광고하는지 확인한다"],
      answer: 1,
      why: ["용어가 많다고 근거가 되지는 않습니다. 오히려 뜻을 흐리는 말일 수 있습니다.", "‘에너지 균형’은 과학에서 재거나 정의할 수 없는 말입니다. 과학에서의 뜻과 측정 가능한 근거를 확인해야 합니다.", "광고하는 사람의 유명세는 과학적 근거가 아닙니다."],
      onDone: function () { got.q = true; window.sthState("termGot", got); mission(); }
    });
    canvas._redraw = draw;
    refresh(); mission();
  })();

  /* 장면 4 — 시민 과학 */
  (function () {
    var canvas = $("a-c-cit"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, n = 5;
    var got = window.sthState("citGot") || false;
    var TRUE = 120, SD = 0.3;
    var COUNTS = (function () { var r = mulberry(55), a = [];
      for (var i = 0; i < 100; i++) { var u = r(), w = r(), z = Math.sqrt(-2 * Math.log(u + 1e-9)) * Math.cos(2 * Math.PI * w); a.push(Math.max(20, TRUE * (1 + SD * z))); }
      return a; })();
    function moe(k) { return 2 * SD * 100 / Math.sqrt(k); }
    var BIRDS = (function () { var r = mulberry(9), a = []; for (var i = 0; i < TRUE; i++) a.push([20 + r() * 330, 60 + Math.pow(r(), 1.3) * 140, .7 + r() * .6]); return a; })();
    function bird(x, y, s) { ctx.beginPath(); ctx.moveTo(x - 5 * s, y - 2 * s); ctx.quadraticCurveTo(x - 2 * s, y - 3.5 * s, x, y); ctx.quadraticCurveTo(x + 2 * s, y - 3.5 * s, x + 5 * s, y - 2 * s); ctx.stroke(); }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var i, sum = 0;
      for (i = 0; i < n; i++) sum += COUNTS[i];
      var mean = sum / n, m = moe(n) / 100 * mean, ok = moe(n) <= 10 + 1e-9;
      /* ── 왼쪽: 우리 동네 습지의 새 떼 ── */
      var LW = 370;
      K.stage(ctx, 0, 0, LW, H, "sky", { seed: 2 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var wg = ctx.createLinearGradient(0, 220, 0, H); wg.addColorStop(0, "#3a7ab0"); wg.addColorStop(1, "#1a3a5c"); ctx.fillStyle = wg; ctx.fillRect(0, 222, LW, H - 222);
      ctx.fillStyle = "#2f4a2a"; ctx.beginPath(); ctx.moveTo(0, 226); for (i = 0; i <= 12; i++) ctx.lineTo(i * 32, 214 + Math.sin(i * 1.7) * 6); ctx.lineTo(LW, 226); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 1; for (i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(30 + i * 60, 248 + (i % 2) * 14); ctx.lineTo(70 + i * 60, 248 + (i % 2) * 14); ctx.stroke(); }
      ctx.strokeStyle = "#1a2236"; ctx.lineWidth = 1.6; ctx.lineCap = "round";
      BIRDS.forEach(function (b) { bird(b[0], b[1], b[2]); });
      ctx.lineCap = "butt";
      /* 새를 세는 사람들 */
      var shown = Math.min(n, 16);
      for (i = 0; i < shown; i++) {
        var px = 22 + i * 21, py = H - 22;
        ctx.fillStyle = "#0e1430"; ctx.beginPath(); ctx.arc(px, py - 16, 4.5, 0, 6.2832); ctx.fill();
        ctx.beginPath(); ctx.roundRect(px - 6, py - 11, 12, 15, [6, 6, 2, 2]); ctx.fill();
        ctx.fillStyle = "#7fd3ff"; ctx.fillRect(px - 4, py - 19, 8, 3);
      }
      ctx.restore();
      K.pill(ctx, "우리 동네 새 세기 · 실제 " + TRUE + "마리", 16, 28, { s: 12.5, c: KC.ink });
      K.pill(ctx, "참가자 " + n + "명", LW - 16, H - 56, { s: 12, a: "right", c: KC.yellow });

      /* ── 오른쪽: 한 사람이 센 값과 평균 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 8 });
      K.pill(ctx, "한 사람이 센 값 (한 점 = 한 사람)", RX + 16, 28, { s: 12.5, c: KC.blue });
      var g = K.chart(ctx, { x: RX + 4, y: 52, w: W - RX - 10, h: H - 58, x0: 20, x1: 220, y0: 0, y1: 10, xt: 5, yt: 1, pl: 20, yf: function () { return ""; }, xl: "센 새의 수(마리)" });
      ctx.fillStyle = ok ? "rgba(63,211,163,.16)" : "rgba(127,211,255,.14)"; ctx.fillRect(g.X(mean - m), g.T, g.X(mean + m) - g.X(mean - m), g.B - g.T);
      for (i = 0; i < n; i++) { var cxp = g.X(COUNTS[i]), cyp = g.B - 12 - (i % 10) * ((g.B - g.T - 24) / 10) - Math.floor(i / 10) * 1.5; K.glow(ctx, cxp, cyp, 3.2, "rgba(160,240,215,.9)", 2.4); }
      K.line(ctx, { x: g.X(TRUE), y: g.T }, { x: g.X(TRUE), y: g.B }, KC.green, 1.6, [5, 4]);
      ctx.save(); ctx.shadowColor = KC.blue; ctx.shadowBlur = 8; K.line(ctx, { x: g.X(mean), y: g.T }, { x: g.X(mean), y: g.B }, KC.blue, 3); ctx.restore();
      var right = mean >= TRUE;
      K.pill(ctx, "평균 " + mean.toFixed(0), g.X(mean) + (right ? 8 : -8), g.T + 40, { s: 11.5, a: right ? "left" : "right", c: KC.blue });
      K.pill(ctx, "실제 " + TRUE, g.X(TRUE) + (right ? -8 : 8), g.T + 14, { s: 11, a: right ? "right" : "left", c: KC.green });
      readout("a-cit-read", [
        ["참가자 수", n + "명", "b"],
        ["평균", mean.toFixed(0) + "마리", "y", "실제 " + TRUE + "마리"],
        ["평균의 오차 범위", "± " + moe(n).toFixed(1) + "%", ok ? "g" : "r", "= 2 × 30% ÷ √" + n]
      ], ok ? [true, "± 10% 안에 들었습니다"] : [false, "아직 ± 10%보다 큽니다"]);
      return ok;
    }
    function update() {
      var ok = draw();
      put("a-cit-info", "한 사람이 센 값은 들쭉날쭉하지만, " + n + "명의 평균은 오차 범위가 <b>± " + moe(n).toFixed(1) + "%</b>로 줄어듭니다. " + (ok ? "± 10% 안에 들었습니다." : "아직 ± 10%보다 큽니다. 참가자를 늘려 보세요."));
      if (!got && n >= 36 && n <= 40) { got = true; window.sthState("citGot", true); window.sthState("citN", n); mission(); }
    }
    function mission() {
      if (!got) return;
      window.sthState("citBest", "시민 과학 참가자 " + (window.sthState("citN") || 36) + "명이면 ± 10%");
      window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("citBest") + ". 오차는 참가자 수의 제곱근에 반비례해 줄어듭니다. 여럿이 함께 모은 자료가 과학의 재료가 되는 것 — 과학기술이 만든 새로운 과학 문화입니다.");
      ep.clear(3); ep.clear(4);
    }
    canvas._redraw = draw;
    $("a-cit-n").addEventListener("input", function (e) { n = +e.target.value; $("a-cit-n-val").textContent = n + "명"; update(); });
    update(); mission();
  })();

  function finish() { window.sthState("r1", "해결 · " + (window.sthState("lvBest") || "") + " / " + (window.sthState("citBest") || "")); }
  function vs() {
    $("e1-vs").innerHTML = "<b>나의 첫 판단</b> " + (window.sthState("quantum") || "기록 없음") + "<br><b>양자 도약</b> " + (window.sthState("lvBest") || "-") + "<br><b>용어 지도</b> " + (window.sthState("termBest") || "-") + "<br><b>시민 과학</b> " + (window.sthState("citBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[과학의 역사와 문화 Ⅲ] 이야기 ① 양자 샴푸의 비밀",
    items: [
      { id: "w2", label: "일상으로 건너가며 뜻이 바뀐 말",
        hint: "용어 지도에서 용어 하나를 골라, 과학에서의 뜻과 일상에서의 쓰임을 나란히 쓰고 어디가 어긋났는지 짚으세요.",
        ph: "고른 용어: (       ) / 과학에서는 … / 일상에서는 … / 어긋난 지점은 …" },
      { id: "e1a", label: "우리 학교 과학 문화 행사 기획", hint: "과학기술이 만든 새로운 문화(과학 유튜브, 시민 과학, 과학 축제 등)를 하나 골라, 우리 학교에서 열 행사를 한 문단으로 기획하세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 같은 ‘라’, 다른 소리
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "사건 파일 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "timbre", title: "음향 담당의 첫 추리",
    question: "피아노와 바이올린이 같은 높이의 ‘라’를 낼 때, 두 소리에서 다른 것은 무엇일까요?",
    options: ["㉠ 기본 진동수", "㉡ 소리의 크기", "㉢ 배음의 세기 분포", "㉣ 소리의 빠르기"],
    onPick: function (i) { window.sthState("timbreOK", i === 2 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 배음 합성 (기존 시뮬레이션) */
  (function () {
    var cv = $("b-c-harm"), ctx = window.setupCanvas(cv), W = cv._w, H = cv._h;
    var N = 8, amp = [1, 0.5, 0.33, 0.25, 0.2, 0.17, 0.14, 0.13], F0 = 440;
    var got = window.sthState("harmGot") || { a: false, b: false }, fromPreset = false;
    var PRESET = {
      pure:   [1, 0, 0, 0, 0, 0, 0, 0],
      saw:    [1, 0.50, 0.33, 0.25, 0.20, 0.17, 0.14, 0.13],
      square: [1, 0, 0.33, 0, 0.20, 0, 0.14, 0],
      clar:   [1, 0.05, 0.60, 0.05, 0.35, 0.05, 0.20, 0.04],
      organ:  [1, 0.85, 0.30, 0.70, 0.15, 0.25, 0.10, 0.40]
    };
    var box = $("b-harm");
    for (var i = 0; i < N; i++) {
      box.insertAdjacentHTML("beforeend",
        '<div class="ctrl-group"><div class="ctrl-label">' + (i + 1) + '배음'
        + '<span class="val" id="bh' + i + '-v">' + Math.round(amp[i] * 100) + '</span></div>'
        + '<input type="range" id="bh' + i + '" min="0" max="100" step="1" value="' + Math.round(amp[i] * 100) + '"></div>');
    }
    function wave(t) { var y = 0; for (var k = 0; k < N; k++) y += amp[k] * Math.sin(2 * Math.PI * (k + 1) * t); return y; }
    function peak() { var m = 0.0001; for (var s = 0; s < 400; s++) m = Math.max(m, Math.abs(wave(s / 400))); return m; }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 오실로스코프 화면 ── */
      var LW = 540, sx = 18, sy = 46, sw = LW - 36, sh = H - 100, i;
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 3 });
      K.pill(ctx, "오실로스코프 · 만들어진 파형 (2주기)", 16, 28, { s: 13, c: KC.blue });
      var bz = ctx.createLinearGradient(0, sy - 8, 0, sy + sh + 8); bz.addColorStop(0, "#3a4250"); bz.addColorStop(1, "#1a1e26");
      ctx.fillStyle = bz; ctx.beginPath(); ctx.roundRect(sx - 8, sy - 8, sw + 16, sh + 16, 12); ctx.fill();
      var sc = ctx.createRadialGradient(sx + sw / 2, sy + sh / 2, 20, sx + sw / 2, sy + sh / 2, sw * .7); sc.addColorStop(0, "#0c2a22"); sc.addColorStop(1, "#03100c");
      ctx.fillStyle = sc; ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, 8); ctx.fill();
      ctx.strokeStyle = "rgba(120,255,200,.10)"; ctx.lineWidth = 1;
      for (i = 1; i < 10; i++) { ctx.beginPath(); ctx.moveTo(sx + sw * i / 10, sy); ctx.lineTo(sx + sw * i / 10, sy + sh); ctx.stroke(); }
      for (i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo(sx, sy + sh * i / 8); ctx.lineTo(sx + sw, sy + sh * i / 8); ctx.stroke(); }
      ctx.strokeStyle = "rgba(120,255,200,.25)"; ctx.beginPath(); ctx.moveTo(sx, sy + sh / 2); ctx.lineTo(sx + sw, sy + sh / 2); ctx.stroke();
      var p = peak(), mid = sy + sh / 2, amp2 = sh / 2 - 12;
      ctx.save(); ctx.strokeStyle = "rgba(180,255,225,.4)"; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.beginPath();
      for (var x2 = 0; x2 <= sw; x2++) { var t2 = (x2 / sw) * 2, y2 = mid - Math.sin(2 * Math.PI * t2) * amp[0] / p * amp2; if (x2 === 0) ctx.moveTo(sx + x2, y2); else ctx.lineTo(sx + x2, y2); }
      ctx.stroke(); ctx.restore();
      ctx.save(); ctx.strokeStyle = "#5affc0"; ctx.lineWidth = 2.6; ctx.lineJoin = "round"; ctx.shadowColor = "#3fd3a3"; ctx.shadowBlur = 12; ctx.beginPath();
      for (var x = 0; x <= sw; x++) { var t = (x / sw) * 2, y = mid - (wave(t) / p) * amp2; if (x === 0) ctx.moveTo(sx + x, y); else ctx.lineTo(sx + x, y); }
      ctx.stroke(); ctx.restore();
      K.pill(ctx, "점선 = 기본음만 있을 때", LW - 16, H - 16, { s: 11, a: "right", c: "#9ff0d4" });
      /* ── 오른쪽: 배음 분석기 ── */
      var RX = LW + 8, RW = W - RX, bx = RX + 20, bw = RW - 40, by = 58, bh = H - 120, barW = bw / N;
      K.stage(ctx, RX, 0, RW, H, "lab", { seed: 6 });
      K.pill(ctx, "배음의 세기", RX + 16, 28, { s: 13, c: KC.blue });
      for (var k = 0; k < N; k++) {
        var h = amp[k] * (bh - 30), cxx = bx + k * barW, top = by + bh - 22 - h;
        var c0 = k === 0 ? "#9fe0ff" : ((k + 1) % 2 === 0 ? "#ffc08a" : "#d6c4ff"), c1 = k === 0 ? "#2a7ad0" : ((k + 1) % 2 === 0 ? "#d0602a" : "#6a4ad0");
        if (h > .5) { var gg = ctx.createLinearGradient(0, top, 0, by + bh - 22); gg.addColorStop(0, c0); gg.addColorStop(1, c1);
          ctx.save(); ctx.shadowColor = c1; ctx.shadowBlur = 10; ctx.fillStyle = gg; ctx.beginPath(); ctx.roundRect(cxx + 4, top, barW - 8, h, [5, 5, 0, 0]); ctx.fill(); ctx.restore(); }
        K.t(ctx, String(k + 1), cxx + barW / 2, by + bh - 6, { s: 11, a: "center", c: KC.mute });
        if (amp[k] > 0.04) K.t(ctx, Math.round((k + 1) * F0) + "", cxx + barW / 2, top - 6, { s: 10, w: "600", a: "center", c: KC.ink });
      }
      K.line(ctx, { x: bx, y: by + bh - 22 }, { x: bx + bw, y: by + bh - 22 }, KC.line, 1.5);
      K.t(ctx, "배음 번호", bx + bw, by + bh + 12, { s: 10.5, a: "right", c: KC.mute });
      K.pill(ctx, "■ 기본음", RX + 16, H - 16, { s: 10.5, c: "#9fe0ff" });
      K.pill(ctx, "■ 짝수 배음", RX + 92, H - 16, { s: 10.5, c: "#ffc08a" });
      K.pill(ctx, "■ 홀수 배음", RX + 190, H - 16, { s: 10.5, c: "#d6c4ff" });
      K.t(ctx, "막대 위 숫자 = 진동수(Hz)", RX + 16, H - 40, { s: 10.5, c: KC.mute });
    }
    function play(pure) {
      var au = actx(); if (!au) return false;
      try {
        var real = new Float32Array(N + 1), imag = new Float32Array(N + 1);
        for (var k = 0; k < N; k++) imag[k + 1] = pure ? (k === 0 ? 1 : 0) : amp[k];
        var w = au.createPeriodicWave(real, imag, { disableNormalization: false });
        var osc = au.createOscillator(), gain = au.createGain();
        osc.setPeriodicWave(w); osc.frequency.value = F0;
        var now = au.currentTime;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.28, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
        osc.connect(gain); gain.connect(au.destination);
        osc.start(now); osc.stop(now + 1.55);
        return true;
      } catch (e) { return false; }
    }
    function oddOnly() { return amp[1] <= 0.05 + 1e-9 && amp[3] <= 0.05 + 1e-9 && amp[5] <= 0.05 + 1e-9 && amp[7] <= 0.05 + 1e-9 && amp[2] >= 0.2 - 1e-9 && amp[4] >= 0.2 - 1e-9; }
    function describe() {
      var even = 0, odd = 0, hi = 0;
      for (var k = 1; k < N; k++) { if ((k + 1) % 2 === 0) even += amp[k]; else odd += amp[k]; if (k >= 4) hi += amp[k]; }
      if (amp.slice(1).every(function (x) { return x < 0.03; })) return "배음이 거의 없는 <b>순음</b>입니다. 소리굽쇠에 가까운, 밋밋하고 맑은 소리가 납니다.";
      if (even < 0.12 && odd > 0.3) return "짝수 배음이 거의 없고 <b>홀수 배음만</b> 있습니다. 클라리넷처럼 속이 빈 듯한 소리가 납니다.";
      if (hi > 0.5) return "높은 배음이 강합니다. <b>날카롭고 거친</b> 소리가 납니다.";
      return "여러 배음이 고르게 섞여 <b>풍성한</b> 소리가 납니다.";
    }
    function refresh() {
      $("b-badge").textContent = "기본 진동수 " + F0 + " Hz (라) · 배음 " + amp.filter(function (x) { return x > 0.03; }).length + "개";
      put("b-info", describe() + " <b>음의 높이는 1배음(440 Hz)이 정합니다.</b> 다른 막대를 아무리 움직여도 ‘라’라는 음 높이는 바뀌지 않고 <b>음색만</b> 바뀝니다." + (oddOnly() && fromPreset && !got.a ? " <b>프리셋을 고른 그대로는 미션으로 치지 않아요.</b> ‘순음’에서 출발해 배음 막대를 직접 움직여 만들어 보세요." : ""));
      draw();
      if (oddOnly() && !fromPreset && !got.a) { got.a = true; window.sthState("harmGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m2-2a"); if (got.b) done("m2-2b");
      if (got.a && got.b) {
        window.sthState("harmBest", "짝수 배음을 뺀 클라리넷 음색");
        window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("harmBest") + ". 같은 높이라도 배음을 어떻게 섞느냐로 악기 소리가 달라집니다. 신시사이저는 바로 이 원리로 소리를 만듭니다.");
        ep.clear(1);
      }
    }
    for (var j = 0; j < N; j++) {
      (function (k) {
        $("bh" + k).addEventListener("input", function () { amp[k] = +this.value / 100; $("bh" + k + "-v").textContent = this.value; fromPreset = false; refresh(); });
      })(j);
    }
    Array.prototype.forEach.call(document.querySelectorAll("#b-preset button"), function (b) {
      b.type = "button";
      b.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#b-preset button"), function (o) { o.classList.remove("on"); });
        b.classList.add("on");
        var p = PRESET[b.getAttribute("data-p")];
        for (var k = 0; k < N; k++) { amp[k] = p[k]; $("bh" + k).value = Math.round(p[k] * 100); $("bh" + k + "-v").textContent = Math.round(p[k] * 100); }
        fromPreset = b.getAttribute("data-p") !== "pure";
        refresh();
      });
    });
    $("b-play").addEventListener("click", function () {
      var ok = play(false);
      if (!ok) put("b-info", "이 브라우저에서는 소리를 만들 수 없습니다. 파형과 막대만으로도 음색의 차이를 볼 수 있습니다.");
      window.sthState("heard", "들어봄");
      if (!got.b) { got.b = true; window.sthState("harmGot", got); mission(); }
    });
    $("b-ref").addEventListener("click", function () { play(true); });
    cv._redraw = draw;
    refresh(); mission();
  })();

  /* 장면 3 — 표본화 */
  (function () {
    var canvas = $("b-c-smp"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, fs = 24, F = 20;
    var got = window.sthState("smpGot") || false;
    function alias() { return F - fs * Math.round(F / fs); }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var x0 = 44, x1 = W - 30, yc = 168, A0 = 100, T = 0.25, i;      /* ms */
      function X(t) { return x0 + t / T * (x1 - x0); }
      var fa = alias(), ok = fs > 2 * F, same = Math.abs(Math.abs(fa) - F) < 0.01;
      K.stage(ctx, 0, 0, W, H, "lab", { seed: 12 });
      K.pill(ctx, "20 kHz 소리를 0.25 ms 동안 재기", 16, 28, { s: 13, c: KC.blue });
      K.pill(ctx, "1초에 " + fs + "천 번 잼", W - 16, 28, { s: 12, a: "right", c: KC.yellow });
      K.line(ctx, { x: x0, y: yc }, { x: x1, y: yc }, KC.line, 1);
      for (i = 0; i <= 5; i++) { var tt = i * 0.05; K.line(ctx, { x: X(tt), y: yc + A0 + 6 }, { x: X(tt), y: yc + A0 + 12 }, KC.mute, 1); K.t(ctx, tt.toFixed(2) + " ms", X(tt), yc + A0 + 26, { s: 10, a: i === 0 ? "left" : i === 5 ? "right" : "center", c: KC.mute }); }
      ctx.save(); ctx.strokeStyle = "rgba(200,210,255,.5)"; ctx.lineWidth = 1.5; ctx.beginPath();
      for (i = 0; i <= 1200; i++) { var t = i / 1200 * T, y = yc - A0 * Math.sin(2 * Math.PI * F * t); if (i) ctx.lineTo(X(t), y); else ctx.moveTo(X(t), y); }
      ctx.stroke(); ctx.restore();
      ctx.save(); ctx.strokeStyle = same ? KC.green : KC.orange; ctx.lineWidth = 3; ctx.shadowColor = same ? KC.green : KC.orange; ctx.shadowBlur = 10; ctx.beginPath();
      for (var j = 0; j <= 1200; j++) { var t2 = j / 1200 * T, y2 = yc - A0 * Math.sin(2 * Math.PI * fa * t2); if (j) ctx.lineTo(X(t2), y2); else ctx.moveTo(X(t2), y2); }
      ctx.stroke(); ctx.restore();
      for (var k = 0; k * (1 / fs) <= T + 1e-9; k++) {
        var ts = k / fs, py = yc - A0 * Math.sin(2 * Math.PI * F * ts);
        K.line(ctx, { x: X(ts), y: yc }, { x: X(ts), y: py }, "rgba(127,211,255,.45)", 1.4);
        K.glow(ctx, X(ts), py, 3.6, "rgba(127,211,255,.98)", 3);
      }
      K.pill(ctx, "— 실제 소리", 16, H - 14, { s: 11, c: "#c8d0ff" });
      K.pill(ctx, "● 잰 값", 120, H - 14, { s: 11, c: KC.blue });
      K.pill(ctx, "— 잰 값으로 되살린 소리 " + Math.abs(fa).toFixed(0) + " kHz", 196, H - 14, { s: 11, c: same ? KC.green : KC.orange });
      readout("b-smp-read", [
        ["표본화 주파수", fs + " kHz", "b", "한 주기에 " + (fs / F).toFixed(2) + "번 잼"],
        ["되살린 소리", Math.abs(fa).toFixed(0) + " kHz", same ? "g" : "r", "CD 음질 = 44.1 kHz"]
      ], ok ? [true, "원래 소리 그대로"] : [false, "다른 소리로 바뀜(겹침)"]);
      return ok;
    }
    function update() {
      var ok = draw(), fa = Math.abs(alias());
      put("b-smp-info", "1초에 " + fs + "천 번 재면 20 kHz 소리가 " + (ok ? "<b>그대로</b> 되살아납니다." : "<b>" + fa.toFixed(0) + " kHz</b>의 다른 소리로 바뀌어 기록됩니다(겹침 현상).") + " 한 주기에 적어도 두 번보다 많이 재야 원래 소리를 되살릴 수 있습니다.");
      if (!got && fs >= 41 && fs <= 45) { got = true; window.sthState("smpGot", true); window.sthState("smpFs", fs); mission(); }
    }
    function mission() {
      if (!got) return;
      window.sthState("smpBest", "20 kHz는 " + (window.sthState("smpFs") || 41) + " kHz 이상으로 표본화");
      window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("smpBest") + ". 들리는 가장 높은 소리의 두 배보다 촘촘히 재야 합니다. 그래서 CD는 44.1 kHz를 씁니다.");
      ep.clear(2);
    }
    canvas._redraw = draw;
    $("b-fs").addEventListener("input", function (e) { fs = +e.target.value; $("b-fs-val").textContent = fs + " kHz"; update(); });
    update(); mission();
  })();

  /* 장면 4 — 인공지능 작곡 (두 음을 보고 다음 음을 고르는 확률 모형) */
  (function () {
    var canvas = $("b-c-ai"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, T = 0.4;
    var got = window.sthState("aiGot") || false;
    var NAMES = ["도", "레", "미", "파", "솔", "라", "시", "도'"];
    var FREQ = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];
    var SONG = "004455433221104433221443322100445543322110".split("").map(Number);
    var C1 = [], C2 = {}, GR = {}, i, k;
    for (i = 0; i < 8; i++) C1.push([0, 0, 0, 0, 0, 0, 0, 0]);
    for (k = 0; k < SONG.length - 1; k++) {
      C1[SONG[k]][SONG[k + 1]]++;
      if (k > 0) { var key = SONG[k - 1] + "" + SONG[k]; (C2[key] = C2[key] || [0, 0, 0, 0, 0, 0, 0, 0])[SONG[k + 1]]++; }
    }
    for (k = 0; k + 3 < SONG.length; k++) GR[SONG.slice(k, k + 4).join("")] = 1;
    function gen(t) {
      var r = mulberry(7), out = [0, 0];
      for (var s = 2; s < 24; s++) {
        var row = C2[out[s - 2] + "" + out[s - 1]] || C1[out[s - 1]];
        var w = row.map(function (c) { return Math.pow(c + 0.15, 1 / t); });
        var tot = w.reduce(function (a, b) { return a + b; }, 0), u = r() * tot, j = 0;
        for (; j < 7; j++) { u -= w[j]; if (u <= 0) break; }
        out.push(j);
      }
      return out;
    }
    function metric(m) {
      var cp = 0, nw = 0, od = 0, copied = [], odd = [];
      for (var q = 0; q < m.length; q++) { copied.push(false); odd.push(false); }
      for (q = 0; q + 3 < m.length; q++) { nw++; if (GR[m.slice(q, q + 4).join("")]) { cp++; copied[q] = copied[q + 1] = copied[q + 2] = copied[q + 3] = true; } }
      for (q = 0; q < m.length - 1; q++) if (!C1[m[q]][m[q + 1]]) { od++; odd[q + 1] = true; }
      return { copy: Math.round(cp / nw * 100), odd: Math.round(od / (m.length - 1) * 100), copied: copied, oddAt: odd };
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var m = gen(T), r = metric(m), x0 = 92, x1 = W - 22, y0 = 52, y1 = H - 58, i;
      var rowH = (y1 - y0) / 8, colW = (x1 - x0) / 24;
      function Yr(nn) { return y1 - (nn + 1) * rowH; }
      K.stage(ctx, 0, 0, W, H, "night", { seed: 26 });
      K.pill(ctx, "인공지능이 만든 24음 멜로디 · 창의성 " + T.toFixed(1), 16, 28, { s: 13, c: KC.blue });
      /* 건반 */
      for (var nn = 0; nn < 8; nn++) {
        var ky = Yr(nn), kg = ctx.createLinearGradient(20, 0, 84, 0); kg.addColorStop(0, "#cfd4e0"); kg.addColorStop(.7, "#f6f7fb"); kg.addColorStop(1, "#b8bed0");
        ctx.fillStyle = kg; ctx.beginPath(); ctx.roundRect(20, ky + 1, 64, rowH - 2, [2, 6, 6, 2]); ctx.fill();
        K.t(ctx, NAMES[nn], 76, ky + rowH / 2 + 4, { s: 10.5, a: "right", c: "#2a3048", w: "800" });
        ctx.fillStyle = nn % 2 ? "rgba(255,255,255,.035)" : "rgba(255,255,255,.015)"; ctx.fillRect(x0, ky, x1 - x0, rowH);
      }
      ctx.strokeStyle = "rgba(160,175,255,.10)"; ctx.lineWidth = 1;
      for (i = 0; i <= 24; i++) { ctx.lineWidth = i % 4 ? 1 : 1.6; ctx.beginPath(); ctx.moveTo(x0 + i * colW, y0); ctx.lineTo(x0 + i * colW, y1); ctx.stroke(); }
      /* 음표 막대 */
      m.forEach(function (nt, q) {
        var c0 = r.oddAt[q] ? "#ff9aa8" : (r.copied[q] ? "#ffe08a" : "#8af0d0"), c1 = r.oddAt[q] ? "#c0304a" : (r.copied[q] ? "#c08a1a" : "#1f8a66");
        var bx = x0 + q * colW + 2, by = Yr(nt) + 3, bw = colW - 4, bh = rowH - 6;
        var g = ctx.createLinearGradient(0, by, 0, by + bh); g.addColorStop(0, c0); g.addColorStop(1, c1);
        ctx.save(); ctx.shadowColor = c1; ctx.shadowBlur = 8; ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 5); ctx.fill(); ctx.restore();
      });
      for (i = 0; i < m.length - 1; i++) {
        var ax = x0 + (i + .5) * colW, ay = Yr(m[i]) + rowH / 2, bx2 = x0 + (i + 1.5) * colW, by2 = Yr(m[i + 1]) + rowH / 2;
        K.line(ctx, { x: ax, y: ay }, { x: bx2, y: by2 }, r.oddAt[i + 1] ? "rgba(255,107,129,.6)" : "rgba(255,255,255,.18)", r.oddAt[i + 1] ? 1.6 : 1);
      }
      K.t(ctx, "시간 →", x1, y1 + 16, { s: 10.5, a: "right", c: KC.mute });
      K.pill(ctx, "■ 배운 곡과 같은 네 음 조각", 20, H - 14, { s: 11, c: "#ffe08a" });
      K.pill(ctx, "■ 배운 적 없는 이음새", 230, H - 14, { s: 11, c: "#ff9aa8" });
      K.pill(ctx, "■ 새로 이어 붙인 부분", 404, H - 14, { s: 11, c: "#8af0d0" });
      var okC = r.copy <= 50, okO = r.odd <= 30;
      readout("b-ai-read", [
        ["창의성", T.toFixed(1), "b"],
        ["베낀 조각", r.copy + "%", okC ? "g" : "r", "기준 50% 이하"],
        ["엉뚱한 이음새", r.odd + "%", okO ? "g" : "r", "기준 30% 이하"]
      ], okC && okO ? [true, "공모전 기준을 모두 지켰습니다"] : [false, r.copy > 50 ? "배운 곡을 거의 베꼈습니다" : "음이 엉뚱하게 튑니다"]);
      return { ok: okC && okO, m: m, r: r };
    }
    function update() {
      var o = draw();
      put("b-ai-info", "창의성 " + T.toFixed(1) + " — 배운 곡과 똑같은 네 음 조각이 <b>" + o.r.copy + "%</b>, 배운 적 없는 이음새가 <b>" + o.r.odd + "%</b>. " +
        (o.r.copy > 50 ? "배운 곡을 거의 그대로 베꼈습니다(표절 위험)." : (o.r.odd > 30 ? "음이 엉뚱하게 튀어 곡처럼 들리지 않습니다." : "✅ 배운 음의 이어짐을 살리면서 새로운 멜로디가 되었습니다.")));
      if (o.ok && !got) { got = true; window.sthState("aiGot", true); window.sthState("aiT", T); mission(); }
    }
    function mission() {
      if (!got) return;
      window.sthState("aiBest", "창의성 " + (+(window.sthState("aiT") || 1.4)).toFixed(1) + " 에서 새 멜로디");
      window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("aiBest") + ". 인공지능 작곡은 배운 곡에서 음의 이어짐을 확률로 익히고, 그 확률을 얼마나 고르게 펴느냐로 ‘베끼기’와 ‘엉뚱함’ 사이를 오갑니다.");
      ep.clear(3); ep.clear(4);
    }
    $("b-ai-play").addEventListener("click", function () {
      var au = actx(); if (!au) { put("b-ai-info", "이 브라우저에서는 소리를 만들 수 없습니다."); return; }
      var m = gen(T), now = au.currentTime + 0.05;
      m.forEach(function (nt, q) {
        var o = au.createOscillator(), g = au.createGain();
        o.type = "triangle"; o.frequency.value = FREQ[nt];
        g.gain.setValueAtTime(0.0001, now + q * 0.28);
        g.gain.exponentialRampToValueAtTime(0.25, now + q * 0.28 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + q * 0.28 + 0.26);
        o.connect(g); g.connect(au.destination); o.start(now + q * 0.28); o.stop(now + q * 0.28 + 0.27);
      });
    });
    canvas._redraw = draw;
    $("b-t").addEventListener("input", function (e) { T = Math.round(+e.target.value * 10) / 10; $("b-t-val").textContent = T.toFixed(1); update(); });
    update(); mission();
  })();

  function finish() { window.sthState("r2", "해결 · " + (window.sthState("harmBest") || "") + " / " + (window.sthState("smpBest") || "") + " / " + (window.sthState("aiBest") || "")); }
  function vs() {
    $("e2-vs").innerHTML = "<b>나의 첫 추리</b> " + (window.sthState("timbre") || "기록 없음") + "<br><b>음색</b> " + (window.sthState("harmBest") || "-") + "<br><b>디지털 녹음</b> " + (window.sthState("smpBest") || "-") + "<br><b>인공지능 작곡</b> " + (window.sthState("aiBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[과학의 역사와 문화 Ⅲ] 이야기 ② 같은 ‘라’, 다른 소리",
    items: [
      { id: "w1", label: "같은 음인데 다르게 들리는 까닭",
        hint: "1배음만 남긴 소리와 여러 배음을 섞은 소리를 각각 들어 보고, 무엇이 같고 무엇이 달랐는지 쓰세요.",
        ph: "같은 것: 음의 높이(       ) / 다른 것: (       )" },
      { id: "e2a", label: "인공지능이 만든 곡의 저작자", hint: "인공지능이 배운 곡과 비슷한 곡을 만들었을 때 생길 수 있는 문제와, 그 곡의 저작자를 누구로 볼지 자기 생각을 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ③ 멀미 나는 가상 교실
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep3", key: "ep3", name: "사건 파일 ③", onDone: finish });

  window.sthGate({
    gate: "g3", key: "vr1", title: "기기 담당의 첫 추리",
    question: "가상현실 기기를 쓰면 멀미가 나는 가장 큰 까닭은 무엇일까요?",
    options: ["㉠ 화면이 너무 밝아서", "㉡ 눈이 보는 움직임과 몸(귓속 전정 기관)이 느끼는 움직임이 어긋나서", "㉢ 기기가 무거워서"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 몰입의 조건 (기존 시뮬레이션) */
  (function () {
    var cv = $("c-c-vr"), ctx = window.setupCanvas(cv), W = cv._w, H = cv._h;
    var fov = 60, lat = 40, HUMAN = 200, HEADSPEED = 200;
    var got = window.sthState("vrGot") || { a: false, b: false };
    function lagAngle() { return HEADSPEED * lat / 1000; }
    function risk() {
      var d = lagAngle();
      if (d < 3) return { n: "낮음", c: "--green-700" };
      if (d < 6) return { n: "보통", c: "--amber-700" };
      if (d < 12) return { n: "높음", c: "--coral-700" };
      return { n: "매우 높음", c: "--rose-700" };
    }
    function rcol(n) { return n === "낮음" ? KC.green : n === "보통" ? KC.yellow : n === "높음" ? KC.orange : KC.red; }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var i;
      /* ── 왼쪽: 위에서 본 머리와 시야 ── */
      var LW = 524, cx = 262, cy = H - 92, R = 250;
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 9 });
      K.pill(ctx, "위에서 본 시야", 16, 28, { s: 13, c: KC.blue });
      function fan(deg, fill, stroke) {
        var half = deg / 2 * Math.PI / 180;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, -Math.PI / 2 - half, -Math.PI / 2 + half); ctx.closePath();
        ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
      }
      fan(HUMAN, "rgba(220,225,255,.10)", "rgba(220,225,255,.35)");
      var fg = ctx.createRadialGradient(cx, cy, 20, cx, cy, R); fg.addColorStop(0, "rgba(127,211,255,.55)"); fg.addColorStop(1, "rgba(127,211,255,.12)");
      ctx.save(); ctx.shadowColor = KC.blue; ctx.shadowBlur = 12; fan(fov, fg, KC.blue); ctx.restore();
      ctx.strokeStyle = "rgba(220,225,255,.45)"; ctx.lineWidth = 1.2;
      for (var d = -100; d <= 100; d += 20) { var a = (-90 + d) * Math.PI / 180; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (R - 10), cy + Math.sin(a) * (R - 10)); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke(); }
      /* 머리(위에서) + 헤드셋 */
      ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.beginPath(); ctx.ellipse(cx + 3, cy + 5, 26, 30, 0, 0, 6.2832); ctx.fill();
      var hg = ctx.createRadialGradient(cx - 6, cy - 4, 4, cx, cy, 30); hg.addColorStop(0, "#5a4030"); hg.addColorStop(1, "#24160e");
      ctx.fillStyle = hg; ctx.beginPath(); ctx.ellipse(cx, cy, 24, 28, 0, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#f0c8a0"; ctx.beginPath(); ctx.ellipse(cx - 25, cy + 2, 4, 7, 0, 0, 6.2832); ctx.ellipse(cx + 25, cy + 2, 4, 7, 0, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "#2a2f3a"; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(cx, cy + 2, 26, 24, 0, 0, 6.2832); ctx.stroke();
      var vg = ctx.createLinearGradient(cx - 26, 0, cx + 26, 0); vg.addColorStop(0, "#3a4150"); vg.addColorStop(.5, "#8a94a8"); vg.addColorStop(1, "#2a2f3a");
      ctx.fillStyle = vg; ctx.beginPath(); ctx.roundRect(cx - 26, cy - 40, 52, 18, 7); ctx.fill();
      ctx.fillStyle = "rgba(127,211,255,.7)"; ctx.fillRect(cx - 18, cy - 24, 36, 2);
      K.pill(ctx, "사람 시야 " + HUMAN + "°", cx, cy - R - 22, { s: 11.5, a: "center", c: KC.ink });
      K.pill(ctx, "기기 시야 " + fov + "°", cx, cy - R + 6 + (fov > 150 ? 0 : 0) + 18, { s: 13, a: "center", c: KC.blue });
      K.pill(ctx, "관측자", cx, cy + 50, { s: 11.5, a: "center", c: KC.ink });
      /* ── 오른쪽: 헤드셋 화면 ── */
      var RX = LW + 8, RW = W - RX;
      K.stage(ctx, RX, 0, RW, H, "lab", { seed: 3 });
      K.pill(ctx, "고개를 돌릴 때 화면이 밀리는 정도", RX + 16, 28, { s: 12.5, c: KC.blue });
      var bx = RX + 22, by = 70, bw = RW - 44, bh = 270, mid = by + bh / 2, half = bw / 2 - 20;
      var shift = Math.min(half - 12, lagAngle() / 20 * half), r2 = risk(), rc = rcol(r2.n);
      ctx.fillStyle = "#1c2030"; ctx.beginPath(); ctx.roundRect(bx - 10, by - 10, bw + 20, bh + 20, 26); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 18); ctx.clip();
      ctx.fillStyle = "#0a0e1e"; ctx.fillRect(bx, by, bw, bh);
      /* 가상 교실(뒤처진 그림) */
      ctx.save(); ctx.translate(-shift, 0);
      var wl = ctx.createLinearGradient(0, by, 0, by + bh * .62); wl.addColorStop(0, "#3a4a6a"); wl.addColorStop(1, "#2a3450");
      ctx.fillStyle = wl; ctx.fillRect(bx - 60, by, bw + 120, bh * .62);
      ctx.fillStyle = "#4a3a2a"; ctx.fillRect(bx - 60, by + bh * .62, bw + 120, bh * .38);
      ctx.strokeStyle = "rgba(255,220,180,.15)"; ctx.lineWidth = 1;
      for (i = -6; i <= 6; i++) { ctx.beginPath(); ctx.moveTo(bx + bw / 2 + i * 30, by + bh * .62); ctx.lineTo(bx + bw / 2 + i * 90, by + bh); ctx.stroke(); }
      ctx.fillStyle = "#6a4a2a"; ctx.fillRect(bx + bw / 2 - 92, by + 34, 184, 100);
      ctx.fillStyle = "#1f4a38"; ctx.fillRect(bx + bw / 2 - 86, by + 40, 172, 88);
      ctx.strokeStyle = "rgba(240,240,220,.7)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx + bw / 2 - 60, by + 70); ctx.lineTo(bx + bw / 2 + 20, by + 70); ctx.moveTo(bx + bw / 2 - 60, by + 92); ctx.lineTo(bx + bw / 2 + 50, by + 92); ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "rgba(0,0,0,.0)";
      var lg = ctx.createRadialGradient(bx + bw / 2, mid, bh * .2, bx + bw / 2, mid, bw * .7); lg.addColorStop(0, "rgba(0,0,0,0)"); lg.addColorStop(1, "rgba(0,0,0,.55)");
      ctx.fillStyle = lg; ctx.fillRect(bx, by, bw, bh);
      ctx.restore();
      /* 실제 바라보는 곳 · 20 ms 기준 · 밀린 폭 */
      K.line(ctx, { x: bx + bw / 2, y: by + 18 }, { x: bx + bw / 2, y: by + bh - 18 }, "rgba(255,255,255,.7)", 1.4, [5, 4]);
      K.pill(ctx, "실제 바라보는 곳", bx + bw / 2, by - 16, { s: 11, a: "center", c: KC.ink });
      var ref = 200 * 20 / 1000 / 20 * half;
      K.line(ctx, { x: bx + bw / 2 - ref, y: by + 24 }, { x: bx + bw / 2 - ref, y: by + bh - 24 }, KC.yellow, 2, [6, 4]);
      K.pill(ctx, "20 ms 기준", bx + bw / 2 - ref - 6, by + bh - 30, { s: 10.5, a: "right", c: KC.yellow, box: [bx, bx + bw] });
      ctx.fillStyle = rc; ctx.globalAlpha = .22; ctx.fillRect(bx + bw / 2 - shift, mid - 62, shift, 124); ctx.globalAlpha = 1;
      ctx.save(); ctx.shadowColor = rc; ctx.shadowBlur = 10; K.line(ctx, { x: bx + bw / 2 - shift, y: mid - 62 }, { x: bx + bw / 2 - shift, y: mid + 62 }, rc, 3); ctx.restore();
      if (shift > 4) K.arrow(ctx, { x: bx + bw / 2 - 4, y: mid + 74 }, { x: bx + bw / 2 - shift + 2, y: mid + 74 }, rc, 2, 8);
      K.pill(ctx, lagAngle().toFixed(1) + "° 뒤처짐 · 멀미 " + r2.n, bx + bw / 2, H - 22, { s: 13, a: "center", c: rc, box: [RX, W] });
      K.pill(ctx, "고개를 1초에 200° 돌릴 때", bx + bw / 2, H - 54, { s: 10.5, a: "center", c: KC.mute, box: [RX, W] });
    }
    function refresh() {
      var cov = Math.min(1, fov / HUMAN), r2 = risk(), ch = false;
      $("c-fv").textContent = fov + "°"; $("c-lv").textContent = lat + " ms";
      $("c-cov").textContent = Math.round(cov * 100) + "%"; $("c-lag").textContent = lagAngle().toFixed(1) + "°"; $("c-sick").textContent = r2.n;
      var msg = "시야를 <b>" + Math.round(cov * 100) + "%</b> 덮고 있습니다. ";
      if (cov < 0.4) msg += "화면 바깥의 현실이 계속 보여 <b>‘창문으로 보는 느낌’</b>에 가깝습니다. ";
      else if (cov < 0.75) msg += "요즘 나오는 기기들이 대체로 이 범위(90~110°)에 있습니다. ";
      else msg += "사람 시야를 거의 다 덮어 <b>바깥이 보이지 않습니다.</b> ";
      msg += "지연 " + lat + " ms는 고개를 빠르게 돌릴 때 화면이 <b>" + lagAngle().toFixed(1) + "° 뒤처진다</b>는 뜻이고, 멀미 위험은 <b>" + r2.n + "</b>입니다.";
      if (lat > 20) msg += " 20 ms를 넘으면 눈이 보는 것과 몸이 느끼는 것이 어긋나 어지러워집니다.";
      put("c-vr-info", msg);
      draw();
      if (!got.a && lat === 14) { got.a = ch = true; }
      if (!got.b && fov === 100) { got.b = ch = true; }
      if (ch) { window.sthState("vrGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m3-2a"); if (got.b) done("m3-2b");
      if (got.a && got.b) {
        window.sthState("vrBest", "지연 14 ms 이하 · 시야 100° 이상");
        window.sthMission("m3-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("vrBest") + ". 화면이 고개를 빨리 따라올수록, 시야를 넓게 덮을수록 눈과 몸의 어긋남이 줄어듭니다.");
        ep.clear(1);
      }
    }
    $("c-f").addEventListener("input", function () { fov = +this.value; refresh(); });
    $("c-l").addEventListener("input", function () { lat = +this.value; refresh(); });
    cv._redraw = draw;
    refresh(); mission();
  })();

  /* 장면 3 — 원격 조종 */
  (function () {
    var canvas = $("c-c-tele"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, d = 300;
    var got = window.sthState("teleGot") || { a: false, q: false };
    var CITY = [["부산", 325], ["도쿄", 1160], ["베이징", 950], ["싱가포르", 4650], ["뉴욕", 11000]];
    function rtt(dd) { return 2 * dd / 200000 * 1000 + 5; }
    var ph = 0, play = null;
    function robot(x, y, col) {
      ctx.save(); ctx.lineCap = "round";
      var bg = ctx.createLinearGradient(x - 14, 0, x + 14, 0); bg.addColorStop(0, "#5a6478"); bg.addColorStop(.5, "#c8d0e0"); bg.addColorStop(1, "#3a4252");
      ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(x - 14, y - 10, 28, 10, 3); ctx.fill();
      ctx.strokeStyle = "#aeb8cc"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.lineTo(x - 8, y - 34); ctx.lineTo(x + 12, y - 50); ctx.stroke();
      K.planet(ctx, x - 8, y - 34, 4.5, "#e0e6f0", "#4a5262"); K.planet(ctx, x, y - 10, 4.5, "#e0e6f0", "#4a5262");
      ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x + 12, y - 50); ctx.lineTo(x + 20, y - 46); ctx.moveTo(x + 12, y - 50); ctx.lineTo(x + 16, y - 58); ctx.stroke();
      ctx.restore();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var x0 = 74, x1 = W - 40, fy = 150, t = rtt(d), ok = t <= 20 + 1e-9, i;
      function X(dd) { return x0 + Math.sqrt(dd / 12000) * (x1 - x0); }
      K.stage(ctx, 0, 0, W, H, "night", { seed: 30 });
      K.pill(ctx, "서울에서 떨어진 거리 (가로는 제곱근 눈금)", 16, 28, { s: 13, c: KC.blue });
      var zg = ctx.createLinearGradient(0, fy - 20, 0, fy + 20); zg.addColorStop(0, "rgba(63,211,163,0)"); zg.addColorStop(.5, "rgba(63,211,163,.28)"); zg.addColorStop(1, "rgba(63,211,163,0)");
      ctx.fillStyle = zg; ctx.fillRect(x0, fy - 20, X(1500) - x0, 40);
      K.pill(ctx, "왕복 20 ms 안", x0 + 6, fy + 40, { s: 10.5, c: KC.green });
      ctx.save(); ctx.strokeStyle = "rgba(127,211,255,.85)"; ctx.lineWidth = 3; ctx.shadowColor = KC.blue; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.moveTo(x0, fy); ctx.lineTo(x1, fy); ctx.stroke(); ctx.restore();
      [1000, 4000, 9000].forEach(function (dd) { K.line(ctx, { x: X(dd), y: fy - 6 }, { x: X(dd), y: fy + 6 }, KC.mute, 1); });
      CITY.forEach(function (c, j) { K.glow(ctx, X(c[1]), fy, 2.5, "rgba(220,230,255,.9)", 3); K.pill(ctx, c[0] + " " + c[1].toLocaleString() + " km", X(c[1]), fy + (j % 2 ? 98 : 72), { s: 10.5, a: "center", c: KC.mute }); });
      /* 서울의 조종석 */
      ctx.fillStyle = "#2a3048"; ctx.beginPath(); ctx.roundRect(x0 - 24, fy - 30, 30, 22, 4); ctx.fill();
      ctx.fillStyle = "rgba(127,211,255,.8)"; ctx.fillRect(x0 - 21, fy - 27, 24, 14);
      ctx.fillStyle = "#e8d6b0"; ctx.beginPath(); ctx.arc(x0 + 14, fy - 40, 6, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#3a4a7a"; ctx.beginPath(); ctx.roundRect(x0 + 6, fy - 33, 16, 22, [7, 7, 2, 2]); ctx.fill();
      K.pill(ctx, "서울 · 조종하는 사람", x0 - 10, fy - 54, { s: 11, c: KC.ink });
      /* 로봇과 신호 */
      var rx = X(d);
      robot(rx, fy - 4, ok ? KC.green : KC.red);
      var u = ph % 1, px = u < .5 ? x0 + (rx - x0) * (u / .5) : rx - (rx - x0) * ((u - .5) / .5);
      if (rx - x0 > 4) K.glow(ctx, px, fy, 4, u < .5 ? "rgba(255,211,107,.98)" : "rgba(127,211,255,.98)", 3.6);
      var lab = u < .5 ? "명령 →" : "← 영상";
      if (rx - x0 > 60) K.t(ctx, lab, px, fy - 14, { s: 10.5, a: "center", c: u < .5 ? KC.yellow : KC.blue });
      K.pill(ctx, "로봇 " + d.toLocaleString() + " km", rx, fy - 70, { s: 11.5, a: "center", c: ok ? KC.green : KC.red, box: [180, W] });
      /* 아래: 왕복 지연 막대 */
      var bx0 = 170, bx1 = W - 40, by = H - 46;
      function B(ms) { return bx0 + Math.min(ms, 130) / 130 * (bx1 - bx0); }
      K.t(ctx, "왕복 지연", bx0 - 12, by + 11, { s: 12, a: "right", c: KC.ink, w: "800" });
      ctx.fillStyle = "rgba(255,255,255,.07)"; ctx.beginPath(); ctx.roundRect(bx0, by, bx1 - bx0, 14, 7); ctx.fill();
      var gb = ctx.createLinearGradient(bx0, 0, B(t), 0); gb.addColorStop(0, ok ? "#1f8a66" : "#a0304a"); gb.addColorStop(1, ok ? "#7ff0c4" : "#ff9aa8");
      ctx.save(); ctx.shadowColor = ok ? KC.green : KC.red; ctx.shadowBlur = 8; ctx.fillStyle = gb; ctx.beginPath(); ctx.roundRect(bx0, by, Math.max(8, B(t) - bx0), 14, 7); ctx.fill(); ctx.restore();
      K.line(ctx, { x: B(20), y: by - 6 }, { x: B(20), y: by + 20 }, KC.yellow, 2);
      K.t(ctx, "20 ms", B(20), by + 32, { s: 10.5, a: "center", c: KC.yellow });
      K.t(ctx, "0", bx0, by + 32, { s: 10, a: "center", c: KC.mute }); K.t(ctx, "130 ms", bx1, by + 32, { s: 10, a: "right", c: KC.mute });
      readout("c-tele-read", [
        ["거리", d.toLocaleString() + " km", "b"],
        ["왕복 지연", t.toFixed(1) + " ms", ok ? "g" : "r", "= 2 × 거리 ÷ 20만 km/s + 처리 5 ms"]
      ], ok ? [true, "손처럼 조종할 수 있습니다"] : [false, "손과 로봇이 어긋납니다"]);
      return ok;
    }
    function update() {
      var ok = draw();
      put("c-tele-info", d.toLocaleString() + " km 떨어진 로봇까지 명령이 갔다가 영상이 돌아오는 데 <b>" + rtt(d).toFixed(1) + " ms</b>가 걸립니다. " + (ok ? "20 ms 안이라 손처럼 부드럽게 조종할 수 있습니다." : "20 ms를 넘어 조종이 굼뜨고 위험해집니다."));
      if (!got.a && d === 1500) { got.a = true; window.sthState("teleGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m3-3a"); if (got.q) done("m3-3b");
      if (got.a && got.q) {
        window.sthState("teleBest", "원격 조종은 약 1500 km까지");
        window.sthMission("m3-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("teleBest") + ". 빛의 속력조차 거리 앞에서는 느립니다. 그래서 계산을 사용자 가까이에서 처리하는 기술이 함께 발전합니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    play = playBtn("c-tele-play", canvas, "신호");
    K.animate(canvas, function (dt) { if (play.on) { ph += dt / Math.max(900, rtt(d) * 60); draw(); } });
    $("c-d").addEventListener("input", function (e) { d = +e.target.value; $("c-d-val").textContent = d.toLocaleString() + " km"; update(); });
    window.sthPick({
      mount: "c-tele-pick",
      q: "서울의 의사가 뉴욕(약 11,000 km)의 수술 로봇을 손처럼 조종할 수 있을까요?",
      options: ["통신이 빠르니 문제없다", "왕복 지연이 100 ms를 넘어 손처럼 조종하기 어렵다 — 빛의 속력이라는 한계가 있다", "거리와 지연은 관계없다"],
      answer: 1,
      why: ["광섬유 속 빛도 1초에 약 20만 km 밖에 못 갑니다.", "2 × 11,000 ÷ 200,000 초 = 110 ms에 처리 시간까지 더해집니다. 아무리 기술이 좋아져도 빛보다 빠를 수는 없습니다.", "신호가 가는 시간은 거리에 비례합니다."],
      onDone: function () { got.q = true; window.sthState("teleGot", got); mission(); }
    });
    update(); mission();
  })();

  window.sthSort({
    mount: "c-sort",
    buckets: [{ id: "vr", label: "🥽 가상현실 (VR)", sub: "눈앞을 가상 세계로" }, { id: "ar", label: "📱 증강현실 (AR)", sub: "현실 위에 정보를 겹쳐" }, { id: "iot", label: "🔗 사물 인터넷 · 초연결", sub: "사물끼리 자료를 주고받아" }],
    items: [
      { t: "조종사가 실제 비행기 없이 비상 착륙을 연습하는 훈련 장치", a: "vr", why: "위험한 상황을 안전하게 되풀이 연습합니다." },
      { t: "높은 곳을 무서워하는 사람이 가상의 높은 다리를 조금씩 건너 보는 치료", a: "vr", why: "노출 치료에 쓰입니다." },
      { t: "소방관이 연기로 가득 찬 건물 속 구조를 연습하는 교육", a: "vr", why: "실제로 재현하기 어려운 현장입니다." },
      { t: "휴대 전화 카메라로 방을 비추면 사려는 소파가 방 안에 놓여 보이는 앱", a: "ar", why: "진짜 방 위에 가상 가구를 겹칩니다." },
      { t: "수술 중 환자 몸 위에 혈관 위치를 겹쳐 보여 주는 안경", a: "ar", why: "현실을 보면서 정보를 더합니다." },
      { t: "거리를 비추면 길 안내 화살표가 도로 위에 떠 보이는 내비게이션", a: "ar", why: "현실 풍경 위에 화살표를 얹습니다.", hint: "현실을 그대로 보면서 무엇을 덧붙이나요?" },
      { t: "비닐하우스의 센서가 온도를 재 창문을 스스로 여닫는 스마트 팜", a: "iot", why: "사물이 스스로 재고 판단합니다." },
      { t: "심장 박동이 이상하면 손목시계가 가족에게 알림을 보내는 서비스", a: "iot", why: "사람의 몸과 기계가 연결됩니다." },
      { t: "차량 수를 감지해 신호등 시간을 바꾸는 교차로", a: "iot", why: "도시의 사물이 서로 연결됩니다." },
      { t: "집 밖에서 휴대 전화로 보일러와 조명을 켜는 스마트 홈", a: "iot", why: "사람과 사물을 멀리서 잇습니다." }
    ],
    onDone: function () { window.sthMission("m3-4", true, "<span class='m-tag'>미션 완료</span>가상과 현실, 사람과 사물을 잇는 기술은 훈련·치료·생활 곳곳으로 퍼지고 있습니다. 그만큼 멀미, 비용, 개인 정보 같은 한계도 함께 살펴야 합니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m3-4", true);

  function finish() { window.sthState("r3", "해결 · " + (window.sthState("vrBest") || "") + " / " + (window.sthState("teleBest") || "")); }
  function vs() {
    $("e3-vs").innerHTML = "<b>나의 첫 추리</b> " + (window.sthState("vr1") || "기록 없음") + "<br><b>몰입의 조건</b> " + (window.sthState("vrBest") || "-") + "<br><b>원격 조종</b> " + (window.sthState("teleBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk3", unitLabel: "[과학의 역사와 문화 Ⅲ] 이야기 ③ 멀미 나는 가상 교실",
    items: [
      { id: "w3", label: "가상현실이 어지러운 까닭",
        hint: "지연을 20 ms 앞뒤로 바꿔 보고, 왜 20 ms가 기준이 되는지 눈과 몸의 감각으로 설명하세요.", ph: "" },
      { id: "e3a", label: "10년 뒤의 초연결 학교", hint: "사람과 기계, 사물을 잇는 기술이 10년 뒤 우리 학교의 하루를 어떻게 바꿀지 예측하고, 그때 생길 수 있는 한계나 문제도 하나 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ④ 풍력 발전기가 들어온다면
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep4", key: "ep4", name: "사건 파일 ④", onDone: finish });

  window.sthGate({
    gate: "g4", key: "deli", title: "진행자의 첫 판단",
    question: "과학기술과 관련된 마을의 문제를 정할 때 가장 알맞은 방법은?",
    options: ["㉠ 전문가가 모두 정한다", "㉡ 인터넷 투표로 빨리 정한다", "㉢ 정확한 정보를 바탕으로 여러 사람이 충분히 토론한 뒤 함께 정한다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 소음과 거리 */
  (function () {
    var canvas = $("d-c-noise"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, r = 150;
    var got = window.sthState("noiseGot") || { a: false, q: false };
    function Lp(rr) { return 107 - 20 * Math.log(rr) / Math.LN10 - 11; }
    var rot = 0.4, wph = 0, play = null;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var L = Lp(r), ok = L <= 45 + 1e-9, i;
      /* ── 왼쪽: 발전기와 집 ── */
      var LW = 480, gy = 272, tx = 66, hy = 104;
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 7 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var sk = ctx.createLinearGradient(0, 0, 0, gy); sk.addColorStop(0, "#101a40"); sk.addColorStop(.7, "#3a3a6a"); sk.addColorStop(1, "#7a5a6a"); ctx.fillStyle = sk; ctx.fillRect(0, 0, LW, gy);
      ctx.fillStyle = "#1e2a26"; ctx.beginPath(); ctx.moveTo(0, gy); for (i = 0; i <= 16; i++) ctx.lineTo(i * 32, gy - 16 - Math.abs(Math.sin(i * .9)) * 22); ctx.lineTo(LW, gy); ctx.closePath(); ctx.fill();
      var gd = ctx.createLinearGradient(0, gy, 0, H); gd.addColorStop(0, "#2a3a22"); gd.addColorStop(1, "#141c10"); ctx.fillStyle = gd; ctx.fillRect(0, gy, LW, H - gy);
      /* 소리 물결 */
      for (i = 0; i < 5; i++) { var rr = ((wph + i / 5) % 1) * 420; ctx.strokeStyle = "rgba(255,211,107," + (0.35 * (1 - rr / 420)) + ")"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(tx, hy, rr, -0.9, 0.9); ctx.stroke(); }
      ctx.restore();
      /* 탑과 날개 */
      var tg = ctx.createLinearGradient(tx - 6, 0, tx + 6, 0); tg.addColorStop(0, "#9aa4b8"); tg.addColorStop(.5, "#f2f5fb"); tg.addColorStop(1, "#7a8498");
      ctx.fillStyle = tg; ctx.beginPath(); ctx.moveTo(tx - 7, gy); ctx.lineTo(tx - 3, hy); ctx.lineTo(tx + 3, hy); ctx.lineTo(tx + 7, gy); ctx.closePath(); ctx.fill();
      for (i = 0; i < 3; i++) {
        var a = rot + i * 2.0944;
        ctx.save(); ctx.translate(tx, hy); ctx.rotate(a);
        var bgr = ctx.createLinearGradient(0, -5, 0, 5); bgr.addColorStop(0, "#ffffff"); bgr.addColorStop(1, "#aab4c8");
        ctx.fillStyle = bgr; ctx.beginPath(); ctx.moveTo(0, -4); ctx.quadraticCurveTo(40, -7, 72, -1); ctx.lineTo(72, 1); ctx.quadraticCurveTo(40, 4, 0, 4); ctx.closePath(); ctx.fill(); ctx.restore();
      }
      K.planet(ctx, tx, hy, 6, "#f2f5fb", "#6a7488");
      /* 집 */
      var hx = tx + 34 + (r - 100) / 1400 * 340, hw = 36;
      ctx.fillStyle = "#c8a070"; ctx.fillRect(hx - hw / 2, gy - 28, hw, 28);
      ctx.fillStyle = "#8a3a2a"; ctx.beginPath(); ctx.moveTo(hx - hw / 2 - 5, gy - 28); ctx.lineTo(hx, gy - 48); ctx.lineTo(hx + hw / 2 + 5, gy - 28); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(255,220,140,.9)"; ctx.fillRect(hx - 10, gy - 20, 8, 8); ctx.fillStyle = "#5a3a20"; ctx.fillRect(hx + 4, gy - 18, 8, 18);
      K.bracket(ctx, tx, hx, gy + 14, KC.mute, r + " m", false);
      K.pill(ctx, "집 앞 " + L.toFixed(1) + " dB", hx, gy - 60, { s: 12, a: "center", c: ok ? KC.green : KC.red, box: [0, LW] });
      K.pill(ctx, "풍력 발전기 · 107 dB(A)", 16, 28, { s: 13, c: KC.blue });
      /* ── 오른쪽: 거리에 따른 소음 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 5 });
      K.pill(ctx, "거리에 따른 집 앞 소음", RX + 16, 28, { s: 13, c: KC.blue });
      var g = K.chart(ctx, { x: RX + 4, y: 48, w: W - RX - 10, h: H - 54, x0: 100, x1: 1500, y0: 30, y1: 70, xt: 7, yt: 4, xl: "거리(m)", yl: "소음(dB)" });
      ctx.save(); ctx.strokeStyle = KC.red; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(g.L, g.Y(45)); ctx.lineTo(g.R, g.Y(45)); ctx.stroke(); ctx.restore();
      K.pill(ctx, "밤 기준 45 dB", g.R - 4, g.Y(45) - 9, { s: 10.5, a: "right", c: KC.red });
      var pts = []; for (var q = 100; q <= 1500; q += 10) pts.push([q, Lp(q)]);
      K.plot(ctx, g, pts, KC.blue);
      K.line(ctx, { x: g.X(r), y: g.B }, { x: g.X(r), y: g.Y(L) }, "rgba(255,255,255,.35)", 1, [3, 3]);
      K.glow(ctx, g.X(r), g.Y(L), 4.5, ok ? "rgba(127,240,196,.98)" : "rgba(255,154,168,.98)", 3.5);
      readout("d-noise-read", [
        ["발전기–집 거리", r + " m", "b"],
        ["집 앞 소음", L.toFixed(1) + " dB", ok ? "g" : "r", "= 107 − 20 log(거리) − 11"]
      ], ok ? [true, "밤에도 잠을 방해하지 않습니다"] : [false, "밤 기준(45 dB)을 넘습니다"]);
      return ok;
    }
    function update() {
      var ok = draw();
      put("d-noise-info", "발전기에서 " + r + " m 떨어진 집 앞의 소음은 약 <b>" + Lp(r).toFixed(1) + " dB</b>입니다. " + (ok ? "밤 기준(45 dB) 안입니다." : "밤 기준(45 dB)을 넘습니다."));
      if (!got.a && r >= 360 && r <= 380) { got.a = true; window.sthState("noiseGot", got); window.sthState("noiseR", r); mission(); }
    }
    function mission() {
      if (got.a) done("m4-2a"); if (got.q) done("m4-2b");
      if (got.a && got.q) {
        window.sthState("noiseBest", "발전기는 집에서 " + (window.sthState("noiseR") || 360) + " m 이상");
        window.sthMission("m4-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("noiseBest") + ". 거리가 두 배가 되면 소음은 약 6 dB 줄어듭니다. 이 숫자가 토론의 공통 출발점이 됩니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    play = playBtn("d-noise-play", canvas, "날개");
    K.animate(canvas, function (dt) { if (play.on) { rot += dt * 0.0018; wph = (wph + dt / 2400) % 1; draw(); } });
    $("d-r").addEventListener("input", function (e) { r = +e.target.value; $("d-r-val").textContent = r + " m"; update(); });
    window.sthPick({
      mount: "d-noise-pick",
      q: "그래프로 보면, 발전기와 집 사이의 거리가 두 배가 되면 소음은 어떻게 될까요?",
      options: ["절반(dB 값이 반)이 된다", "약 6 dB 줄어든다", "변하지 않는다"],
      answer: 1,
      why: ["dB는 로그 눈금이라 값이 반으로 줄지 않습니다.", "20 × log 2 ≈ 6. 소리가 넓게 퍼지면서 거리가 두 배일 때마다 약 6 dB씩 줄어듭니다.", "그래프가 거리에 따라 내려갑니다."],
      onDone: function () { got.q = true; window.sthState("noiseGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 함께 정하기 (기존 시뮬레이션) */
  (function () {
    var cv = $("d-c-op"), ctx = window.setupCanvas(cv), W = cv._w, H = cv._h;
    var rounds = 0, mode = "delib", NP = 120;
    var got = window.sthState("opGot") || { a: false, b: false };
    var INIT = (function () { var r = mulberry(777), a = [];
      for (var i = 0; i < NP; i++) { var u = r(); a.push(u < 0.5 ? -1 + Math.pow(r(), 1.4) * 1.1 : 1 - Math.pow(r(), 1.4) * 1.1); }
      return a; })();
    function simulate() {
      var a = INIT.slice(), r = mulberry(1234);
      for (var n = 0; n < rounds; n++) {
        var next = a.slice();
        for (var i = 0; i < NP; i++) {
          var partners = [], tries = 0;
          while (partners.length < 5 && tries < 60) {
            var j = Math.floor(r() * NP); tries++;
            if (j === i) continue;
            if (mode === "bubble" && Math.abs(a[j] - a[i]) > 0.55) continue;
            partners.push(a[j]);
          }
          if (!partners.length) continue;
          var mean = partners.reduce(function (x, y) { return x + y; }, 0) / partners.length;
          if (mode === "delib") next[i] = a[i] + (mean - a[i]) * 0.22;
          else next[i] = Math.max(-1.4, Math.min(1.4, a[i] + (mean - a[i]) * 0.22 + (a[i] > 0 ? 1 : -1) * 0.045));
        }
        a = next;
      }
      return a;
    }
    function stats(a) {
      var m = a.reduce(function (x, y) { return x + y; }, 0) / a.length;
      var vv = a.reduce(function (s, x) { return s + (x - m) * (x - m); }, 0) / a.length;
      return { m: m, sd: Math.sqrt(vv), ext: a.filter(function (x) { return Math.abs(x) > 0.7; }).length };
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var a = simulate(), s = stats(a), ox = 70, oy = 84, iw = W - 140, ih = H - 180;
      var BINS = 28, hist = [], h0 = [], b0, b, bw = iw / BINS;
      for (b0 = 0; b0 < BINS; b0++) { hist.push(0); h0.push(0); }
      function bin(x) { var q = Math.floor((Math.max(-1.4, Math.min(1.4, x)) + 1.4) / 2.8 * BINS); return Math.max(0, Math.min(BINS - 1, q)); }
      a.forEach(function (x) { hist[bin(x)]++; });
      INIT.forEach(function (x) { h0[bin(x)]++; });
      var mx = Math.max(6, Math.max.apply(null, hist), Math.max.apply(null, h0)), cols = Math.max(1, Math.min(3, Math.ceil(mx * 10 / ih))), step = Math.min(11, ih / Math.ceil(mx / cols)), csp = bw / cols;
      K.stage(ctx, 0, 0, W, H, "night", { seed: 40 });
      K.pill(ctx, rounds === 0 ? "토론 전 — 처음 의견 분포" : (mode === "delib" ? "숙의 " + rounds + "회 뒤" : "끼리끼리 " + rounds + "회 뒤"), 16, 28, { s: 14, c: KC.blue });
      K.pill(ctx, "주민 " + NP + "명 · 점 하나 = 한 사람 · 붉은 점 = 양 극단", 16, 56, { s: 11.5, c: KC.mute });
      /* 극단 구역 */
      var e0 = ox + iw * (0.7 + 1.4) / 2.8, e1 = ox + iw * (-0.7 + 1.4) / 2.8;
      ctx.fillStyle = "rgba(255,107,129,.07)"; ctx.fillRect(ox, oy, e1 - ox, ih); ctx.fillRect(e0, oy, ox + iw - e0, ih);
      /* 토론 전 분포(점선 윤곽) */
      if (rounds > 0) {
        ctx.save(); ctx.strokeStyle = "rgba(220,225,255,.45)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.4; ctx.beginPath();
        for (b = 0; b < BINS; b++) { var yy = oy + ih - Math.ceil(h0[b] / cols) * step; if (b === 0) ctx.moveTo(ox, oy + ih); ctx.lineTo(ox + b * bw, yy); ctx.lineTo(ox + (b + 1) * bw, yy); }
        ctx.lineTo(ox + iw, oy + ih); ctx.stroke(); ctx.restore();
        K.pill(ctx, "점선 = 토론 전", W - 16, 56, { s: 11, a: "right", c: KC.ink });
      }
      /* 사람 점 */
      for (b = 0; b < BINS; b++) {
        var center = -1.4 + (b + 0.5) / BINS * 2.8, ext = Math.abs(center) > 0.7, cxp = ox + (b + .5) * bw;
        for (var k = 0; k < hist[b]; k++) {
          var cyp = oy + ih - step * (Math.floor(k / cols) + .5), cx2 = ox + b * bw + csp * ((k % cols) + .5);
          K.planet(ctx, cols > 1 ? cx2 : cxp, cyp, Math.min(4.6, step * .45, csp * .46), ext ? "#ff9aa8" : "#9fd8ff", ext ? "#8a1a30" : "#1a4a8a");
        }
      }
      /* 축 */
      var ag = ctx.createLinearGradient(ox, 0, ox + iw, 0); ag.addColorStop(0, "#ff6b81"); ag.addColorStop(.5, "#9fb0e0"); ag.addColorStop(1, "#ff6b81");
      ctx.fillStyle = ag; ctx.fillRect(ox, oy + ih + 2, iw, 3);
      K.t(ctx, "← 반대", ox, oy + ih + 24, { s: 12, c: KC.mute });
      K.t(ctx, "중립", ox + iw / 2, oy + ih + 24, { s: 12, a: "center", c: KC.mute });
      K.t(ctx, "찬성 →", ox + iw, oy + ih + 24, { s: 12, a: "right", c: KC.mute });
      var mxp = ox + iw * (s.m + 1.4) / 2.8;
      K.line(ctx, { x: mxp, y: oy - 4 }, { x: mxp, y: oy + ih }, "rgba(255,255,255,.75)", 2, [6, 4]);
      K.pill(ctx, "평균", mxp, oy - 10, { s: 12, a: "center", c: KC.ink });
    }
    function refresh() {
      var a = simulate(), s = stats(a), s0 = stats(INIT), ch = false, msg;
      $("d-rv").textContent = rounds + "회"; $("d-mean").textContent = s.m.toFixed(2); $("d-sd").textContent = s.sd.toFixed(2); $("d-ext").textContent = s.ext + "명";
      if (rounds === 0) msg = "처음에는 의견이 <b>양 끝으로 갈려</b> 있습니다. 극단에 선 사람이 " + s0.ext + "명입니다. 라운드를 올리며 두 진행 방식이 어떻게 달라지는지 보세요.";
      else if (mode === "delib") msg = "<b>다른 의견도 듣는 경우</b> — 흩어짐이 " + s0.sd.toFixed(2) + " → <b>" + s.sd.toFixed(2) + "</b>로 줄고, 극단에 선 사람이 " + s0.ext + "명 → <b>" + s.ext + "명</b>이 되었습니다. 결론이 하나로 모이는 것이 아니라 <b>서로의 거리가 좁아지는</b> 것입니다.";
      else msg = "<b>비슷한 의견만 듣는 경우</b> — 흩어짐이 " + s0.sd.toFixed(2) + " → <b>" + s.sd.toFixed(2) + "</b>, 극단에 선 사람이 " + s0.ext + "명 → <b>" + s.ext + "명</b>. 같은 사람들이 같은 시간을 이야기했는데 <b>거리가 더 벌어졌습니다.</b> 이것을 집단 극화라고 합니다.";
      put("d-op-info", msg);
      draw();
      if (rounds >= 10 && mode === "delib" && s.ext < s0.ext && !got.a) { got.a = ch = true; window.sthState("opDel", s.ext); }
      if (rounds >= 10 && mode === "bubble" && s.ext > s0.ext && !got.b) { got.b = ch = true; window.sthState("opBub", s.ext); }
      if (ch) { window.sthState("opGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m4-3a"); if (got.b) done("m4-3b");
      if (got.a && got.b) {
        window.sthState("opBest", "극단 " + stats(INIT).ext + "명 → 숙의 " + window.sthState("opDel") + "명 · 끼리끼리 " + window.sthState("opBub") + "명");
        window.sthMission("m4-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("opBest") + ". 같은 사람, 같은 시간이라도 누구의 말을 듣느냐가 결과를 바꿉니다.");
        ep.clear(2);
      }
    }
    $("d-rd").addEventListener("input", function () { rounds = +this.value; refresh(); });
    Array.prototype.forEach.call(document.querySelectorAll("#d-mode button"), function (b) {
      b.type = "button";
      b.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#d-mode button"), function (o) { o.classList.remove("on"); });
        b.classList.add("on"); mode = b.getAttribute("data-m"); refresh();
      });
    });
    cv._redraw = draw;
    refresh(); mission();
  })();

  window.sthSort({
    mount: "d-sort",
    buckets: [{ id: "pub", label: "👥 시민참여단 공론화" }, { id: "con", label: "🏛️ 합의 회의" }, { id: "vote", label: "🗳️ 국민·주민 투표" }],
    items: [
      { t: "2017년 신고리 5·6호기 공론화 — 시민참여단 471명이 합숙 토론 뒤 건설 재개(59.5%)를 권고했다", a: "pub", why: "우리나라의 대표적인 공론화 사례입니다." },
      { t: "성별·나이·지역을 고려해 뽑은 수백 명이 자료집을 읽고 여러 차례 숙의한다", a: "pub", why: "대표성을 갖춘 시민참여단의 특징입니다." },
      { t: "신고리 권고안에는 원자력 발전을 점차 줄여 가자는 의견도 함께 담겼다", a: "pub", why: "찬반 하나만이 아니라 조건과 방향까지 권고했습니다." },
      { t: "1987년 덴마크에서 시민 패널이 유전자 기술에 대해 전문가에게 묻고 보고서를 썼다", a: "con", why: "세계 여러 나라로 퍼진 합의 회의의 출발점입니다." },
      { t: "십여 명의 시민이 질문을 직접 정해 전문가를 불러 묻고, 합의한 권고문을 발표한다", a: "con", why: "합의 회의의 진행 방식입니다.", hint: "소수의 시민이 전문가에게 질문하는 방식입니다." },
      { t: "전문가가 아닌 시민의 눈으로 새로운 과학기술의 쟁점을 정리해 정책에 전한다", a: "con", why: "합의 회의가 과학기술 정책에 주는 의미입니다." },
      { t: "2017년 스위스 국민 투표에서 새 원자력 발전소 건설을 금지하는 에너지 법안이 58.2%로 통과되었다", a: "vote", why: "직접 민주주의로 에너지 정책을 정한 사례입니다." },
      { t: "2005년 경주 시민이 주민 투표로 방사성 폐기물 처분장 유치를 89.5% 찬성으로 결정했다", a: "vote", why: "주민 투표로 과학기술 시설의 입지를 정한 사례입니다." },
      { t: "짧은 기간에 모든 유권자의 뜻을 한 번에 확인할 수 있지만, 충분한 토론이 부족해지기 쉽다", a: "vote", why: "투표 방식의 장점과 한계입니다." }
    ],
    onDone: function () { window.sthMission("m4-4", true, "<span class='m-tag'>미션 완료</span>방식은 달라도, 정확한 정보와 다양한 시민의 참여가 과학기술 문제를 함께 푸는 열쇠였습니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m4-4", true);

  function finish() { window.sthState("r4", "해결 · " + (window.sthState("noiseBest") || "") + " / " + (window.sthState("opBest") || "")); }
  function vs() {
    $("e4-vs").innerHTML = "<b>나의 첫 판단</b> " + (window.sthState("deli") || "기록 없음") + "<br><b>사실 확인</b> " + (window.sthState("noiseBest") || "-") + "<br><b>토론 실험</b> " + (window.sthState("opBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk4", unitLabel: "[과학의 역사와 문화 Ⅲ] 이야기 ④ 풍력 발전기가 들어온다면",
    items: [
      { id: "w4", label: "같은 토론, 다른 결과",
        hint: "두 진행 방식을 각각 10회씩 돌려 보고, 흩어짐과 극단 인원이 어떻게 달랐는지 숫자로 쓰세요.",
        ph: "숙의: 흩어짐 (   ) 극단 (   )명 / 끼리끼리: 흩어짐 (   ) 극단 (   )명 → 그래서 …" },
      { id: "w5", label: "과학기술 문제를 함께 정해야 하는 까닭",
        hint: "전문가가 사실을 다 알려 주어도 결론이 하나로 정해지지 않는 이유를 한 문장으로 쓰세요.", ph: "" }
    ]
  });
})();

/* ========================================================================= 07 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[과학의 역사와 문화 Ⅲ] 과학과 인류의 미래 — 정리",
  recap: [
    { key: "r1", label: "① 양자 샴푸의 비밀" },
    { key: "r2", label: "② 같은 ‘라’, 다른 소리" },
    { key: "r3", label: "③ 멀미 나는 가상 교실" },
    { key: "r4", label: "④ 풍력 발전기가 들어온다면" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rInq", label: "교과서 실험" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "네 사건을 꿰는 한 문장", hint: "과학 용어, 음악, 가상현실, 풍력 발전기. 네 이야기를 ‘과학기술’과 ‘미래 사회’라는 말을 넣어 한 문장으로 이어 보세요." },
    { id: "w6", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 08 우리 반 */
window.sthShare({
  mount: "share", unit: "shc-3", unitLabel: "[과학의 역사와 문화 Ⅲ] 과학과 인류의 미래",
  rows: [
    { key: "r1", label: "① 양자 샴푸의 비밀" },
    { key: "r2", label: "② 같은 ‘라’, 다른 소리" },
    { key: "r3", label: "③ 멀미 나는 가상 교실" },
    { key: "r4", label: "④ 풍력 발전기가 들어온다면" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rInq", label: "교과서 실험" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "네 사건을 꿰는 한 문장" }
});

})();
