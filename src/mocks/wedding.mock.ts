import { ASSET_URLS } from './assetPaths'

/** 예식 시작 시각 (로컬) — 카운트다운·달력에 사용 */
export const WEDDING_EVENT_ISO = '2026-08-16T15:30:00+09:00'

export const posterSection = {
  imageUrl: ASSET_URLS.poster,
  /** 스크립트 히어로 — 두 줄 권장 */
  titleLines: ['We\'re Getting', 'Married!'],
  /** 포스터 상단 양옆 이름 위 역할 라벨 — 로케일별로 다른 텍스트 */
  roleLabels: {
    groom: '신랑',
    bride: '신부',
  },
}

export const ceremonySection = {
  dateLabel: '2026.08.16(일) 15:30',
  venueName: '영등포 더베르G 단독홀',
}

export const invitationSection = {
  headline: '소중한 분들을 초대합니다.',
  paragraphs: [
    ['푸른 녹음이 바람에 일렁이는 아름다운 날,'],
    ['서로의 가장 든든한 편이 되기로 약속합니다.'],
    ['귀한 걸음으로 함께 축복해 주시면'],
    ['감사하겠습니다.'],
  ],
  /** 초대장 배경 봉투 이미지 — 흰 편지지 영역 위에 문구가 올라감 */
  envelopeUrl: ASSET_URLS.beigeEnvelope,
  envelopeAlt: '편지가 담긴 베이지색 봉투',
}

export const introduceSection = {
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
    parentsLine: '故 유희주 · 문선옥의 딸',
    photoUrl: ASSET_URLS.bride,
    alt: '신부 사진',
  },
  introducePhoto: ASSET_URLS.introduce
}

/** 로딩 스크린 — 언어 무관하게 영문 고정 표기 */
export const loadingSection = {
  groomName: 'Koo One',
  brideName: 'Yoo Minsun',
}

export const profileSection = {
  title: 'ABOUT US',
  cards: [
    {
      id: 'groom',
      roleLabel: '신랑',
      name: '구원',
      photoUrl: ASSET_URLS.profileGroom,
      alt: '신랑 어린 시절 사진',
      description: '1988년 12월 전주 출생\n트레이너, 성우, 사회자, 사업\n' +
          '무엇이든 씩씩하게 해내는 재주꾼',
    },
    {
      id: 'bride',
      roleLabel: '신부',
      name: '유민선',
      photoUrl: ASSET_URLS.profileBride,
      alt: '신부 어린 시절 사진',
      description: '1991년 3월 안산\/시흥 출신\n조금 게으른 완벽주의자\n생존운동 열심히 하는 웹개발자',
    },
  ],
}

export const calendarSection = {
  title: 'WEDDING DAY',
  meetSinceIso: '2020-04-16',
  ddayHeadline: '구원과 민선이 함께한 시간',
  weddingDay: '2026년 8월 16일 일요일 | 오후 3시 30분',
  weddingDayEng: 'Sunday, Aug 16, 2026 | PM 3:30',
  calendarYear: 2026,
  /** 8월 → 0-based 7 */
  calendarMonthIndex: 7,
  highlightedDay: 16,
  /** 달력 강조일 아래 작은 글씨 */
  ceremonyTimeShort: '오후 3:30',
  /** 디데이 상단 한 줄 */
  countdownHeadline: '우리의 결혼식까지',
  /** 카운트다운 단위 라벨 — 로케일별로 다르게 표시 */
  countdownUnits: {
    days: '일',
    hours: '시간',
    minutes: '분',
    seconds: '초',
  },
}

export const gallerySection = {
  title: 'GALLERY',
  items: ASSET_URLS.gallery.map((url, index) => ({
    id: `g-${index + 1}`,
    src: url,
    alt: `웨딩 갤러리 ${index + 1}`,
  })),
}

export const locationSection = {
  title: 'LOCATION',
  venueTitle: '더베르G',
  hallLine: '단독홀',
  phone: '02-2088-5272',
  address: '서울 영등포구 국회대로 612 (당산동3가 2-7)\n코레일유통사옥 2층',
  /** 네이버 지도 API 중심 좌표 (필요 시 주소 검색 후 수정) */
  map: {
    lat: 37.525952,
    lng: 126.902249,
    zoom: 16,
  },
  navigationLinks: [
    { label: '티맵', href: 'https://tmap.life/7946ae5c' },
    { label: '카카오맵', href: 'https://kko.to/SmW6dQx3k4' },
    { label: '네이버지도', href: 'https://map.naver.com/p/directions/-/3zetzr,2AKl3Y,%EB%8D%94%EB%B2%A0%EB%A5%B4G,,/-/car?c=15.00,0,0,0,dh' },
  ],
  transportBlocks: [
    {
      subtitle: '🚇 지하철',
      lines: ['2·5호선 영등포구청역 4번 출구에서 566m(도보 약 7분)'],
    },
    {
      subtitle: '🚌 셔틀버스',
      lines: [
        '영등포구청역 5번 출구 ↔ 더베르G 주차장 입구 좌측 순환 운행',
      ],
    },
    {
      subtitle: '🚗 주차',
      lines: [
        '건물 내 지하주차장 이용(2시간 무료 주차)',
        '2층 웰컴드링크존 또는 지하 1층 연회장에서 주차등록 후 출차',
      ],
    },
  ],
}

