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
        // Codebase
        sh 'docker run --rm -v $(pwd):/srv/app -w /srv/app jc21/node yarn install'
        sh 'docker run --rm -v $(pwd):/srv/app -w /srv/app jc21/node npm run-script build'
        sh 'rm -rf node_modules'
        sh 'docker run --rm -v $(pwd):/srv/app -w /srv/app jc21/node yarn install --prod'
        sh 'docker run --rm -v $(pwd):/data $DOCKER_CI_TOOLS node-prune'

        // Docker Build
        sh 'docker build --pull --no-cache --squash --compress -t $TEMP_IMAGE_NAME .'

        // Zip it
        sh 'rm -rf zips'
        sh 'mkdir -p zips'
        sh '''docker run --rm -v $(pwd):/data/docker-registry-ui -w /data $DOCKER_CI_TOOLS zip -qr "/data/docker-registry-ui/zips/docker-registry-ui_$TAG_VERSION.zip" docker-registry-ui -x \\
            \\*.gitkeep \\
            docker-registry-ui/zips\\* \\
            docker-registry-ui/bin\\* \\
            docker-registry-ui/src/frontend\\* \\
            docker-registry-ui/tmp\\* \\
            docker-registry-ui/node_modules\\* \\
            docker-registry-ui/.git\\* \\
            docker-registry-ui/.env \\
            docker-registry-ui/.babelrc \\
            docker-registry-ui/yarn\\* \\
            docker-registry-ui/.gitignore \\
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
        // Private Registry
        sh 'docker tag $TEMP_IMAGE_NAME $DOCKER_PRIVATE_REGISTRY/$IMAGE_NAME:latest'
        sh 'docker push $DOCKER_PRIVATE_REGISTRY/$IMAGE_NAME:latest'
        sh 'docker tag $TEMP_IMAGE_NAME $DOCKER_PRIVATE_REGISTRY/$IMAGE_NAME:$TAG_VERSION'
        sh 'docker push $DOCKER_PRIVATE_REGISTRY/$IMAGE_NAME:$TAG_VERSION'

        // Public Registry
        sh 'docker tag $TEMP_IMAGE_NAME docker.io/jc21/$IMAGE_NAME:latest'
        sh 'docker tag $TEMP_IMAGE_NAME docker.io/jc21/$IMAGE_NAME:$TAG_VERSION'

        withCredentials([usernamePassword(credentialsId: 'jc21-dockerhub', passwordVariable: 'dpass', usernameVariable: 'duser')]) {
          sh "docker login -u '${duser}' -p '$dpass'"
          sh 'docker push docker.io/jc21/$IMAGE_NAME:latest'
          sh 'docker push docker.io/jc21/$IMAGE_NAME:$TAG_VERSION'
        }

        // Artifacts
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
      juxtapose event: 'success'
      sh 'figlet "SUCCESS"'
    }
    failure {
      juxtapose event: 'failure'
      sh 'figlet "FAILURE"'
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
