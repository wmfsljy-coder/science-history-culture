/* 과학의 역사와 문화 Ⅰ 과학과 문명의 탄생과 통합 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 해시계 영침의 높이 */
  {
    id: "c1", tag: "조선의 과학 · 해의 고도", title: "학교 앞마당의 앙부일구", short: "해시계 영침",
    who: "☀️", name: "과학 동아리 선배",
    say: "“세종 때의 앙부일구는 오목한 반구 모양이지만, 우리는 학교 앞마당(북위 <b>37.5°</b>)에 만들기 쉬운 평평한 해시계를 만들려고 해요. 판의 반지름은 <b>50 cm</b>. 정오의 그림자가 <b>동지</b>에는 판 밖으로 나가지 않아야 하고, <b>하지</b>에도 <b>5 cm</b> 이상은 되어야 눈금을 읽을 수 있어요. 영침(그림자 막대)의 높이를 정해 주세요.”",
    predict: {
      q: "정오의 그림자는 언제 가장 길까요?",
      options: ["㉠ 해가 가장 높이 뜨는 하지", "㉡ 해가 가장 낮게 뜨는 동지", "㉢ 계절과 관계없이 같다"],
      answer: 1
    },
    task: "영침 높이를 정해 동지 그림자 <b>≤ 50 cm</b>, 하지 그림자 <b>≥ 5 cm</b>를 모두 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(260), ctx = cv.ctx, W = cv.W, h = 40, LAT = 37.5;
      var alt = { w: 90 - LAT - 23.44, s: 90 - LAT + 23.44 };
      function sh(k) { return h / Math.tan(alt[k] * Math.PI / 180); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var gx = 60, gy = 210, sc = 5;
        H.box(ctx, gx, gy, 50 * sc, 6, H.v("--amber"), 0.35);
        H.text(ctx, "해시계 판 50 cm", gx + 50 * sc, gy + 22, { s: 10.5, w: "800", a: "right", c: H.v("--amber-700") });
        H.line(ctx, [[gx, gy], [gx, gy - h * sc * 0.6]], H.v("--ink"), 4);
        H.text(ctx, "영침", gx - 10, gy - h * sc * 0.3 - 4, { s: 11, w: "800", a: "right", c: H.v("--ink") }); H.text(ctx, h + " cm", gx - 10, gy - h * sc * 0.3 + 10, { s: 11, w: "800", a: "right", c: H.v("--ink") });
        var ws = sh("w"), ss = sh("s");
        H.line(ctx, [[gx, gy - 12], [gx + Math.min(ws, 110) * sc, gy - 12]], H.v("--cold"), 6);
        H.text(ctx, "동지 " + ws.toFixed(1) + " cm", gx + Math.min(ws, 110) * sc * 0.5, gy - 22, { s: 11, w: "800", a: "center", c: H.v("--cold") });
        H.line(ctx, [[gx, gy - 38], [gx + ss * sc, gy - 38]], H.v("--coral"), 6);
        H.text(ctx, "하지 " + ss.toFixed(1) + " cm", gx + Math.max(ss * sc, 70) + 6, gy - 34, { s: 11, w: "800", c: H.v("--coral") });
        H.dash(ctx, gx + 50 * sc, 40, gx + 50 * sc, gy, H.v("--rose"), 1.5);
        H.rows(ctx, 640, 40, [["정오 태양 고도", "동지 " + alt.w.toFixed(1) + "° · 하지 " + alt.s.toFixed(1) + "°"], ["동지 그림자", ws.toFixed(1) + " cm", ws <= 50 ? "--green-700" : "--rose-700", true], ["하지 그림자", ss.toFixed(1) + " cm", ss >= 5 ? "--green-700" : "--rose-700", true]], 62);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "영침 높이", min: 5, max: 50, step: 1, value: 40, fmt: function (x) { return x + " cm"; }, onInput: function (x) { h = Math.round(x); draw(); api.changed(); } });
      api.info("정오의 태양 고도 = 90° − 위도 ± 23.4° (하지 +, 동지 −). 그림자 길이 = 영침 높이 ÷ tan(태양 고도).");
      draw();
      return {
        judge: function () {
          var ws = sh("w"), ss = sh("s");
          if (ws <= 50 && ss >= 5) return { ok: true, msg: "영침 " + h + " cm → 동지 " + ws.toFixed(1) + " cm, 하지 " + ss.toFixed(1) + " cm. 일 년 내내 판 위에서 읽을 수 있습니다." };
          if (ws > 50) return { ok: false, msg: "동지 그림자 " + ws.toFixed(1) + " cm — 판 밖으로 나갑니다. 영침을 낮추세요." };
          return { ok: false, msg: "하지 그림자 " + ss.toFixed(1) + " cm — 너무 짧아 읽기 어렵습니다. 영침을 높이세요." };
        }
      };
    },
    hints: ["동지 그림자는 영침 높이의 약 1.8배, 하지 그림자는 약 0.25배입니다.", "50 ÷ 1.8 ≈ 27.8, 5 ÷ 0.25 ≈ 20 사이로 정하세요."],
    solution: "영침 높이 <b>20~27 cm</b>.",
    why: "해의 높이는 위도와 계절에 따라 달라지므로, 해시계는 <b>그 땅의 위도</b>에 맞춰 만들어야 합니다. 조선의 앙부일구가 오목한 반구 모양에 한양의 위도에 맞춘 절기선을 새긴 까닭입니다. 남의 하늘에 맞춘 역법 대신 『칠정산』을 만든 것과 같은 생각입니다.<br>※ 대기의 굴절과 태양의 크기는 무시한 단순 계산입니다."
  },

  /* ------------------------------------------------------------------ 2. 에라토스테네스 다시 하기 */
  {
    id: "c2", tag: "그리스의 방법 · 측정 오차", title: "우리나라에서 지구 둘레 재기", short: "지구 둘레 재기",
    who: "📏", name: "전국 과학 교사 모임",
    say: "“에라토스테네스처럼 두 학교가 같은 날 정오에 막대 그림자로 태양 고도를 재어 지구 둘레를 구하려 해요. 서울의 짝 학교를 골라 주세요. 막대 관측은 아무리 조심해도 각도에 <b>0.1° 이상</b>의 오차가 생겨요. 지구 둘레의 오차를 <b>5% 이하</b>로 줄이고 싶어요.”",
    predict: {
      q: "각도 오차가 같다면, 서울과 가까운 도시를 고를수록 결과가 어떻게 될까요?",
      options: ["㉠ 더 정확해진다 — 거리를 재기 쉬우니까", "㉡ 덜 정확해진다 — 두 곳의 각도 차이가 작아 오차의 비중이 커지니까", "㉢ 거리와 관계없다"],
      answer: 1
    },
    task: "짝 도시와 각도 측정 오차를 정해 지구 둘레의 오차를 <b>5% 이하</b>로 만드세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(250), ctx = cv.ctx, W = cv.W, city = "dj", err = 0.2;
      var C = { sw: { t: "수원", dl: 0.30 }, dj: { t: "대전", dl: 1.21 }, bs: { t: "부산", dl: 2.39 }, jj: { t: "제주", dl: 4.07 } };
      function rel() { return err / C[city].dl; }
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 70, x1 = 560, y = 120;
        function X(dl) { return x0 + dl / 4.5 * (x1 - x0); }
        H.line(ctx, [[x0, y], [x1, y]], H.v("--line"), 3);
        H.dot(ctx, x0, y, 7, H.v("--brand")); H.text(ctx, "서울", x0, y - 16, { s: 11, w: "800", a: "center" });
        Object.keys(C).forEach(function (k) {
          var c = C[k], on = k === city;
          H.dot(ctx, X(c.dl), y, on ? 8 : 5, on ? H.v("--coral") : H.v("--mist"));
          H.text(ctx, c.t, X(c.dl), y - 16, { s: 11, w: on ? "900" : "600", a: "center", c: on ? H.v("--coral") : H.v("--mist") });
          H.text(ctx, c.dl.toFixed(2) + "°", X(c.dl), y + 22, { s: 10, a: "center", c: H.v("--mist") });
        });
        var c = C[city], lo = c.dl - err, hi = c.dl + err;
        H.box(ctx, X(Math.max(0, lo)), y + 34, X(hi) - X(Math.max(0, lo)), 10, H.v("--amber"), 0.5);
        H.text(ctx, "각도 차이의 불확실한 범위", X(c.dl), y + 60, { s: 10.5, w: "700", a: "center", c: H.v("--amber-700") });
        H.text(ctx, "위도 차이(남북 방향 각도)", x0, 30, { s: 12, w: "800" });
        var r = rel(), d = c.dl * 111.2, circ = 360 / c.dl * d;
        H.rows(ctx, 620, 40, [["남북 거리", Math.round(d) + " km"], ["계산한 둘레", Math.round(circ).toLocaleString() + " km ± " + Math.round(circ * r).toLocaleString()], ["둘레의 오차", (r * 100).toFixed(1) + "%", r <= 0.05 + 1e-9 ? "--green-700" : "--rose-700", true]], 58);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "짝 도시", value: "dj", options: [{ v: "sw", t: "수원" }, { v: "dj", t: "대전" }, { v: "bs", t: "부산" }, { v: "jj", t: "제주" }], onPick: function (x) { city = x; draw(); api.changed(); } });
      api.slider({ label: "각도 측정 오차", min: 0.1, max: 0.5, step: 0.05, value: 0.2, fmt: function (x) { return "± " + x.toFixed(2) + "°"; }, onInput: function (x) { err = Math.round(x * 100) / 100; draw(); api.changed(); } });
      api.info("둘레의 상대 오차 ≈ 각도 오차 ÷ 두 도시의 각도 차이. 각도 오차는 0.1°보다 작게 할 수 없습니다.");
      draw();
      return {
        judge: function () {
          var r = rel();
          if (r <= 0.05 + 1e-9) return { ok: true, msg: "서울–" + C[city].t + ", 오차 ±" + err.toFixed(2) + "° → 둘레 오차 " + (r * 100).toFixed(1) + "%." };
          return { ok: false, msg: "둘레 오차 " + (r * 100).toFixed(1) + "% — " + (C[city].dl < 2 ? "두 도시의 각도 차이가 너무 작습니다. 더 먼 도시를 골라 보세요." : "각도를 더 정밀하게 재 보세요.") };
        }
      };
    },
    hints: ["0.1° ÷ 5% = 2°. 서울과 위도가 2° 이상 차이 나는 도시가 필요합니다.", "부산(오차 ±0.10°) 또는 제주(오차 ±0.20° 이하)를 고르세요."],
    solution: "<b>부산</b>에서 오차 ±0.10°, 또는 <b>제주</b>에서 오차 ±0.20° 이하.",
    why: "측정 오차가 같다면 <b>재려는 차이가 클수록</b> 상대 오차가 작아집니다. 에라토스테네스가 멀리 떨어진 시에네와 알렉산드리아를 쓴 것도, 오늘날 측지 측량이 먼 기준점을 쓰는 것도 같은 이유입니다.<br>※ 위도 1°는 약 111 km, 두 도시가 정확히 남북에 있다고 가정한 계산입니다."
  },

  /* ------------------------------------------------------------------ 3. 케플러 제3법칙 */
  {
    id: "c3", tag: "과학혁명 · 케플러 법칙", title: "새로 찾은 소행성의 궤도", short: "케플러 제3법칙",
    who: "🔭", name: "1801년 팔레르모 천문대",
    say: "“새로운 천체를 찾았어요! 몇 주 동안 관측한 자료로 궤도를 계산해 보니 태양을 한 바퀴 도는 데 <b>약 4.6년</b>이 걸려요. 케플러는 ‘행성의 공전 주기의 제곱은 궤도 크기의 세제곱에 비례한다’고 했지요. 이 천체는 태양에서 얼마나 떨어져 있을까요? (지구 궤도 = 1 AU, 1년)”",
    predict: {
      q: "태양에서 두 배 먼 행성의 공전 주기는?",
      options: ["㉠ 두 배", "㉡ 약 2.8배", "㉢ 네 배"],
      answer: 1
    },
    task: "궤도 반지름을 조절해 공전 주기가 <b>4.4~4.8년</b>이 되게 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, a = 1.5;
      var PL = [["수성", 0.387], ["금성", 0.723], ["지구", 1], ["화성", 1.524], ["목성", 5.203]];
      function T(x) { return Math.pow(x, 1.5); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 60, x1 = 580, y0 = 30, y1 = 230;
        function X(r) { return x0 + r / 6 * (x1 - x0); }
        function Y(t) { return y1 - Math.min(t, 15) / 15 * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        var pts = []; for (var r = 0; r <= 6; r += 0.05) pts.push([X(r), Y(T(r))]);
        ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip(); H.line(ctx, pts, H.v("--line"), 2); ctx.restore();
        PL.forEach(function (p) { H.dot(ctx, X(p[1]), Y(T(p[1])), 5, H.v("--mist")); H.text(ctx, p[0], X(p[1]) + 7, Y(T(p[1])) + 14, { s: 10.5, w: "700", c: H.v("--mist") }); });
        H.box(ctx, x0, Y(4.8), x1 - x0, Y(4.4) - Y(4.8), H.v("--green"), 0.15);
        H.dot(ctx, X(a), Y(T(a)), 8, H.v("--coral"));
        [0, 2, 4, 6].forEach(function (r) { H.text(ctx, r + " AU", X(r), y1 + 16, { s: 10, a: "center", c: H.v("--mist") }); });
        [0, 5, 10, 15].forEach(function (t) { H.text(ctx, t + "년", x0 - 6, Y(t) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        var t = T(a);
        H.rows(ctx, 630, 50, [["궤도 반지름", a.toFixed(2) + " AU"], ["공전 주기 = a^1.5", t.toFixed(2) + "년", t >= 4.4 && t <= 4.8 ? "--green-700" : "--rose-700", true], ["T² ÷ a³", (t * t / (a * a * a)).toFixed(2)]], 58);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "궤도 반지름", min: 0.3, max: 6, step: 0.01, value: 1.5, fmt: function (x) { return x.toFixed(2) + " AU"; }, onInput: function (x) { a = Math.round(x * 100) / 100; draw(); api.changed(); } });
      api.info("회색 점은 이미 알려진 행성들입니다. 모두 같은 곡선 T² = a³ 위에 놓입니다.");
      draw();
      return {
        judge: function () {
          var t = T(a);
          if (t >= 4.4 && t <= 4.8) return { ok: true, msg: "궤도 반지름 " + a.toFixed(2) + " AU → 공전 주기 " + t.toFixed(2) + "년. 화성과 목성 사이입니다." };
          return { ok: false, msg: "공전 주기 " + t.toFixed(2) + "년 — " + (t < 4.4 ? "궤도를 더 크게 하세요." : "궤도를 더 작게 하세요.") };
        }
      };
    },
    hints: ["4.6² ≈ 21.2이므로 a³ ≈ 21.2 인 a를 찾으세요.", "a는 약 2.7~2.85 AU입니다."],
    solution: "궤도 반지름 <b>약 2.69~2.84 AU</b> (4.6년이면 약 2.77 AU).",
    why: "케플러는 ‘우주는 수학적 조화로 이루어졌다’는 신념으로 행성들의 주기와 거리 사이의 관계를 10년 넘게 찾아 제3법칙을 얻었습니다. 1801년 발견된 세레스는 실제로 약 2.77 AU, 4.6년 주기로 화성과 목성 사이를 돕니다. 신념이 이끈 법칙이 새로운 천체의 위치를 예측하는 도구가 된 것입니다."
  }
  ]
});
})();
