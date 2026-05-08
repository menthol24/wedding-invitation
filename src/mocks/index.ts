import * as ko from './wedding.mock'
import * as ja from './wedding.mock.ja'

export type Locale = 'ko' | 'ja'

export const locales = { ko, ja } as const

/** locale 키에 해당하는 mock 묶음 반환 */
export function getWeddingMock(locale: Locale) {
  return locale === 'ja' ? ja : ko
}
