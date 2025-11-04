const scanner = require('sonarqube-scanner');

scanner(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      'sonar.projectName': 'ThinkSync Backend',
      'sonar.projectKey': 'thinksync-backend',
      'sonar.projectVersion': '1.0.0',
      'sonar.sources': 'routes,middleware,index.js,db.js,logger.js',
      'sonar.exclusions': 'node_modules/**,test/**,logs/**,coverage/**',
      'sonar.tests': 'test',
      'sonar.test.inclusions': '**/*.test.js',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.sourceEncoding': 'UTF-8'
    }
  },
  () => {
    console.log('SonarQube analysis completed');
    process.exit();
  }
);