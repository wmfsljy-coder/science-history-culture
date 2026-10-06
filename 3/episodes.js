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
    function draw() {
      paper(ctx, W, H);
      var x0 = 70, x1 = 330, y0 = 26, y1 = 270;
      function Y(e) { return y0 + (e - (-0.1)) / (-3.6 + 0.1) * (y1 - y0); }
      text(ctx, "수소 원자의 에너지 준위", x0, 20, { s: 12, w: "800" });
      for (var k = 2; k <= 6; k++) {
        seg(ctx, x0, Y(E(k)), x1, Y(E(k)), k === n || k === 2 ? v("--ink") : v("--line"), k === n || k === 2 ? 2.5 : 1.5);
        text(ctx, "n = " + k, x1 + 8, Y(E(k)) + 4, { s: 10.5, w: "700", c: v("--mist") });
      }
      text(ctx, "−3.40 eV", x0 - 6, Y(E(2)) + 4, { s: 10, a: "right", c: v("--mist") });
      text(ctx, "0 eV", x0 - 6, Y(0) + 4, { s: 10, a: "right", c: v("--mist") });
      ctx.save(); ctx.strokeStyle = color(lam(n)); ctx.fillStyle = color(lam(n)); ctx.lineWidth = 3;
      window.drawArrow(ctx, 200, Y(E(n)), 200, Y(E(2)) - 2, 10); ctx.restore();
      dot(ctx, 200, Y(E(n)), 6, v("--brand"));
      var l = lam(n), d = dE(n);
      ctx.fillStyle = color(l); ctx.fillRect(430, 40, 120, 70);
      text(ctx, "나오는 빛", 430, 30, { s: 11.5, w: "800", c: v("--mist") });
      text(ctx, n + " → 2 도약", 580, 56, { s: 15, w: "900" });
      text(ctx, "에너지 " + d.toFixed(2) + " eV", 580, 82, { s: 13, w: "800" });
      text(ctx, "파장 " + l.toFixed(0) + " nm", 580, 106, { s: 13, w: "800", c: Math.abs(l - 656) < 3 ? v("--green-700") : v("--ink") });
      text(ctx, "종이 클립(1 g)을 1 cm 들어 올리는 에너지", 430, 160, { s: 11.5, c: v("--mist") });
      text(ctx, "≈ 9.8 × 10⁻⁵ J ≈ 6.1 × 10¹⁴ eV", 430, 182, { s: 13, w: "800" });
      text(ctx, "→ 이 양자 도약의 약 " + (6.1e14 / d).toExponential(1).replace("e+", " × 10^") + " 배", 430, 206, { s: 13, w: "900", c: v("--coral-700") });
      text(ctx, "eV(전자볼트) = 1.6 × 10⁻¹⁹ J", 430, 240, { s: 10.5, c: v("--mist") });
      return Math.abs(l - 656) < 3;
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
      paper(ctx, W, H);
      var t = TERMS[sel], boxW = 330, boxH = 132, ly = 30, lx = 40, rx = W - 40 - boxW;
      function card(x, title, body, col) {
        ctx.fillStyle = A(V("--card"), 1); ctx.strokeStyle = A(V(col), 0.9); ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.rect(x, ly, boxW, boxH); ctx.fill(); ctx.stroke();
        text(ctx, title, x + 16, ly + 24, { s: 12, w: "800", c: V(col) });
        ctx.fillStyle = V("--ink"); ctx.font = "600 12.5px " + FONT; ctx.textAlign = "left";
        wrap(body, x + 16, ly + 48, boxW - 32, 19);
      }
      card(lx, "과학에서의 뜻", t.sci, "--brand-700");
      card(rx, "일상에서의 쓰임", t.life, "--coral-700");
      var ay = ly + boxH / 2;
      ctx.strokeStyle = V("--mist"); ctx.fillStyle = V("--mist"); ctx.lineWidth = 3;
      window.drawArrow(ctx, lx + boxW + 12, ay, rx - 12, ay, 11);
      text(ctx, t.w, W / 2, ay - 14, { s: 15, w: "800", a: "center" });
      text(ctx, t.drift > 0.7 ? "크게 달라짐" : (t.drift > 0.4 ? "일부 달라짐" : "거의 그대로"), W / 2, ay + 26,
        { s: 11.5, w: "700", a: "center", c: V(t.drift > 0.7 ? "--rose-700" : (t.drift > 0.4 ? "--amber-700" : "--green-700")) });
      var gx = 70, gy = ly + boxH + 56, gw = W - 140, gh = H - gy - 54;
      axes(ctx, gx, gy, gx + gw, gy + gh);
      text(ctx, "일상에서 쓰이는 정도 →", gx + gw / 2, gy + gh + 24, { s: 11.5, w: "700", a: "center", c: V("--mist") });
      ctx.save(); ctx.translate(24, gy + gh / 2); ctx.rotate(-Math.PI / 2);
      text(ctx, "원래 뜻에서 멀어진 정도 →", 0, 0, { s: 11.5, w: "700", a: "center", c: V("--mist") }); ctx.restore();
      TERMS.forEach(function (q, i) {
        var px = gx + gw * q.use, py = gy + gh - gh * q.drift, on = (i === sel), was = seen.indexOf(i) >= 0;
        dot(ctx, px, py, on ? 9 : 5, on ? V("--brand") : (was ? V("--teal") : A(V("--mist"), 0.5)));
        text(ctx, q.w, px, py - (on ? 16 : 11), { s: on ? 12.5 : 11, w: on ? "800" : "600", a: "center", c: on ? V("--ink") : V("--mist") });
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
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 560, y0 = 30, y1 = 240;
      function X(c) { return x0 + (c - 20) / 200 * (x1 - x0); }
      axes(ctx, x0, y0, x1, y1);
      text(ctx, "참가자가 센 새의 수 (한 점 = 한 사람)", x0 + 6, y0 - 10, { s: 11, w: "700", c: v("--mist") });
      [40, 80, 120, 160, 200].forEach(function (c) { text(ctx, c + "마리", X(c), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      var sum = 0;
      for (var i = 0; i < n; i++) { sum += COUNTS[i]; dot(ctx, X(COUNTS[i]), y1 - 14 - (i % 10) * 16 - Math.floor(i / 10) * 1.5, 4, A(V("--teal"), 0.8)); }
      var mean = sum / n, m = moe(n) / 100 * mean;
      ctx.fillStyle = A(V("--brand"), 0.18); ctx.fillRect(X(mean - m), y0, X(mean + m) - X(mean - m), y1 - y0);
      seg(ctx, X(mean), y0, X(mean), y1, v("--brand"), 3);
      seg(ctx, X(TRUE), y0, X(TRUE), y1, v("--green-700"), 1.5, true);
      text(ctx, "실제 " + TRUE + "마리", X(TRUE) + 4, y0 + 12, { s: 10.5, w: "800", c: v("--green-700") });
      var ok = moe(n) <= 10 + 1e-9;
      text(ctx, "참가자 " + n + "명", 610, 60, { s: 15, w: "900" });
      text(ctx, "평균 " + mean.toFixed(0) + "마리", 610, 90, { s: 13, w: "800", c: v("--brand-700") });
      text(ctx, "평균의 오차 범위", 610, 124, { s: 12, c: v("--mist") });
      text(ctx, "± " + moe(n).toFixed(1) + "%", 610, 156, { s: 24, w: "900", c: ok ? v("--green-700") : v("--rose-700") });
      text(ctx, "= 2 × 30% ÷ √" + n, 610, 182, { s: 11.5, c: v("--mist") });
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
    var got = window.sthState("harmGot") || { a: false, b: false };
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
      ctx.fillStyle = A(V("--card-2"), 1); ctx.fillRect(0, 0, W, H);
      var ox = 56, oy = 34, iw = 460, ih = H - 110;
      text(ctx, "만들어진 파형 (2주기)", ox, oy - 12, { s: 13, w: "800" });
      seg(ctx, ox, oy + ih / 2, ox + iw, oy + ih / 2, V("--line"), 1.4);
      var p = peak();
      ctx.strokeStyle = V("--brand"); ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.beginPath();
      for (var x = 0; x <= iw; x++) { var t = (x / iw) * 2, y = oy + ih / 2 - (wave(t) / p) * (ih / 2 - 8); if (x === 0) ctx.moveTo(ox + x, y); else ctx.lineTo(ox + x, y); }
      ctx.stroke();
      ctx.strokeStyle = A(V("--mist"), 0.55); ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); ctx.beginPath();
      for (var x2 = 0; x2 <= iw; x2++) { var t2 = (x2 / iw) * 2, y2 = oy + ih / 2 - Math.sin(2 * Math.PI * t2) * amp[0] / p * (ih / 2 - 8); if (x2 === 0) ctx.moveTo(ox + x2, y2); else ctx.lineTo(ox + x2, y2); }
      ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "점선 = 기본음만 있을 때", ox, oy + ih + 20, { s: 11, w: "600", c: V("--mist") });
      var bx = 566, bw = W - bx - 40, by = 34, bh = ih, barW = bw / N;
      text(ctx, "배음의 세기", bx, by - 12, { s: 13, w: "800" });
      for (var k = 0; k < N; k++) {
        var h = amp[k] * (bh - 30), cxx = bx + k * barW;
        ctx.fillStyle = k === 0 ? A(V("--brand"), 0.95) : ((k + 1) % 2 === 0 ? A(V("--coral"), 0.8) : A(V("--violet"), 0.8));
        ctx.fillRect(cxx + 3, by + bh - 22 - h, barW - 6, h);
        text(ctx, String(k + 1), cxx + barW / 2, by + bh - 6, { s: 11, w: "700", a: "center", c: V("--mist") });
        if (amp[k] > 0.04) text(ctx, Math.round((k + 1) * F0) + "", cxx + barW / 2, by + bh - 28 - h, { s: 10, w: "600", a: "center" });
      }
      seg(ctx, bx, by + bh - 22, bx + bw, by + bh - 22, V("--line"), 1.5);
      text(ctx, "주황 = 짝수 배음 · 막대 위 = 진동수(Hz)", bx, by + bh + 20, { s: 11, w: "600", c: V("--mist") });
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
      put("b-info", describe() + " <b>음의 높이는 1배음(440 Hz)이 정합니다.</b> 다른 막대를 아무리 움직여도 ‘라’라는 음 높이는 바뀌지 않고 <b>음색만</b> 바뀝니다.");
      draw();
      if (oddOnly() && !got.a) { got.a = true; window.sthState("harmGot", got); mission(); }
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
        $("bh" + k).addEventListener("input", function () { amp[k] = +this.value / 100; $("bh" + k + "-v").textContent = this.value; refresh(); });
      })(j);
    }
    Array.prototype.forEach.call(document.querySelectorAll("#b-preset button"), function (b) {
      b.type = "button";
      b.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#b-preset button"), function (o) { o.classList.remove("on"); });
        b.classList.add("on");
        var p = PRESET[b.getAttribute("data-p")];
        for (var k = 0; k < N; k++) { amp[k] = p[k]; $("bh" + k).value = Math.round(p[k] * 100); $("bh" + k + "-v").textContent = Math.round(p[k] * 100); }
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
      paper(ctx, W, H);
      var x0 = 40, x1 = 600, yc = 140, A0 = 90, T = 0.25;      /* ms */
      function X(t) { return x0 + t / T * (x1 - x0); }
      text(ctx, "20 kHz 소리 (0.25 ms 동안)", x0, 24, { s: 12, w: "800" });
      seg(ctx, x0, yc, x1, yc, v("--line"), 1);
      ctx.strokeStyle = A(V("--mist"), 0.6); ctx.lineWidth = 1.5; ctx.beginPath();
      for (var i = 0; i <= 900; i++) { var t = i / 900 * T, y = yc - A0 * Math.sin(2 * Math.PI * F * t); if (i) ctx.lineTo(X(t), y); else ctx.moveTo(X(t), y); }
      ctx.stroke();
      var fa = alias();
      ctx.strokeStyle = v("--coral"); ctx.lineWidth = 3; ctx.beginPath();
      for (var j = 0; j <= 900; j++) { var t2 = j / 900 * T, y2 = yc - A0 * Math.sin(2 * Math.PI * fa * t2); if (j) ctx.lineTo(X(t2), y2); else ctx.moveTo(X(t2), y2); }
      ctx.stroke();
      for (var k = 0; k * (1 / fs) <= T + 1e-9; k++) { var ts = k / fs; dot(ctx, X(ts), yc - A0 * Math.sin(2 * Math.PI * F * ts), 5, v("--brand")); }
      text(ctx, "회색 = 실제 소리 · 파랑 점 = 잰 값 · 주황 = 잰 값으로 되살린 소리", x0, 262, { s: 11, c: v("--mist") });
      var ok = fs > 2 * F;
      text(ctx, "표본화 " + fs + " kHz", 640, 60, { s: 15, w: "900" });
      text(ctx, "되살린 소리", 640, 96, { s: 12, c: v("--mist") });
      text(ctx, Math.abs(fa).toFixed(0) + " kHz", 640, 128, { s: 24, w: "900", c: Math.abs(Math.abs(fa) - F) < 0.01 ? v("--green-700") : v("--rose-700") });
      text(ctx, ok ? "원래 소리 그대로" : "다른 소리로 바뀜", 640, 154, { s: 12.5, w: "800", c: ok ? v("--green-700") : v("--rose-700") });
      text(ctx, "CD 음질 = 44.1 kHz", 640, 200, { s: 11.5, c: v("--mist") });
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
      paper(ctx, W, H);
      var m = gen(T), r = metric(m), x0 = 70, x1 = 590, y0 = 40, y1 = 240;
      function X(q) { return x0 + q * (x1 - x0) / 24; }
      function Y(nn) { return y1 - nn / 7 * (y1 - y0); }
      text(ctx, "인공지능이 만든 24음 멜로디", x0, 24, { s: 12, w: "800" });
      for (var nn = 0; nn < 8; nn++) { seg(ctx, x0, Y(nn), x1, Y(nn), v("--line"), 0.8); text(ctx, NAMES[nn], x0 - 8, Y(nn) + 4, { s: 10, a: "right", c: v("--mist") }); }
      m.forEach(function (nt, q) {
        ctx.fillStyle = r.oddAt[q] ? v("--rose") : (r.copied[q] ? A(V("--amber"), 0.85) : v("--teal"));
        ctx.fillRect(X(q) + 2, Y(nt) - 7, (x1 - x0) / 24 - 4, 14);
      });
      [[A(V("--amber"), 0.85), "배운 곡과 같은 네 음 조각"], [v("--rose"), "배운 적 없는 이음새"], [v("--teal"), "새로 이어 붙인 부분"]].forEach(function (L, q) {
        ctx.fillStyle = L[0]; ctx.fillRect(x0 + q * 175, 259, 10, 10);
        text(ctx, L[1], x0 + q * 175 + 14, 268, { s: 10.5, c: v("--mist") });
      });
      var okC = r.copy <= 50, okO = r.odd <= 30;
      text(ctx, "창의성 " + T.toFixed(1), 630, 56, { s: 15, w: "900" });
      text(ctx, "베낀 조각", 630, 92, { s: 12, c: v("--mist") });
      text(ctx, r.copy + "%", 630, 120, { s: 22, w: "900", c: okC ? v("--green-700") : v("--rose-700") });
      text(ctx, "기준 50% 이하", 730, 120, { s: 11, c: v("--mist") });
      text(ctx, "엉뚱한 이음새", 630, 156, { s: 12, c: v("--mist") });
      text(ctx, r.odd + "%", 630, 184, { s: 22, w: "900", c: okO ? v("--green-700") : v("--rose-700") });
      text(ctx, "기준 30% 이하", 730, 184, { s: 11, c: v("--mist") });
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
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = A(V("--card-2"), 1); ctx.fillRect(0, 0, W, H);
      var cx = 270, cy = H - 90, R = 250;
      function fan(deg, color, alpha) {
        var half = deg / 2 * Math.PI / 180;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, -Math.PI / 2 - half, -Math.PI / 2 + half); ctx.closePath();
        ctx.fillStyle = A(V(color), alpha); ctx.fill();
      }
      fan(HUMAN, "--mist", 0.28); fan(fov, "--brand", 0.55);
      ctx.strokeStyle = V("--line"); ctx.lineWidth = 1.2;
      for (var d = -100; d <= 100; d += 20) { var a = (-90 + d) * Math.PI / 180; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (R - 10), cy + Math.sin(a) * (R - 10)); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke(); }
      ctx.fillStyle = A(V("--ink"), 0.85); ctx.beginPath(); ctx.arc(cx, cy, 17, 0, 6.2832); ctx.fill();
      text(ctx, "관측자", cx, cy + 34, { s: 11.5, w: "700", a: "center" });
      text(ctx, "사람 시야 " + HUMAN + "°", cx, cy - R - 26, { s: 11.5, w: "700", a: "center", c: V("--mist") });
      text(ctx, "기기 시야 " + fov + "°", cx, cy - R - 8, { s: 13, w: "800", a: "center", c: V("--brand-700") });
      var bx = 570, by = 60, bw = W - bx - 44, bh = 260;
      ctx.fillStyle = V("--card"); ctx.strokeStyle = V("--line"); ctx.lineWidth = 2; ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.fill(); ctx.stroke();
      text(ctx, "고개를 돌릴 때 화면이 밀리는 정도", bx, by - 12, { s: 13, w: "800" });
      var mid = by + bh / 2, half = bw / 2 - 20;
      seg(ctx, bx + bw / 2, by + 20, bx + bw / 2, by + bh - 20, A(V("--mist"), 0.6), 1.4, true);
      text(ctx, "실제 바라보는 곳", bx + bw / 2, by + 14, { s: 11, w: "600", a: "center", c: V("--mist") });
      var shift = Math.min(half - 12, lagAngle() / 20 * half), r2 = risk();
      ctx.fillStyle = A(V(r2.c), 0.28); ctx.fillRect(bx + bw / 2 - shift, mid - 62, shift, 124);
      seg(ctx, bx + bw / 2 - shift, mid - 62, bx + bw / 2 - shift, mid + 62, V(r2.c), 3);
      text(ctx, lagAngle().toFixed(1) + "° 뒤처짐", bx + bw / 2 - shift / 2, mid + 90, { s: 14, w: "800", a: "center", c: V(r2.c) });
      var ref = 200 * 20 / 1000 / 20 * half;
      seg(ctx, bx + bw / 2 - ref, by + 24, bx + bw / 2 - ref, by + bh - 24, V("--amber"), 2, true);
      text(ctx, "20 ms 기준", bx + bw / 2 - ref - 6, by + 38, { s: 11, w: "700", a: "right", c: V("--amber-700") });
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
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 600, y = 120;
      function X(dd) { return x0 + Math.sqrt(dd / 12000) * (x1 - x0); }
      text(ctx, "서울에서 떨어진 거리 (가로는 제곱근 눈금)", x0, 24, { s: 12, w: "800" });
      seg(ctx, x0, y, x1, y, v("--line"), 3);
      ctx.fillStyle = A(V("--green"), 0.25); ctx.fillRect(x0, y - 18, X(1500) - x0, 36);
      text(ctx, "초록 = 왕복 20 ms 안", x0 + 6, y + 62, { s: 10.5, w: "800", c: v("--green-700") });
      dot(ctx, x0, y, 7, v("--brand")); text(ctx, "서울", x0, y + 24, { s: 11, w: "800", a: "center" });
      CITY.forEach(function (c, i) { dot(ctx, X(c[1]), y, 5, v("--mist")); text(ctx, c[0], X(c[1]), y + (i % 2 ? 40 : 24), { s: 10.5, w: "700", a: "center", c: v("--mist") }); });
      text(ctx, "🤖", X(d), y - 30, { s: 20, a: "center" });
      seg(ctx, X(d), y - 20, X(d), y + 12, v("--coral"), 2);
      var t = rtt(d), ok = t <= 20 + 1e-9;
      text(ctx, "거리 " + d.toLocaleString() + " km", 640, 60, { s: 15, w: "900" });
      text(ctx, "왕복 지연 = 2 × 거리 ÷ 20만 km/s + 처리 5 ms", 640, 90, { s: 10.5, c: v("--mist") });
      text(ctx, t.toFixed(1) + " ms", 640, 128, { s: 24, w: "900", c: ok ? v("--green-700") : v("--rose-700") });
      text(ctx, ok ? "손처럼 조종 가능" : "손과 로봇이 어긋남", 640, 154, { s: 12.5, w: "800", c: ok ? v("--green-700") : v("--rose-700") });
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
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 580, y0 = 30, y1 = 230;
      function X(rr) { return x0 + (rr - 100) / 1400 * (x1 - x0); }
      function Y(db) { return y1 - (db - 30) / 40 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      text(ctx, "집 앞 소음 (dB)", x0 + 6, y0 - 10, { s: 11, w: "700", c: v("--mist") });
      [30, 40, 50, 60, 70].forEach(function (db) { text(ctx, db + "", x0 - 6, Y(db) + 4, { s: 10, a: "right", c: v("--mist") }); });
      [100, 500, 1000, 1500].forEach(function (rr) { text(ctx, rr + " m", X(rr), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      seg(ctx, x0, Y(45), x1, Y(45), v("--rose"), 1.5, true);
      text(ctx, "밤 기준 45 dB", x1 - 4, Y(45) - 6, { s: 10.5, w: "800", a: "right", c: v("--rose-700") });
      ctx.strokeStyle = v("--brand"); ctx.lineWidth = 3; ctx.beginPath();
      for (var q = 100; q <= 1500; q += 10) { if (q === 100) ctx.moveTo(X(q), Y(Lp(q))); else ctx.lineTo(X(q), Y(Lp(q))); }
      ctx.stroke();
      dot(ctx, X(r), Y(Lp(r)), 7, v("--coral"));
      var L = Lp(r), ok = L <= 45 + 1e-9;
      text(ctx, "🌬️ ←── " + r + " m ──→ 🏠", 620, 60, { s: 14, w: "800" });
      text(ctx, "집 앞 소음", 620, 96, { s: 12, c: v("--mist") });
      text(ctx, L.toFixed(1) + " dB", 620, 128, { s: 24, w: "900", c: ok ? v("--green-700") : v("--rose-700") });
      text(ctx, ok ? "밤에도 잠을 방해하지 않음" : "밤 기준을 넘음", 620, 154, { s: 12.5, w: "800", c: ok ? v("--green-700") : v("--rose-700") });
      text(ctx, "= 107 − 20 log(거리) − 11", 620, 184, { s: 11, c: v("--mist") });
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
      ctx.fillStyle = A(V("--card-2"), 1); ctx.fillRect(0, 0, W, H);
      var a = simulate(), s = stats(a), ox = 70, oy = 70, iw = W - 140, ih = H - 170;
      var BINS = 28, hist = []; for (var b0 = 0; b0 < BINS; b0++) hist.push(0);
      a.forEach(function (x) { var b = Math.floor((Math.max(-1.4, Math.min(1.4, x)) + 1.4) / 2.8 * BINS); hist[Math.max(0, Math.min(BINS - 1, b))]++; });
      var mx = Math.max.apply(null, hist);
      for (var b2 = 0; b2 < BINS; b2++) {
        var bw = iw / BINS, bx = ox + b2 * bw, h = ih * hist[b2] / Math.max(6, mx), center = -1.4 + (b2 + 0.5) / BINS * 2.8;
        ctx.fillStyle = Math.abs(center) > 0.7 ? A(V("--rose"), 0.85) : A(V("--brand"), 0.8);
        ctx.fillRect(bx + 2, oy + ih - h, bw - 4, h);
      }
      seg(ctx, ox, oy + ih, ox + iw, oy + ih, V("--line"), 1.6);
      text(ctx, "← 반대", ox, oy + ih + 24, { s: 12, w: "700", c: V("--mist") });
      text(ctx, "중립", ox + iw / 2, oy + ih + 24, { s: 12, w: "700", a: "center", c: V("--mist") });
      text(ctx, "찬성 →", ox + iw, oy + ih + 24, { s: 12, w: "700", a: "right", c: V("--mist") });
      var mxp = ox + iw * (s.m + 1.4) / 2.8;
      seg(ctx, mxp, oy, mxp, oy + ih, A(V("--ink"), 0.8), 2, true);
      text(ctx, "평균", mxp, oy - 10, { s: 12, w: "800", a: "center" });
      text(ctx, rounds === 0 ? "토론 전 — 처음 의견 분포" : (mode === "delib" ? "숙의 " + rounds + "회 뒤" : "끼리끼리 " + rounds + "회 뒤"), ox, 36, { s: 14, w: "800" });
      text(ctx, "주민 " + NP + "명 · 붉은 막대 = 양 극단", ox, 54, { s: 11.5, w: "600", c: V("--mist") });
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
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "네 사건을 꿰는 한 문장" }
});

})();
