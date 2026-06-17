/**
 * Central image URLs — swap to local files under @/assets/images if you prefer imports.
 *
 * 예: import poster from '@/assets/images/poster.jpg' 후 poster를 export 에 넣으면 됩니다.
 */
import poster from '@/assets/images/poster.jpg';
import introduce from '@/assets/images/introduce.jpg';
import groomProfile from '@/assets/images/profile/groom_profile.jpg';
import brideProfile from '@/assets/images/profile/bride_profile.jpg';
import groomProfileChild from '@/assets/images/profile/groom_profile_child_.png';
import groomProfileBride from '@/assets/images/profile/bride_profile_child_.png';
import gallery1 from '@/assets/images/gallery/1.jpg';
import gallery2 from '@/assets/images/gallery/2.jpg';
import gallery3 from '@/assets/images/gallery/3.jpg';
import gallery4 from '@/assets/images/gallery/4.jpg';
import gallery5 from '@/assets/images/gallery/5.jpg';
import gallery6 from '@/assets/images/gallery/6.jpg';
import gallery7 from '@/assets/images/gallery/7.jpg';
import gallery8 from '@/assets/images/gallery/8.jpg';
import gallery9 from '@/assets/images/gallery/9.jpg';
import gallery10 from '@/assets/images/gallery/10.jpg';
import gallery11 from '@/assets/images/gallery/11.jpg';
import gallery12 from '@/assets/images/gallery/12.jpg';
import gallery13 from '@/assets/images/gallery/13.jpg';
import gallery14 from '@/assets/images/gallery/14.jpg';
import gallery15 from '@/assets/images/gallery/15.jpg';
import gallery16 from '@/assets/images/gallery/16.jpg';
import tabWelcomeDrinks from '@/assets/images/tabWelcomeDrinks.png';
import tabBrideWaiting from '@/assets/images/tabBrideWaiting.jpg';
import tabAtm from '@/assets/images/tabAtm.png';
import timeline1 from '@/assets/images/timeline/timeline1.jpg';
import timeline2 from '@/assets/images/timeline/timeline2.jpg';
import timeline3 from '@/assets/images/timeline/timeline3.png';
import timeline4 from '@/assets/images/timeline/timeline4.png';
import timeline5 from '@/assets/images/timeline/timeline5.jpg';
import coupleShot from '@/assets/images/coupleShot.jpg';
import letter1 from '@/assets/images/letter/letter1.png';
import letter2 from '@/assets/images/letter/letter2.png';
import beigeEnvelope from '@/assets/images/beige-envelope.png';
import weddingRing from '@/assets/images/weddingRing.jpg';

export const ASSET_URLS = {
  poster,
  introduce,
  groom: groomProfile,
  bride: brideProfile,
  profileGroom: groomProfileChild,
  profileBride: groomProfileBride,
  gallery: [
    gallery1,
    gallery2,
    gallery3,
    gallery4,
    gallery5,
    gallery6,
    gallery7,
    gallery8,
    gallery9,
    gallery10,
    gallery11,
    gallery12,
    gallery13,
    gallery14,
    gallery15,
    gallery16
  ] as string[],
  tabWelcomeDrinks,
  tabBrideWaiting,
  tabAtm,
  timeline1,
  timeline2,
  timeline3,
  timeline4,
  timeline5,
  coupleShot,
  letter1,
  letter2,
  beigeEnvelope,
  weddingRing,
}
