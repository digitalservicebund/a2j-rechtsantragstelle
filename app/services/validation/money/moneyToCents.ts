const moneyToCents = (validatedMoney: string | undefined) => {
  if (validatedMoney === undefined) return undefined;
  let v = validatedMoney;

  // 1200,9
  if (/[.,]\d$/.test(v)) {
    v = `${v}0`;
  }
  // 1200
  if (!/[.,]\d{2}$/.test(v)) {
    v = `${v},00`;
  }

  v = v.replace(/[.,]/g, "");

  const num = Number(v);

  if (Object.is(num, -0)) return 0;

  return num;
};

export default moneyToCents;
