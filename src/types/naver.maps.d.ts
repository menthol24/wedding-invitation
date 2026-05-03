export {}

declare global {
  interface Window {
    naver?: {
      maps: {
        LatLng: new (lat: number, lng: number) => unknown
        Map: new (
          el: HTMLElement,
          opts: { center: unknown; zoom: number },
        ) => unknown
        Marker: new (opts: { map: unknown; position: unknown }) => unknown
        Event?: {
          trigger: (instance: unknown, eventName: string) => void
        }
      }
    }
  }
}
