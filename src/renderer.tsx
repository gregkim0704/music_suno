import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AI Music Creator - 혁신적인 음악 창작 플랫폼</title>
        <meta name="description" content="Suno AI와 연동하여 머릿속 멜로디를 현실로 만드는 AI 음악 창작 플랫폼. 오디오 분석, 스타일 디렉팅, 가사 생성을 지원합니다." />
        <meta name="keywords" content="AI 음악, Suno AI, 음악 창작, 작곡, 편곡, 가사 생성, 인공지능 음악" />
        <meta property="og:title" content="AI Music Creator - 혁신적인 음악 창작 플랫폼" />
        <meta property="og:description" content="Suno AI와 연동하여 머릿속 멜로디를 현실로 만드는 AI 음악 창작 플랫폼" />
        <meta property="og:type" content="website" />
        
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="/static/style.css" rel="stylesheet" />
        
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  animation: {
                    'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    'bounce-slow': 'bounce 2s infinite',
                  },
                  backgroundImage: {
                    'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                  }
                }
              }
            }
          `
        }} />
      </head>
      <body className="antialiased">
        {children}
        <script src="/static/app.js"></script>
      </body>
    </html>
  )
})
