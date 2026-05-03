/** monthIndex: 0=1월 … 11=12월 */
export function buildMonthGrid(year: number, monthIndex: number): (number | null)[][] {
  const first = new Date(year, monthIndex, 1)
  const pad = first.getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < pad; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const rows: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7))
  }
  return rows
}

export const WEEKDAY_LABELS_KO = ['일', '월', '화', '수', '목', '금', '토']
