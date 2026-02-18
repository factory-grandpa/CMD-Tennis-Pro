
import React, { useRef, useEffect, useState } from 'react';

/**
 * [학습 포인트 1: 인터페이스 설계]
 * 객체 지향적인 설계를 위해 각 게임 요소(공, 파티클, 벽돌 등)의 구조를 명확히 정의합니다.
 * 이는 코드의 유지보수성을 높이고 타입 체크를 통해 버그를 사전에 방지합니다.
 */
interface Ball {
  x: number; y: number; dx: number; dy: number; active: boolean;
  trail: { x: number; y: number }[]; // 공의 잔상 효과를 위한 좌표 배열
  stuck: boolean; // 라켓에 붙어있는 상태인지 여부
}

interface Particle {
  x: number; y: number; vx: number; vy: number; life: number; color: string;
}

interface Brick {
  x: number; y: number; w: number; h: number; 
  type: 'normal' | 'tough' | 'gold'; 
  health: number; active: boolean; 
  color: string;
  originalColor: string;
  targetColor: string; 
}

type PowerType = 'LONG' | 'SHORT' | 'GUN' | 'IRON' | 'WALL' | 'SLOW' | 'FAST' | '+LIFE';

interface PowerUp {
  x: number; y: number; type: PowerType; active: boolean;
}

interface ItemLog {
  type: string;
  color: string;
  id: number;
}

// --- 상수 및 색상 정의 ---
const _ = null;
const W = "#ffffff"; // White
const B = "#3b82f6"; // Blue
const Y = "#facc15"; // Yellow
const S = "#d97706"; // Sand
const R = "#ef4444"; // Red
const L = "#a3e635"; // Lime (Tennis Ball)
const O = "#f97316"; // Orange
const P = "#a855f7"; // Purple
const G = "#22c55e"; // Green

/**
 * [학습 포인트 2: 데이터 기반 디자인]
 * 하드코딩 대신 2차원 배열 형태의 '모양 데이터'를 정의하여 
 * 레벨 디자인을 유연하게 관리하는 기법입니다.
 */
const SHAPES = {
  CLASSIC: [
    [R, R, R, R, R, R, R, R, R, R, R, R, R, R],
    [O, O, O, O, O, O, O, O, O, O, O, O, O, O],
    [Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y],
    [G, G, G, G, G, G, G, G, G, G, G, G, G, G],
    [B, B, B, B, B, B, B, B, B, B, B, B, B, B],
    [P, P, P, P, P, P, P, P, P, P, P, P, P, P],
  ],
  FUJI: [
    [_,_,_,_,_,W,W,_,_,_,_,_],
    [_,_,_,_,W,W,W,W,_,_,_,_],
    [_,_,_,W,W,W,W,W,W,_,_,_],
    [_,_,W,W,W,W,W,W,W,W,_,_],
    [_,W,B,B,B,B,B,B,B,B,W,_],
    [W,B,B,B,B,B,B,B,B,B,B,W],
    [B,B,B,B,B,B,B,B,B,B,B,B],
    [B,B,B,B,B,B,B,B,B,B,B,B],
    [B,B,B,B,B,B,B,B,B,B,B,B],
  ],
  STAR: [
    [_,_,_,_,_,Y,_,_,_,_,_,_],
    [_,_,_,_,Y,Y,Y,_,_,_,_,_],
    [_,_,_,Y,Y,Y,Y,Y,_,_,_,_],
    [Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y],
    [_,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,_],
    [_,_,Y,Y,Y,Y,Y,Y,Y,Y,_,_],
    [_,_,Y,Y,Y,_,Y,Y,Y,_,_,_],
    [_,Y,Y,Y,_,_,_,Y,Y,Y,_,_],
    [Y,Y,Y,_,_,_,_,_,Y,Y,Y,_],
  ],
  MOON: [
    [_,_,_,Y,Y,Y,_,_,_,_,_,_],
    [_,_,Y,Y,Y,Y,Y,_,_,_,_,_],
    [_,Y,Y,Y,Y,Y,_,_,_,_,_,_],
    [Y,Y,Y,Y,Y,_,_,_,_,_,_,_],
    [Y,Y,Y,Y,Y,_,_,_,_,_,_,_],
    [Y,Y,Y,Y,Y,_,_,_,_,_,_,_],
    [_,Y,Y,Y,Y,Y,_,_,_,_,_,_],
    [_,_,Y,Y,Y,Y,Y,_,_,_,_,_],
    [_,_,_,Y,Y,Y,_,_,_,_,_,_],
  ],
  PYRAMID: [
    [_,_,_,_,_,S,_,_,_,_,_,_],
    [_,_,_,_,S,S,S,_,_,_,_,_],
    [_,_,_,S,S,S,S,S,_,_,_,_],
    [_,_,S,S,S,S,S,S,S,_,_,_],
    [_,S,S,S,S,S,S,S,S,S,_,_],
    [S,S,S,S,S,S,S,S,S,S,S,S],
    [S,S,S,S,S,S,S,S,S,S,S,S],
  ],
  HEART: [
    [_,R,R,_,_,_,R,R,_],
    [R,R,R,R,_,R,R,R,R],
    [R,R,R,R,R,R,R,R,R],
    [R,R,R,R,R,R,R,R,R],
    [_,R,R,R,R,R,R,R,_],
    [_,_,R,R,R,R,R,_,_],
    [_,_,_,R,R,R,_,_,_],
    [_,_,_,_,R,_,_,_,_],
  ],
  TENNIS: [
    [_,_,_,L,L,L,L,_,_,_],
    [_,L,L,W,W,W,W,L,L,_],
    [L,L,W,L,L,L,L,W,L,L],
    [L,W,L,L,L,L,L,L,W,L],
    [L,W,L,L,L,L,L,L,W,L],
    [L,W,L,L,L,L,L,L,W,L],
    [L,L,W,L,L,L,L,W,L,L],
    [_,L,L,W,W,W,W,L,L,_],
    [_,_,_,L,L,L,L,_,_,_],
  ]
};

