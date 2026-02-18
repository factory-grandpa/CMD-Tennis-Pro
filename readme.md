
# 🎾 CMD TENNIS PRO v3.0

**CMD TENNIS PRO**는 터미널 스타일의 테니스 코칭 플랫폼과 레트로 감성의 테니스 벽돌 깨기 게임이 결합된 하이브리드 웹 애플리케이션입니다. Google Gemini AI를 활용하여 실시간 자세 분석 및 전술 조언을 제공합니다.

---

## 🚀 주요 기능 (Features)

1.  **PRO_GAME (Tennis Breakout)**: 
    *   레트로 스타일의 벽돌 깨기 게임. 
    *   다양한 파워업 아이템(거대 라켓, 철퇴 공, 멀티 볼 등) 제공.
    *   픽셀 아트 기반의 스테이지 디자인.
2.  **COACH_CHAT**: 
    *   Gemini AI 기반 전문 테니스 코칭 챗봇.
    *   기술적 질문, 장비 추천 등 실시간 답변.
3.  **STROKE_ANALYZE**: 
    *   사용자의 테니스 폼 사진을 업로드하면 AI가 관절 각도 및 운동 사슬을 분석.
    *   장점/단점 및 교정 연습법(Drills) 제안.
4.  **STRATEGY_GEN**: 
    *   코트 표면, 본인의 스타일, 상대방의 성향을 입력하여 맞춤형 승리 전략 도출.
5.  **WORLD_TOUR_FEED**: 
    *   Google Search Grounding 기술을 사용하여 실시간 ATP/WTA 뉴스 및 랭킹 정보 제공.

---

## 💡 학습 포인트 (For Beginners)

이 프로젝트의 소스코드는 웹 게임 및 AI 연동 앱을 공부하는 분들에게 다음과 같은 핵심 개념을 제공합니다.

### 1. React에서 고성능 게임 구현 (`useRef`)
React의 `useState`는 값이 바뀔 때마다 컴포넌트를 다시 그리기 때문에, 초당 60프레임이 움직여야 하는 게임 로직에는 적합하지 않습니다. 이 프로젝트는 **`useRef`를 사용하여 메모리 내에서 물리 연산을 수행**하고, `requestAnimationFrame` 루프를 통해 캔버스에 직접 렌더링하는 방식을 사용합니다.

### 2. 가상 해상도 및 스케일링 시스템
다양한 기기(모바일, PC)에서 동일한 게임 경험을 주기 위해 **`2000x1500`의 가상 좌표계**를 먼저 설계했습니다. 실제 화면에 그려질 때는 브라우저 크기에 맞춰 스케일 비율(`renderScale`)을 계산하여 적용하는 기법을 배울 수 있습니다.

### 3. AABB 충돌 감지 로직
사각 벽돌과 공(원)의 충돌을 감지하는 가장 기초적이고 중요한 알고리즘인 **AABB(Axis-Aligned Bounding Box)** 충돌 판정이 구현되어 있습니다.

### 4. 데이터 기반 레벨 디자인 (Data-Driven Design)
게임 맵을 코드로 직접 짜는 것이 아니라, 2차원 배열(`SHAPES`) 형태로 데이터를 정의하여 유지보수가 쉽도록 설계되었습니다.

---

## 🎮 게임 아이템 가이드

| 아이템 | 효과 설명 |
| :--- | :--- |
| **LONG** | 테니스 라켓(패들)의 길이가 1.5배 길어집니다. |
| **SHORT** | 테니스 라켓이 짧아져 난이도가 상승합니다. |
| **GUN** | **[핵심]** 라켓에 공이 부딪힐 때마다 3개로 복제됩니다. |
| **IRON** | 공이 벽돌을 관통하며 파괴합니다. |
| **WALL** | 화면 하단에 보조 벽을 생성하여 공이 떨어지는 것을 방지합니다. |
| **SLOW/FAST** | 공의 이동 속도를 제어합니다. |
| **+LIFE** | 남은 라켓(목숨) 개수를 추가합니다. |

---

## 🛠 기술 스택 (Tech Stack)

*   **Frontend**: React (TypeScript), Tailwind CSS
*   **Icons**: Lucide React
*   **AI Engine**: Google Gemini API (`gemini-3-flash-preview`, `gemini-3-pro-preview`)
*   **Grounding**: Google Search Tool (Real-time data)

---

## 📜 설치 및 실행

본 프로젝트는 최신 브라우저 환경에서 ES 모듈을 지원하며, API_KEY는 환경 변수로 관리됩니다.

```bash
# 별도의 빌드 과정 없이 index.html을 통해 실행 가능합니다.
# (개발 환경 설정에 따라 상이할 수 있음)
```

이 프로젝트를 통해 **Canvas API, React 최적화, 그리고 AI API 활용법**을 마스터해보세요!
