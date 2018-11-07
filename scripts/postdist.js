const fs = require('fs');
const path = require('path');
const {
  name,
  version,
  main,
  browser,
  description,
  repository,
  author,
  license,
  dependencies,
} = require('../package.json');

const distPkgJSON = {
  name,
  version,
  main,
  browser,
  description,
  repository,
  author,
  license,
  dependencies,
};

fs.writeFileSync(path.resolve(__dirname, '../dist/package.json'), JSON.stringify(distPkgJSON, 0, 2));
