export const money = (n) =>
  n == null
    ? "Unavailable"
    : new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
      }).format(n);

export const pairs = a => a.map(x=>[x,x]);
