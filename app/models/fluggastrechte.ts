export function forderungFromEntfernung(entfernung: number) {
  return entfernung < 1500 ? 250 : entfernung < 3500 ? 400 : 600;
}
