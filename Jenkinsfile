pipeline {
	agent any
	options {
		buildDiscarder(logRotator(numToKeepStr: '10'))
		disableConcurrentBuilds()
	}
	environment {
		IMAGE           = "registry-ui"
		TAG_VERSION     = getPackageVersion()
		BRANCH_LOWER    = "${BRANCH_NAME.toLowerCase().replaceAll('/', '-')}"
		BUILDX_NAME     = "${COMPOSE_PROJECT_NAME}"
		BASE_IMAGE_NAME = "jc21/node:latest"
		TEMP_IMAGE_NAME = "${IMAGE}-build_${BUILD_NUMBER}"
	}
	stages {
		stage('Prepare') {
			steps {
				sh 'docker pull "${BASE_IMAGE_NAME}"'
				sh 'docker pull "${DOCKER_CI_TOOLS}"'
			}
		}
		stage('Build') {
			steps {
				// Codebase
				sh 'docker run --rm -v $(pwd):/app -w /app "${BASE_IMAGE_NAME}" yarn install'
				sh 'docker run --rm -v $(pwd):/app -w /app "${BASE_IMAGE_NAME}" yarn build'
				sh 'docker run --rm -v $(pwd):/app -w /app "${BASE_IMAGE_NAME}" chown -R "$(id -u):$(id -g)" *'
				sh 'rm -rf node_modules'
				sh 'docker run --rm -v $(pwd):/app -w /app "${BASE_IMAGE_NAME}" yarn install --prod'
				sh 'docker run --rm -v $(pwd):/data "${DOCKER_CI_TOOLS}" node-prune'

				// Docker Build
				sh 'docker build --pull --no-cache --squash --compress -t "${TEMP_IMAGE_NAME}" .'

				// Zip it
				sh 'rm -rf zips'
				sh 'mkdir -p zips'
				sh '''docker run --rm -v "$(pwd):/data/docker-registry-ui" -w /data "${DOCKER_CI_TOOLS}" zip -qr "/data/docker-registry-ui/zips/docker-registry-ui_${TAG_VERSION}.zip" docker-registry-ui -x \\
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
				'''
			}
			post {
				always {
					sh 'docker run --rm -v $(pwd):/app -w /app "${BASE_IMAGE_NAME}" chown -R "$(id -u):$(id -g)" *'
				}
			}
		}
		stage('Publish Develop') {
			when {
				branch 'develop'
			}
			steps {
				sh 'docker tag "${TEMP_IMAGE_NAME}" "jc21/${IMAGE}:develop"'
				withCredentials([usernamePassword(credentialsId: 'jc21-dockerhub', passwordVariable: 'dpass', usernameVariable: 'duser')]) {
					sh "docker login -u '${duser}' -p '$dpass'"
					sh 'docker push "jc21/${IMAGE}:develop"'
				}

				// Artifacts
				dir(path: 'zips') {
					archiveArtifacts(artifacts: '**/*.zip', caseSensitive: true, onlyIfSuccessful: true)
				}
			}
		}
		stage('Publish Master') {
			when {
				branch 'master'
			}
			steps {
				// Public Registry
				sh 'docker tag "${TEMP_IMAGE_NAME}" "jc21/${IMAGE}:latest"'
				sh 'docker tag "${TEMP_IMAGE_NAME}" "jc21/${IMAGE}:${TAG_VERSION}"'
				withCredentials([usernamePassword(credentialsId: 'jc21-dockerhub', passwordVariable: 'dpass', usernameVariable: 'duser')]) {
					sh "docker login -u '${duser}' -p '$dpass'"
					sh 'docker push "jc21/${IMAGE}:latest"'
					sh 'docker push "jc21/${IMAGE}:${TAG_VERSION}"'
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
			sh 'docker rmi "${TEMP_IMAGE_NAME}"'
		}
	}
}

def getPackageVersion() {
	ver = sh(script: 'docker run --rm -v $(pwd):/data "${DOCKER_CI_TOOLS}" bash -c "cat /data/package.json|jq -r \'.version\'"', returnStdout: true)
	return ver.trim()
}
