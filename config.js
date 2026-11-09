/* 가장 먼저 수정할 설정 파일. HTML/CSS/JS 모두 일반 텍스트. */
window.SOFIA_CONFIG = {
    heroImage: 'images/sofia.jpg',
    targetImage: '', // 실제 Kivicube에 등록한 인식 이미지 경로
    imageCredit: '', // 사진 출처 입력하면 홈 아래에 표시.

    kivicube: {
        // Kivicube의 공개 Web 체험 주소 삽입.
        // 비워둘 경우, exteriorUrl/interiorUrl 대신 sceneUrl 사용.
        sceneURL: '',
        exteriorUrl: '',
        interiorUrl: ''
    },

    history: [
        {
            year: '1907',
            title: '早期教堂',
            text: '从早期的建筑形态出发，了解索菲亚的历史起点。',
            image: '',
            source: ''
        },
        {
            year: '1923',
            title: '重建阶段',
            text: '通过历史资料，认识建筑重建与形态变化的过程。',
            image: '',
            source: ''
        },
        {
            year: '1932',
            title: '现存教堂建成',
            text: '观察现存建筑的整体形态，以及主体、穹顶与钟楼的关系。',
            image: '',
            source: ''
        },
        {
            year: '1997',
            title: '保护与修复',
            text: '通过修复资料，了解建筑的保护与空间再利用。',
            image: '',
            source: ''
        }
        ],

        // 실제 자료 검증 후 true로 변경.
        historyVerified: false,

        media: {
            // 역사 애니메이션 MP4 삽입 시, 영상 탭에서 재생.
            historyVideo: '', // 'videos/history.mp4'
            videoPoster: '',
            pastImage: 'images/sofia-past.jpg', // 'images/sofia-past.jpg'
            presentImage: 'images/sofia-now.jpg', // 'images/sofia-now.jpg'
            pastLabel: '历史照片',
            presentLabel: '现状照片',
            comparisonSource: ''
        }
};