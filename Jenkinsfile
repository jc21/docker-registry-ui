pipeline {
  options {
    buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '10'))
    disableConcurrentBuilds()
  }
  agent any
  environment {
    IMAGE_NAME      = "registry-ui"
    TEMP_IMAGE_NAME = "registry-ui-build_${BUILD_NUMBER}"
    TAG_VERSION     = getPackageVersion()
  }
  stages {
    stage('Prepare') {
        steps {
          sh 'docker pull jc21/node'
          sh 'docker pull $DOCKER_CI_TOOLS'
      }
    }
    stage('Build') {
      steps {
        sh 'docker run --rm -v $(pwd):/srv/app -v /usr/local/share/.cache/yarn:/usr/local/share/.cache/yarn -w /srv/app jc21/node yarn --registry=$NPM_REGISTRY install'
        sh 'docker run --rm -v $(pwd):/srv/app -w /srv/app jc21/node npm run-script build'
        sh 'rm -rf node_modules'
        sh 'docker run --rm -v $(pwd):/srv/app -v /usr/local/share/.cache/yarn:/usr/local/share/.cache/yarn -w /srv/app jc21/node yarn --registry=$NPM_REGISTRY install --prod'
        sh 'docker run --rm -v $(pwd):/data $DOCKER_CI_TOOLS node-prune'
        sh 'docker build -t $TEMP_IMAGE_NAME .'

        sh '''rm -rf zips
        mkdir -p zips
        docker run --rm -v $(pwd):/data/docker-registry-ui -w /data $DOCKER_CI_TOOLS zip -qr "/data/docker-registry-ui/zips/docker-registry-ui_$TAG_VERSION.zip" docker-registry-ui -x \\
            \\*.gitkeep \\
            docker-registry-ui/zips\\* \\
            docker-registry-ui/bin\\* \\
            docker-registry-ui/config/my.cnf \\
            docker-registry-ui/data\\* \\
            docker-registry-ui/src/frontend\\* \\
            docker-registry-ui/test\\* \\
            docker-registry-ui/node_modules\\* \\
            docker-registry-ui/.git\\* \\
            docker-registry-ui/.env \\
            docker-registry-ui/.babelrc \\
            docker-registry-ui/yarn\\* \\
            docker-registry-ui/.gitignore \\
            docker-registry-ui/docker-compose.yml \\
            docker-registry-ui/Dockerfile \\
            docker-registry-ui/nodemon.json \\
            docker-registry-ui/webpack.config.js \\
            docker-registry-ui/webpack_stats.html

        exit $?'''
      }
    }
    stage('Publish') {
      when {
        branch 'master'
      }
      steps {
        sh 'docker tag $TEMP_IMAGE_NAME $DOCKER_PRIVATE_REGISTRY/$IMAGE_NAME:latest'
        /*
        sh 'docker push $DOCKER_PRIVATE_REGISTRY/$IMAGE_NAME:latest'
        sh 'docker tag $TEMP_IMAGE_NAME $DOCKER_PRIVATE_REGISTRY/$IMAGE_NAME:latest'
        sh 'docker push $DOCKER_PRIVATE_REGISTRY/$IMAGE_NAME:latest'
        sh 'docker tag $TEMP_IMAGE_NAME docker.io/jc21/$IMAGE_NAME:latest'
        sh 'docker tag $TEMP_IMAGE_NAME docker.io/jc21/$IMAGE_NAME:$TAG_VERSION'

        withCredentials([usernamePassword(credentialsId: 'jc21-dockerhub', passwordVariable: 'dpass', usernameVariable: 'duser')]) {
          sh "docker login -u '${duser}' -p '$dpass'"
          sh 'docker push docker.io/jc21/$IMAGE_NAME:latest'
          sh 'docker push docker.io/jc21/$IMAGE_NAME:$TAG_VERSION'
        }
        */

        dir(path: 'zips') {
          archiveArtifacts(artifacts: '**/*.zip', caseSensitive: true, onlyIfSuccessful: true)
        }
      }
    }
  }
  triggers {
    bitbucketPush()
  }
  post {
    success {
      slackSend color: "#72c900", message: "SUCCESS: <${BUILD_URL}|${JOB_NAME}> build #${BUILD_NUMBER} - ${currentBuild.durationString}"
    }
    failure {
      slackSend color: "#d61111", message: "FAILED: <${BUILD_URL}|${JOB_NAME}> build #${BUILD_NUMBER} - ${currentBuild.durationString}"
    }
    always {
      sh 'docker rmi  $TEMP_IMAGE_NAME'
    }
  }
}

def getPackageVersion() {
  ver = sh(script: 'docker run --rm -v $(pwd):/data $DOCKER_CI_TOOLS bash -c "cat /data/package.json|jq -r \'.version\'"', returnStdout: true)
  return ver.trim()
}
