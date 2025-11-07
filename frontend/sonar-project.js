import scanner from 'sonarqube-scanner';

scanner(
  {
    serverUrl: 'http://localhost:9000', 
    options: {
      'sonar.projectName': 'ThinkSync Frontend',
      'sonar.projectKey': 'thinksync-frontend',
      'sonar.projectVersion': '1.0.0',
      'sonar.sources': 'src',
      'sonar.exclusions': 'node_modules/**,dist/**,coverage/**,**/*.test.js',
      'sonar.tests': 'src',
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