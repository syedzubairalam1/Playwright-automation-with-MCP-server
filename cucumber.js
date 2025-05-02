module.exports = {
  default: {
    paths: ['Login.feature'],
    require: ['steps/*.js'],
    format: ['html:cucumber-report.html', 'summary'],
    publishQuiet: true,
    timeout: 60000
  }
}; 