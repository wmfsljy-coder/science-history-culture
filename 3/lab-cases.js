/* 과학의 역사와 문화 Ⅲ 과학과 인류의 미래 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";
function mulberry(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 잔향 시간 */
  {
    id: "c1", tag: "과학기술과 음악 · 건축 음향", title: "학교 강당을 음악회장으로", short: "강당 잔향",
    who: "🎻", name: "학교 오케스트라",
    say: "“콘크리트 벽으로 된 강당(부피 2400 m³)에서 연주하면 소리가 너무 오래 울려 음이 뭉개져요. 관현악 음악회에 알맞은 <b>잔향 시간은 1.5 ~ 2.0초</b>. 벽에 흡음 패널을 붙여 맞춰 주세요. 관객이 가득 찬 날을 기준으로 해야 합니다.”",
    predict: {
      q: "관객이 강당을 가득 채우면, 빈 강당일 때와 비교해 소리가 울리는 시간(잔향)은?",
      options: ["㉠ 길어진다", "㉡ 짧아진다 — 사람과 옷이 소리를 흡수하므로", "㉢ 변하지 않는다"],
      answer: 1
    },
    task: "관객 상태와 흡음 패널 넓이를 정해 <b>관객이 가득 찼을 때 잔향 시간 1.5 ~ 2.0초</b>가 되게 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W;
      var S = 0, aud = "empty", V = 2400, SURF = 1160;
      function A() { return 0.02 * (SURF - S) + 0.8 * S + (aud === "full" ? 150 : 0); }
      function rt() { return 0.161 * V / A(); }
      function draw() {
        H.paper(ctx, W, cv.H);
        H.text(ctx, "잔향 시간 = 0.161 × 부피 ÷ 흡음력 (세이빈의 식)", 40, 26, { s: 13.5, w: "900" });
        var x0 = 60, y0 = 60, w = 380, h = 200;
        H.box(ctx, x0, y0, w, h, H.v("--card-2"), 1);
        var pw = Math.min(w, S / 400 * w);
        H.box(ctx, x0, y0, pw, 14, H.v("--teal"), 0.8);
        H.text(ctx, "흡음 패널 " + S + " m²", x0 + 4, y0 + 30, { s: 11, w: "800", c: H.v("--teal-700") });
        if (aud === "full") for (var i = 0; i < 60; i++) H.text(ctx, "🧑", x0 + 20 + (i % 15) * 23, y0 + 110 + Math.floor(i / 15) * 22, { s: 14 });
        H.text(ctx, "🎻", x0 + w / 2, y0 + 80, { s: 22, a: "center" });
        var t = rt(), ok = aud === "full" && t >= 1.5 && t <= 2.0;
        H.rows(ctx, 500, 70, [
          ["흡음력 (m²)", A().toFixed(0)],
          ["잔향 시간", t.toFixed(2) + " 초", ok ? "--green-700" : (t >= 1.5 && t <= 2.0 ? "--amber-700" : "--rose-700"), true],
          ["음악회 기준", "1.5 ~ 2.0 초 · 강연은 0.8 ~ 1.2 초"]
        ], 62);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "관객", value: "empty", options: [{ v: "empty", t: "빈 강당" }, { v: "full", t: "관객이 가득 참" }], onPick: function (x) { aud = x; draw(); } });
      api.slider({ label: "흡음 패널 넓이 (흡음률 0.8)", min: 0, max: 400, step: 10, value: 0, fmt: function (x) { return x + " m²"; }, onInput: function (x) { S = x; draw(); } });
      api.info("콘크리트는 소리를 2% 만 흡수하고 흡음 패널은 80% 를 흡수합니다. 관객 한 명 한 명도 소리를 흡수해요.");
      draw();
      return {
        judge: function () {
          var t = rt();
          if (aud !== "full") return { ok: false, msg: "빈 강당 기준으로 맞추면 관객이 들어찼을 때 소리가 너무 빨리 사라집니다. 관객이 가득 찬 상태로 맞추세요." };
          if (t >= 1.5 && t <= 2.0) return { ok: true, msg: "패널 " + S + " m² · 관객 가득 → 잔향 " + t.toFixed(2) + "초. 음이 풍성하게 이어지면서도 뭉개지지 않습니다." };
          return { ok: false, msg: "잔향 " + t.toFixed(2) + "초 — " + (t > 2 ? "아직 너무 오래 울립니다." : "너무 빨리 사라져 소리가 메마릅니다.") };
        }
      };
    },
    hints: [
      "잔향 시간은 흡음력에 반비례합니다. 1.5 ~ 2.0초가 되려면 흡음력이 약 193 ~ 258 m² 여야 해요.",
      "관객이 가득 차면 흡음력이 150 늘어납니다. 나머지를 패널로 채우세요(패널 1 m² 당 약 0.78 증가)."
    ],
    solution: "<b>관객이 가득 참</b>, 흡음 패널 <b>30 ~ 100 m²</b>.",
    why: "잔향 시간은 방의 부피에 비례하고 벽·사람·의자가 소리를 흡수하는 정도(흡음력)에 반비례합니다. 1900년 세이빈이 하버드 강당의 울림 문제를 풀며 찾은 식으로, 오늘날 음악당은 이 원리로 설계합니다.<br>" +
      "관현악은 소리가 조금 오래 이어지는 편이 풍성하게 들리고, 강연은 말소리가 겹치지 않도록 짧은 편이 좋습니다. 과학기술은 악기뿐 아니라 <b>음악을 듣는 공간</b>까지 바꾸었습니다. ※ 수업용으로 단순화한 값입니다."
  },

  /* ------------------------------------------------------------------ 2. VR 기기 설계 */
  {
    id: "c2", tag: "가상현실 · 지연과 재생률", title: "멀미 없는 가상현실 기기 설계", short: "VR 재생률",
    who: "🥽", name: "VR 게임 개발팀",
    say: "“새 VR 게임을 만들어요. 화면을 <b>1초에 몇 번 새로 그릴지(재생률)</b>와 <b>한 장면을 그리는 데 걸리는 시간(렌더링 시간)</b>을 정해야 해요. 렌더링이 오래 걸릴수록 그래픽이 섬세하지만, 한 장면을 다음 장면 전까지 못 그리면 화면이 끊기고, 고개를 돌린 뒤 화면이 바뀌기까지의 지연이 <b>20 ms</b> 를 넘으면 멀미가 납니다.”",
    predict: {
      q: "재생률을 60 Hz 에서 120 Hz 로 높이면, 한 장면을 그리는 데 쓸 수 있는 시간은?",
      options: ["㉠ 두 배로 길어진다", "㉡ 절반으로 짧아진다", "㉢ 변하지 않는다"],
      answer: 1
    },
    task: "재생률과 렌더링 시간을 정해 <b>화면이 끊기지 않고 지연 20 ms 이하</b>이면서 그래픽이 <b>가장 섬세한</b>(렌더링 시간이 가장 긴) 설정을 찾으세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W;
      var hz = 60, r = 16;
      function frame() { return 1000 / hz; }
      function lat() { return 2 + r + frame() / 2; }
      function okSet(h, rr) { var f = 1000 / h; return rr <= f && 2 + rr + f / 2 <= 20; }
      function best() { var b = 0; [60, 90, 120].forEach(function (h) { for (var rr = 2; rr <= 20; rr++) if (okSet(h, rr) && rr > b) b = rr; }); return b; }
      function draw() {
        H.paper(ctx, W, cv.H);
        H.text(ctx, "한 장면이 만들어지는 시간표 (ms)", 40, 26, { s: 13.5, w: "900" });
        var x0 = 60, x1 = 560, y = 90, sc = (x1 - x0) / 40;
        for (var k = 0; k * frame() <= 40; k++) { H.dash(ctx, x0 + k * frame() * sc, 60, x0 + k * frame() * sc, 200, H.v("--line")); }
        H.text(ctx, "점선 = 화면이 바뀌는 순간 (" + frame().toFixed(1) + " ms 마다)", x0, 222, { s: 11, c: H.v("--mist") });
        H.box(ctx, x0, y, 2 * sc, 26, H.v("--violet"), 0.8); H.text(ctx, "센서", x0 + 2, y - 6, { s: 10.5, c: H.v("--mist") });
        H.box(ctx, x0 + 2 * sc, y, r * sc, 26, r <= frame() ? H.v("--teal") : H.v("--rose"), 0.8);
        H.text(ctx, "렌더링 " + r + " ms", x0 + 2 * sc + 4, y + 18, { s: 11, w: "800", c: "#fff" });
        H.box(ctx, x0 + (2 + r) * sc, y + 34, frame() / 2 * sc, 20, H.v("--amber"), 0.8);
        H.text(ctx, "화면에 나타날 때까지 (평균)", x0 + (2 + r) * sc + 4, y + 70, { s: 10.5, c: H.v("--amber-700") });
        H.line(ctx, [[x0 + 20 * sc, 60], [x0 + 20 * sc, 200]], H.v("--rose"), 2);
        H.text(ctx, "20 ms", x0 + 20 * sc + 4, 72, { s: 11, w: "800", c: H.v("--rose-700") });
        H.rows(ctx, 600, 60, [
          ["한 장면에 쓸 수 있는 시간", frame().toFixed(1) + " ms"],
          ["화면 끊김", r <= frame() ? "없음" : "생김 (렌더링이 늦음)", r <= frame() ? "--green-700" : "--rose-700"],
          ["움직임 → 화면 지연", lat().toFixed(1) + " ms", lat() <= 20 ? "--green-700" : "--rose-700", true]
        ], 62);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "재생률", value: 60, options: [{ v: 60, t: "60 Hz" }, { v: 90, t: "90 Hz" }, { v: 120, t: "120 Hz" }], onPick: function (x) { hz = x; draw(); } });
      api.slider({ label: "렌더링 시간 (길수록 섬세한 그래픽)", min: 2, max: 20, step: 1, value: 16, fmt: function (x) { return x + " ms"; }, onInput: function (x) { r = x; draw(); } });
      api.info("지연 = 센서 2 ms + 렌더링 시간 + 화면이 바뀔 때까지 평균 기다리는 시간(한 장면 시간의 절반).");
      draw();
      return {
        judge: function () {
          if (r > frame()) return { ok: false, msg: "렌더링 " + r + " ms 가 한 장면 시간 " + frame().toFixed(1) + " ms 를 넘어 화면이 끊깁니다." };
          if (lat() > 20) return { ok: false, msg: "지연 " + lat().toFixed(1) + " ms — 20 ms 를 넘어 멀미가 납니다." };
          if (r < best()) return { ok: false, msg: "끊김도 멀미도 없지만, 더 섬세한 그래픽을 쓸 수 있는 설정이 있습니다." };
          return { ok: true, msg: hz + " Hz · 렌더링 " + r + " ms → 지연 " + lat().toFixed(1) + " ms. 끊김·멀미 없이 가장 섬세한 설정입니다." };
        }
      };
    },
    hints: [
      "60 Hz 는 한 장면 시간이 길지만 화면이 늦게 바뀌어 지연이 커지고, 120 Hz 는 지연은 짧지만 한 장면 시간이 8.3 ms 뿐입니다.",
      "90 Hz 에서는 한 장면에 11.1 ms. 렌더링 11 ms 면 지연은 2 + 11 + 5.6 = 18.6 ms."
    ],
    solution: "<b>90 Hz</b>, 렌더링 <b>11 ms</b>.",
    why: "가상현실 기기는 재생률과 지연 사이에서 균형을 잡아야 합니다. 재생률을 높이면 화면이 자주 바뀌어 지연이 줄지만, 한 장면을 그릴 시간이 짧아져 그래픽을 단순하게 해야 하지요. 그래서 많은 VR 기기가 90 Hz 안팎을 씁니다.<br>" +
      "가상현실의 가능성(몰입감·섬세한 그래픽)과 한계(멀미·계산 능력)가 한 기기 안에서 맞부딪치는 셈입니다. ※ 지연 계산은 수업용으로 단순화했습니다."
  },

  /* ------------------------------------------------------------------ 3. 추천 알고리즘과 숙의 */
  {
    id: "c3", tag: "집단적 의사결정 · 추천 알고리즘", title: "토론 앱의 추천 폭", short: "추천 폭",
    who: "📱", name: "시민 토론 앱 개발팀",
    say: "“주민 120명이 쓰는 토론 앱을 만들어요. 앱은 <b>내 의견과 차이가 어느 폭 이하인 글만</b> 추천해요. 폭을 좁히면 편한 글만 보여 만족도는 높지만… 12번의 토론 뒤 주민 의견의 <b>흩어짐이 0.2 이하</b>(서로 대화할 수 있는 거리)가 되게 하려면, 추천 폭을 적어도 얼마로 해야 할까요?”",
    predict: {
      q: "추천 폭을 아주 좁게 해서 나와 비슷한 의견만 보여 주면, 토론이 거듭될수록 주민 전체의 의견은?",
      options: ["㉠ 하나로 모인다", "㉡ 비슷한 사람끼리 따로 뭉쳐 무리가 갈라진 채 남는다", "㉢ 아무렇게나 흩어진다"],
      answer: 1
    },
    task: "추천 폭을 정해 <b>흩어짐 0.2 이하</b>가 되는 <b>가장 좁은</b> 폭을 찾으세요(± 0.1).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W;
      var d = 0.3, NP = 120;
      var INIT = (function () { var r = mulberry(777), a = []; for (var i = 0; i < NP; i++) { var u = r(); a.push(u < 0.5 ? -1 + Math.pow(r(), 1.4) * 1.1 : 1 - Math.pow(r(), 1.4) * 1.1); } return a; })();
      var cache = {};
      function sim(dd) {
        var key = dd.toFixed(2); if (cache[key]) return cache[key];
        var a = INIT.slice(), r = mulberry(1234);
        for (var n = 0; n < 12; n++) {
          var nx = a.slice();
          for (var i = 0; i < NP; i++) {
            var p = [], t = 0;
            while (p.length < 5 && t < 60) { var j = Math.floor(r() * NP); t++; if (j === i) continue; if (Math.abs(a[j] - a[i]) > dd) continue; p.push(a[j]); }
            if (!p.length) continue;
            var m = p.reduce(function (x, y) { return x + y; }, 0) / p.length;
            nx[i] = a[i] + (m - a[i]) * 0.22;
          }
          a = nx;
        }
        cache[key] = a; return a;
      }
      function sd(a) { var m = a.reduce(function (x, y) { return x + y; }, 0) / a.length; return Math.sqrt(a.reduce(function (s, x) { return s + (x - m) * (x - m); }, 0) / a.length); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var a = sim(d), s = sd(a);
        H.text(ctx, "12번 토론 뒤 주민 의견 분포", 40, 26, { s: 13.5, w: "900" });
        var x0 = 60, x1 = 540, y1 = 250, B = 24, hist = [];
        for (var b = 0; b < B; b++) hist.push(0);
        a.forEach(function (x) { var k = Math.floor((Math.max(-1.2, Math.min(1.2, x)) + 1.2) / 2.4 * B); hist[Math.max(0, Math.min(B - 1, k))]++; });
        var mx = Math.max.apply(null, hist);
        hist.forEach(function (c, k) { var h = c / Math.max(8, mx) * 190; H.box(ctx, x0 + k * (x1 - x0) / B + 2, y1 - h, (x1 - x0) / B - 4, h, H.v("--brand"), 0.8); });
        H.axes(ctx, x0, 50, x1, y1);
        H.text(ctx, "← 반대", x0, y1 + 18, { s: 11, c: H.v("--mist") });
        H.text(ctx, "찬성 →", x1, y1 + 18, { s: 11, a: "right", c: H.v("--mist") });
        H.rows(ctx, 590, 70, [
          ["추천 폭", d.toFixed(1)],
          ["처음 흩어짐", sd(INIT).toFixed(2)],
          ["12번 뒤 흩어짐", s.toFixed(2), s <= 0.2 ? "--green-700" : "--rose-700", true]
        ], 62);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "추천 폭 (의견 차이가 이 값 이하인 글만 보여 줌)", min: 0.2, max: 2.0, step: 0.1, value: 0.3, fmt: function (x) { return x.toFixed(1); }, onInput: function (x) { d = Math.round(x * 10) / 10; draw(); } });
      api.info("의견은 −1(반대)부터 +1(찬성)까지입니다. 폭이 2 면 모든 글이 보이고, 0.2 면 거의 같은 생각의 글만 보입니다.");
      draw();
      return {
        judge: function () {
          var s = sd(sim(d));
          if (s > 0.2) return { ok: false, msg: "흩어짐 " + s.toFixed(2) + " — 주민들이 서로 다른 무리로 갈라진 채 남았습니다." };
          if (d > 0.9 + 1e-9) return { ok: false, msg: "흩어짐은 줄었지만 폭 " + d.toFixed(1) + " 은 필요 이상으로 넓습니다. 가장 좁은 폭을 찾으세요." };
          return { ok: true, msg: "추천 폭 " + d.toFixed(1) + " → 흩어짐 " + s.toFixed(2) + ". 나와 조금 다른 의견까지 보여 주자 무리 사이에 다리가 놓였습니다." };
        }
      };
    },
    hints: [
      "폭이 좁으면 양쪽 끝의 무리가 서로의 글을 전혀 보지 못합니다. 두 무리가 서로의 글을 볼 수 있을 만큼 넓혀 보세요.",
      "0.7 과 0.8 사이에서 흩어짐이 크게 달라집니다."
    ],
    solution: "추천 폭 <b>0.8</b>(0.8 ~ 0.9).",
    why: "추천 알고리즘이 나와 비슷한 의견만 보여 주면, 사람들은 편안하지만 비슷한 무리끼리만 이야기하게 됩니다(필터 버블, 반향실). 이야기 ④의 ‘끼리끼리’ 토론과 같은 구조예요.<br>" +
      "조금 불편하더라도 <b>나와 다른 의견을 만날 수 있게</b> 설계해야 사회 전체가 대화할 수 있는 거리를 유지합니다. 과학기술(알고리즘)의 설계가 집단적 의사결정의 질을 좌우하는 셈입니다. ※ 사람의 판단을 크게 단순화한 모형입니다."
  }
  ]
});
})();
