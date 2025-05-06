pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_REGISTRY = 'your_dockerhub_username'
    }
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/your_username/project-management-system.git'
            }
        }
        stage('Build and Test Microservices') {
            parallel {
                stage('Auth Service') {
                    steps {
                        dir('auth-service') {
                            sh 'docker build -t ${DOCKERHUB_REGISTRY}/auth-service:latest .'
                            sh 'pytest tests/' // Предполагается наличие тестов
                        }
                    }
                }
                stage('User Service') {
                    steps {
                        dir('user-service') {
                            sh 'docker build -t ${DOCKERHUB_REGISTRY}/user-service:latest .'
                            sh 'pytest tests/'
                        }
                    }
                }
                stage('Project Service') {
                    steps {
                        dir('project-service') {
                            sh 'docker build -t ${DOCKERHUB_REGISTRY}/project-service:latest .'
                            sh 'pytest tests/'
                        }
                    }
                }
                stage('Task Service') {
                    steps {
                        dir('task-service') {
                            sh 'docker build -t ${DOCKERHUB_REGISTRY}/task-service:latest .'
                            sh 'pytest tests/'
                        }
                    }
                }
                stage('Report Service') {
                    steps {
                        dir('report-service') {
                            sh 'docker build -t ${DOCKERHUB_REGISTRY}/report-service:latest .'
                            sh 'pytest tests/'
                        }
                    }
                }
                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'docker build -t ${DOCKERHUB_REGISTRY}/frontend:latest .'
                            sh 'npm test' // Предполагается наличие тестов
                        }
                    }
                }
            }
        }
        stage('Push Images') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh 'docker push ${DOCKERHUB_REGISTRY}/auth-service:latest'
                sh 'docker push ${DOCKERHUB_REGISTRY}/user-service:latest'
                sh 'docker push ${DOCKERHUB_REGISTRY}/project-service:latest'
                sh 'docker push ${DOCKERHUB_REGISTRY}/task-service:latest'
                sh 'docker push ${DOCKERHUB_REGISTRY}/report-service:latest'
                sh 'docker push ${DOCKERHUB_REGISTRY}/frontend:latest'
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                dir('helm-charts/project-management') {
                    sh 'helm upgrade --install project-management . --namespace default'
                }
            }
        }
    }
    post {
        always {
            sh 'docker logout'
        }
        success {
            slackSend(channel: '#ci-cd', message: "Build and deployment successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}")
        }
        failure {
            slackSend(channel: '#ci-cd', message: "Build failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}")
        }
    }
}
