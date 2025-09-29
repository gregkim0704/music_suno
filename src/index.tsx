import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'

// Type definitions for Cloudflare bindings
type Bindings = {
  GEMINI_API_KEY?: string;
  SUNO_API_KEY?: string;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Use renderer for HTML pages
app.use(renderer)

// Main application page
app.get('/', (c) => {
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            🎵 AI Music Creator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Suno AI와 연동하여 머릿속 멜로디를 현실로 만드는 혁신적인 음악 창작 플랫폼
          </p>
        </header>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* 오디오 업로드 섹션 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">🎧</span>
              </div>
              <h2 className="text-xl font-semibold text-white">오디오 분석</h2>
            </div>
            <p className="text-gray-300 mb-4">기존 곡을 업로드하여 가사, 코드, 스타일을 AI가 자동 분석</p>
            <div id="audio-upload-section">
              <input type="file" id="audioFile" accept="audio/*" className="hidden" />
              <button 
                onclick="document.getElementById('audioFile').click()" 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                음악 파일 업로드
              </button>
            </div>
          </div>
          
          {/* 스타일 디렉팅 섹션 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">🎨</span>
              </div>
              <h2 className="text-xl font-semibold text-white">스타일 디렉팅</h2>
            </div>
            <p className="text-gray-300 mb-4">장르, 악기, 분위기를 세밀하게 조정하여 원하는 음악 스타일 생성</p>
            <button 
              id="openStyleModal" 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              스타일 설정하기
            </button>
          </div>
          
          {/* 가사 생성 섹션 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">✍️</span>
              </div>
              <h2 className="text-xl font-semibold text-white">가사 생성</h2>
            </div>
            <p className="text-gray-300 mb-4">테마와 감정을 입력하면 AI가 완성도 높은 가사 자동 생성</p>
            <button 
              id="openLyricsModal" 
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              가사 작성하기
            </button>
          </div>
        </div>
        
        {/* Suno AI 연동 섹션 */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-6">
              <span className="text-white text-2xl">🚀</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Suno AI 연동 생성</h2>
              <p className="text-gray-300">최적화된 프롬프트로 Suno AI에서 전문가급 음악 생성</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">생성된 음악 스타일 프롬프트</label>
              <textarea 
                id="musicPrompt" 
                readOnly 
                className="w-full h-32 bg-black/20 border border-white/30 rounded-lg p-4 text-white placeholder-gray-400 resize-none"
                placeholder="스타일 설정 후 자동으로 최적화된 프롬프트가 생성됩니다."
              />
              <button 
                id="copyPrompt" 
                className="mt-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                📋 프롬프트 복사
              </button>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">생성된 가사</label>
              <textarea 
                id="generatedLyrics" 
                readOnly 
                className="w-full h-32 bg-black/20 border border-white/30 rounded-lg p-4 text-white placeholder-gray-400 resize-none"
                placeholder="가사 작성 후 여기에 표시됩니다."
              />
              <button 
                id="copyLyrics" 
                className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                📋 가사 복사
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <a 
              href="https://suno.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">🎵</span>
              Suno AI에서 음악 생성하기
            </a>
          </div>
        </div>
        
        {/* 기능 소개 섹션 */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white text-center mb-8">🌟 핵심 기능</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🔍</span>
              </div>
              <h3 className="text-white font-semibold mb-2">AI 음악 분석</h3>
              <p className="text-gray-400 text-sm">업로드한 음악의 구조와 스타일을 딥러닝으로 분석</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-white font-semibold mb-2">정밀 디렉팅</h3>
              <p className="text-gray-400 text-sm">장르, 악기, 보컬 스타일을 세밀하게 조정</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-white font-semibold mb-2">원클릭 생성</h3>
              <p className="text-gray-400 text-sm">최적화된 프롬프트로 10-20분 내 완곡 생성</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💾</span>
              </div>
              <h3 className="text-white font-semibold mb-2">페르소나 저장</h3>
              <p className="text-gray-400 text-sm">선호하는 보컬 스타일을 저장하고 재사용</p>
            </div>
          </div>
        </div>
        
        <footer className="text-center mt-12 text-gray-400">
          <p className="mb-2">한국인프라연구원(주) | infrastructure@kakao.com | 010-9143-0800</p>
          <p className="text-sm">AI 기반 음악 창작의 새로운 패러다임을 제시합니다</p>
        </footer>
      </div>
    </div>
  )
})

// API Routes
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', service: 'AI Music Creator' })
})

// 오디오 분석 API
app.post('/api/analyze-audio', async (c) => {
  try {
    const formData = await c.req.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      return c.json({ error: '오디오 파일이 필요합니다' }, 400)
    }
    
    // Gemini API를 사용한 오디오 분석 (구현 예정)
    const analysis = {
      lyrics: '분석된 가사 내용...',
      chords: ['C', 'Am', 'F', 'G'],
      style: 'Pop, Emotional, Mid-tempo',
      key: 'C Major',
      tempo: '120 BPM'
    }
    
    return c.json({ success: true, analysis })
  } catch (error) {
    return c.json({ error: '분석 중 오류가 발생했습니다' }, 500)
  }
})

// 프롬프트 생성 API
app.post('/api/generate-prompt', async (c) => {
  try {
    const { style, genre, instruments, mood, influences } = await c.req.json()
    
    // 최적화된 Suno AI 프롬프트 생성
    const prompt = `${genre || 'Pop'}, ${style || 'Contemporary'}, ${mood || 'Upbeat'}, featuring ${instruments || 'piano, guitar, drums'}, inspired by ${influences || 'modern artists'}, high quality production, professional mixing`
    
    return c.json({ 
      success: true, 
      prompt,
      instructions: '원곡을 따르라 - 업로드된 멜로디 구조를 유지하며 편곡하세요'
    })
  } catch (error) {
    return c.json({ error: '프롬프트 생성 중 오류가 발생했습니다' }, 500)
  }
})

// 가사 생성 API
app.post('/api/generate-lyrics', async (c) => {
  try {
    const { theme, mood, structure, language = 'ko' } = await c.req.json()
    
    // 가사 생성 로직 (Gemini API 연동 예정)
    const lyrics = `[Verse 1]
${theme}에 대한 감정을 담은 첫 번째 구절
${mood}한 분위기로 시작하는 이야기

[Chorus]
가슴을 울리는 후렴구
기억에 남을 멜로디와 함께

[Verse 2]
더 깊어지는 이야기
감정의 절정으로 향하는 여정

[Chorus]
가슴을 울리는 후렴구
기억에 남을 멜로디와 함께

[Bridge]
잠깐의 휴식과 변화
새로운 관점에서 바라본 세상

[Outro]
여운을 남기는 마무리
${theme}에 대한 최종 메시지`
    
    return c.json({ success: true, lyrics })
  } catch (error) {
    return c.json({ error: '가사 생성 중 오류가 발생했습니다' }, 500)
  }
})

export default app