const GameView: React.FC = () => {
  // DOM 및 Canvas 제어를 위한 Ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // 게임 UI 상태 (리렌더링이 필요한 요소들)
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [ballSpeed, setBallSpeed] = useState(0);
  const [itemHistory, setItemHistory] = useState<ItemLog[]>([]);
  const [combo, setCombo] = useState(0);
  const [level, setLevel] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  /**
   * [학습 포인트 3: 가상 해상도 시스템]
   * 화면 크기에 상관없이 동일한 게임 로직을 수행하기 위해 가상 좌표(2000x1500)를 사용합니다.
   * 실제 렌더링 시에는 브라우저 크기에 맞춰 스케일링(Scale) 작업을 거칩니다.
   */
  const V_WIDTH = 2000;
  const V_HEIGHT = 1500;
  const BASE_PADDLE_W = 300;
  const PADDLE_H = 30;
  const BALL_R = 12;
  const PADDLE_Y = V_HEIGHT - 150;
  const WALL_SIZE = 50;

  // 오디오 효과음 정의
  const MELODIES = {
    INTRO: [{ f: 440, d: 0.1 }, { f: 554, d: 0.1 }, { f: 659, d: 0.1 }, { f: 880, d: 0.3 }, { f: 659, d: 0.1 }, { f: 880, d: 0.4 }],
    LEVEL_CLEAR: [{ f: 523, d: 0.1 }, { f: 587, d: 0.1 }, { f: 659, d: 0.1 }, { f: 698, d: 0.1 }, { f: 783, d: 0.1 }, { f: 880, d: 0.1 }, { f: 987, d: 0.1 }, { f: 1046, d: 0.4 }],
    DEATH: [{ f: 440, d: 0.15 }, { f: 415, d: 0.15 }, { f: 392, d: 0.15 }, { f: 349, d: 0.4 }],
    GAME_OVER: [{ f: 349, d: 0.2 }, { f: 311, d: 0.2 }, { f: 277, d: 0.2 }, { f: 233, d: 0.6 }]
  };

  /**
   * [학습 포인트 4: useRef를 활용한 게임 상태 관리]
   * React의 useState는 값이 바뀔 때마다 컴포넌트를 전체 리렌더링하므로 초당 60프레임이 필요한 게임에는 부적합합니다.
   * useRef를 사용하면 화면 업데이트 없이 데이터만 즉각적으로 변경하여 성능을 최적화할 수 있습니다.
   */
  const state = useRef({
    balls: [] as Ball[],
    bricks: [] as Brick[],
    particles: [] as Particle[],
    powerUps: [] as PowerUp[],
    playerX: (V_WIDTH - BASE_PADDLE_W) / 2,
    shake: 0,
    renderScale: 1,
    offsetX: 0,
    offsetY: 0,
    ballSpeedMult: 1.0, 
    timers: { LONG: 0, SHORT: 0, IRON: 0, WALL: 0, GUN: 0 },
    comboMultiplier: 1,
    lastItemId: 0,
    lastShapeKey: null as string | null
  });

  // --- 사운드 제어 함수 ---
  const playMelody = (notes: { f: number; d: number }[], speed = 1) => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      let time = ctx.currentTime;
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(note.f, time);
        gain.gain.setValueAtTime(0.04, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + note.d * speed);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + note.d * speed);
        time += note.d * speed;
      });
    } catch (e) {}
  };

  const playSynth = (freq: number, type: OscillatorType = 'square', dur = 0.1, vol = 0.05) => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.1, ctx.currentTime + dur);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  };

  // --- 게임 로직 함수 ---

  // 레벨 생성 (스테이지 구성)
  const createLevel = (lv: number) => {
    const s = state.current;
    const bricks: Brick[] = [];
    const shapeKeys = Object.keys(SHAPES) as (keyof typeof SHAPES)[];
    let selectedKey: string;
    
    // 이전 스테이지와 같은 모양이 나오지 않도록 랜덤 선택
    do {
      selectedKey = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
    } while (selectedKey === s.lastShapeKey && shapeKeys.length > 1);
    
    s.lastShapeKey = selectedKey;
    const selectedShape = SHAPES[selectedKey as keyof typeof SHAPES];
    
    const rows = selectedShape.length;
    const cols = selectedShape[0].length;
    const padding = 10;
    const startX = (V_WIDTH - (cols * (80 + padding))) / 2;
    const startY = 200; 

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const color = selectedShape[r][c];
        if (!color) continue;
        
        let type: 'normal' | 'tough' | 'gold' = 'normal';
        // 모양에 따라 벽돌 속성 부여
        if (selectedKey === 'CLASSIC') {
            if ((r + c) % 5 === 0) type = 'tough';
            else if (Math.random() < 0.03) type = 'gold';
        } else {
            const isCenter = r < rows / 2 && c > cols / 4 && c < (3 * cols) / 4;
            type = isCenter ? 'tough' : Math.random() < 0.05 ? 'gold' : 'normal';
        }
        
        bricks.push({
          x: startX + c * (80 + padding),
          y: startY + r * (45 + padding),
          w: 80, h: 45,
          type, health: type === 'tough' ? 3 : 1, active: true,
          color, originalColor: color, targetColor: color
        });
      }
    }

    s.bricks = bricks;
    s.ballSpeedMult = 1.0; 
    spawnBall();
    setCombo(0);
    setItemHistory([]);
  };

  // 공 스폰 (패들 위에 올리기)
  const spawnBall = () => {
    const s = state.current;
    const currentPaddleW = s.timers.LONG > 0 ? BASE_PADDLE_W * 1.5 : s.timers.SHORT > 0 ? BASE_PADDLE_W * 0.5 : BASE_PADDLE_W;
    s.balls = [{ 
      x: s.playerX + currentPaddleW / 2, y: PADDLE_Y - BALL_R, 
      dx: 0, dy: 0, active: true, trail: [], stuck: true
    }];
  };

  // 게임 초기화
  const initGame = () => {
    const s = state.current;
    s.particles = []; s.powerUps = []; s.shake = 30; s.ballSpeedMult = 1.0; s.lastShapeKey = null;
    Object.keys(s.timers).forEach(k => (s.timers as any)[k] = 0);
    setLevel(1); setScore(0); setLives(3); setIsGameOver(false);
    createLevel(1);
  };

  // 게임 시작
  const startGame = () => {
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current.resume();
    setHasStarted(true);
    initGame();
    playMelody(MELODIES.INTRO);
  };

  /**
   * [학습 포인트 5: 캔버스 게임 루프]
   * useEffect 내에서 requestAnimationFrame을 호출하여 무한 루프를 만듭니다.
   * 1. 로직 계산(Update) 2. 화면 지우기(Clear) 3. 그리기(Draw) 과정을 반복합니다.
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasStarted) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 창 크기 조절 시 스케일 계산
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width; canvas.height = height;
        const scale = Math.min(width / V_WIDTH, height / V_HEIGHT);
        state.current.renderScale = scale;
        state.current.offsetX = (width - V_WIDTH * scale) / 2;
        state.current.offsetY = (height - V_HEIGHT * scale) / 2;
      }
    });
    resizeObserver.observe(containerRef.current!);

    // 입력 처리 (마우스/터치)
    const handleInput = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const s = state.current;
      const physicalX = clientX - rect.left;
      const virtualX = (physicalX - s.offsetX) / s.renderScale;
      const currentPaddleW = s.timers.LONG > 0 ? BASE_PADDLE_W * 1.5 : s.timers.SHORT > 0 ? BASE_PADDLE_W * 0.5 : BASE_PADDLE_W;
      s.playerX = Math.max(WALL_SIZE, Math.min(V_WIDTH - WALL_SIZE - currentPaddleW, virtualX - currentPaddleW / 2));
    };

    const handleLaunch = () => {
      const s = state.current;
      s.balls.forEach(ball => {
        if (ball.stuck) {
          ball.stuck = false; ball.dx = (Math.random() - 0.5) * 6; ball.dy = -(8 + (level * 0.2));
          playSynth(600, 'sine', 0.1, 0.1);
        }
      });
    };

    const onMouseMove = (e: MouseEvent) => handleInput(e.clientX);
    const onTouch = (e: TouchEvent) => { if(e.touches[0]){ e.preventDefault(); handleInput(e.touches[0].clientX); } };
    const onClick = () => handleLaunch();

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchstart', onTouch, { passive: false });
    canvas.addEventListener('touchmove', onTouch, { passive: false });
    canvas.addEventListener('mousedown', onClick);

    let animationId: number;
    const loop = () => {
      if (isGameOver) return;
      const s = state.current;
      const currentPaddleW = s.timers.LONG > 0 ? BASE_PADDLE_W * 1.5 : s.timers.SHORT > 0 ? BASE_PADDLE_W * 0.5 : BASE_PADDLE_W;

      // 1. 상태 업데이트
      Object.keys(s.timers).forEach(k => { if ((s.timers as any)[k] > 0) (s.timers as any)[k]--; });
      s.particles.forEach((p, i) => { p.x += p.vx; p.y += p.vy; p.life -= 0.02; if (p.life <= 0) s.particles.splice(i, 1); });

      // 아이템 이동 및 획득
      s.powerUps.forEach((p, i) => {
        const colors_map: any = { LONG: '#3b82f6', SHORT: '#ef4444', GUN: '#eab308', IRON: '#94a3b8', WALL: '#22c55e', SLOW: '#a855f7', FAST: '#f97316', '+LIFE': '#ec4899' };
        p.y += 7;
        if (p.active && p.y + 50 > PADDLE_Y && p.y < PADDLE_Y + PADDLE_H && p.x + 80 > s.playerX && p.x < s.playerX + currentPaddleW) {
          p.active = false; playSynth(1000, 'sine', 0.4, 0.1);
          setItemHistory(prev => [{ type: p.type, color: colors_map[p.type], id: s.lastItemId++ }, ...prev].slice(0, 5));
          if (p.type === '+LIFE') setLives(prev => prev + 1);
          else if (p.type === 'SLOW') s.ballSpeedMult = 0.6;
          else if (p.type === 'FAST') s.ballSpeedMult = 1.4;
          else (s.timers as any)[p.type] = 450; 
          s.powerUps.splice(i, 1);
        }
        if (p.y > V_HEIGHT) s.powerUps.splice(i, 1);
      });

      let activeBallCount = 0;
      let maxSpd = 0;
      const ballsToSplit: Ball[] = [];

      // 공 이동 및 충돌 감지
      s.balls.forEach((ball) => {
        if (!ball.active) return;
        activeBallCount++;
        if (ball.stuck) { ball.x = s.playerX + currentPaddleW / 2; ball.y = PADDLE_Y - BALL_R; return; }

        const spdMult = s.ballSpeedMult;
        ball.x += ball.dx * spdMult; ball.y += ball.dy * spdMult;
        ball.trail.push({ x: ball.x, y: ball.y }); if (ball.trail.length > 10) ball.trail.shift();

        // 벽 충돌 (가장자리 경계 인식)
        if (ball.x < WALL_SIZE + BALL_R || ball.x > V_WIDTH - WALL_SIZE - BALL_R) { ball.dx *= -1; playSynth(200, 'sine', 0.05); }
        if (ball.y < WALL_SIZE + BALL_R) { ball.dy *= -1; playSynth(200, 'sine', 0.05); }

        // 라켓(패들) 충돌
        if (ball.y + BALL_R > PADDLE_Y && ball.y - BALL_R < PADDLE_Y + PADDLE_H && ball.x > s.playerX && ball.x < s.playerX + currentPaddleW) {
          const hitPos = (ball.x - (s.playerX + currentPaddleW / 2)) / (currentPaddleW / 2);
          const speed = Math.sqrt(ball.dx**2 + ball.dy**2) * 1.015;
          const angle = hitPos * (Math.PI / 2.5);
          ball.dx = Math.sin(angle) * speed; ball.dy = -Math.cos(angle) * speed; ball.y = PADDLE_Y - BALL_R;
          playSynth(440, 'triangle', 0.1);
          s.comboMultiplier = 1; setCombo(0);
          
          /**
           * [중요 로직] GUN 아이템 효과: 라켓 충돌 시에만 공이 3개로 분리됨 (게임 난이도 조절)
           */
          if (s.timers.GUN > 0) ballsToSplit.push(ball);
        }

        // 보조 벽(WALL) 충돌
        if (s.timers.WALL > 0 && ball.y + BALL_R > V_HEIGHT - 60) { ball.dy = -Math.abs(ball.dy); ball.y = V_HEIGHT - 61 - BALL_R; playSynth(150, 'sine', 0.1); }

        // 벽돌 충돌 (AABB 충돌 알고리즘 기반)
        for (const brick of s.bricks) {
          if (!brick.active) continue;
          if (ball.x + BALL_R > brick.x && ball.x - BALL_R < brick.x + brick.w && ball.y + BALL_R > brick.y && ball.y - BALL_R < brick.y + brick.h) {
            if (s.timers.IRON <= 0) {
              const dx1 = Math.abs(ball.x - brick.x); const dx2 = Math.abs(ball.x - (brick.x + brick.w));
              const dy1 = Math.abs(ball.y - brick.y); const dy2 = Math.abs(ball.y - (brick.y + brick.h));
              if (Math.min(dy1, dy2) < Math.min(dx1, dx2)) ball.dy *= -1; else ball.dx *= -1;
            }
            brick.health--;
            if (brick.health > 0) {
              playSynth(300 + (3-brick.health)*100, 'sawtooth', 0.1);
            } else {
              brick.active = false; s.shake = 25; playSynth(800, 'square', 0.15);
              const basePoints = brick.type === 'gold' ? 500 : brick.type === 'tough' ? 300 : 100;
              setScore(v => v + basePoints * s.comboMultiplier); s.comboMultiplier++; setCombo(s.comboMultiplier-1);
              // 아이템 드롭 랜덤 로직
              if (Math.random() < 0.22) {
                const rand = Math.random();
                let type: PowerType = 'LONG';
                if (rand < 0.05) type = '+LIFE'; else if (rand < 0.12) type = 'SHORT'; else if (rand < 0.22) type = 'SLOW'; else if (rand < 0.35) type = 'FAST'; else if (rand < 0.50) type = 'GUN'; else type = ['LONG', 'IRON', 'WALL'][Math.floor(Math.random()*3)] as PowerType;
                s.powerUps.push({ x: brick.x, y: brick.y, type, active: true });
              }
              // 파티클 생성 (시각적 피드백)
              for(let k=0; k<10; k++) s.particles.push({x: brick.x+brick.w/2, y: brick.y+brick.h/2, vx: (Math.random()-0.5)*30, vy: (Math.random()-0.5)*30, life: 1.0, color: brick.originalColor});
            }
            if (s.timers.IRON <= 0) break;
          }
        }
        if (ball.y > V_HEIGHT + 100) ball.active = false;
        maxSpd = Math.max(maxSpd, Math.sqrt(ball.dx**2 + ball.dy**2) * spdMult);
      });

      // 공 복제 실행
      if (s.timers.GUN > 0 && s.balls.length < 60) {
        ballsToSplit.forEach(original => {
          const speed = Math.sqrt(original.dx**2 + original.dy**2); const angle = Math.atan2(original.dy, original.dx);
          s.balls.push(
            { x: original.x, y: original.y, dx: Math.cos(angle + 0.35) * speed, dy: Math.sin(angle + 0.35) * speed, active: true, trail: [], stuck: false },
            { x: original.x, y: original.y, dx: Math.cos(angle - 0.35) * speed, dy: Math.sin(angle - 0.35) * speed, active: true, trail: [], stuck: false }
          );
        });
      }

      setBallSpeed(Math.round(maxSpd * 10));

      // 게임 상태 관리 (목숨 소진, 레벨 클리어)
      if (activeBallCount === 0 && !isGameOver) {
        if (lives > 1) { setLives(l => l - 1); spawnBall(); s.ballSpeedMult = 1.0; playMelody(MELODIES.DEATH); }
        else { setLives(0); setIsGameOver(true); playMelody(MELODIES.GAME_OVER); }
      }
      if (s.bricks.length > 0 && s.bricks.every(b => !b.active)) { 
        setLevel(l => l+1); createLevel(level+1); playMelody(MELODIES.LEVEL_CLEAR);
      }

      // 2. 캔버스 그리기 (Rendering)
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      if (s.shake > 0) { ctx.translate((Math.random()-0.5)*s.shake, (Math.random()-0.5)*s.shake); s.shake *= 0.82; }
      ctx.translate(s.offsetX, s.offsetY); ctx.scale(s.renderScale, s.renderScale);

      // 외곽 벽 그리기
      ctx.fillStyle = "rgba(163, 230, 53, 0.1)"; ctx.strokeStyle = "#a3e635"; ctx.lineWidth = 4;
      ctx.fillRect(0, 0, WALL_SIZE, V_HEIGHT); ctx.strokeRect(0, 0, WALL_SIZE, V_HEIGHT);
      ctx.fillRect(0, 0, V_WIDTH, WALL_SIZE); ctx.strokeRect(0, 0, V_WIDTH, WALL_SIZE);
      ctx.fillRect(V_WIDTH - WALL_SIZE, 0, WALL_SIZE, V_HEIGHT); ctx.strokeRect(V_WIDTH - WALL_SIZE, 0, WALL_SIZE, V_HEIGHT);

      // 벽돌 그리기
      s.bricks.forEach(b => {
        if (!b.active) return;
        ctx.fillStyle = b.color; ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.strokeRect(b.x, b.y, b.w, b.h);
      });

      // 파티클 및 아이템 그리기
      s.particles.forEach(p => { ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 10, 10); });
      ctx.globalAlpha = 1.0;
      s.powerUps.forEach(p => {
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(p.x, p.y, 100, 50, 25); ctx.fill();
        ctx.fillStyle = '#000'; ctx.font = 'bold 24px JetBrains Mono'; ctx.textAlign = 'center'; ctx.fillText(p.type, p.x + 50, p.y + 32);
      });

      // 공 그리기
      s.balls.forEach(ball => {
        if (!ball.active) return;
        const ballColor = s.timers.IRON > 0 ? '#94a3b8' : s.timers.GUN > 0 ? '#eab308' : '#fff';
        ctx.fillStyle = ballColor; ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2); ctx.fill();
      });

      // 패들(라켓) 그리기
      ctx.fillStyle = s.timers.SHORT > 0 ? '#ef4444' : s.timers.LONG > 0 ? '#3b82f6' : '#a3e635';
      ctx.fillRect(s.playerX, PADDLE_Y, currentPaddleW, PADDLE_H);

      ctx.restore();
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(animationId); resizeObserver.disconnect(); canvas.removeEventListener('mousedown', onClick); };
  }, [hasStarted, isGameOver, level, lives]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-black flex font-mono text-lime-400">
      
      {/* 사이드바 HUD (상태 창) */}
      <div className="w-64 border-r border-lime-900/20 bg-zinc-950/90 p-6 flex flex-col gap-8 z-20">
        <section>
          <label className="text-[10px] text-zinc-500 font-black mb-1 block uppercase">Sector_Lv</label>
          <div className="text-3xl font-black text-cyan-400 italic">0{level}</div>
        </section>
        <section>
          <label className="text-[10px] text-zinc-500 font-black mb-3 block uppercase">Rackets_Remaining</label>
          <div className="flex gap-2">
            {Array.from({ length: lives }).map((_, i) => <div key={i} className="w-6 h-8 bg-lime-500 rounded-t-full border-b-4 border-lime-700" />)}
          </div>
        </section>
        <section className="space-y-4">
          <div><label className="text-[10px] text-zinc-500 uppercase">High_Score</label><div className="text-2xl font-black">{highScore.toLocaleString()}</div></div>
          <div><label className="text-[10px] text-zinc-500 uppercase">Current_Score</label><div className="text-2xl font-black text-white">{score.toLocaleString()}</div></div>
          <div><label className="text-[10px] text-zinc-500 uppercase">Core_Velocity</label><div className="text-2xl font-black text-yellow-500">{ballSpeed} m/s</div></div>
        </section>
        <div className="flex-1 border-t border-zinc-800 pt-6 overflow-hidden">
          <label className="text-[10px] text-zinc-500 font-black mb-4 block uppercase">Item_Log</label>
          <div className="space-y-2">
            {itemHistory.map(item => (
              <div key={item.id} className="flex items-center gap-3 bg-zinc-900/50 p-2 rounded border border-zinc-800 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />{item.type}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 게임 화면 메인 */}
      <div className="flex-1 relative flex items-center justify-center">
        <canvas ref={canvasRef} className="cursor-none touch-none w-full h-full" />
        {combo > 1 && <div className="absolute top-10 right-10 text-4xl font-black text-pink-500 animate-pulse">COMBO_X{combo}</div>}
      </div>

      {/* 인트로 화면 */}
      {!hasStarted && (
        <div className="absolute inset-0 bg-black/98 z-50 flex flex-col items-center justify-center text-center">
          <div className="relative mb-24">
            <h1 className="text-[160px] font-black text-white italic tracking-tighter animate-[glitch_2s_infinite]">TENNIS</h1>
            <p className="text-xl font-bold text-cyan-400 tracking-[1.2em] uppercase mt-4">PIXEL_ART_BREAKOUT_v7</p>
          </div>
          <button onClick={startGame} className="px-32 py-12 bg-white text-black font-black text-4xl hover:bg-lime-400 transition-all active:scale-95 shadow-[0_0_100px_rgba(163,230,53,0.4)]">
            System_Boot
          </button>
        </div>
      )}

      {/* 게임 오버 화면 */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black/98 z-[60] flex flex-col items-center justify-center text-center">
          <h2 className="text-8xl font-black text-red-600 mb-8 italic uppercase animate-pulse">Connection_Terminated</h2>
          <div className="bg-zinc-950 border-y border-zinc-800 py-16 px-24 mb-16">
            <div className="text-[120px] font-black text-white leading-none">{score}</div>
          </div>
          <button onClick={startGame} className="px-24 py-8 bg-lime-500 text-black font-black text-2xl uppercase tracking-[0.6em] hover:bg-lime-400 transition-all">
            System_Reboot
          </button>
        </div>
      )}
    </div>
  );
};

export default GameView;