export const venueGuideSection = {
  title: 'VENUE GUIDE',
  tabs: [
    {
      id: 'welcome',
      title: '웰컴드링크',
      imageUrl: ASSET_URLS.tabWelcomeDrinks,
      imageAlt: '웰컴 드링크 안내 이미지',
      blocks: [
        {
          subtitle: '🍹 웰컴드링크 안내',
          lines: ['귀한 발걸음 해주신 하객분들을 위해 로비에 간단한 음료가 준비되어 있습니다. 식 전에 여유롭게 즐겨주세요.'],
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
          subtitle: '👰🏻 신부대기실 위치 및 인사 가능 시간',
          lines: ['홀 왼편 \'베르아일(복도)\' 끝에 위치, 사진 촬영 및 인사는 예식 시작 <mark class="hl">15분 전</mark>까지 가능합니다.'],
        },
      ],
    },
    {
      id: 'atm',
      title: 'ATM 안내',
      imageUrl: ASSET_URLS.tabAtm,
      imageAlt: 'ATM 위치 안내',
      blocks: [
        {
          subtitle: '💳 ATM 위치',
          lines: ['더베르G 2층 접수대 좌측 끝 포토월 옆에 2대가 있습니다.'],
        },
      ],
    },
  ],
} as const

export const timelineSection = {
  /** 함께한 시간 디데이 단위 라벨 */
  sinceUnits: {
    years: '년',
    days: '일',
  },
  items: [
    {
      text: '2020년 고등학교 친구의 소개로 만난 우리. 신랑의 구애 끝에 세번째 만남에 사귀게 되었어요.',
      photoUrl: ASSET_URLS.timeline1,
      alt: '첫만남',
    },
    {
      text: '신랑 덕에 신부도 운동에 눈을 떴어요. 하지만 둘 다 먹고 마시는 걸 좋아해서 살이 안빠져요T_T',
      photoUrl: ASSET_URLS.timeline2,
      alt: '운동',
    },
    {
      text: '우리의 인생 여행지 오키나와! 날씨도 일정도 음식도 바다도 모두 완벽했다.',
      photoUrl: ASSET_URLS.timeline3,
      alt: '여행',
    },
    {
      text: '신부는 감성적이고 조화로운 ENFJ, 신랑은 사고적이지만 유연한 ENTP 우린 제법 잘어울려요.',
      photoUrl: ASSET_URLS.timeline4,
      alt: '최고의 조합',
    },
    {
      text: '작년 11월 신부의 로망이었던 한강이 보이는 레스토랑에서 프로포즈♥️',
      photoUrl: ASSET_URLS.timeline5,
      alt: '프로포즈',
    },
  ]
}


export const guestbookSection = {
  title: 'MESSAGE',
  emptyMessageLines: ['아직 작성된 방명록이 없습니다.', '첫 방명록을 작성해주세요.'],
}

export const letterSection = {
  imageUrl: ASSET_URLS.coupleShot,
  imageAlt: '신랑 신부 사진',
  brideLetter: {
    imageUrl: ASSET_URLS.letter1,
    alt: '신부의 손글씨 편지',
  },
  groomLetter: {
    imageUrl: ASSET_URLS.letter2,
    alt: '신랑의 손글씨 편지',
  },
}

export const accountsSection = {
  title: '마음 전하실 곳',
  introLines: [
    '참석이 어려우신 분들을 위해 기재했습니다.\n너그러운 마음으로 양해 부탁드립니다.',
  ],
  groups: [
    {
      id: 'groom-side',
      label: '신랑측',
      rows: [
        {
          role: '신랑',
          bankInfo: '신한 구원',
          number: '110-221-930230',
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
          number: '1000-2983-9322',
        },
      ],
    },
  ],
}

export const footerSection = {
  message: '소중한 축복과 따뜻한 마음,\n오래도록 잊지 않겠습니다.',
  signoff: '구원, 민선 드림',
}

/** 공유 시 제목 등 — 배포 후 문구 수정 */
export const shareSection = {
  title: '구원 ♥ 민선 결혼합니다',
  text: '저희 두 사람의 새로운 시작을 함께해 주세요.',
  description: '2026년 8월 16일 오후 3시 30분\n영등포 더베르G',
  /**
   * 카카오톡 메시지 공유 썸네일.
   * 빌드 시 해시가 붙은 자산 URL 로 변환되며, 카카오 SDK 호출 시
   * VITE_SITE_URL 기준의 절대 URL 로 보정됩니다.
   */
  imageUrl: new URL('@/assets/images/kakaoMessage.jpg', import.meta.url).href,
  /**
   * 카카오톡 메시지에서 카드 / 버튼 클릭 시 이동할 링크 (절대 URL).
   * 이 도메인이 카카오 디벨로퍼스 > 플랫폼 > Web 사이트 도메인에 등록되어 있어야
   * 카카오톡에서 클릭이 차단되지 않습니다.
   */
  imageWidth: 400,
  imageHeight: 600,
  url: 'https://wedding-invitation-sandy-chi.vercel.app',
}
