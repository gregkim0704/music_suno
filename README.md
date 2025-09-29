# AI Music Creator 🎵

## 프로젝트 개요
- **프로젝트명**: AI Music Creator  
- **목표**: Suno AI와 연동하여 머릿속 멜로디를 현실로 만드는 혁신적인 음악 창작 플랫폼
- **핵심 가치**: 음악 전문 지식 없이도 전문가급 음악 창작이 가능한 민주화된 음악 제작 도구

## 🚀 현재 URL
- **데모 사이트**: https://3000-iauksye4ia4js6oy3mv78-6532622b.e2b.dev
- **헬스 체크**: https://3000-iauksye4ia4js6oy3mv78-6532622b.e2b.dev/api/health
- **GitHub**: 배포 예정

## 🎯 완성된 핵심 기능

### 1. **오디오 분석 시스템**
- **기능**: 기존 곡 업로드 → AI 자동 분석
- **분석 요소**: 가사, 코드 진행, 음악 스타일, 키, 템포
- **API 엔드포인트**: `POST /api/analyze-audio`
- **상태**: ✅ UI 완성, 🔄 Gemini API 연동 개발 중

### 2. **스타일 디렉팅 엔진** 
- **장르 선택**: Pop, Rock, Jazz, K-pop, J-pop 등 12개 장르
- **악기 조합**: 피아노, 기타, 드럼, 베이스, 바이올린 등 8개 악기
- **분위기 설정**: 경쾌함, 감동적, 로맨틱, 드라마틱 등 12가지 무드
- **고급 설정**: 원곡 따라하기 강도, 창의성 수준 조절
- **프리셋 기능**: 스타일 조합 저장/재사용
- **API 엔드포인트**: `POST /api/generate-prompt`
- **상태**: ✅ 완성

### 3. **가사 생성 시스템**
- **테마 기반**: 사랑, 이별, 희망, 우정, 꿈 등 자유 입력
- **구조 선택**: 표준형, 발라드형, 확장형, 사용자 정의
- **언어 지원**: 한국어, 영어, 한영 혼용
- **보컬 디렉팅**: 파워풀, 부드러운, 감정적인 등 7가지 스타일
- **특수 효과**: 하모니, 리버브, 위스퍼, 팔세토
- **API 엔드포인트**: `POST /api/generate-lyrics`
- **상태**: ✅ 완성

### 4. **Suno AI 워크플로우 연동**
- **최적화된 프롬프트**: 선택한 스타일을 Suno AI 최적 형태로 변환
- **원클릭 복사**: 생성된 프롬프트와 가사를 클립보드로 즉시 복사
- **강력한 지시어**: "원곡을 따르라" 등 핵심 디렉팅 문구 자동 포함
- **직접 연동**: Suno AI 사이트로 원클릭 이동
- **상태**: ✅ 완성

## 🛠️ 기술 아키텍처

### **데이터 모델**
```typescript
// 음악 스타일 데이터 구조
interface MusicStyle {
  genre: string;           // 장르
  instruments: string[];   // 악기 배열
  mood: string;           // 분위기
  tempo: string;          // 템포
  customKeywords: string; // 추가 키워드
  influences: string;     // 참고 아티스트
  originalInfluence: number; // 원곡 유사도 (0-100)
  creativity: number;     // 창의성 수준 (0-100)
}

// 가사 생성 데이터 구조
interface LyricsData {
  theme: string;          // 주제
  mood: string;          // 감정
  structure: string;     // 곡 구조
  language: string;      // 언어
  keywords: string;      // 핵심 키워드
  message: string;       // 전달 메시지
  vocalStyle: string;    // 보컬 스타일
  vocalEffects: string[]; // 보컬 효과
}

// 오디오 분석 결과 구조
interface AudioAnalysis {
  lyrics: string;        // 추출된 가사
  chords: string[];      // 코드 진행
  style: string;         // 음악 스타일
  key: string;          // 조성
  tempo: string;        // 템포
}
```

### **저장 서비스** 
- **로컬 저장소**: localStorage를 활용한 프리셋 및 세션 데이터 관리
- **향후 확장**: Cloudflare D1 DB 연동 예정 (사용자 계정, 작업 히스토리)

### **API 엔드포인트**
```
GET  /                     # 메인 페이지
GET  /api/health          # 서비스 상태 확인
POST /api/analyze-audio   # 오디오 파일 분석
POST /api/generate-prompt # 음악 스타일 프롬프트 생성  
POST /api/generate-lyrics # 가사 생성
```

## 🔧 개발 환경 및 배포

### **기술 스택**
- **백엔드**: Hono Framework (Cloudflare Workers)
- **프론트엔드**: TypeScript + TailwindCSS + Vanilla JS
- **배포**: Cloudflare Pages (Edge Computing)
- **개발 서버**: Wrangler Pages Dev + PM2

