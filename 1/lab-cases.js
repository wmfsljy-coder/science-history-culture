/* 과학의 역사와 문화 Ⅰ 과학과 문명의 탄생과 통합 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 해시계 영침의 높이 */
  {
    id: "c1", about: "03", tag: "조선의 과학 · 해의 고도", title: "학교 앞마당의 앙부일구", short: "해시계 영침",
    who: "☀️", name: "과학 동아리 선배",
    say: "“세종 때의 앙부일구는 오목한 반구 모양이지만, 우리는 학교 앞마당(북위 <b>37.5°</b>)에 만들기 쉬운 평평한 해시계를 만들려고 해요. 판의 반지름은 <b>50 cm</b>. 정오의 그림자가 <b>동지</b>에는 판 밖으로 나가지 않아야 하고, <b>하지</b>에도 <b>5 cm</b> 이상은 되어야 눈금을 읽을 수 있어요. 영침(그림자 막대)의 높이를 정해 주세요.”",
    predict: {
      q: "정오의 그림자는 언제 가장 길까요?",
      options: ["㉠ 해가 가장 높이 뜨는 하지", "㉡ 해가 가장 낮게 뜨는 동지", "㉢ 계절과 관계없이 같다"],
      answer: 1
    },
    task: "영침 높이를 정해 동지 그림자 <b>≤ 50 cm</b>, 하지 그림자 <b>≥ 5 cm</b>를 모두 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, h = 40, LAT = 37.5;
      var alt = { w: 90 - LAT - 23.44, s: 90 - LAT + 23.44 };
      function sh(k) { return h / Math.tan(alt[k] * Math.PI / 180); }
        function draw() {
        var K = window.sthKit, SP = window.sthSP19, LT = K.LT, CH = cv.H;
        var ws = sh("w"), ss = sh("s"), ok = ws <= 50 && ss >= 5;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, W, CH, { x: 380, y: 276, rx: 250, ry: 22 });
        /* 학교 앞마당 블록 + 나무 해시계 판 + 놋쇠 영침 (x 방향 = 북쪽) */
        var I = K.iso({ ox: 360, oy: 122, s: 0.75, L: 300, D: 110 }), Z = 12, sc = 2.5, B = Z + 5, G0 = 12, GY = 55;
        SP.box(ctx, I, 0, 0, 0, I.L, I.D, Z, "stone", { edge: true });
        ctx.strokeStyle = "rgba(120,105,80,.35)"; ctx.lineWidth = 1;
        for (var k = 40; k < I.L; k += 40) { var a1 = I.P(k, 0, Z), b1 = I.P(k, I.D, Z); ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(b1.x, b1.y); ctx.stroke(); }
        SP.box(ctx, I, G0 - 6, GY - 26, Z, G0 + 50 * sc, GY + 26, B, "wood", { grain: true });
        function bar(len, dy, col) {
          var x1 = G0 + Math.min(len, 110) * sc, z1 = x1 <= G0 + 50 * sc ? B : Z;
          SP.poly(ctx, [I.P(G0, GY + dy - 3, B + .3), I.P(Math.min(x1, G0 + 50 * sc), GY + dy - 3, B + .3), I.P(Math.min(x1, G0 + 50 * sc), GY + dy + 3, B + .3), I.P(G0, GY + dy + 3, B + .3)], col);
          if (x1 > G0 + 50 * sc) SP.poly(ctx, [I.P(G0 + 50 * sc, GY + dy - 3, Z + .3), I.P(x1, GY + dy - 3, Z + .3), I.P(x1, GY + dy + 3, Z + .3), I.P(G0 + 50 * sc, GY + dy + 3, Z + .3)], col);
          return I.P(x1, GY + dy, z1);
        }
        var top = I.P(G0, GY, B + h * sc), tw = bar(ws, 8, "rgba(28,126,214,.85)"), tsu = bar(ss, -8, "rgba(224,49,49,.85)");
        SP.poly(ctx, [I.P(G0 + 50 * sc, GY - 26, B + .4), I.P(G0 + 50 * sc, GY + 26, B + .4)], null, "rgba(224,49,49,.9)", 2);
        ctx.save(); ctx.setLineDash([5, 4]); ctx.lineWidth = 1.4;
        [[tw, LT.blue], [tsu, LT.red]].forEach(function (q) { var dx = top.x - q[0].x, dy = top.y - q[0].y; ctx.strokeStyle = q[1]; ctx.beginPath(); ctx.moveTo(q[0].x, q[0].y); ctx.lineTo(top.x + dx * .5, top.y + dy * .5); ctx.stroke(); });
        ctx.restore();
        var bt = I.P(G0, GY, B); ctx.strokeStyle = "#8a5d14"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(bt.x, bt.y); ctx.lineTo(top.x, top.y); ctx.stroke(); ctx.lineCap = "butt";
        ctx.strokeStyle = "#f2cf74"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(bt.x - 1, bt.y); ctx.lineTo(top.x - 1, top.y); ctx.stroke();
        K.planet(ctx, top.x, top.y, 4, "#ffe9a8", "#7a5010");
        var bx = [0, 604];
        K.pill(ctx, "영침 " + h + " cm", top.x - 10, top.y - 4, { s: 11.5, a: "right", c: "#ffe3a0", box: bx });
        K.pill(ctx, "동지 " + ws.toFixed(1) + " cm", tw.x + 10, tw.y + 22, { s: 11.5, c: "#bfe6ff", box: bx });
        K.pill(ctx, "하지 " + ss.toFixed(1) + " cm", tsu.x + 12, tsu.y - 10, { s: 11.5, c: "#ffb3bd", box: bx });
        I.label(ctx, G0 + 50 * sc, GY - 26, B, "판 끝 · 50 cm", 30, -30, "#ffb3bd", bx);
        K.pill(ctx, "→ 북쪽 (정오의 그림자 방향)", 16, CH - 14, { s: 11, c: KC2(K) });
        SP.card(ctx, 616, 14, 270, CH - 28, "정오의 그림자 (북위 37.5°)", [
          ["정오 태양 고도", "동지 " + alt.w.toFixed(1) + "° · 하지 " + alt.s.toFixed(1) + "°"],
          ["동지 그림자", ws.toFixed(1) + " cm", ws <= 50 ? LT.green : LT.red],
          ["하지 그림자", ss.toFixed(1) + " cm", ss >= 5 ? LT.green : LT.red]
        ], [ok ? "일 년 내내 판 위에서 읽힌다" : (ws > 50 ? "동지 그림자가 판 밖으로" : "하지 그림자가 너무 짧다"), ok], { top: 62, gap: 30 });
        K.bigText(ctx, "영침 " + h + " cm", 22, 44, 24, ok ? "#ffd35a" : "#ffffff");
      }
      function KC2(K) { return K.C.ink; }
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
    id: "c2", about: "02", tag: "그리스의 방법 · 측정 오차", title: "우리나라에서 지구 둘레 재기", short: "지구 둘레 재기",
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
        var K = window.sthKit, SP = window.sthSP19, LT = K.LT, CH = cv.H;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, W, CH, { x: 300, y: 222, rx: 290, ry: 20 });
        var x0 = 64, x1 = 560, ty = 158, c = C[city], r = rel(), d = c.dl * 111.2, circ = 360 / c.dl * d, ok = r <= 0.05 + 1e-9;
        function X(dl) { return x0 + dl / 4.5 * (x1 - x0); }
        /* 나무 자: 윗면(비스듬) + 앞면 */
        SP.poly(ctx, [{ x: x0 - 30, y: ty }, { x: x1 + 30, y: ty }, { x: x1 + 16, y: ty + 18 }, { x: x0 - 44, y: ty + 18 }], "#e6c08a");
        var fg = ctx.createLinearGradient(0, ty + 18, 0, ty + 34); fg.addColorStop(0, "#b07a42"); fg.addColorStop(1, "#7d5228");
        ctx.fillStyle = fg; ctx.fillRect(x0 - 44, ty + 18, x1 - x0 + 60, 16);
        SP.poly(ctx, [{ x: x1 + 16, y: ty + 18 }, { x: x1 + 30, y: ty }, { x: x1 + 30, y: ty + 16 }, { x: x1 + 16, y: ty + 34 }], "#6a4422");
        ctx.strokeStyle = "rgba(90,55,20,.7)"; ctx.lineWidth = 1;
        for (var q = 0; q <= 45; q++) { var tx = X(q / 10), long = q % 10 === 0; ctx.beginPath(); ctx.moveTo(tx - 2, ty + 2); ctx.lineTo(tx - 2 - (long ? 8 : 4) * .78, ty + (long ? 12 : 6)); ctx.stroke(); }
        [0, 1, 2, 3, 4].forEach(function (v) { SP.lbl(ctx, v + "°", X(v) - 4, ty + 30, { s: 10, a: "center", c: "#fff4dc" }); });
        /* 불확실한 범위(호박색 띠) */
        var lo = Math.max(0, c.dl - err), hi = c.dl + err;
        ctx.fillStyle = "rgba(245,159,0,.45)"; SP.poly(ctx, [{ x: X(lo), y: ty + 3 }, { x: X(hi), y: ty + 3 }, { x: X(hi) - 10, y: ty + 15 }, { x: X(lo) - 10, y: ty + 15 }], "rgba(245,159,0,.5)", "#c27c00");
        /* 도시 핀 */
        function pin(px, hgt, col, dark, big) { ctx.strokeStyle = "#8a6a3a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px - 4, ty + 9); ctx.lineTo(px - 4, ty + 9 - hgt); ctx.stroke(); K.planet(ctx, px - 4, ty + 9 - hgt, big ? 9 : 6, col, dark); }
        pin(X(0), 52, "#5aa0e8", "#123a7a", true);
        K.pill(ctx, "서울", X(0) - 14, ty - 50, { s: 11.5, a: "right", c: "#bfe6ff" });
        Object.keys(C).forEach(function (k, n) {
          var cc = C[k], on = k === city, hg = 40 + (n % 2) * 26;
          pin(X(cc.dl), hg, on ? "#ff8a6a" : "#c9ced6", on ? "#8a2a10" : "#5a6270", on);
          K.pill(ctx, cc.t + " " + cc.dl.toFixed(2) + "°", X(cc.dl) - 4, ty + 9 - hg - 14, { s: on ? 12 : 10.5, a: "center", c: on ? "#ffc2b0" : "#dfe5ee", box: [0, 600] });
        });
        K.pill(ctx, "호박색 띠 = 각도 차이의 불확실한 범위", 16, CH - 12, { s: 11, c: "#ffe3a0" });
        SP.card(ctx, 616, 14, 270, CH - 28, "서울과의 위도 차이로 잰 둘레", [
          ["남북 거리", Math.round(d) + " km"],
          ["계산한 둘레", Math.round(circ).toLocaleString() + " km"],
          ["± 오차", Math.round(circ * r).toLocaleString() + " km", LT.orange],
          ["둘레의 오차", (r * 100).toFixed(1) + "%", ok ? LT.green : LT.red]
        ], [ok ? "5% 이하!" : "5%를 넘는다", ok], { top: 56, gap: 26 });
        K.bigText(ctx, "오차 " + (r * 100).toFixed(1) + "%", 22, 44, 24, ok ? "#ffd35a" : "#ffffff");
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
    id: "c3", about: "04", tag: "과학혁명 · 케플러 법칙", title: "새로 찾은 소행성의 궤도", short: "케플러 제3법칙",
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
        var K = window.sthKit, SP = window.sthSP19, LT = K.LT, CH = cv.H, t = T(a), ok = t >= 4.4 && t <= 4.8;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, W, CH, { x: 540, y: 236, rx: 110, ry: 18 });
        var g = SP.chart(ctx, { x: 10, y: 24, w: 430, h: CH - 34, x0: 0, x1: 6, y0: 0, y1: 15, xt: 6, yt: 3, xl: "궤도 반지름(AU)", yl: "공전 주기(년)" });
        ctx.fillStyle = "rgba(15,159,118,.16)"; ctx.fillRect(g.L, g.Y(4.8), g.R - g.L, g.Y(4.4) - g.Y(4.8));
        var pts = []; for (var r = 0; r <= 6; r += 0.05) if (T(r) <= 15.5) pts.push([r, T(r)]);
        ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T, g.R - g.L, g.B - g.T); ctx.clip(); SP.plot(ctx, g, pts, LT.violet, { glow: false }); ctx.restore();
        PL.forEach(function (p) { ctx.fillStyle = "#8a96a8"; ctx.beginPath(); ctx.arc(g.X(p[1]), g.Y(T(p[1])), 4.5, 0, 6.2832); ctx.fill(); SP.lbl(ctx, p[0], g.X(p[1]) + 7, g.Y(T(p[1])) + (p[0] === "수성" ? -6 : 14), { s: 10.5, c: LT.mute }); });
        ctx.fillStyle = ok ? LT.green : LT.red; ctx.beginPath(); ctx.arc(g.X(a), g.Y(Math.min(t, 15)), 7, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
        SP.lbl(ctx, "초록 띠 = 4.4~4.8년", g.R - 4, g.Y(4.8) - 6, { s: 10.5, a: "right", c: LT.green });
        /* 작은 태양계 모형: 궤도판 위의 새 천체 */
        var ox = 540, oy = 150, sc = 15, SY = .45;
        SP.cyl(ctx, ox, oy, 96, 96 * SY, 8, "navy", { top: "#1d2b55" });
        [[1, "#7fd3ff"], [1.524, "#ff9a6a"], [5.203, "#e8c48a"]].forEach(function (o) { ctx.strokeStyle = o[1]; ctx.globalAlpha = .7; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(ox, oy, Math.min(o[0] * sc + 6, 92), Math.min(o[0] * sc + 6, 92) * SY, 0, 0, 6.2832); ctx.stroke(); ctx.globalAlpha = 1; });
        var ra = Math.min(a * sc + 6, 92);
        ctx.save(); ctx.strokeStyle = ok ? "#5fe0b0" : "#ff8a8a"; ctx.lineWidth = 2.4; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 6; ctx.beginPath(); ctx.ellipse(ox, oy, ra, ra * SY, 0, 0, 6.2832); ctx.stroke(); ctx.restore();
        K.sun(ctx, ox, oy, 5); K.planet(ctx, ox + ra * .7, oy + ra * SY * .71, 5, ok ? "#a8f0d0" : "#ffc0c0", "#333");
        K.pill(ctx, "목성", ox + Math.min(5.203 * sc + 6, 92) - 4, oy - 6, { s: 10, a: "right", c: "#f3dcae" });
        K.pill(ctx, "작은 태양계 모형", ox, oy + 70, { s: 10.5, a: "center", c: KCi(K) });
        SP.card(ctx, 650, 14, 236, CH - 28, "케플러 제3법칙 T² = a³", [
          ["궤도 반지름 a", a.toFixed(2) + " AU", LT.blue],
          ["공전 주기 T", t.toFixed(2) + "년", ok ? LT.green : LT.red],
          ["T² ÷ a³", (t * t / (a * a * a)).toFixed(2)]
        ], [ok ? "관측한 4.6년과 맞는다" : (t < 4.4 ? "궤도를 더 크게" : "궤도를 더 작게"), ok], { top: 62, gap: 30 });
      }
      function KCi(K) { return K.C.ink; }
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
