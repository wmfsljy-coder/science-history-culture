/* 과학의 역사와 문화 Ⅱ 변화하는 과학과 세계 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 상대성 이론: 뮤온 */
  {
    id: "c1", about: "01", tag: "상대성 이론 · 시간 지연", title: "하늘에서 쏟아지는 뮤온", short: "뮤온의 수명",
    who: "⚛️", name: "우주선 관측소 연구원",
    say: "“우주에서 온 입자가 지상 <b>15 km</b> 높이의 공기와 부딪히면 <b>뮤온</b>이 생겨요. 뮤온은 <b>1.56 마이크로초</b>마다 절반씩 사라지는 불안정한 입자라, 빛에 가까운 속력으로 달려도 15 km를 가는 동안 거의 다 없어져야 해요. 그런데 지상 검출기에는 많은 뮤온이 잡혀요! 뮤온의 속력이 얼마면 <b>10% 이상</b>이 땅에 닿을까요?”",
    predict: {
      q: "상대성 이론 없이 계산하면, 빛의 속력으로 달리는 뮤온 가운데 땅에 닿는 비율은?",
      options: ["㉠ 절반쯤", "㉡ 100억분의 1 정도로 거의 없다", "㉢ 모두 닿는다"],
      answer: 1
    },
    task: "뮤온의 속력을 조절해 땅에 닿는 비율을 <b>10% 이상</b>으로 만드세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(260), ctx = cv.ctx, W = cv.W, sp = 0.99;
      function calc() { var t = 15000 / (sp * 3e8), g = 1 / Math.sqrt(1 - sp * sp); return { t: t, g: g, rel: Math.pow(0.5, (t / g) / 1.56e-6), cls: Math.pow(0.5, t / 1.56e-6) }; }
          function draw() {
        var K = window.sthKit, SP = window.sthSP19, LT = K.LT, CH = cv.H, r = calc(), ok = r.rel >= 0.1;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, W, CH, { x: 250, y: 240, rx: 190, ry: 14 });
        /* 땅 블록 + 지상 검출기 + 높이 15 km 의 대기 기둥(유리) */
        var I = K.iso({ ox: 262, oy: 150, s: 0.6, L: 200, D: 90 }), Z = 12, TOP = Z + 200;
        SP.box(ctx, I, 0, 0, 0, I.L, I.D, Z, "grass", { edge: false });
        SP.box(ctx, I, 60, 22, Z, 140, 68, Z + 14, "slate");
        I.box(ctx, 62, 24, Z + 14, 138, 66, Z + 15, "#5ad0a0", "#2a8a68", "#1f6a50");
        var alive = Math.round(20 * r.rel), R = K.rng(9);
        for (var i = 0; i < 20; i++) {
          var px = 70 + (i % 10) * 7, py = 32 + Math.floor(i / 10) * 18;
          if (i < alive) { var p = I.P(px, py, Z + 22); K.planet(ctx, p.x, p.y, 4, "#8fc7ff", "#1a4a9a"); }
          else { var q = I.P(16 + R() * 168, 8 + R() * 74, Z + 40 + R() * 150); ctx.strokeStyle = "rgba(232,89,12,.75)"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(q.x - 4, q.y - 4); ctx.lineTo(q.x + 4, q.y + 4); ctx.moveTo(q.x + 4, q.y - 4); ctx.lineTo(q.x - 4, q.y + 4); ctx.stroke(); }
        }
        SP.glass(ctx, I, 0, 0, Z, I.L, I.D, TOP, "170,210,250");
        var t0 = I.P(I.L / 2, I.D / 2, TOP);
        K.arrow(ctx, { x: t0.x, y: t0.y - 14 }, { x: t0.x, y: t0.y + 26 }, LT.blue, 2.4, 9);
        I.label(ctx, 0, I.D, TOP - 20, "높이 15 km · 대기 위쪽에서 뮤온 생성", -24, 10, "#bfe6ff", [0, 460]);
        I.label(ctx, 140, 68, Z + 14, "지상 검출기", 44, 18, "#7ff0c4", [0, 460]);
        K.pill(ctx, "● 땅에 닿은 뮤온  ✕ 도중에 붕괴", 16, CH - 12, { s: 11, c: K.C.ink });
        SP.card(ctx, 470, 14, 416, CH - 28, "뮤온 20개 중 몇 개가 땅에 닿을까", [
          ["걸리는 시간 (지상의 시계)", (r.t * 1e6).toFixed(1) + " μs"],
          ["뮤온의 시계는 몇 배 느리게 (γ)", r.g.toFixed(2) + "배", LT.blue],
          ["상대성 이론 없이", r.cls.toExponential(1).replace("e", "×10^"), LT.mute],
          ["상대성 이론으로 — 닿는 비율", (r.rel * 100).toFixed(1) + "%", ok ? LT.green : LT.red]
        ], [ok ? "10% 넘게 땅에 닿는다" : "거의 다 도중에 붕괴", ok], { top: 58, gap: 30 });
        K.bigText(ctx, "속력 " + sp + "c", 22, 44, 24, ok ? "#ffd35a" : "#ffffff");
      }
    cv.canvas._redraw = draw;
      api.slider({ label: "뮤온의 속력 (빛의 속력의 몇 배)", min: 0.9, max: 0.9995, step: 0.0005, value: 0.99, fmt: function (x) { return x.toFixed(4) + " c"; }, onInput: function (x) { sp = Math.round(x * 10000) / 10000; draw(); api.changed(); } });
      api.info("빠르게 움직이는 뮤온의 시계는 γ 배 느리게 갑니다. 뮤온 입장에서 흐른 시간 = 지상의 시간 ÷ γ.");
      draw();
      return {
        judge: function () {
          var r = calc();
          if (r.rel >= 0.1) return { ok: true, msg: "속력 " + sp.toFixed(4) + " c → 시간이 " + r.g.toFixed(1) + "배 느리게 흘러 " + (r.rel * 100).toFixed(1) + "%가 땅에 닿습니다." };
          return { ok: false, msg: "땅에 닿는 비율 " + (r.rel * 100).toFixed(1) + "% — 속력을 더 빛에 가깝게 해 보세요." };
        }
      };
    },
    hints: ["10%가 남으려면 뮤온의 시계로 약 5.2 μs 안에 도착해야 합니다.", "γ 가 약 10 이상 — 속력 0.995 c 이상입니다."],
    solution: "속력 <b>약 0.995 c 이상</b>.",
    why: "지상에서 잰 시간은 50 μs이지만, 빠르게 움직이는 뮤온의 시간은 γ 배 느리게 흐릅니다. 상대성 이론이 없으면 설명할 수 없는 이 관측(1940년대)은 시간 지연의 직접 증거가 되었습니다. 1919년 일식 관측처럼, 새 이론은 옛 이론과 예측이 크게 갈리는 현상에서 시험됩니다."
  },

  /* ------------------------------------------------------------------ 2. 감염병: 방역 수단 조합 */
  {
    id: "c2", about: "03", tag: "감염병 · 방역", title: "학교 축제를 열어도 될까", short: "축제 방역",
    who: "🎪", name: "학생회 방역 담당",
    say: "“독감이 유행하는 시기에 축제를 열려고 해요. 이 독감의 R0는 <b>3</b>, 우리 학교 학생의 <b>40%</b>는 예방 접종을 했어요. 마스크와 공간 배치(접촉 줄이기)를 조합해서, 환자 한 명이 옮기는 평균 인원을 <b>1 이하</b>로 만들어 주세요.”",
    predict: {
      q: "접종률 40% 만으로 유행을 막을 수 있을까요?",
      options: ["㉠ 막을 수 있다", "㉡ 막을 수 없다 — 3 × 0.6 = 1.8로 아직 1보다 크다", "㉢ 접종은 아무 효과가 없다"],
      answer: 1
    },
    task: "마스크 종류와 접촉 줄이기 비율을 정해 실제 전파 수를 <b>1 이하</b>로 만드세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(230), ctx = cv.ctx, W = cv.W, m = 0, c = 0;
      function re() { return 3 * 0.6 * (1 - m) * (1 - c / 100); }
          function draw() {
        var K = window.sthKit, SP = window.sthSP19, LT = K.LT, CH = cv.H, R1 = re(), ok = R1 <= 1 + 1e-9;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, W, CH, { x: 310, y: 210, rx: 290, ry: 14 });
        var steps = [["R0", 3], ["× 접종 안 한 0.6", 1.8], ["× 마스크 통과 " + (1 - m).toFixed(1), 1.8 * (1 - m)], ["× 접촉 남은 " + (1 - c / 100).toFixed(2), R1]];
        /* 나무 받침 위의 입체 막대(정면 + 윗면 + 옆면) */
        var x0 = 70, bw = 90, y1 = 188, DX = 16, DY = -10, U = 140 / 3;
        SP.poly(ctx, [{ x: 40, y: y1 }, { x: 600, y: y1 }, { x: 600 + DX, y: y1 + DY }, { x: 40 + DX, y: y1 + DY }], "#e4bd86");
        ctx.fillStyle = "#a87640"; ctx.fillRect(40, y1, 560, 10);
        function col(x, h, c0) {
          var c = SP.mt(c0);
          SP.poly(ctx, [{ x: x + bw, y: y1 }, { x: x + bw + DX, y: y1 + DY }, { x: x + bw + DX, y: y1 + DY - h }, { x: x + bw, y: y1 - h }], c[2]);
          SP.poly(ctx, [{ x: x, y: y1 - h }, { x: x + bw, y: y1 - h }, { x: x + bw + DX, y: y1 + DY - h }, { x: x + DX, y: y1 + DY - h }], c[0]);
          var g = ctx.createLinearGradient(x, 0, x + bw, 0); g.addColorStop(0, c[1]); g.addColorStop(1, K.tint(c[1].charAt(0) === "#" ? c[1] : "#888888", .9));
          ctx.fillStyle = g; ctx.fillRect(x, y1 - h, bw, h);
        }
        steps.forEach(function (s, i) {
          var x = x0 + i * 130, h = Math.max(2, s[1] * U), last = i === 3;
          col(x, h, last ? (ok ? "green" : "red") : "white");
          K.pill(ctx, s[1].toFixed(2), x + bw / 2 + DX / 2, y1 - h + DY - 8, { s: 12.5, a: "center", c: last ? (ok ? "#7ff0c4" : "#ffb3bd") : K.C.ink });
          SP.lbl(ctx, s[0], x + bw / 2, y1 + 26, { s: 10.5, a: "center", c: LT.mute });
        });
        var yl = y1 - U;
        ctx.save(); ctx.setLineDash([6, 4]); ctx.strokeStyle = LT.red; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(40, yl); ctx.lineTo(600, yl); ctx.lineTo(600 + DX, yl + DY); ctx.stroke(); ctx.restore();
        K.pill(ctx, "1명 선", 34, yl + 4, { s: 11, a: "right", c: "#ffb3bd", box: [0, 620] });
        SP.card(ctx, 640, 14, 246, CH - 28, "환자 한 명이 실제로 옮기는 수", [["실제 전파 수", R1.toFixed(2) + "명", ok ? LT.green : LT.red]], [ok ? "1 이하 · 번지지 못한다" : "1보다 크다 · 커진다", ok], { top: 62 });
      }
    cv.canvas._redraw = draw;
      api.seg({ label: "마스크", value: 0, options: [{ v: 0, t: "안 씀" }, { v: 0.3, t: "천 마스크 (30% 차단)" }, { v: 0.6, t: "KF94 (60% 차단)" }], onPick: function (x) { m = +x; draw(); api.changed(); } });
      api.slider({ label: "접촉 줄이기 (부스 간격·환기·인원 제한)", min: 0, max: 60, step: 5, value: 0, fmt: function (x) { return x + "%"; }, onInput: function (x) { c = Math.round(x); draw(); api.changed(); } });
      api.info("실제 전파 수 = R0 × (접종 안 한 비율) × (마스크 통과율) × (남은 접촉 비율)");
      draw();
      return {
        judge: function () {
          var r = re();
          if (r <= 1 + 1e-9) return { ok: true, msg: "실제 전파 수 " + r.toFixed(2) + "명 — 유행이 번지지 못합니다." };
          return { ok: false, msg: "실제 전파 수 " + r.toFixed(2) + "명 — 아직 1보다 큽니다. 방역 수단을 겹쳐 써 보세요." };
        }
      };
    },
    hints: ["마스크 없이 접촉만 줄이면 45% 이상 줄여야 합니다.", "천 마스크라면 접촉을 25% 이상, KF94라면 줄이지 않아도 됩니다."],
    solution: "예: <b>천 마스크 + 접촉 25% 이상 줄이기</b>, 또는 <b>KF94</b>, 또는 <b>마스크 없이 접촉 45% 이상 줄이기</b>.",
    why: "방역 수단은 하나하나가 완벽하지 않아도 <b>곱해져서</b> 효과가 커집니다(스위스 치즈 모형). 감염병 대응에서 과학은 R0와 각 수단의 효과를 계산해 정책의 근거를 주고, 어떤 조합을 고를지는 비용·불편·공정성을 따지는 사회적 결정입니다.<br>※ 마스크 차단율과 접촉 감소 효과는 계산을 위한 가상의 값입니다."
  },

  /* ------------------------------------------------------------------ 3. 교통: 시간과 탄소 */
  {
    id: "c3", about: "04", tag: "교통수단 · 빛과 그림자", title: "부산 회의에 가는 가장 좋은 방법", short: "교통수단 고르기",
    who: "🧳", name: "환경 동아리 선생님",
    say: "“우리 동아리 <b>4명</b>이 서울에서 부산(약 400 km) 청소년 기후 회의에 가요. 오전 8시에 출발해 11시 30분 회의에 늦지 않아야 하니 문에서 문까지 <b>3.5시간 이하</b>, 그리고 모두의 이산화탄소 배출을 합쳐 <b>50 kg 이하</b>로 하고 싶어요.”",
    predict: {
      q: "4명이 함께 탄다면, 승용차 한 대와 KTX 중 이산화탄소를 덜 내는 쪽은?",
      options: ["㉠ 승용차 — 한 대에 같이 타니까", "㉡ KTX — 한 사람당 배출이 훨씬 적어서 4명이어도 적다", "㉢ 같다"],
      answer: 1
    },
    task: "교통수단을 골라 <b>3.5시간 이하</b>, 이산화탄소 <b>50 kg 이하</b>를 모두 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(250), ctx = cv.ctx, W = cv.W, md = "car", ppl = 4;
      var M = { car: { t: "승용차", h: 4.5, per: "car", g: 170 }, bus: { t: "고속버스", h: 4.5, g: 30 }, ktx: { t: "KTX", h: 3.2, g: 20 }, air: { t: "비행기", h: 3.0, g: 150 } };
      function co2(k) { var o = M[k]; return o.per === "car" ? 400 * o.g / 1000 : ppl * 400 * o.g / 1000; }
        function draw() {
        var K = window.sthKit, SP = window.sthSP19, LT = K.LT, CH = cv.H;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, W, CH);
        var x0 = 120, x1 = 540, o = M[md], cc = co2(md);
        K.card(ctx, 10, 10, 586, CH - 20, null);
        SP.lbl(ctx, "문에서 문까지 걸리는 시간", x0, 32, { s: 11.5, c: LT.mute });
        SP.lbl(ctx, "이산화 탄소 (" + ppl + "명 합계)", x0, 140, { s: 11.5, c: LT.mute });
        Object.keys(M).forEach(function (k, i) {
          var oo = M[k], on = k === md, y = 40 + i * 22, y2 = 148 + i * 22;
          SP.lbl(ctx, oo.t, x0 - 10, y + 12, { s: 11.5, w: on ? "900" : "600", a: "right", c: on ? LT.ink : LT.mute });
          K.bar(ctx, x0, y + 3, x1 - x0, oo.h / 5, on ? LT.blue : "#b8c2d0");
          SP.lbl(ctx, oo.h.toFixed(1) + "h", x0 + oo.h / 5 * (x1 - x0) + 6, y + 12, { s: 10.5, c: on ? LT.blue : LT.dim });
          SP.lbl(ctx, oo.t, x0 - 10, y2 + 12, { s: 11.5, w: on ? "900" : "600", a: "right", c: on ? LT.ink : LT.mute });
          K.bar(ctx, x0, y2 + 3, x1 - x0, Math.min(co2(k), 250) / 250, on ? LT.orange : "#b8c2d0");
          SP.lbl(ctx, co2(k).toFixed(0) + " kg", x0 + Math.min(co2(k), 250) / 250 * (x1 - x0) + 6, y2 + 12, { s: 10.5, c: on ? LT.orange : LT.dim });
        });
        ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = LT.red; ctx.lineWidth = 1.5;
        var a1 = x0 + 3.5 / 5 * (x1 - x0), a2 = x0 + 50 / 250 * (x1 - x0);
        ctx.beginPath(); ctx.moveTo(a1, 36); ctx.lineTo(a1, 128); ctx.moveTo(a2, 144); ctx.lineTo(a2, 236); ctx.stroke(); ctx.restore();
        SP.lbl(ctx, "3.5시간", a1 + 4, 132, { s: 10, c: LT.red }); SP.lbl(ctx, "50 kg", a2 + 4, CH - 14, { s: 10, c: LT.red });
        /* 고른 탈것 미니어처 */
        var I = K.iso({ ox: 700, oy: 40, s: 0.6, L: 230, D: 60 }), Z = 6;
        SP.box(ctx, I, 0, 0, 0, I.L, I.D, Z, "slate", { edge: false });
        I.plane(ctx, Z + .2, "#59606e");
        ctx.strokeStyle = "#f5d36b"; ctx.lineWidth = 2; ctx.setLineDash([8, 6]); var l1 = I.P(0, 30, Z + .3), l2 = I.P(I.L, 30, Z + .3); ctx.beginPath(); ctx.moveTo(l1.x, l1.y); ctx.lineTo(l2.x, l2.y); ctx.stroke(); ctx.setLineDash([]);
        var V = { car: [70, 46, 16, "#e03131"], bus: [130, 48, 24, "#1c7ed6"], ktx: [200, 44, 18, "#f1f3f5"], air: [120, 40, 14, "#dee2e6"] }[md];
        var vx = (I.L - V[0]) / 2, vz = md === "air" ? Z + 40 : Z;
        if (md === "air") { var sh = I.P(I.L / 2, 30, Z + .3); ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(sh.x, sh.y, 40, 8, 0, 0, 6.2832); ctx.fill(); }
        SP.box(ctx, I, vx, 30 - V[1] / 2, vz, vx + V[0], 30 + V[1] / 2, vz + V[2], V[3]);
        if (md === "air") SP.box(ctx, I, I.L / 2 - 14, -10, vz + 6, I.L / 2 + 14, 70, vz + 9, "#ced4da");
        else SP.box(ctx, I, vx + 6, 30 - V[1] / 2 + 3, vz + V[2], vx + V[0] - 6, 30 + V[1] / 2 - 3, vz + V[2] + 6, "#a5d8ff");
        SP.card(ctx, 616, 112, 270, CH - 124, null, [
          ["고른 수단", o.t],
          ["시간", o.h.toFixed(1) + "시간", o.h <= 3.5 ? LT.green : LT.red],
          ["이산화 탄소", cc.toFixed(0) + " kg", cc <= 50 ? LT.green : LT.red]
        ], null, { top: 32, gap: 32 });
      }
    cv.canvas._redraw = draw;
      api.seg({ label: "교통수단", value: "car", options: [{ v: "car", t: "승용차" }, { v: "bus", t: "고속버스" }, { v: "ktx", t: "KTX" }, { v: "air", t: "비행기" }], onPick: function (x) { md = x; draw(); api.changed(); } });
      api.slider({ label: "함께 가는 인원", min: 1, max: 6, step: 1, value: 4, fmt: function (x) { return x + "명"; }, onInput: function (x) { ppl = Math.round(x); draw(); api.changed(); } });
      api.info("1인 1 km 당 이산화탄소: 고속버스 약 30 g, KTX 약 20 g, 비행기 약 150 g. 승용차는 한 대가 1 km에 약 170 g을 냅니다. 비행기·KTX 시간에는 공항·역까지 가는 시간을 포함했습니다.");
      draw();
      return {
        judge: function () {
          var o = M[md], cc = co2(md);
          if (ppl !== 4) return { ok: false, msg: "이번 회의에는 4명이 갑니다. 인원을 4명으로 맞춰 주세요." };
          if (o.h <= 3.5 && cc <= 50) return { ok: true, msg: o.t + " — " + o.h.toFixed(1) + "시간, 이산화탄소 " + cc.toFixed(0) + " kg." };
          return { ok: false, msg: o.t + " — " + (o.h > 3.5 ? "회의에 늦습니다. " : "") + (cc > 50 ? "이산화탄소 " + cc.toFixed(0) + " kg로 너무 많습니다." : "") };
        }
      };
    },
    hints: ["승용차와 버스는 4.5시간이 걸려 늦습니다.", "비행기는 빠르지만 4명이면 240 kg입니다."],
    solution: "<b>KTX</b> — 3.2시간, 이산화탄소 32 kg.",
    why: "빠른 교통수단은 시간을 줄이는 <b>빛</b>이지만, 에너지를 많이 쓰면 기후 변화라는 <b>그림자</b>를 남깁니다. 전기로 달리는 고속철도는 빠르면서도 한 사람당 배출이 적어 두 조건을 함께 맞춥니다. 인원이 많아지면 승용차의 한 사람당 배출은 줄어들기 때문에, 상황에 따라 가장 좋은 선택이 달라집니다.<br>※ 배출량과 시간은 대략적인 값입니다."
  }
  ]
});
})();
