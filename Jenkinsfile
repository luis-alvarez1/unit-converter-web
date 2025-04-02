pipeline {
    agent any

    tools {
        nodejs 'nodejs'
        dockerTool 'docker'
    }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_IMAGE = 'luisalvarez1106/unit-converter'
        DOCKER_TAG = "${BUILD_NUMBER}"
        VM_DETAILS = credentials('vm-connection-details')
        SSH_CREDS = 'vm-ssh-credentials'
    }

    stages {
        stage('Environment Setup') {
            steps {
                script {
                    def vmDetails = readJSON text: VM_DETAILS
                    env.VM_IP = vmDetails.ip
                    env.VM_SSH_PORT = vmDetails.port
                    env.VM_USER = vmDetails.user
                }
                sh '''
                    echo "Node version: $(node --version)"
                    echo "NPM version: $(npm --version)"
                    echo "Docker version: $(docker --version)"
                '''
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build TypeScript') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
            }
        }

        stage('Login to DockerHub') {
            steps {
                sh 'docker login -u $DOCKERHUB_CREDENTIALS_USR -p $DOCKERHUB_CREDENTIALS_PSW'
            }
        }

        stage('Push Docker Image') {
            steps {
                sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh "docker push ${DOCKER_IMAGE}:latest"
            }
        }

        stage('Deploy to VM') {
            steps {
                script {
                    def deployScript = """
                        # Stop existing container
                        docker stop unit-converter || true
                        docker rm unit-converter || true

                        # Pull latest image
                        docker pull ${DOCKER_IMAGE}:latest

                        # Run new container
                        docker run -d \\
                            --name unit-converter \\
                            -p 3000:3000 \\
                            -e NODE_ENV=production \\
                            --restart unless-stopped \\
                            ${DOCKER_IMAGE}:latest
                    """

                    writeFile file: 'deploy.sh', text: deployScript

                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDS, keyFileVariable: 'SSH_KEY')]) {
                        sh """
                            # Ensure correct permissions on SSH key
                            chmod 600 "\${SSH_KEY}"
                            
                            # Copy deployment script
                            scp -i "\${SSH_KEY}" -P ${VM_SSH_PORT} -o StrictHostKeyChecking=no deploy.sh ${VM_USER}@${VM_IP}:~/
                            
                            # Execute deployment script
                            ssh -i "\${SSH_KEY}" -p ${VM_SSH_PORT} -o StrictHostKeyChecking=no ${VM_USER}@${VM_IP} 'bash ~/deploy.sh'
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
} 