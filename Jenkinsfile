pipeline {
    agent any

    parameters {
        string(
            name: 'IMAGE_NAME',
            defaultValue: 'comp3123-frontend',
            description: 'Docker image name'
        )
        string(
            name: 'CONTAINER_NAME',
            defaultValue: 'comp3123-frontend-container',
            description: 'Docker container name'
        )
        string(
            name: 'DOMAIN',
            defaultValue: 'comp3123-frontend.ekosenko.me',
            description: 'Domain name for Nginx reverse proxy'
        )
        string(
            name: 'CONTAINER_PORT',
            defaultValue: '3000',
            description: 'Container internal port'
        )
        string(
            name: 'PORT_RANGE_START',
            defaultValue: '3001',
            description: 'Host port range start'
        )
        string(
            name: 'PORT_RANGE_END',
            defaultValue: '3100',
            description: 'Host port range end'
        )
        string(
            name: 'REACT_APP_API_URL',
            defaultValue: 'https://comp3123-backend.ekosenko.me/api/v1',
            description: 'Backend API URL for React app'
        )
    }

    environment {
        IMAGE_NAME = "${params.IMAGE_NAME}"
        CONTAINER_NAME = "${params.CONTAINER_NAME}"
        DOMAIN = "${params.DOMAIN}"
        CONTAINER_PORT = "${params.CONTAINER_PORT}"
        PORT_RANGE_START = "${params.PORT_RANGE_START}"
        PORT_RANGE_END = "${params.PORT_RANGE_END}"
        REACT_APP_API_URL = "${params.REACT_APP_API_URL}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out repository...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Building Docker image...'
                sh '''
                    chmod +x jenkins/build.sh
                    ./jenkins/build.sh
                '''
            }
        }

        stage('Deploy Preparation') {
            steps {
                echo 'Preparing deployment...'
                sh '''
                    chmod +x jenkins/deploy-prep.sh
                    ./jenkins/deploy-prep.sh
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying container...'
                sh '''
                    chmod +x jenkins/deploy.sh
                    ./jenkins/deploy.sh
                '''
            }
        }

        stage('Configure Nginx') {
            steps {
                echo 'Configuring Nginx reverse proxy...'
                sh '''
                    chmod +x jenkins/nginx-config.sh
                    ./jenkins/nginx-config.sh
                '''
            }
        }

        stage('Cleanup') {
            steps {
                echo 'Cleaning up...'
                sh '''
                    chmod +x jenkins/cleanup.sh
                    ./jenkins/cleanup.sh
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed! Check logs for details.'
        }
        always {
            cleanWs()
        }
    }
}
