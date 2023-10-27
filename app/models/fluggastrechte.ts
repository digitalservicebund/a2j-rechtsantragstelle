export function forderungFromEntfernung(entfernung: number) {
  return entfernung < 1500 ? 250 : entfernung < 3000 ? 400 : 600;
}
