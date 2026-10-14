// CI/CD pipeline: checks out the repo, installs backend dependencies,
// and copies the static frontend to the Nginx web root.
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Arunimaaaaa/placemate.git'
            }
        }

        stage('Install backend dependencies') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Deploy frontend to Nginx') {
            steps {
                sh '''
                sudo rm -rf /var/www/html/*
                sudo cp *.html *.css *.js *.png /var/www/html/
                '''
            }
        }
    }
}
