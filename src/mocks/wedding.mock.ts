import { ASSET_URLS } from './assetPaths'

/** 예식 시작 시각 (로컬) — 카운트다운·달력에 사용 */
export const WEDDING_EVENT_ISO = '2026-08-16T15:20:00+09:00'

export const weddingHero = {
  imageUrl: ASSET_URLS.hero,
  /** 스크립트 히어로 — 두 줄 권장 */
  titleLines: ['We\'re getting', 'married!'],
}

export const ceremonyInfo = {
  dateLabel: '2026년 8월 16일 일요일 오후 3시 20분',
  venueName: '더베르G 단독홀',
}

export const invitationSection = {
  headline: '소중한 분들을 초대합니다.',
  paragraphs: [
    ['오랜 기다림 속에서 저희 두 사람,', '한 마음 되어 참된 사랑의 결실을', '맺게 되었습니다.'],
    ['오셔서 축복해 주시면 큰 기쁨이겠습니다.'],
  ],
}

export const couplesSection = {
  groom: {
    roleLabel: '신랑',
    givenName: '구원',
    parentsLine: '구갑서 · 최순례의 아들',
    photoUrl: ASSET_URLS.groom,
    alt: '신랑 사진',
  },
  bride: {
    roleLabel: '신부',
    givenName: '유민선',
    parentsLine: '문선옥의 딸',
    photoUrl: ASSET_URLS.bride,
    alt: '신부 사진',
  },
}

export const countdownSection = {
  titleLines: ['팔월의', '열여섯 번째 날.'],
  calendarYear: 2026,
  /** 8월 → 0-based 7 */
  calendarMonthIndex: 7,
  highlightedDay: 16,
  /** 달력 강조일 아래 작은 글씨 */
  ceremonyTimeShort: '오후 3:20',
  /** 디데이 상단 한 줄 */
  countdownHeadline: '원 ♥ 민선 결혼식까지',
}

export const galleryImages = ASSET_URLS.gallery.map((url, index) => ({
  id: `g-${index + 1}`,
  src: url,
  alt: `웨딩 갤러리 ${index + 1}`,
}))

export const directionsSection = {
  venueTitle: '더베르G',
  hallLine: '단독홀',
  phone: '02-0000-0000',
  address: '서울 영등포구 국회대로 612',
  /** 네이버 지도 API 중심 좌표 (필요 시 주소 검색 후 수정) */
  map: {
    lat: 37.52835,
    lng: 126.91785,
    zoom: 17,
  },
  navigationLinks: [
    { label: '티맵', href: '#' },
    { label: '카카오내비', href: '#' },
    { label: '네이버지도', href: '#' },
  ],
}

export const venueGuideTabs = [
  {
    id: 'welcome',
    title: '웰컴드링크',
    imageUrl: ASSET_URLS.tabWelcomeDrinks,
    imageAlt: '웰컴 드링크 안내 이미지',
    blocks: [
      {
        subtitle: '[지하철]',
        lines: ['2·5호선 영등포구청역 4번 출구에서 566m(도보 약 7분)'],
      },
      {
        subtitle: '[셔틀버스]',
        lines: [
          '영등포구청역 5번 출구 ↔ 더베르G 주차장 입구 좌측',
          '순환 운행',
        ],
      },
      {
        subtitle: '[주차]',
        lines: [
          '건물 내 지하주차장 이용(2시간 무료 주차)',
          '2층 웰컴드링크존 또는 지하 1층 연회장에서 주차등록 후 출차',
        ],
      },
    ],
  },
  {
    id: 'bridal-room',
    title: '신부대기실',
    imageUrl: ASSET_URLS.tabBrideWaiting,
    imageAlt: '신부대기실',
    blocks: [
      {
        subtitle: '위치 안내',
        lines: ['단독홀 인근 신부 전용 라운지에서 준비하실 수 있습니다.'],
      },
      {
        subtitle: '이용 시간',
        lines: ['예식 2시간 전부터 이용 가능합니다. 스태프에게 문의해 주세요.'],
      },
    ],
  },
  {
    id: 'atm',
    title: 'ATM 안내',
    imageAlt: 'ATM 위치 안내',
    blocks: [
      {
        subtitle: '[위치]',
        lines: ['1층 로비 우측, 편의시설 존 근처에 ATM이 준비되어 있습니다.'],
      },
      {
        subtitle: '[유의]',
        lines: ['혼주·하객 모두 이용 가능하며, 현금 필요 시 이용해 주세요.'],
      },
    ],
  },
] as const

export const timelineItems = [
  {
    year: '2019',
    text: '고등학교 친구의 소개로 만났습니다.',
    photoUrl: ASSET_URLS.timeline1,
    alt: '2019 추억',
  },
  {
    year: '2020',
    text: '구원 덕에 운동을 시작하고 조금 더 단단해졌습니다.',
    photoUrl: ASSET_URLS.timeline2,
    alt: '운동',
  },
  {
    text: '우리의 인생 여행지는 오키나와입니다.',
    photoUrl: ASSET_URLS.timeline3,
    alt: '여행',
  },
  {
    text: '저는 감성적이고 조화로운 ENFJ, 남자친구는 사고적이지만 유연한 ENTP. 최고의 조합이에요.',
    photoUrl: ASSET_URLS.timeline4,
    alt: '함께',
  },
  {
    text: '작년 12월, 깊어진 마음 속에서 프로포즈를 받았습니다.',
    photoUrl: ASSET_URLS.timeline5,
    alt: '프로포즈',
  },
]

export const guestbookIntro = {
  title: '방명록',
  emptyMessageLines: ['아직 작성된 방명록이 없습니다.', '첫 방명록을 작성해주세요.'],
}

export const accountsSection = {
  title: '마음 전하실 곳',
  introLines: [
    '멀리서도 축하의 마음을 전하고 싶으신 분들을 위해 계좌번호를 안내드립니다.',
    '소중한 축하를 보내주셔서 감사드리며, 따뜻한 마음에 깊이 감사드립니다.',
  ],
  groups: [
    {
      id: 'groom-side',
      label: '신랑측',
      rows: [
        {
          role: '신랑',
          bankInfo: '신한 구원',
          number: '1000-397-038961',
        },
      ],
    },
    {
      id: 'bride-side',
      label: '신부측',
      rows: [
        {
          role: '신부',
          bankInfo: '토스뱅크 유민선',
          number: '1000-29839322',
        },
      ],
    },
  ],
}

/** 공유 시 제목 등 — 배포 후 문구 수정 */
export const shareMeta = {
  title: '구원 ♥ 유민선 결혼식에 초대합니다',
  text: '저희 두 사람의 새로운 시작을 함께해 주세요.',
}
