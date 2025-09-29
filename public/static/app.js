// AI Music Creator - Frontend JavaScript
class MusicCreatorApp {
    constructor() {
        this.currentAudioFile = null;
        this.analysisResult = null;
        this.musicPrompt = '';
        this.generatedLyrics = '';
        this.savedPersonas = JSON.parse(localStorage.getItem('musicPersonas') || '[]');
        this.stylePresets = JSON.parse(localStorage.getItem('stylePresets') || '[]');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSavedData();
        this.createModals();
    }
    
    setupEventListeners() {
        // 오디오 업로드 처리
        const audioFileInput = document.getElementById('audioFile');
        if (audioFileInput) {
            audioFileInput.addEventListener('change', (e) => {
                this.handleAudioUpload(e.target.files[0]);
            });
        }
        
        // 스타일 설정 모달 열기
        const openStyleModalBtn = document.getElementById('openStyleModal');
        if (openStyleModalBtn) {
            openStyleModalBtn.addEventListener('click', () => {
                this.openStyleModal();
            });
        }
        
        // 가사 작성 모달 열기
        const openLyricsModalBtn = document.getElementById('openLyricsModal');
        if (openLyricsModalBtn) {
            openLyricsModalBtn.addEventListener('click', () => {
                this.openLyricsModal();
            });
        }
        
        // 프롬프트 복사
        const copyPromptBtn = document.getElementById('copyPrompt');
        if (copyPromptBtn) {
            copyPromptBtn.addEventListener('click', () => {
                this.copyToClipboard('musicPrompt', '프롬프트가 복사되었습니다!');
            });
        }
        
        // 가사 복사
        const copyLyricsBtn = document.getElementById('copyLyrics');
        if (copyLyricsBtn) {
            copyLyricsBtn.addEventListener('click', () => {
                this.copyToClipboard('generatedLyrics', '가사가 복사되었습니다!');
            });
        }
    }
    
