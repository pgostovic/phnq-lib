import p from 'process';
import bHrtime from 'browser-process-hrtime';

export const hrtime = p.browser ? bHrtime : process.hrtime;
