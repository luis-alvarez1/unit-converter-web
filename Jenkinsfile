pipeline {
    agent any

    tools {
        nodejs 'nodejs'
        dockerTool 'docker'
    }

    environment {
        // Define environment variables
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_IMAGE = 'luisalvarez1106/unit-converter'
        DOCKER_TAG = "${BUILD_NUMBER}"
        // Use credentials for VM connection details
        VM_DETAILS = credentials('vm-connection-details')
        // Define SSH credentials ID
        SSH_CREDS = 'vm-ssh-credentials'
    }

    stages {
        stage('Environment Setup') {
            steps {
                script {
                    // Parse VM details from JSON
                    def vmDetails = readJSON text: VM_DETAILS
                    env.VM_IP = vmDetails.ip
                    env.VM_SSH_PORT = vmDetails.port
                    env.VM_USER = vmDetails.user
                }
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
                // Login to DockerHub using environment variables
                sh 'docker login -u $DOCKERHUB_CREDENTIALS_USR -p $DOCKERHUB_CREDENTIALS_PSW'
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

                    // Deploy using SSH
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