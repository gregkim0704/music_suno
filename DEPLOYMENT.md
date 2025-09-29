# 🚀 AI Music Creator - 배포 가이드

## 📋 배포 준비사항

### 1. **필수 요구사항**
- Node.js 18+ 
- npm 또는 yarn
- Cloudflare 계정
- Wrangler CLI

### 2. **API 키 준비**
- **Gemini API Key**: Google AI Studio에서 발급
- **Suno API Key**: Suno AI 계정 (선택사항)

## 🛠️ 로컬 개발 환경 설정

### **1단계: 저장소 클론**
```bash
git clone https://github.com/gregkim0704/music_suno.git
cd music_suno
```

### **2단계: 의존성 설치**
```bash
npm install
```

### **3단계: 환경변수 설정**
```bash
# .dev.vars 파일 생성
echo "GEMINI_API_KEY=your-gemini-api-key" > .dev.vars
echo "SUNO_API_KEY=your-suno-api-key" >> .dev.vars
```

### **4단계: 빌드 및 개발 서버 실행**
```bash
# 빌드
npm run build

# 개발 서버 시작 (PM2 사용)
npm run clean-port
pm2 start ecosystem.config.cjs

# 또는 직접 실행
npm run dev:sandbox
```

### **5단계: 서비스 확인**
```bash
# 로컬 테스트
curl http://localhost:3000
npm test
```

## ☁️ Cloudflare Pages 배포

### **1단계: Cloudflare 인증**
```bash
wrangler login
# 또는
npx wrangler login
```

### **2단계: 프로젝트 생성**
```bash
# Cloudflare Pages 프로젝트 생성
wrangler pages project create ai-music-creator \
  --production-branch main \
  --compatibility-date 2024-01-01
```

### **3단계: 환경변수 설정**
```bash
# 프로덕션 환경변수 추가
wrangler pages secret put GEMINI_API_KEY --project-name ai-music-creator
wrangler pages secret put SUNO_API_KEY --project-name ai-music-creator

# 환경변수 확인
wrangler pages secret list --project-name ai-music-creator
```

### **4단계: 배포 실행**
```bash
# 프로덕션 빌드 및 배포
npm run build
wrangler pages deploy dist --project-name ai-music-creator
```

### **5단계: 커스텀 도메인 설정 (선택사항)**
```bash
# 커스텀 도메인 추가
wrangler pages domain add your-domain.com --project-name ai-music-creator
```

## 🎯 배포 스크립트 (package.json)

```json
{
  "scripts": {
    "dev": "vite",
    "dev:sandbox": "wrangler pages dev dist --ip 0.0.0.0 --port 3000",
    "build": "vite build",
    "preview": "wrangler pages dev dist",
    "deploy": "npm run build && wrangler pages deploy dist",
    "deploy:prod": "npm run build && wrangler pages deploy dist --project-name ai-music-creator",
    "cf-typegen": "wrangler types --env-interface CloudflareBindings",
    "clean-port": "fuser -k 3000/tcp 2>/dev/null || true",
    "test": "curl http://localhost:3000"
  }
}
```

## 🔧 PM2 설정 (개발용)

```javascript
// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'ai-music-creator',
      script: 'npx',
      args: 'wrangler pages dev dist --ip 0.0.0.0 --port 3000',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
```

## 📊 모니터링 및 로그

### **로그 확인**
```bash
# PM2 로그 (개발환경)
pm2 logs --nostream

# Cloudflare 로그 (프로덕션)
wrangler pages deployment tail --project-name ai-music-creator
```

### **성능 모니터링**
```bash
# 서비스 상태 확인
curl https://your-app.pages.dev/api/health

# PM2 상태 확인
pm2 list
pm2 monit
```

## 🚨 문제 해결

### **일반적인 문제**
1. **빌드 실패**: `npm run build` 오류 시 의존성 재설치
2. **포트 충돌**: `npm run clean-port` 실행
3. **API 오류**: 환경변수 설정 확인

### **Cloudflare 관련**
1. **배포 실패**: wrangler 버전 업데이트 확인
2. **도메인 오류**: DNS 설정 확인
3. **환경변수**: Cloudflare 대시보드에서 직접 설정

## 📈 성능 최적화

### **Cloudflare 설정**
- **Cache Rules**: 정적 자원 캐싱 최적화
- **Compression**: Gzip/Brotli 압축 활성화
- **Minification**: CSS/JS 최소화

### **앱 최적화**
- **Code Splitting**: 라우트별 번들 분할
- **Lazy Loading**: 이미지 및 컴포넌트 지연 로딩
- **CDN 활용**: 외부 라이브러리 CDN 사용

## 🔒 보안 고려사항

### **API 키 보안**
- 환경변수로만 관리, 코드에 하드코딩 금지
- Cloudflare Workers 환경변수 암호화
- 정기적인 API 키 순환

### **CORS 설정**
```typescript
// src/index.tsx
app.use('/api/*', cors({
  origin: ['https://your-domain.com'],
  allowMethods: ['GET', 'POST'],
  allowHeaders: ['Content-Type']
}))
```

## 📞 지원 및 문의

- **GitHub Issues**: https://github.com/gregkim0704/music_suno/issues
- **이메일**: infrastructure@kakao.com
- **전화**: 010-9143-0800
- **회사**: 한국인프라연구원(주)

---
**최종 업데이트**: 2025-09-29  
**배포 가이드 버전**: 1.0  
**호환 환경**: Node.js 18+, Cloudflare Pages