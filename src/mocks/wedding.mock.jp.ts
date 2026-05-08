import { ASSET_URLS } from './assetPaths'

/** 식 시작 시각 (로컬) — 카운트다운/달력에 사용 */
export const WEDDING_EVENT_ISO = '2026-08-16T15:30:00+09:00'

export const posterSection = {
  imageUrl: ASSET_URLS.poster,
  titleLines: ['We\'re Getting', 'Married!'],
  /** 포스터 상단 양옆 이름 위 역할 라벨 — 로케일별로 다른 텍스트 */
  roleLabels: {
    groom: '新郎',
    bride: '新婦',
  },
}

export const ceremonySection = {
  dateLabel: '2026.08.16(日) 15:30',
  venueName: '永登浦 ザ・ベルG ホール',
}

export const invitationSection = {
  headline: '大切な皆さまをご招待いたします。',
  paragraphs: [
    [
      '若さのように輝く夏、',
      '青い緑が風に揺れる美しい日に、',
      'お互いの一番の味方になることを約束します。',
    ],
    ['お忙しい中、足を運んで祝福してくださると幸いです。'],
  ],
}

export const couplesSection = {
  groom: {
    roleLabel: '新郎',
    givenName: 'ク・ウォン',
    parentsLine: 'ク・ガプソ、チェ・スンレの長男',
    photoUrl: ASSET_URLS.groom,
    alt: '新郎の写真',
  },
  bride: {
    roleLabel: '新婦',
    givenName: 'ユ・ミンソン',
    parentsLine: '故 ユ・ヒジュ、ムン・ソノクの娘',
    photoUrl: ASSET_URLS.bride,
    alt: '新婦の写真',
  },
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
      roleLabel: '新郎',
      name: 'ク・ウォン',
      photoUrl: ASSET_URLS.profileGroom,
      alt: '新郎の幼少期の写真',
      description:
        '1988年12月 全州生まれ\nトレーナー、声優、司会者、事業\n何でも頼もしくこなす多才な人',
    },
    {
      id: 'bride',
      roleLabel: '新婦',
      name: 'ユ・ミンソン',
      photoUrl: ASSET_URLS.profileBride,
      alt: '新婦の幼少期の写真',
      description:
        '1991年3月 安山・始興育ち\nちょっと怠け者の完璧主義者\nサバイバル運動を頑張るウェブ開発者',
    },
  ],
}

export const calendarSection = {
  title: 'WEDDING DAY',
  meetSinceIso: '2020-04-16',
  ddayHeadline: 'ウォンとミンソンが共に過ごした時間',
  weddingDay: '2026年8月16日 日曜日 | 午後3時30分',
  weddingDayEng: 'Sunday, Aug 16, 2026 | PM 3:30',
  calendarYear: 2026,
  /** 8月 → 0-based 7 */
  calendarMonthIndex: 7,
  highlightedDay: 16,
  /** 달력 강조일 아래 작은 글씨 */
  ceremonyTimeShort: '午後 3:30',
  /** 디데이 상단 한 줄 */
  countdownHeadline: '私たちの結婚式まで',
  /** 카운트다운 단위 라벨 — 로케일별로 다르게 표시 */
  countdownUnits: {
    days: '日',
    hours: '時間',
    minutes: '分',
    seconds: '秒',
  },
}

export const gallerySection = {
  title: 'GALLERY',
  items: ASSET_URLS.gallery.map((url, index) => ({
    id: `g-${index + 1}`,
    src: url,
    alt: `ウェディングギャラリー ${index + 1}`,
  })),
}

export const locationSection = {
  title: 'LOCATION',
  venueTitle: 'ザ・ベルG',
  hallLine: '単独ホール',
  phone: '02-2088-5272',
  address: 'ソウル特別市 永登浦区 国会大路 612 (堂山洞3街 2-7)\nコレイル流通社屋 2階',
  map: {
    lat: 37.525952,
    lng: 126.902249,
    zoom: 17,
  },
  navigationLinks: [
    { label: 'TMAP', href: 'https://tmap.life/7946ae5c' },
    { label: 'カカオマップ', href: 'https://kko.to/SmW6dQx3k4' },
    { label: 'NAVERマップ', href: 'https://map.naver.com/p/directions/-/3zetzr,2AKl3Y,%EB%8D%94%EB%B2%A0%EB%A5%B4G,,/-/car?c=15.00,0,0,0,dh' },
  ],
  transportBlocks: [
    {
      subtitle: '🚇地下鉄',
      lines: ['2・5号線 永登浦区庁駅 4番出口から566m(徒歩約7分)'],
    },
    {
      subtitle: '🚌シャトルバス',
      lines: [
        '永登浦区庁駅 5番出口 ↔ ザ・ベルG 駐車場入口左側を循環運行',
      ],
    },
    {
      subtitle: '🚗駐車',
      lines: [
        '建物内の地下駐車場をご利用ください(2時間無料)',
        '2階ウェルカムドリンクゾーンまたは地下1階の宴会場で駐車登録後に出庫',
      ],
    },
  ],
}

