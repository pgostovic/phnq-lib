import p from 'process';
import bHrtime from 'browser-process-hrtime';

const hrtime = p.browser ? bHrtime : process.hrtime;

export default hrtime;
