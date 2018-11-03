import chalk from 'chalk';
import { browser } from 'process';

const getTs = () => new Date().toISOString();

const colorize = s => {
  const charCodeSum = s
    .split('')
    .map(char => char.charCodeAt(0))
    .reduce((sum, charCode) => sum + charCode, 0);

  const hue = charCodeSum % 360;

  if (browser) {
    return {
      text: `%c${s}%c`,
      args: [`font-weight: bold; color: hsl(${hue}, 100%, 30%)`, 'font-weight: normal; color: inherit'],
    };
  }
  return {
    text: chalk.hsl(hue, 100, 30).bold(s),
    args: [],
  };
};

export const newLogger = category => {
  const colorCat = colorize(category);
  const logFn = (...a) => {
    const [msg, ...args] = a;
    console.log(`${getTs()} ${colorCat.text} ${msg}`, ...colorCat.args, ...args);
  };
  return logFn;
};
