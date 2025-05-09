module.exports = {
  default: {
    paths: ['features/*.feature'],
    require: ['steps/*.js', 'features/support/*.js'],
    format: [
      'progress-bar',
      'html:cucumber-report.html'
    ],
    publishQuiet: true
  },
  run: {
    paths: ['features/*.feature'],
    require: ['steps/*.js', 'features/support/*.js'],
    format: [
      'progress-bar',
      'html:cucumber-report.html'
    ],
    tags: '@run',
    publishQuiet: true
  }
}; 