export const formatDuration = (ms, rounding = 0) => {
  const sec = Math.round(ms / 10 ** (3 - rounding)) / 10 ** rounding;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec - h * 3600) / 60);
  const s = sec - h * 3600 - m * 60;

  return (h === 0 ? [m, s] : [h, m, s]).map((n, i) => (i > 0 && n < 10 ? `0${n}` : n)).join(':');
};
