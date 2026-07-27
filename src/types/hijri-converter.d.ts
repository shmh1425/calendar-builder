declare module 'hijri-converter' {
  export function toHijri(gYear: number, gMonth: number, gDay: number): {
    hy: number;
    hm: number;
    hd: number;
  };
  export function toGregorian(hYear: number, hMonth: number, hDay: number): {
    gy: number;
    gm: number;
    gd: number;
  };
}
