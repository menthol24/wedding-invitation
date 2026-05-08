import * as ko from './wedding.mock'
import * as jp from './wedding.mock.jp'

export type Locale = 'ko' | 'jp'

export const locales = { ko, jp } as const

/** locale 키에 해당하는 mock 묶음 반환 */
export function getWeddingMock(locale: Locale) {
  return locale === 'jp' ? jp : ko
}
