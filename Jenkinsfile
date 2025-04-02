pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        // Define environment variables
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_IMAGE = 'luisalvarez1106/unit-converter'
        DOCKER_TAG = "${BUILD_NUMBER}"
        VM_IP = '192.168.1.150'
        VM_SSH_PORT = '2215'
        VM_USER = 'root'
        SSH_CREDENTIALS = credentials('vm-ssh-credentials')
    }

    stages {
        stage('Environment Setup') {
            steps {
                // Verify required tools
                sh '''
                    echo "Node version: $(node --version)"
                    echo "NPM version: $(npm --version)"
                    echo "Docker version: $(docker --version)"
                '''
            }
        }

        stage('Checkout') {
            steps {
                // Get code from repository
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install npm dependencies
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                // Run tests
                sh 'npm test'
            }
        }

        stage('Build TypeScript') {
            steps {
                // Build TypeScript code
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build Docker image
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
            }
        }

        stage('Login to DockerHub') {
            steps {
                // Login to DockerHub
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }

        stage('Push Docker Image') {
            steps {
                // Push Docker image to DockerHub
                sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh "docker push ${DOCKER_IMAGE}:latest"
            }
        }

        stage('Deploy to VM') {
            steps {
                script {
                    // Create deployment script
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

                    // Write deployment script to file
                    writeFile file: 'deploy.sh', text: deployScript

                    // Copy deployment script to VM and execute
                    sshagent([SSH_CREDENTIALS]) {
                        sh """
                            scp -o StrictHostKeyChecking=no deploy.sh ${VM_USER}@${VM_IP}:~/
                            ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_IP} 'bash ~/deploy.sh'
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            // Cleanup
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