### **로컬 개발 명령어**
```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run build
pm2 start ecosystem.config.cjs

# 프로덕션 빌드
npm run build

# 포트 정리
npm run clean-port

# 서비스 테스트  
npm test  # curl http://localhost:3000
```

### **배포 상태**
- **플랫폼**: Cloudflare Pages 배포 준비 완료
- **도메인**: 커스텀 도메인 설정 가능
- **상태**: 🔄 로컬 개발 완료, 프로덕션 배포 대기

## 🎨 사용자 경험 (UX)

### **워크플로우**
1. **오디오 업로드** (선택사항) → AI가 기존 곡 분석
2. **스타일 디렉팅** → 장르, 악기, 무드 세부 조정
3. **가사 작성** → 테마와 감정 기반 가사 자동 생성
4. **프롬프트 복사** → 최적화된 Suno AI 프롬프트 생성
5. **Suno AI 연동** → 원클릭으로 음악 생성 사이트 이동
6. **완곡 생성** → 10-20분 내 전문가급 음악 완성

### **핵심 혁신 요소**
- **"원곡을 따르라" 지시어**: 업로드된 멜로디 구조 유지하며 편곡
- **구간별 보컬 디렉팅**: 구절별 감정과 강약 조절
- **페르소나 시스템**: 선호 보컬 스타일 저장 및 재사용
- **실시간 미리보기**: 설정 변경 시 즉시 프롬프트 업데이트

## 📊 아직 구현되지 않은 기능

### **개발 예정 기능**
1. **Gemini API 연동**: 실제 오디오 분석 및 가사 생성 AI 처리
2. **사용자 인증**: 계정 기반 작업 저장 및 관리  
3. **작업 히스토리**: 생성된 음악과 프롬프트 이력 관리
4. **고급 분석**: 보다 정교한 음악 이론 기반 분석
5. **협업 기능**: 여러 사용자간 프로젝트 공유
6. **API 키 관리**: 사용자별 Gemini/Suno API 키 안전 저장

### **향후 확장 방향**
1. **Multi-AI 지원**: Claude, GPT 등 추가 AI 모델 연동
2. **실시간 편집**: 브라우저 내 음악 편집 도구
3. **소셜 기능**: 생성된 음악 공유 및 커뮤니티
4. **모바일 앱**: React Native 기반 모바일 버전

## 💼 사업화 전략

### **수익 모델 설계**
1. **Freemium 모델**: 기본 기능 무료, 고급 기능 구독제
2. **API 사용량 기반**: Gemini/Suno API 호출량에 따른 과금
3. **B2B 라이센싱**: 음악 제작사, 방송사 등 기업 고객
4. **프리미엄 템플릿**: 전문가 제작 프리셋 판매

### **타겟 시장**
- **1차 타겟**: 음악 창작에 관심 있는 일반인 (월 100만 명)
- **2차 타겟**: 인디 음악가, 콘텐츠 크리에이터 (월 10만 명)  
- **3차 타겟**: 음악 교육기관, 기업 마케팅팀 (월 1만 명)

### **경쟁 우위**
- **차별화 요소**: 오디오 업로드 기반 스타일 추출
- **기술적 우위**: Suno AI 최적화된 프롬프트 엔진
- **사용성**: 직관적 UI와 단계별 가이드
- **확장성**: Cloudflare Edge 기반 글로벌 서비스

## 📈 권장되는 다음 단계

### **단기 목표 (1-2주)**
1. **Gemini API 연동**: 실제 오디오 분석 기능 구현
2. **프로덕션 배포**: Cloudflare Pages 배포 및 도메인 설정
3. **사용자 테스트**: 베타 사용자 피드백 수집
4. **성능 최적화**: 로딩 시간 및 UI/UX 개선

### **중기 목표 (1-2개월)** 
1. **사용자 인증**: Firebase Auth 또는 Cloudflare Access 연동
2. **데이터베이스**: Cloudflare D1으로 사용자 데이터 관리
3. **고급 기능**: 실시간 협업, 버전 관리 등
4. **마케팅**: 음악 커뮤니티 및 소셜미디어 프로모션

### **장기 목표 (3-6개월)**
1. **AI 모델 최적화**: 자체 음악 분석 모델 개발
2. **글로벌 서비스**: 다국어 지원 및 현지화
3. **파트너십**: Suno AI, 음악 레이블과의 공식 파트너십
4. **IPO 준비**: 투자 유치 및 사업 확장

---

**문의**: 한국인프라연구원(주) | infrastructure@kakao.com | 010-9143-0800  
**마지막 업데이트**: 2025-09-29  
**개발 상태**: ✅ MVP 완성, 🔄 API 연동 진행 중  
**라이센스**: MIT License