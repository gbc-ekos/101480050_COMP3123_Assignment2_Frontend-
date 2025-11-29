#!/bin/bash
echo "========================================="
echo "Step 5: Cleanup"
echo "========================================="

# Load variables
source /tmp/jenkins_build_vars_${BUILD_NUMBER}.env

# Clean up old Docker images (keep last 5)
echo "Cleaning up old Docker images..."
docker image prune -f

# Keep versioned images for rollback
echo "Keeping Docker images for rollback capability"

# Clean up temp files
rm -f /tmp/jenkins_build_vars_${BUILD_NUMBER}.env
rm -f /tmp/${CONTAINER_NAME}-nginx.conf

echo "========================================="
echo "Deployment Summary:"
echo "Application: ${IMAGE_NAME}"
echo "Container: ${CONTAINER_NAME}"
echo "Internal Port: ${HOST_PORT}"
echo "Domain: ${DOMAIN}"
echo "Backend API: ${REACT_APP_API_URL}"
echo "Build Number: ${BUILD_NUMBER}"
echo "========================================="
