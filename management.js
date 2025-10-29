document.addEventListener('DOMContentLoaded', () => {
    const addGroupForm = document.getElementById('add-group-form');
    const groupList = document.getElementById('group-list');
    const groupNameInput = document.getElementById('group-name');

    const MASTER_PASSWORD = '0070';
    let allData = {};
    let categories = [];
    let selectedCategory = 'all'; // 'all' or category name

    const sampleData = {
        // 사진 카테고리
        '이미지 생성 AI': {
            description: '텍스트로 이미지 생성하는 AI 도구',
            password: null,
            category: '사진',
            bookmarks: [
                { title: 'Midjourney', url: 'https://www.midjourney.com' },
                { title: 'DALL-E 3', url: 'https://openai.com/dall-e-3' },
                { title: 'Stable Diffusion', url: 'https://stability.ai' }
            ]
        },
        '사진 편집 AI': {
            description: '사진 보정 및 편집 AI',
            password: null,
            category: '사진',
            bookmarks: [
                { title: 'Photoshop AI', url: 'https://www.adobe.com/products/photoshop.html' },
                { title: 'Luminar Neo', url: 'https://skylum.com/luminar' },
                { title: 'Topaz Photo AI', url: 'https://www.topazlabs.com/topaz-photo-ai' }
            ]
        },
        '배경 제거 AI': {
            description: '자동 배경 제거 도구',
            password: null,
            category: '사진',
            bookmarks: [
                { title: 'Remove.bg', url: 'https://www.remove.bg' },
                { title: 'Cleanup.pictures', url: 'https://cleanup.pictures' },
                { title: 'PhotoRoom', url: 'https://www.photoroom.com' }
            ]
        },
        '얼굴 생성 AI': {
            description: '가상 얼굴 생성 및 편집',
            password: null,
            category: '사진',
            bookmarks: [
                { title: 'Generated Photos', url: 'https://generated.photos' },
                { title: 'This Person Does Not Exist', url: 'https://thispersondoesnotexist.com' },
                { title: 'Artbreeder', url: 'https://www.artbreeder.com' }
            ]
        },
        '이미지 업스케일링': {
            description: '이미지 해상도 향상 AI',
            password: null,
            category: '사진',
            bookmarks: [
                { title: 'Upscale.media', url: 'https://upscale.media' },
                { title: 'Let\'s Enhance', url: 'https://letsenhance.io' },
                { title: 'Gigapixel AI', url: 'https://www.topazlabs.com/gigapixel-ai' }
            ]
        },
        '아트 생성 AI': {
            description: 'AI 예술 작품 생성',
            password: null,
            category: '사진',
            bookmarks: [
                { title: 'NightCafe', url: 'https://creator.nightcafe.studio' },
                { title: 'Deep Dream Generator', url: 'https://deepdreamgenerator.com' },
                { title: 'Craiyon', url: 'https://www.craiyon.com' }
            ]
        },
        '로고 디자인 AI': {
            description: 'AI 로고 생성 도구',
            password: null,
            category: '사진',
            bookmarks: [
                { title: 'Looka', url: 'https://looka.com' },
                { title: 'Brandmark', url: 'https://brandmark.io' },
                { title: 'Designs.ai', url: 'https://designs.ai' }
            ]
        },
        '색상 팔레트 AI': {
            description: 'AI 색상 조합 추천',
            password: null,
            category: '사진',
            bookmarks: [
                { title: 'Khroma', url: 'https://www.khroma.co' },
                { title: 'Colormind', url: 'http://colormind.io' },
                { title: 'Adobe Color', url: 'https://color.adobe.com' }
            ]
        },
        '3D 이미지 생성': {
            description: '2D를 3D로 변환하는 AI',
            password: null,
            category: '사진',
            bookmarks: [
                { title: 'Luma AI', url: 'https://lumalabs.ai' },
                { title: 'Kaedim', url: 'https://www.kaedim3d.com' },
                { title: 'Masterpiece Studio', url: 'https://masterpiecestudio.com' }
            ]
        },
        'AI 필터 효과': {
            description: '예술적 필터 및 스타일 변환',
            password: null,
            category: '사진',
            bookmarks: [
                { title: 'Prisma', url: 'https://prisma-ai.com' },
                { title: 'Deep Art Effects', url: 'https://www.deeparteffects.com' },
                { title: 'Picsart AI', url: 'https://picsart.com/ai-photo-editor' }
            ]
        },

        // 영상 카테고리
        '비디오 생성 AI': {
            description: '텍스트로 비디오 생성',
            password: null,
            category: '영상',
            bookmarks: [
                { title: 'Runway Gen-2', url: 'https://runwayml.com' },
                { title: 'Pika Labs', url: 'https://pika.art' },
                { title: 'Synthesia', url: 'https://www.synthesia.io' }
            ]
        },
        '비디오 편집 AI': {
            description: 'AI 비디오 편집 도구',
            password: null,
            category: '영상',
            bookmarks: [
                { title: 'Adobe Premiere Pro AI', url: 'https://www.adobe.com/products/premiere.html' },
                { title: 'Descript', url: 'https://www.descript.com' },
                { title: 'CapCut', url: 'https://www.capcut.com' }
            ]
        },
        '영상 자막 AI': {
            description: '자동 자막 생성 및 번역',
            password: null,
            category: '영상',
            bookmarks: [
                { title: 'SubtitleBee', url: 'https://subtitlebee.com' },
                { title: 'Happy Scribe', url: 'https://www.happyscribe.com' },
                { title: 'Rev AI', url: 'https://www.rev.ai' }
            ]
        },
        '딥페이크 AI': {
            description: '얼굴 바꾸기 및 표정 변환',
            password: null,
            category: '영상',
            bookmarks: [
                { title: 'DeepFaceLab', url: 'https://github.com/iperov/DeepFaceLab' },
                { title: 'Reface', url: 'https://hey.reface.ai' },
                { title: 'D-ID', url: 'https://www.d-id.com' }
            ]
        },
        '영상 업스케일링': {
            description: '비디오 해상도 향상',
            password: null,
            category: '영상',
            bookmarks: [
                { title: 'Topaz Video AI', url: 'https://www.topazlabs.com/topaz-video-ai' },
                { title: 'AVCLabs Video Enhancer', url: 'https://www.avclabs.com/video-enhancer-ai.html' },
                { title: 'Pixop', url: 'https://www.pixop.com' }
            ]
        },
        '애니메이션 AI': {
            description: 'AI 애니메이션 제작',
            password: null,
            category: '영상',
            bookmarks: [
                { title: 'Animaker', url: 'https://www.animaker.com' },
                { title: 'Vyond', url: 'https://www.vyond.com' },
                { title: 'Steve.AI', url: 'https://www.steve.ai' }
            ]
        },
        '숏폼 제작 AI': {
            description: '쇼츠, 릴스 자동 생성',
            password: null,
            category: '영상',
            bookmarks: [
                { title: 'OpusClip', url: 'https://www.opus.pro' },
                { title: 'Klap', url: 'https://klap.app' },
                { title: 'Vizard', url: 'https://vizard.ai' }
            ]
        },
        '영상 색보정 AI': {
            description: 'AI 컬러 그레이딩',
            password: null,
            category: '영상',
            bookmarks: [
                { title: 'DaVinci Resolve AI', url: 'https://www.blackmagicdesign.com/products/davinciresolve' },
                { title: 'Colourlab AI', url: 'https://www.colourlab.ai' },
                { title: 'AutoColor', url: 'https://autocolor.ai' }
            ]
        },
        '슬로우모션 AI': {
            description: '프레임 보간으로 슬로우모션 생성',
            password: null,
            category: '영상',
            bookmarks: [
                { title: 'Flowframes', url: 'https://nmkd.itch.io/flowframes' },
                { title: 'DAIN-APP', url: 'https://grisk.itch.io/dain-app' },
                { title: 'Butterflow', url: 'https://github.com/dthpham/butterflow' }
            ]
        },
        '영상 변환 AI': {
            description: '스타일 변환 및 효과',
            password: null,
            category: '영상',
            bookmarks: [
                { title: 'EbSynth', url: 'https://ebsynth.com' },
                { title: 'Kaiber', url: 'https://kaiber.ai' },
                { title: 'Wonder Studio', url: 'https://wonderdynamics.com' }
            ]
        },

        // 챗봇 카테고리
        '대화형 AI': {
            description: '범용 AI 챗봇',
            password: null,
            category: '챗봇',
            bookmarks: [
                { title: 'ChatGPT', url: 'https://chat.openai.com' },
                { title: 'Claude', url: 'https://claude.ai' },
                { title: 'Gemini', url: 'https://gemini.google.com' }
            ]
        },
        '검색 AI': {
            description: 'AI 기반 검색 엔진',
            password: null,
            category: '챗봇',
            bookmarks: [
                { title: 'Perplexity', url: 'https://www.perplexity.ai' },
                { title: 'You.com', url: 'https://you.com' },
                { title: 'Bing Chat', url: 'https://www.bing.com/chat' }
            ]
        },
        '문서 분석 AI': {
            description: 'PDF, 문서 분석 챗봇',
            password: null,
            category: '챗봇',
            bookmarks: [
                { title: 'ChatPDF', url: 'https://www.chatpdf.com' },
                { title: 'DocuAsk', url: 'https://www.docuask.com' },
                { title: 'AskYourPDF', url: 'https://askyourpdf.com' }
            ]
        },
        '캐릭터 AI': {
            description: '개성있는 AI 캐릭터 대화',
            password: null,
            category: '챗봇',
            bookmarks: [
                { title: 'Character.AI', url: 'https://character.ai' },
                { title: 'Replika', url: 'https://replika.com' },
                { title: 'Chai', url: 'https://chai.ml' }
            ]
        },
        '번역 AI': {
            description: 'AI 번역 서비스',
            password: null,
            category: '챗봇',
            bookmarks: [
                { title: 'DeepL', url: 'https://www.deepl.com' },
                { title: 'Papago', url: 'https://papago.naver.com' },
                { title: 'Google Translate', url: 'https://translate.google.com' }
            ]
        },
        '글쓰기 AI': {
            description: 'AI 글쓰기 도우미',
            password: null,
            category: '챗봇',
            bookmarks: [
                { title: 'Jasper', url: 'https://www.jasper.ai' },
                { title: 'Copy.ai', url: 'https://www.copy.ai' },
                { title: 'Writesonic', url: 'https://writesonic.com' }
            ]
        },
        '학습 AI': {
            description: '교육 및 학습 AI',
            password: null,
            category: '챗봇',
            bookmarks: [
                { title: 'Khan Academy AI', url: 'https://www.khanacademy.org' },
                { title: 'Socratic', url: 'https://socratic.org' },
                { title: 'Quizlet AI', url: 'https://quizlet.com' }
            ]
        },
        '비즈니스 AI': {
            description: '업무용 AI 어시스턴트',
            password: null,
            category: '챗봇',
            bookmarks: [
                { title: 'Notion AI', url: 'https://www.notion.so/product/ai' },
                { title: 'Microsoft Copilot', url: 'https://copilot.microsoft.com' },
                { title: 'Slack AI', url: 'https://slack.com/features/ai' }
            ]
        },
        '법률 AI': {
            description: '법률 상담 AI',
            password: null,
            category: '챗봇',
            bookmarks: [
                { title: 'DoNotPay', url: 'https://donotpay.com' },
                { title: 'LawDroid', url: 'https://lawdroid.com' },
                { title: 'CaseText', url: 'https://casetext.com' }
            ]
        },
        '헬스케어 AI': {
            description: '건강 상담 AI',
            password: null,
            category: '챗봇',
            bookmarks: [
                { title: 'Ada Health', url: 'https://ada.com' },
                { title: 'Babylon Health', url: 'https://www.babylonhealth.com' },
                { title: 'K Health', url: 'https://khealth.com' }
            ]
        },

        // 음악 카테고리
        '음악 생성 AI': {
            description: '텍스트로 음악 생성',
            password: null,
            category: '음악',
            bookmarks: [
                { title: 'Suno AI', url: 'https://www.suno.ai' },
                { title: 'Udio', url: 'https://www.udio.com' },
                { title: 'Mubert', url: 'https://mubert.com' }
            ]
        },
        '작곡 AI': {
            description: 'AI 작곡 도구',
            password: null,
            category: '음악',
            bookmarks: [
                { title: 'AIVA', url: 'https://www.aiva.ai' },
                { title: 'Amper Music', url: 'https://www.ampermusic.com' },
                { title: 'Soundraw', url: 'https://soundraw.io' }
            ]
        },
        '보컬 제거 AI': {
            description: '노래에서 보컬/MR 분리',
            password: null,
            category: '음악',
            bookmarks: [
                { title: 'Lalal.ai', url: 'https://www.lalal.ai' },
                { title: 'Moises', url: 'https://moises.ai' },
                { title: 'Vocal Remover', url: 'https://vocalremover.org' }
            ]
        },
        '마스터링 AI': {
            description: 'AI 음원 마스터링',
            password: null,
            category: '음악',
            bookmarks: [
                { title: 'LANDR', url: 'https://www.landr.com' },
                { title: 'eMastered', url: 'https://www.emastered.com' },
                { title: 'CloudBounce', url: 'https://www.cloudbounce.com' }
            ]
        },
        '악보 인식 AI': {
            description: '음악을 악보로 변환',
            password: null,
            category: '음악',
            bookmarks: [
                { title: 'AnthemScore', url: 'https://www.lunaverus.com' },
                { title: 'ScoreCloud', url: 'https://scorecloud.com' },
                { title: 'Melody Scanner', url: 'https://melodyscanner.com' }
            ]
        },
        '리믹스 AI': {
            description: 'AI 음악 리믹스',
            password: null,
            category: '음악',
            bookmarks: [
                { title: 'Boomy', url: 'https://boomy.com' },
                { title: 'Splash Pro', url: 'https://www.splashmusic.com' },
                { title: 'Beatoven.ai', url: 'https://www.beatoven.ai' }
            ]
        },
        '효과음 생성 AI': {
            description: 'AI 효과음 제작',
            password: null,
            category: '음악',
            bookmarks: [
                { title: 'AudioCraft', url: 'https://audiocraft.metademolab.com' },
                { title: 'Soundful', url: 'https://soundful.com' },
                { title: 'ElevenLabs Sound Effects', url: 'https://elevenlabs.io/sound-effects' }
            ]
        },
        'AI DJ': {
            description: 'AI 음악 믹싱',
            password: null,
            category: '음악',
            bookmarks: [
                { title: 'Algoriddim djay', url: 'https://www.algoriddim.com' },
                { title: 'Neural Mix', url: 'https://www.algoriddim.com/neural-mix' },
                { title: 'Splitter', url: 'https://www.splitter.ai' }
            ]
        },
        '음악 추천 AI': {
            description: 'AI 음악 큐레이션',
            password: null,
            category: '음악',
            bookmarks: [
                { title: 'Spotify AI DJ', url: 'https://www.spotify.com' },
                { title: 'Maroofy', url: 'https://maroofy.com' },
                { title: 'Chosic', url: 'https://www.chosic.com' }
            ]
        },
        '음악 분석 AI': {
            description: '음악 분석 및 BPM 감지',
            password: null,
            category: '음악',
            bookmarks: [
                { title: 'Tunebat', url: 'https://tunebat.com' },
                { title: 'Musiio', url: 'https://www.musiio.com' },
                { title: 'Cyanite', url: 'https://cyanite.ai' }
            ]
        },

        // 음성 카테고리
        '음성 합성 AI': {
            description: '텍스트를 음성으로 변환(TTS)',
            password: null,
            category: '음성',
            bookmarks: [
                { title: 'ElevenLabs', url: 'https://elevenlabs.io' },
                { title: 'Play.ht', url: 'https://play.ht' },
                { title: 'Murf AI', url: 'https://murf.ai' }
            ]
        },
        '음성 복제 AI': {
            description: '목소리 클론 생성',
            password: null,
            category: '음성',
            bookmarks: [
                { title: 'Resemble AI', url: 'https://www.resemble.ai' },
                { title: 'Descript Overdub', url: 'https://www.descript.com/overdub' },
                { title: 'Voice.ai', url: 'https://voice.ai' }
            ]
        },
        '음성 인식 AI': {
            description: '음성을 텍스트로 변환(STT)',
            password: null,
            category: '음성',
            bookmarks: [
                { title: 'Whisper AI', url: 'https://openai.com/research/whisper' },
                { title: 'Otter.ai', url: 'https://otter.ai' },
                { title: 'AssemblyAI', url: 'https://www.assemblyai.com' }
            ]
        },
        '음성 변조 AI': {
            description: '실시간 음성 변환',
            password: null,
            category: '음성',
            bookmarks: [
                { title: 'Voicemod', url: 'https://www.voicemod.net' },
                { title: 'MorphVOX', url: 'https://screamingbee.com' },
                { title: 'Clownfish Voice Changer', url: 'https://clownfish-translator.com' }
            ]
        },
        '팟캐스트 AI': {
            description: 'AI 팟캐스트 제작',
            password: null,
            category: '음성',
            bookmarks: [
                { title: 'Podcastle', url: 'https://podcastle.ai' },
                { title: 'Adobe Podcast', url: 'https://podcast.adobe.com' },
                { title: 'Riverside.fm', url: 'https://riverside.fm' }
            ]
        },
        '음성 번역 AI': {
            description: '음성 실시간 번역',
            password: null,
            category: '음성',
            bookmarks: [
                { title: 'Google Translate Voice', url: 'https://translate.google.com' },
                { title: 'iTranslate Voice', url: 'https://www.itranslate.com' },
                { title: 'Microsoft Translator', url: 'https://www.microsoft.com/translator' }
            ]
        },
        '노이즈 제거 AI': {
            description: '음성 배경 소음 제거',
            password: null,
            category: '음성',
            bookmarks: [
                { title: 'Krisp', url: 'https://krisp.ai' },
                { title: 'Adobe Podcast Enhance', url: 'https://podcast.adobe.com/enhance' },
                { title: 'Cleanvoice', url: 'https://cleanvoice.ai' }
            ]
        },
        '오디오북 AI': {
            description: 'AI 오디오북 생성',
            password: null,
            category: '음성',
            bookmarks: [
                { title: 'Speechify', url: 'https://speechify.com' },
                { title: 'NaturalReader', url: 'https://www.naturalreaders.com' },
                { title: 'Voice Dream Reader', url: 'https://www.voicedream.com' }
            ]
        },
        '음성 감정 분석': {
            description: '음성에서 감정 인식',
            password: null,
            category: '음성',
            bookmarks: [
                { title: 'Hume AI', url: 'https://www.hume.ai' },
                { title: 'Affectiva', url: 'https://www.affectiva.com' },
                { title: 'Beyond Verbal', url: 'https://www.beyondverbal.com' }
            ]
        },
        '음성 회의 AI': {
            description: '회의 녹음 및 요약',
            password: null,
            category: '음성',
            bookmarks: [
                { title: 'Fireflies.ai', url: 'https://fireflies.ai' },
                { title: 'Fathom', url: 'https://fathom.video' },
                { title: 'Grain', url: 'https://grain.com' }
            ]
        },

        // 코딩 카테고리
        '코드 생성 AI': {
            description: 'AI 코드 자동 생성',
            password: null,
            category: '코딩',
            bookmarks: [
                { title: 'GitHub Copilot', url: 'https://github.com/features/copilot' },
                { title: 'Cursor', url: 'https://cursor.sh' },
                { title: 'Codeium', url: 'https://codeium.com' }
            ]
        },
        '코드 리뷰 AI': {
            description: 'AI 코드 검토 및 개선',
            password: null,
            category: '코딩',
            bookmarks: [
                { title: 'CodeRabbit', url: 'https://coderabbit.ai' },
                { title: 'Sourcery', url: 'https://sourcery.ai' },
                { title: 'DeepSource', url: 'https://deepsource.io' }
            ]
        },
        '버그 탐지 AI': {
            description: 'AI 버그 및 취약점 탐지',
            password: null,
            category: '코딩',
            bookmarks: [
                { title: 'Snyk', url: 'https://snyk.io' },
                { title: 'DeepCode', url: 'https://www.deepcode.ai' },
                { title: 'CodeQL', url: 'https://codeql.github.com' }
            ]
        },
        '코드 문서화 AI': {
            description: '자동 코드 문서 생성',
            password: null,
            category: '코딩',
            bookmarks: [
                { title: 'Mintlify', url: 'https://mintlify.com' },
                { title: 'Swimm', url: 'https://swimm.io' },
                { title: 'Docuwriter', url: 'https://www.docuwriter.ai' }
            ]
        },
        'SQL 생성 AI': {
            description: 'AI SQL 쿼리 생성',
            password: null,
            category: '코딩',
            bookmarks: [
                { title: 'AI2SQL', url: 'https://www.ai2sql.io' },
                { title: 'Text2SQL', url: 'https://www.text2sql.ai' },
                { title: 'SQLCoder', url: 'https://sqlcoder.com' }
            ]
        },
        '정규식 AI': {
            description: 'AI 정규표현식 생성',
            password: null,
            category: '코딩',
            bookmarks: [
                { title: 'AutoRegex', url: 'https://www.autoregex.xyz' },
                { title: 'Regex.ai', url: 'https://regex.ai' },
                { title: 'RegexGPT', url: 'https://regexgpt.app' }
            ]
        },
        '코드 변환 AI': {
            description: '프로그래밍 언어 변환',
            password: null,
            category: '코딩',
            bookmarks: [
                { title: 'Code Converter', url: 'https://www.codeconvert.ai' },
                { title: 'AI Code Translator', url: 'https://ai-code-translator.vercel.app' },
                { title: 'BlackBox AI', url: 'https://www.blackbox.ai' }
            ]
        },
        '테스트 생성 AI': {
            description: 'AI 유닛 테스트 생성',
            password: null,
            category: '코딩',
            bookmarks: [
                { title: 'Codium AI', url: 'https://www.codium.ai' },
                { title: 'Testim', url: 'https://www.testim.io' },
                { title: 'Diffblue', url: 'https://www.diffblue.com' }
            ]
        },
        'API 개발 AI': {
            description: 'AI API 설계 및 테스트',
            password: null,
            category: '코딩',
            bookmarks: [
                { title: 'Postman AI', url: 'https://www.postman.com' },
                { title: 'Hoppscotch', url: 'https://hoppscotch.io' },
                { title: 'Insomnia', url: 'https://insomnia.rest' }
            ]
        },
        '코드 검색 AI': {
            description: 'AI 코드베이스 검색',
            password: null,
            category: '코딩',
            bookmarks: [
                { title: 'Phind', url: 'https://www.phind.com' },
                { title: 'Bloop', url: 'https://bloop.ai' },
                { title: 'Sourcegraph Cody', url: 'https://sourcegraph.com/cody' }
            ]
        },

        // 자동화 카테고리
        '워크플로우 자동화': {
            description: 'AI 업무 자동화 플랫폼',
            password: null,
            category: '자동화',
            bookmarks: [
                { title: 'Zapier', url: 'https://zapier.com' },
                { title: 'Make (Integromat)', url: 'https://www.make.com' },
                { title: 'n8n', url: 'https://n8n.io' }
            ]
        },
        '이메일 자동화 AI': {
            description: 'AI 이메일 작성 및 관리',
            password: null,
            category: '자동화',
            bookmarks: [
                { title: 'SaneBox', url: 'https://www.sanebox.com' },
                { title: 'Mailbutler', url: 'https://www.mailbutler.io' },
                { title: 'Superhuman', url: 'https://superhuman.com' }
            ]
        },
        '데이터 입력 자동화': {
            description: 'AI 데이터 추출 및 입력',
            password: null,
            category: '자동화',
            bookmarks: [
                { title: 'Parsio', url: 'https://parsio.io' },
                { title: 'Docparser', url: 'https://docparser.com' },
                { title: 'Nanonets', url: 'https://nanonets.com' }
            ]
        },
        'RPA AI': {
            description: '로봇 프로세스 자동화',
            password: null,
            category: '자동화',
            bookmarks: [
                { title: 'UiPath', url: 'https://www.uipath.com' },
                { title: 'Automation Anywhere', url: 'https://www.automationanywhere.com' },
                { title: 'Blue Prism', url: 'https://www.blueprism.com' }
            ]
        },
        '스케줄링 AI': {
            description: 'AI 일정 관리 및 예약',
            password: null,
            category: '자동화',
            bookmarks: [
                { title: 'Calendly AI', url: 'https://calendly.com' },
                { title: 'Motion', url: 'https://www.usemotion.com' },
                { title: 'Reclaim AI', url: 'https://reclaim.ai' }
            ]
        },
        '소셜미디어 자동화': {
            description: 'SNS 자동 포스팅 및 관리',
            password: null,
            category: '자동화',
            bookmarks: [
                { title: 'Buffer', url: 'https://buffer.com' },
                { title: 'Hootsuite', url: 'https://www.hootsuite.com' },
                { title: 'Later', url: 'https://later.com' }
            ]
        },
        '웹 스크래핑 AI': {
            description: 'AI 웹 데이터 수집',
            password: null,
            category: '자동화',
            bookmarks: [
                { title: 'Apify', url: 'https://apify.com' },
                { title: 'Octoparse', url: 'https://www.octoparse.com' },
                { title: 'ParseHub', url: 'https://www.parsehub.com' }
            ]
        },
        'CRM 자동화 AI': {
            description: '고객 관리 자동화',
            password: null,
            category: '자동화',
            bookmarks: [
                { title: 'HubSpot AI', url: 'https://www.hubspot.com' },
                { title: 'Salesforce Einstein', url: 'https://www.salesforce.com/einstein' },
                { title: 'Pipedrive AI', url: 'https://www.pipedrive.com' }
            ]
        },
        '챗봇 빌더': {
            description: 'AI 챗봇 제작 플랫폼',
            password: null,
            category: '자동화',
            bookmarks: [
                { title: 'Chatfuel', url: 'https://chatfuel.com' },
                { title: 'ManyChat', url: 'https://manychat.com' },
                { title: 'Tidio', url: 'https://www.tidio.com' }
            ]
        },
        '문서 자동화 AI': {
            description: 'AI 문서 생성 및 관리',
            password: null,
            category: '자동화',
            bookmarks: [
                { title: 'Coda AI', url: 'https://coda.io' },
                { title: 'Airtable AI', url: 'https://www.airtable.com' },
                { title: 'SmartSheet', url: 'https://www.smartsheet.com' }
            ]
        }
    };

    const sampleCategories = ['사진', '영상', '챗봇', '음악', '음성', '코딩', '자동화'];

    function migrateData(data) {
        let needsUpdate = false;
        for (const key in data) {
            if (Array.isArray(data[key])) { // Very old format
                data[key] = {
                    description: '',
                    password: null,
                    category: null,
                    bookmarks: data[key]
                };
                needsUpdate = true;
            } else if (data[key].password === undefined) { // Old format without password
                data[key].password = null;
                needsUpdate = true;
            }
            if (data[key].category === undefined) { // Old format without category
                data[key].category = null;
                needsUpdate = true;
            }
        }
        return needsUpdate;
    }

    function loadAllData() {
        const storedData = localStorage.getItem('bookmarkGroups');
        const storedCategories = localStorage.getItem('bookmarkCategories');

        if (storedData) {
            allData = JSON.parse(storedData);
            if (migrateData(allData)) {
                saveAllData();
            }
        } else {
            allData = sampleData;
            saveAllData();
        }

        if (storedCategories) {
            categories = JSON.parse(storedCategories);
        } else {
            categories = sampleCategories;
            saveCategories();
        }
    }

    function saveAllData() {
        localStorage.setItem('bookmarkGroups', JSON.stringify(allData));
    }

    function saveCategories() {
        localStorage.setItem('bookmarkCategories', JSON.stringify(categories));
    }

    function renderCategoryTabs() {
        const categoryTabsContainer = document.getElementById('category-tabs');
        categoryTabsContainer.innerHTML = '';

        // All tab
        const allTab = document.createElement('button');
        allTab.className = `category-tab ${selectedCategory === 'all' ? 'active' : ''}`;
        allTab.textContent = '전체';
        allTab.addEventListener('click', () => {
            selectedCategory = 'all';
            renderCategoryTabs();
            renderGroups();
        });
        categoryTabsContainer.appendChild(allTab);

        // Category tabs
        categories.forEach(categoryName => {
            const tab = document.createElement('button');
            tab.className = `category-tab ${selectedCategory === categoryName ? 'active' : ''}`;
            tab.textContent = categoryName;
            tab.addEventListener('click', () => {
                selectedCategory = categoryName;
                renderCategoryTabs();
                renderGroups();
            });

            // Right-click for category actions
            tab.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (confirm(`'${categoryName}' 카테고리를 관리하시겠습니까?\n\n확인: 이름 변경\n취소: 삭제`)) {
                    renameCategory(categoryName);
                } else {
                    deleteCategory(categoryName);
                }
            });

            categoryTabsContainer.appendChild(tab);
        });

        // Uncategorized tab
        const uncategorizedCount = Object.values(allData).filter(g => !g.category).length;
        if (uncategorizedCount > 0) {
            const uncategorizedTab = document.createElement('button');
            uncategorizedTab.className = `category-tab ${selectedCategory === 'uncategorized' ? 'active' : ''}`;
            uncategorizedTab.textContent = '미분류';
            uncategorizedTab.addEventListener('click', () => {
                selectedCategory = 'uncategorized';
                renderCategoryTabs();
                renderGroups();
            });
            categoryTabsContainer.appendChild(uncategorizedTab);
        }
    }

    function renderGroups() {
        groupList.innerHTML = '';

        if (Object.keys(allData).length === 0) {
            groupList.innerHTML = '<p class="text-center text-muted">아직 생성된 그룹이 없습니다. 새 그룹을 추가해보세요!</p>';
            return;
        }

        // Filter groups by selected category
        const filteredGroups = Object.keys(allData).filter(groupName => {
            const groupData = allData[groupName];
            if (selectedCategory === 'all') {
                return true;
            } else if (selectedCategory === 'uncategorized') {
                return !groupData.category || !categories.includes(groupData.category);
            } else {
                return groupData.category === selectedCategory;
            }
        });

        if (filteredGroups.length === 0) {
            groupList.innerHTML = '<p class="text-center text-muted">이 카테고리에 그룹이 없습니다.</p>';
            return;
        }

        // Render filtered groups
        filteredGroups.forEach(groupName => {
            const groupData = allData[groupName];
            const card = createGroupCard(groupName, groupData);
            groupList.appendChild(card);
        });
    }

    function createGroupCard(groupName, groupData) {
        const card = document.createElement('div');
        card.className = 'group-card';
        card.dataset.groupName = groupName;

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body d-flex flex-column';

        // QR Code Toggle Button
        const qrToggleBtn = document.createElement('button');
        qrToggleBtn.className = 'qr-toggle-btn';
        qrToggleBtn.innerHTML = '&#9635;';
        qrToggleBtn.title = 'QR코드 보기/숨기기';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = groupName;

        const description = document.createElement('p');
        description.className = 'card-text text-muted small';
        description.textContent = groupData.description || '설명이 없습니다.';

        const bookmarkCount = document.createElement('p');
        bookmarkCount.className = 'card-text text-muted small flex-grow-1';
        bookmarkCount.textContent = `북마크 ${groupData.bookmarks.length}개`;

        // Hidden QR Code Container
        const qrContainer = document.createElement('div');
        qrContainer.className = 'qr-container';

        qrToggleBtn.addEventListener('click', () => {
            if (qrContainer.innerHTML === '') {
                const groupURL = new URL(`viewer.html?group=${encodeURIComponent(groupName)}`, window.location.href).href;
                new QRCode(qrContainer, {
                    text: groupURL,
                    width: 128,
                    height: 128,
                });
            }
            qrContainer.classList.toggle('visible');
        });

        const groupURL = new URL(`viewer.html?group=${encodeURIComponent(groupName)}`, window.location.href).href;
        const viewLink = document.createElement('a');
        viewLink.href = groupURL;
        viewLink.className = 'btn btn-primary w-100 mb-2';
        viewLink.textContent = '보러가기';

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'd-flex flex-wrap gap-1';

        const renameBtn = document.createElement('button');
        renameBtn.className = 'btn btn-outline-secondary btn-sm flex-fill';
        renameBtn.textContent = '이름';
        renameBtn.addEventListener('click', () => renameGroup(groupName));

        const editDescBtn = document.createElement('button');
        editDescBtn.className = 'btn btn-outline-secondary btn-sm flex-fill';
        editDescBtn.textContent = '설명';
        editDescBtn.addEventListener('click', () => editDescription(groupName));

        const categoryBtn = document.createElement('button');
        categoryBtn.className = 'btn btn-outline-info btn-sm flex-fill';
        categoryBtn.textContent = '분류';
        categoryBtn.addEventListener('click', () => changeGroupCategory(groupName));

        const passwordBtn = document.createElement('button');
        passwordBtn.textContent = '잠금';
        if (groupData.password) {
            passwordBtn.className = 'btn btn-outline-danger btn-sm flex-fill';
        } else {
            passwordBtn.className = 'btn btn-outline-secondary btn-sm flex-fill';
        }
        passwordBtn.addEventListener('click', () => editGroupPassword(groupName));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-outline-danger btn-sm flex-fill';
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', () => deleteGroup(groupName));

        buttonGroup.appendChild(renameBtn);
        buttonGroup.appendChild(editDescBtn);
        buttonGroup.appendChild(categoryBtn);
        buttonGroup.appendChild(passwordBtn);
        buttonGroup.appendChild(deleteBtn);

        cardBody.appendChild(qrToggleBtn);
        cardBody.appendChild(title);
        cardBody.appendChild(description);
        cardBody.appendChild(bookmarkCount);
        cardBody.appendChild(qrContainer);
        cardBody.appendChild(viewLink);
        cardBody.appendChild(buttonGroup);
        card.appendChild(cardBody);

        return card;
    }

    function addGroup(e) {
        e.preventDefault();
        const newGroupName = groupNameInput.value.trim();
        if (newGroupName && !allData.hasOwnProperty(newGroupName)) {
            // Select category
            let categoryOptions = '미분류\n' + categories.join('\n');
            const selectedCategory = prompt(`카테고리를 선택하세요 (선택 안함 = 미분류):\n\n${categoryOptions}`);
            let category = null;
            if (selectedCategory && selectedCategory.trim() !== '' && selectedCategory !== '미분류') {
                if (categories.includes(selectedCategory.trim())) {
                    category = selectedCategory.trim();
                } else {
                    if (confirm(`'${selectedCategory}' 카테고리가 없습니다. 새로 만드시겠습니까?`)) {
                        categories.push(selectedCategory.trim());
                        saveCategories();
                        category = selectedCategory.trim();
                    }
                }
            }

            let newPassword = null;
            if (confirm('이 그룹에 비밀번호를 설정하시겠습니까?')) {
                newPassword = prompt('새 비밀번호를 입력하세요:');
            }
            allData[newGroupName] = {
                description: '',
                password: newPassword || null,
                category: category,
                bookmarks: []
            };
            saveAllData();
            renderCategoryTabs();
            renderGroups();
            groupNameInput.value = '';
        } else if (allData.hasOwnProperty(newGroupName)){
            alert('이미 존재하는 그룹 이름입니다.');
        } else {
            alert('그룹 이름을 입력해주세요.');
        }
    }

    function addCategory() {
        const newCategoryName = prompt('새 카테고리 이름을 입력하세요:');
        if (newCategoryName && newCategoryName.trim() !== '') {
            const trimmedName = newCategoryName.trim();
            if (categories.includes(trimmedName)) {
                alert('이미 존재하는 카테고리 이름입니다.');
                return;
            }
            categories.push(trimmedName);
            saveCategories();
            renderCategoryTabs();
        }
    }

    function deleteGroup(groupName) {
        const groupData = allData[groupName];
        if (groupData.password) {
            const inputPassword = prompt('이 그룹은 비밀번호로 보호되어 있습니다. 삭제하려면 비밀번호를 입력하세요.');
            if (inputPassword !== groupData.password && inputPassword !== MASTER_PASSWORD) {
                if (inputPassword !== null) alert('비밀번호가 틀렸습니다.');
                return;
            }
        }

        if (confirm(`'${groupName}' 그룹을 정말 삭제하시겠습니까? 그룹 안의 모든 북마크가 사라집니다.`)) {
            delete allData[groupName];
            saveAllData();
            renderCategoryTabs();
            renderGroups();
        }
    }

    function renameGroup(oldName) {
        const newName = prompt(`'${oldName}' 그룹의 새 이름을 입력하세요.`, oldName);
        if (newName && newName.trim() !== '' && newName !== oldName) {
            if(allData.hasOwnProperty(newName)) {
                alert('이미 존재하는 그룹 이름입니다.');
                return;
            }
            allData[newName] = allData[oldName];
            delete allData[oldName];
            saveAllData();
            renderGroups();
        }
    }

    function editDescription(groupName) {
        const currentDescription = allData[groupName].description;
        const newDescription = prompt(`'${groupName}' 그룹의 새 설명을 입력하세요.`, currentDescription);
        if (newDescription !== null) {
            allData[groupName].description = newDescription;
            saveAllData();
            renderGroups();
        }
    }

    function editGroupPassword(groupName) {
        const groupData = allData[groupName];

        // If a password exists, verify it first.
        if (groupData.password) {
            const inputPassword = prompt('잠금을 해제하시려면 비밀번호를 입력하세요:');
            if (inputPassword !== groupData.password && inputPassword !== MASTER_PASSWORD) {
                if (inputPassword !== null) alert('비밀번호가 틀렸습니다. 잠금을 해제할 수 없습니다.');
                return; // Abort if password is wrong or prompt is cancelled
            }
        }

        // Proceed to set a new password
        const newPassword = prompt(`'${groupName}' 그룹의 새 비밀번호를 입력하세요 (없애려면 비워두세요).`);
        if (newPassword !== null) { // User did not cancel the new password prompt
            allData[groupName].password = newPassword || null;
            saveAllData();
            renderGroups();
        }
    }

    function changeGroupCategory(groupName) {
        let categoryOptions = '미분류\n' + categories.join('\n');
        const currentCategory = allData[groupName].category || '미분류';
        const selectedCategory = prompt(`'${groupName}' 그룹의 카테고리를 선택하세요 (현재: ${currentCategory}):\n\n${categoryOptions}`);

        if (selectedCategory !== null) {
            let category = null;
            if (selectedCategory.trim() !== '' && selectedCategory !== '미분류') {
                if (categories.includes(selectedCategory.trim())) {
                    category = selectedCategory.trim();
                } else {
                    if (confirm(`'${selectedCategory}' 카테고리가 없습니다. 새로 만드시겠습니까?`)) {
                        categories.push(selectedCategory.trim());
                        saveCategories();
                        category = selectedCategory.trim();
                    }
                }
            }
            allData[groupName].category = category;
            saveAllData();
            renderCategoryTabs();
            renderGroups();
        }
    }

    function renameCategory(oldName) {
        const newName = prompt(`'${oldName}' 카테고리의 새 이름을 입력하세요.`, oldName);
        if (newName && newName.trim() !== '' && newName !== oldName) {
            if (categories.includes(newName.trim())) {
                alert('이미 존재하는 카테고리 이름입니다.');
                return;
            }
            // Update category in categories array
            const index = categories.indexOf(oldName);
            if (index !== -1) {
                categories[index] = newName.trim();
                saveCategories();
            }
            // Update all groups with this category
            Object.keys(allData).forEach(groupName => {
                if (allData[groupName].category === oldName) {
                    allData[groupName].category = newName.trim();
                }
            });
            saveAllData();
            renderCategoryTabs();
            renderGroups();
        }
    }

    function deleteCategory(categoryName) {
        if (!confirm(`'${categoryName}' 카테고리를 삭제하시겠습니까? 이 카테고리의 그룹들은 '미분류'로 이동됩니다.`)) {
            return;
        }
        // Remove from categories array
        const index = categories.indexOf(categoryName);
        if (index !== -1) {
            categories.splice(index, 1);
            saveCategories();
        }
        // Update all groups with this category to null
        Object.keys(allData).forEach(groupName => {
            if (allData[groupName].category === categoryName) {
                allData[groupName].category = null;
            }
        });
        saveAllData();
        selectedCategory = 'all'; // Reset to all after deleting category
        renderCategoryTabs();
        renderGroups();
    }

    // 초기화
    addGroupForm.addEventListener('submit', addGroup);
    document.getElementById('add-category-btn').addEventListener('click', addCategory);
    loadAllData();
    renderCategoryTabs();
    renderGroups();

    // 검색 기능
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        Object.keys(allData).forEach(groupName => {
            const groupData = allData[groupName];
            const card = groupList.querySelector(`[data-group-name="${groupName}"]`);
            if (!card) return;

            const titleMatch = groupName.toLowerCase().includes(searchTerm);
            const descriptionMatch = (groupData.description || '').toLowerCase().includes(searchTerm);
            const bookmarkMatch = groupData.bookmarks.some(bookmark => 
                bookmark.title.toLowerCase().includes(searchTerm)
            );

            if (titleMatch || descriptionMatch || bookmarkMatch) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
});