export const venueGuideSection = {
  title: 'VENUE GUIDE',
  tabs: [
    {
      id: 'welcome',
      title: 'ウェルカムドリンク',
      imageUrl: ASSET_URLS.tabWelcomeDrinks,
      imageAlt: 'ウェルカムドリンク案内画像',
      blocks: [
        {
          subtitle: '🍹ウェルカムドリンクのご案内',
          lines: ['お越しくださった皆さまのために、ロビーに簡単なお飲み物をご用意しております。式の前にごゆっくりお楽しみください。'],
        },
      ],
    },
    {
      id: 'bridal-room',
      title: '新婦待機室',
      imageUrl: ASSET_URLS.tabBrideWaiting,
      imageAlt: '新婦待機室',
      blocks: [
        {
          subtitle: '👰🏻新婦待機室の場所と挨拶可能時間',
          lines: ['ホール左側「ベルアイル(廊下)」の奥に位置しています。写真撮影とご挨拶は式開始15分前まで可能です。'],
        },
      ],
    },
    {
      id: 'atm',
      title: 'ATM案内',
      imageUrl: ASSET_URLS.tabAtm,
      imageAlt: 'ATM位置案内',
      blocks: [
        {
          subtitle: '💳ATMの場所',
          lines: ['ザ・ベルG 2階の受付左端、フォトウォール横に2台設置されています。'],
        },
      ],
    },
  ],
} as const

export const timelineSection = {
  /** 함께한 시간 디데이 단위 라벨 */
  sinceUnits: {
    years: '年',
    days: '日',
  },
  items: [
    {
      text: '2020年、高校の友人の紹介で出会った私たち。新郎の熱心なアプローチで3度目の出会いで付き合うことに。',
      photoUrl: ASSET_URLS.timeline1,
      alt: '初対面',
    },
    {
      text: '新郎のおかげで新婦も運動に目覚めました。でも二人とも食べることが大好きで、なかなか痩せませんT_T',
      photoUrl: ASSET_URLS.timeline2,
      alt: '運動',
    },
    {
      text: '私たちの人生の旅行先は沖縄!天気も日程も食事も海も、すべてが完璧だった。',
      photoUrl: ASSET_URLS.timeline3,
      alt: '旅行',
    },
    {
      text: '新婦は感性的で調和を大切にするENFJ、新郎は思考的だけど柔軟なENTP。なかなかいいじゃん!',
      photoUrl: ASSET_URLS.timeline4,
      alt: '最高の組み合わせ',
    },
    {
      text: '昨年11月、新婦の憧れだった漢江の見えるレストランでプロポーズ♥️',
      photoUrl: ASSET_URLS.timeline5,
      alt: 'プロポーズ',
    },
  ],
}

export const guestbookSection = {
  title: 'MESSAGE',
  emptyMessageLines: ['まだメッセージはありません。', '最初のメッセージを残してください。'],
}

export const letterSection = {
  imageUrl: ASSET_URLS.coupleShot,
  imageAlt: '新郎新婦の写真',
  brideLetter: {
    imageUrl: ASSET_URLS.letter1,
    alt: '新婦の手書きメッセージ',
  },
  groomLetter: {
    imageUrl: ASSET_URLS.letter2,
    alt: '新郎の手書きメッセージ',
  },
}

// 일본어 모드에서는 계좌 안내 섹션을 표시하지 않음 (App.vue에서 v-if로 숨김 처리됨)
// 하지만 mock 시그니처는 한국어와 맞춰두어야 getWeddingMock 타입이 호환됨 — 빈 데이터로 둠
export const accountsSection = {
  title: '',
  introLines: [],
  groups: [],
}

export const footerSection = {
  message: '皆さまの祝福と温かいお気持ちを、\nいつまでも忘れません。',
  signoff: 'ク・ウォン・ユ・ミンソン より',
}

export const shareSection = {
  title: 'ク・ウォン ♥ ユ・ミンソン 結婚します',
  text: '私たち二人の新しい門出をぜひ一緒に祝ってください。',
  description: '2026年8月16日 午後3時30分\n永登浦 ザ・ベルG',
  imageUrl: new URL('@/assets/images/kakaoMessage.jpg', import.meta.url).href,
  imageWidth: 400,
  imageHeight: 600,
  url: 'https://wedding-invitation-sandy-chi.vercel.app',
}
