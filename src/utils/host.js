export function getHostPrefix() {
  const envs = ['prd', 'test', 'pre', 'dev'];
  if (envs.indexOf(__env__) === -1) {
    throw new Error('not a valid env:' + __env__);
  }

  switch (__env__) {
    case 'prd':
      return '';
    case 'pre':
      return 'u-';
    default:
      return 't-'; // dev ,test
  }
}
