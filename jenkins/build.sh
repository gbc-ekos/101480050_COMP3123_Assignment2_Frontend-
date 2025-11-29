#!/bin/bash
echo "========================================="
echo "Step 1: Building Docker image"
echo "========================================="

# Variables from Jenkins environment
# IMAGE_NAME, CONTAINER_NAME, DOMAIN, CONTAINER_PORT, REACT_APP_API_URL
# are passed from Jenkinsfile

# Save variables for next steps
echo "IMAGE_NAME=${IMAGE_NAME}" > /tmp/jenkins_build_vars_${BUILD_NUMBER}.env
echo "CONTAINER_NAME=${CONTAINER_NAME}" >> /tmp/jenkins_build_vars_${BUILD_NUMBER}.env
echo "DOMAIN=${DOMAIN}" >> /tmp/jenkins_build_vars_${BUILD_NUMBER}.env
echo "CONTAINER_PORT=${CONTAINER_PORT}" >> /tmp/jenkins_build_vars_${BUILD_NUMBER}.env
echo "PORT_RANGE_START=${PORT_RANGE_START}" >> /tmp/jenkins_build_vars_${BUILD_NUMBER}.env
echo "PORT_RANGE_END=${PORT_RANGE_END}" >> /tmp/jenkins_build_vars_${BUILD_NUMBER}.env
echo "REACT_APP_API_URL=${REACT_APP_API_URL}" >> /tmp/jenkins_build_vars_${BUILD_NUMBER}.env

echo "Configuration:"
echo "  IMAGE_NAME: ${IMAGE_NAME}"
echo "  CONTAINER_NAME: ${CONTAINER_NAME}"
echo "  DOMAIN: ${DOMAIN}"
echo "  CONTAINER_PORT: ${CONTAINER_PORT}"
echo "  PORT_RANGE: ${PORT_RANGE_START}-${PORT_RANGE_END}"
echo "  REACT_APP_API_URL: ${REACT_APP_API_URL}"

# Build the Docker image with build-time argument
docker build \
  --build-arg REACT_APP_API_URL="${REACT_APP_API_URL}" \
  -t ${IMAGE_NAME}:latest .

if [ $? -ne 0 ]; then
    echo "Error: Docker build failed"
    exit 1
fi

docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${BUILD_NUMBER}

echo "Docker image built successfully: ${IMAGE_NAME}:latest (${IMAGE_NAME}:${BUILD_NUMBER})"