    async handleAudioUpload(file) {
        if (!file) return;
        
        this.currentAudioFile = file;
        this.showLoadingMessage('오디오 분석 중...');
        
        try {
            const formData = new FormData();
            formData.append('audio', file);
            
            const response = await fetch('/api/analyze-audio', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.analysisResult = result.analysis;
                this.showAnalysisResult();
                this.showSuccessMessage('오디오 분석이 완료되었습니다!');
            } else {
                this.showErrorMessage(result.error || '분석 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Audio analysis error:', error);
            this.showErrorMessage('오디오 분석 중 오류가 발생했습니다.');
        }
    }
    
    createModals() {
        // 스타일 설정 모달 생성
        this.createStyleModal();
        // 가사 작성 모달 생성  
        this.createLyricsModal();
    }
    
    createStyleModal() {
        const modalHTML = `
        <div id="styleModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-800">🎨 음악 스타일 디렉팅</h2>
                    <button onclick="app.closeModal('styleModal')" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                <div class="p-6">
                    <div class="grid md:grid-cols-2 gap-8">
                        <!-- 장르 선택 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-3">🎵 장르 선택</label>
                            <select id="genreSelect" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="">장르 선택...</option>
                                <option value="Pop">팝 (Pop)</option>
                                <option value="Rock">록 (Rock)</option>
                                <option value="Jazz">재즈 (Jazz)</option>
                                <option value="Classical">클래식 (Classical)</option>
                                <option value="Electronic">일렉트로닉 (Electronic)</option>
                                <option value="Hip-hop">힙합 (Hip-hop)</option>
                                <option value="R&B">알앤비 (R&B)</option>
                                <option value="Country">컨트리 (Country)</option>
                                <option value="Folk">포크 (Folk)</option>
                                <option value="Reggae">레게 (Reggae)</option>
                                <option value="K-pop">케이팝 (K-pop)</option>
                                <option value="J-pop">제이팝 (J-pop)</option>
                            </select>
                        </div>
                        
                        <!-- 악기 선택 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-3">🎸 주요 악기</label>
                            <div class="grid grid-cols-2 gap-2">
                                <label class="flex items-center">
                                    <input type="checkbox" value="piano" class="mr-2 instrument-checkbox"> 피아노
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" value="guitar" class="mr-2 instrument-checkbox"> 기타
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" value="drums" class="mr-2 instrument-checkbox"> 드럼
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" value="bass" class="mr-2 instrument-checkbox"> 베이스
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" value="violin" class="mr-2 instrument-checkbox"> 바이올린
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" value="saxophone" class="mr-2 instrument-checkbox"> 색소폰
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" value="synthesizer" class="mr-2 instrument-checkbox"> 신디사이저
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" value="orchestra" class="mr-2 instrument-checkbox"> 오케스트라
                                </label>
                            </div>
                        </div>
                        
                        <!-- 분위기/무드 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-3">🌟 분위기/무드</label>
                            <select id="moodSelect" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="">분위기 선택...</option>
                                <option value="Upbeat">경쾌함 (Upbeat)</option>
                                <option value="Emotional">감동적 (Emotional)</option>
                                <option value="Melancholy">우울한 (Melancholy)</option>
                                <option value="Energetic">에너지틱 (Energetic)</option>
                                <option value="Romantic">로맨틱 (Romantic)</option>
                                <option value="Dramatic">드라마틱 (Dramatic)</option>
                                <option value="Peaceful">평화로운 (Peaceful)</option>
                                <option value="Dark">어두운 (Dark)</option>
                                <option value="Cinematic">영화적 (Cinematic)</option>
                                <option value="Nostalgic">향수적 (Nostalgic)</option>
                                <option value="Inspiring">영감을 주는 (Inspiring)</option>
                                <option value="Mysterious">신비로운 (Mysterious)</option>
                            </select>
                        </div>
                        
                        <!-- 템포 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-3">⚡ 템포</label>
                            <select id="tempoSelect" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="">템포 선택...</option>
                                <option value="Slow">느림 (60-80 BPM)</option>
                                <option value="Mid-tempo">중간 (80-120 BPM)</option>
                                <option value="Fast">빠름 (120-140 BPM)</option>
                                <option value="Very Fast">매우 빠름 (140+ BPM)</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- 커스텀 키워드 -->
                    <div class="mt-6">
                        <label class="block text-sm font-medium text-gray-700 mb-3">✨ 추가 키워드 (선택사항)</label>
                        <input type="text" id="customKeywords" placeholder="예: vintage, dreamy, ethereal, powerful..." 
                               class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <p class="text-sm text-gray-500 mt-1">쉼표로 구분하여 여러 키워드를 입력할 수 있습니다.</p>
                    </div>
                    
                    <!-- 인플루언스 (참고 아티스트) -->
                    <div class="mt-6">
                        <label class="block text-sm font-medium text-gray-700 mb-3">🎤 참고 스타일 (선택사항)</label>
                        <input type="text" id="influences" placeholder="예: Beatles-style, Taylor Swift-inspired..." 
                               class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <p class="text-sm text-gray-500 mt-1">특정 아티스트나 밴드의 스타일을 참고할 수 있습니다. (직접적인 아티스트명 사용은 권장하지 않습니다)</p>
                    </div>
                    
                    <!-- 고급 설정 -->
                    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 class="font-medium text-gray-800 mb-3">🔧 고급 설정</h3>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm text-gray-600 mb-2">원곡 따라하기 강도</label>
                                <input type="range" id="originalInfluence" min="0" max="100" value="80" 
                                       class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                <div class="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>자유롭게</span>
                                    <span id="originalInfluenceValue">80%</span>
                                    <span>정확하게</span>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm text-gray-600 mb-2">창의성 수준</label>
                                <input type="range" id="creativity" min="0" max="100" value="60" 
                                       class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                <div class="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>보수적</span>
                                    <span id="creativityValue">60%</span>
                                    <span>혁신적</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 프리셋 저장/불러오기 -->
                    <div class="mt-6 flex gap-4">
                        <input type="text" id="presetName" placeholder="프리셋 이름..." 
                               class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <button onclick="app.saveStylePreset()" 
                                class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            💾 저장
                        </button>
                        <select id="presetSelect" class="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <option value="">저장된 프리셋...</option>
                        </select>
                    </div>
                    
                    <!-- 액션 버튼 -->
                    <div class="mt-8 flex gap-4">
                        <button onclick="app.generatePrompt()" 
                                class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
                            🚀 프롬프트 생성하기
                        </button>
                        <button onclick="app.closeModal('styleModal')" 
                                class="px-6 py-4 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors">
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // 슬라이더 값 업데이트 이벤트
        const originalInfluenceSlider = document.getElementById('originalInfluence');
        const creativitySlider = document.getElementById('creativity');
        
        if (originalInfluenceSlider) {
            originalInfluenceSlider.addEventListener('input', (e) => {
                document.getElementById('originalInfluenceValue').textContent = e.target.value + '%';
            });
        }
        
        if (creativitySlider) {
            creativitySlider.addEventListener('input', (e) => {
                document.getElementById('creativityValue').textContent = e.target.value + '%';
            });
        }
    }
    
    createLyricsModal() {
        const modalHTML = `
        <div id="lyricsModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-800">✍️ 가사 작성</h2>
                    <button onclick="app.closeModal('lyricsModal')" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                <div class="p-6">
                    <div class="grid md:grid-cols-2 gap-8">
                        <!-- 테마 및 주제 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-3">🎯 노래 주제</label>
                            <input type="text" id="lyricsTheme" placeholder="예: 사랑, 이별, 희망, 우정, 꿈..." 
                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        </div>
                        
                        <!-- 감정/무드 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-3">💫 감정/무드</label>
                            <select id="lyricsMood" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                <option value="">감정 선택...</option>
                                <option value="희망적">희망적</option>
                                <option value="슬픈">슬픈</option>
                                <option value="기쁜">기쁜</option>
                                <option value="그리운">그리운</option>
                                <option value="용기있는">용기있는</option>
                                <option value="로맨틱">로맨틱</option>
                                <option value="강렬한">강렬한</option>
                                <option value="평화로운">평화로운</option>
                                <option value="신비로운">신비로운</option>
                                <option value="에너지틱">에너지틱</option>
                            </select>
                        </div>
                        
                        <!-- 곡 구조 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-3">🏗️ 곡 구조</label>
                            <select id="lyricsStructure" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                <option value="standard">표준 (Verse-Chorus-Verse-Chorus-Bridge-Chorus)</option>
                                <option value="simple">단순 (Verse-Chorus-Verse-Chorus)</option>
                                <option value="extended">확장 (Intro-Verse-Pre-Chorus-Chorus-Verse-Pre-Chorus-Chorus-Bridge-Chorus-Outro)</option>
                                <option value="ballad">발라드 (Verse-Chorus-Verse-Chorus-Bridge-Chorus-Outro)</option>
                                <option value="custom">사용자 정의</option>
                            </select>
                        </div>
                        
                        <!-- 언어 설정 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-3">🌐 언어</label>
                            <select id="lyricsLanguage" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                <option value="ko">한국어</option>
                                <option value="en">영어</option>
                                <option value="mix">한영 혼용</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- 키워드 및 메시지 -->
                    <div class="mt-6">
                        <label class="block text-sm font-medium text-gray-700 mb-3">🔑 핵심 키워드 (선택사항)</label>
                        <input type="text" id="lyricsKeywords" placeholder="예: 별, 바다, 꿈, 시간, 기억..." 
                               class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <p class="text-sm text-gray-500 mt-1">가사에 포함하고 싶은 단어들을 쉼표로 구분하여 입력하세요.</p>
                    </div>
                    
                    <!-- 전달하고 싶은 메시지 -->
                    <div class="mt-6">
                        <label class="block text-sm font-medium text-gray-700 mb-3">💬 전달하고 싶은 메시지</label>
                        <textarea id="lyricsMessage" rows="3" placeholder="이 노래를 통해 전달하고 싶은 메시지나 이야기를 간단히 적어주세요..." 
                                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"></textarea>
                    </div>
                    
                    <!-- 보컬 디렉팅 -->  \n                    <div class=\"mt-6 p-4 bg-gray-50 rounded-lg\">\n                        <h3 class=\"font-medium text-gray-800 mb-3\">🎤 보컬 디렉팅</h3>\n                        <div class=\"grid md:grid-cols-2 gap-4\">\n                            <div>\n                                <label class=\"block text-sm text-gray-600 mb-2\">보컬 스타일</label>\n                                <select id=\"vocalStyle\" class=\"w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500\">\n                                    <option value=\"\">선택...</option>\n                                    <option value=\"powerful\">파워풀</option>\n                                    <option value=\"soft\">부드러운</option>\n                                    <option value=\"emotional\">감정적인</option>\n                                    <option value=\"breathy\">숨소리가 섞인</option>\n                                    <option value=\"soulful\">소울풀</option>\n                                    <option value=\"gentle\">젠틀한</option>\n                                    <option value=\"dramatic\">드라마틱</option>\n                                </select>\n                            </div>\n                            <div>\n                                <label class=\"block text-sm text-gray-600 mb-2\">특수 효과</label>\n                                <div class=\"flex flex-wrap gap-2\">\n                                    <label class=\"flex items-center text-sm\">\n                                        <input type=\"checkbox\" value=\"harmonies\" class=\"mr-1 vocal-effect\"> 하모니\n                                    </label>\n                                    <label class=\"flex items-center text-sm\">\n                                        <input type=\"checkbox\" value=\"reverb\" class=\"mr-1 vocal-effect\"> 리버브\n                                    </label>\n                                    <label class=\"flex items-center text-sm\">\n                                        <input type=\"checkbox\" value=\"whisper\" class=\"mr-1 vocal-effect\"> 위스퍼\n                                    </label>\n                                    <label class=\"flex items-center text-sm\">\n                                        <input type=\"checkbox\" value=\"falsetto\" class=\"mr-1 vocal-effect\"> 팔세토\n                                    </label>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    \n                    <!-- 기존 곡 참조 정보 표시 -->\n                    <div id=\"analysisReference\" class=\"mt-6 p-4 bg-blue-50 rounded-lg\" style=\"display: none;\">\n                        <h3 class=\"font-medium text-blue-800 mb-3\">📊 분석된 곡 정보 참조</h3>\n                        <div id=\"analysisReferenceContent\"></div>\n                        <label class=\"flex items-center mt-3\">\n                            <input type=\"checkbox\" id=\"useAnalysisReference\" class=\"mr-2\">\n                            <span class=\"text-sm text-blue-700\">분석된 곡의 스타일을 가사 생성에 반영</span>\n                        </label>\n                    </div>\n                    \n                    <!-- 액션 버튼 -->\n                    <div class=\"mt-8 flex gap-4\">\n                        <button onclick=\"app.generateLyrics()\" \n                                class=\"flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105\">\n                            ✨ 가사 생성하기\n                        </button>\n                        <button onclick=\"app.closeModal('lyricsModal')\" \n                                class=\"px-6 py-4 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors\">\n                            취소\n                        </button>\n                    </div>\n                </div>\n            </div>\n        </div>`;\n        \n        document.body.insertAdjacentHTML('beforeend', modalHTML);\n    }\n    \n    openStyleModal() {\n        document.getElementById('styleModal').classList.remove('hidden');\n        this.loadStylePresets();\n    }\n    \n    openLyricsModal() {\n        document.getElementById('lyricsModal').classList.remove('hidden');\n        \n        // 분석 결과가 있으면 참조 섹션 표시\n        if (this.analysisResult) {\n            this.showAnalysisReference();\n        }\n    }\n    \n    closeModal(modalId) {\n        document.getElementById(modalId).classList.add('hidden');\n    }\n    \n    async generatePrompt() {\n        try {\n            const styleData = this.collectStyleData();\n            this.showLoadingMessage('프롬프트 생성 중...');\n            \n            const response = await fetch('/api/generate-prompt', {\n                method: 'POST',\n                headers: {\n                    'Content-Type': 'application/json'\n                },\n                body: JSON.stringify(styleData)\n            });\n            \n            const result = await response.json();\n            \n            if (result.success) {\n                this.musicPrompt = result.prompt;\n                document.getElementById('musicPrompt').value = this.musicPrompt;\n                this.closeModal('styleModal');\n                this.showSuccessMessage('프롬프트가 생성되었습니다!');\n                \n                // 강력한 지시어 추가 알림\n                if (this.currentAudioFile) {\n                    this.showInfoMessage('💡 원곡 업로드 시 \"원곡을 따르라\" 지시어를 반드시 포함하세요!');\n                }\n            } else {\n                this.showErrorMessage(result.error || '프롬프트 생성 중 오류가 발생했습니다.');\n            }\n        } catch (error) {\n            console.error('Prompt generation error:', error);\n            this.showErrorMessage('프롬프트 생성 중 오류가 발생했습니다.');\n        }\n    }\n    \n    async generateLyrics() {\n        try {\n            const lyricsData = this.collectLyricsData();\n            this.showLoadingMessage('가사 생성 중...');\n            \n            const response = await fetch('/api/generate-lyrics', {\n                method: 'POST',\n                headers: {\n                    'Content-Type': 'application/json'\n                },\n                body: JSON.stringify(lyricsData)\n            });\n            \n            const result = await response.json();\n            \n            if (result.success) {\n                this.generatedLyrics = result.lyrics;\n                document.getElementById('generatedLyrics').value = this.generatedLyrics;\n                this.closeModal('lyricsModal');\n                this.showSuccessMessage('가사가 생성되었습니다!');\n            } else {\n                this.showErrorMessage(result.error || '가사 생성 중 오류가 발생했습니다.');\n            }\n        } catch (error) {\n            console.error('Lyrics generation error:', error);\n            this.showErrorMessage('가사 생성 중 오류가 발생했습니다.');\n        }\n    }\n    \n    collectStyleData() {\n        const selectedInstruments = Array.from(document.querySelectorAll('.instrument-checkbox:checked'))\n            .map(cb => cb.value);\n            \n        return {\n            genre: document.getElementById('genreSelect').value,\n            instruments: selectedInstruments.join(', '),\n            mood: document.getElementById('moodSelect').value,\n            tempo: document.getElementById('tempoSelect').value,\n            customKeywords: document.getElementById('customKeywords').value,\n            influences: document.getElementById('influences').value,\n            originalInfluence: document.getElementById('originalInfluence').value,\n            creativity: document.getElementById('creativity').value,\n            hasAudio: !!this.currentAudioFile\n        };\n    }\n    \n    collectLyricsData() {\n        const selectedVocalEffects = Array.from(document.querySelectorAll('.vocal-effect:checked'))\n            .map(cb => cb.value);\n            \n        return {\n            theme: document.getElementById('lyricsTheme').value,\n            mood: document.getElementById('lyricsMood').value,\n            structure: document.getElementById('lyricsStructure').value,\n            language: document.getElementById('lyricsLanguage').value,\n            keywords: document.getElementById('lyricsKeywords').value,\n            message: document.getElementById('lyricsMessage').value,\n            vocalStyle: document.getElementById('vocalStyle').value,\n            vocalEffects: selectedVocalEffects,\n            useAnalysis: document.getElementById('useAnalysisReference')?.checked || false,\n            analysisData: this.analysisResult\n        };\n    }\n    \n    showAnalysisResult() {\n        if (!this.analysisResult) return;\n        \n        const notification = document.createElement('div');\n        notification.className = 'fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';\n        notification.innerHTML = `\n            <h4 class=\"font-semibold mb-2\">🎵 분석 완료!</h4>\n            <p class=\"text-sm mb-2\"><strong>스타일:</strong> ${this.analysisResult.style}</p>\n            <p class=\"text-sm mb-2\"><strong>키:</strong> ${this.analysisResult.key}</p>\n            <p class=\"text-sm mb-2\"><strong>템포:</strong> ${this.analysisResult.tempo}</p>\n            <p class=\"text-sm\"><strong>코드:</strong> ${this.analysisResult.chords.join(', ')}</p>\n        `;\n        \n        document.body.appendChild(notification);\n        \n        setTimeout(() => {\n            notification.remove();\n        }, 5000);\n    }\n    \n    showAnalysisReference() {\n        const referenceDiv = document.getElementById('analysisReference');\n        const contentDiv = document.getElementById('analysisReferenceContent');\n        \n        if (this.analysisResult && referenceDiv && contentDiv) {\n            contentDiv.innerHTML = `\n                <div class=\"grid grid-cols-2 gap-4 text-sm\">\n                    <div><strong>감지된 스타일:</strong> ${this.analysisResult.style}</div>\n                    <div><strong>키:</strong> ${this.analysisResult.key}</div>\n                    <div><strong>템포:</strong> ${this.analysisResult.tempo}</div>\n                    <div><strong>코드 진행:</strong> ${this.analysisResult.chords.join(', ')}</div>\n                </div>\n            `;\n            referenceDiv.style.display = 'block';\n        }\n    }\n    \n    saveStylePreset() {\n        const presetName = document.getElementById('presetName').value.trim();\n        if (!presetName) {\n            this.showErrorMessage('프리셋 이름을 입력하세요.');\n            return;\n        }\n        \n        const styleData = this.collectStyleData();\n        const preset = {\n            name: presetName,\n            data: styleData,\n            created: new Date().toISOString()\n        };\n        \n        this.stylePresets.push(preset);\n        localStorage.setItem('stylePresets', JSON.stringify(this.stylePresets));\n        \n        this.loadStylePresets();\n        this.showSuccessMessage(`프리셋 \"${presetName}\"이 저장되었습니다!`);\n        \n        document.getElementById('presetName').value = '';\n    }\n    \n    loadStylePresets() {\n        const presetSelect = document.getElementById('presetSelect');\n        if (!presetSelect) return;\n        \n        presetSelect.innerHTML = '<option value=\"\">저장된 프리셋...</option>';\n        \n        this.stylePresets.forEach((preset, index) => {\n            const option = document.createElement('option');\n            option.value = index;\n            option.textContent = preset.name;\n            presetSelect.appendChild(option);\n        });\n        \n        presetSelect.addEventListener('change', (e) => {\n            if (e.target.value !== '') {\n                this.loadPreset(parseInt(e.target.value));\n            }\n        });\n    }\n    \n    loadPreset(index) {\n        const preset = this.stylePresets[index];\n        if (!preset) return;\n        \n        const data = preset.data;\n        \n        // 폼 필드에 데이터 로드\n        document.getElementById('genreSelect').value = data.genre || '';\n        document.getElementById('moodSelect').value = data.mood || '';\n        document.getElementById('tempoSelect').value = data.tempo || '';\n        document.getElementById('customKeywords').value = data.customKeywords || '';\n        document.getElementById('influences').value = data.influences || '';\n        \n        if (data.originalInfluence) {\n            document.getElementById('originalInfluence').value = data.originalInfluence;\n            document.getElementById('originalInfluenceValue').textContent = data.originalInfluence + '%';\n        }\n        \n        if (data.creativity) {\n            document.getElementById('creativity').value = data.creativity;\n            document.getElementById('creativityValue').textContent = data.creativity + '%';\n        }\n        \n        // 악기 체크박스 설정\n        document.querySelectorAll('.instrument-checkbox').forEach(cb => {\n            cb.checked = data.instruments.includes(cb.value);\n        });\n        \n        this.showSuccessMessage(`프리셋 \"${preset.name}\"을 불러왔습니다!`);\n    }\n    \n    async copyToClipboard(elementId, successMessage) {\n        try {\n            const element = document.getElementById(elementId);\n            const text = element.value || element.textContent;\n            \n            if (!text.trim()) {\n                this.showErrorMessage('복사할 내용이 없습니다.');\n                return;\n            }\n            \n            await navigator.clipboard.writeText(text);\n            this.showSuccessMessage(successMessage);\n        } catch (error) {\n            console.error('Clipboard error:', error);\n            this.showErrorMessage('복사 중 오류가 발생했습니다.');\n        }\n    }\n    \n    loadSavedData() {\n        // 로컬 스토리지에서 저장된 데이터 불러오기\n        const savedPrompt = localStorage.getItem('lastMusicPrompt');\n        const savedLyrics = localStorage.getItem('lastGeneratedLyrics');\n        \n        if (savedPrompt) {\n            document.getElementById('musicPrompt').value = savedPrompt;\n            this.musicPrompt = savedPrompt;\n        }\n        \n        if (savedLyrics) {\n            document.getElementById('generatedLyrics').value = savedLyrics;\n            this.generatedLyrics = savedLyrics;\n        }\n    }\n    \n    saveDataToLocal() {\n        // 데이터를 로컬 스토리지에 저장\n        if (this.musicPrompt) {\n            localStorage.setItem('lastMusicPrompt', this.musicPrompt);\n        }\n        \n        if (this.generatedLyrics) {\n            localStorage.setItem('lastGeneratedLyrics', this.generatedLyrics);\n        }\n    }\n    \n    showLoadingMessage(message) {\n        this.showNotification(message, 'bg-blue-500', '⏳');\n    }\n    \n    showSuccessMessage(message) {\n        this.showNotification(message, 'bg-green-500', '✅');\n    }\n    \n    showErrorMessage(message) {\n        this.showNotification(message, 'bg-red-500', '❌');\n    }\n    \n    showInfoMessage(message) {\n        this.showNotification(message, 'bg-yellow-500', '💡', 8000);\n    }\n    \n    showNotification(message, bgClass, icon, duration = 3000) {\n        const notification = document.createElement('div');\n        notification.className = `fixed top-4 right-4 ${bgClass} text-white p-4 rounded-lg shadow-lg z-50 max-w-sm transform transition-all duration-300 translate-x-full`;\n        notification.innerHTML = `\n            <div class=\"flex items-center\">\n                <span class=\"text-xl mr-2\">${icon}</span>\n                <span>${message}</span>\n            </div>\n        `;\n        \n        document.body.appendChild(notification);\n        \n        // 애니메이션으로 슬라이드 인\n        setTimeout(() => {\n            notification.classList.remove('translate-x-full');\n        }, 100);\n        \n        // 일정 시간 후 제거\n        setTimeout(() => {\n            notification.classList.add('translate-x-full');\n            setTimeout(() => {\n                notification.remove();\n            }, 300);\n        }, duration);\n    }\n}\n\n// 앱 초기화\nlet app;\ndocument.addEventListener('DOMContentLoaded', function() {\n    app = new MusicCreatorApp();\n    \n    // 페이지 언로드 시 데이터 저장\n    window.addEventListener('beforeunload', () => {\n        if (app) {\n            app.saveDataToLocal();\n        }\n    });\n    \n    console.log('🎵 AI Music Creator 앱이 초기화되었습니다!');\n});"}, {"old_string": "// \ubc84\ub2c8\ub2e4.", "new_string": "// \ubc84\ub2c8\ub2e4."}]