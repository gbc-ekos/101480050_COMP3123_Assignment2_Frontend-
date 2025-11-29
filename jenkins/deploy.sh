#!/bin/bash
echo "========================================="
echo "Step 3: Deploying new container"
echo "========================================="

# Load variables
source /tmp/jenkins_build_vars_${BUILD_NUMBER}.env

# Run new container
docker run -d \
  --name ${CONTAINER_NAME} \
  --restart unless-stopped \
  -p ${HOST_PORT}:${CONTAINER_PORT} \
  ${IMAGE_NAME}:latest

if [ $? -ne 0 ]; then
    echo "Error: Docker run failed"
    exit 1
fi

# Verify container is running
sleep 2
if docker ps | grep -q ${CONTAINER_NAME}; then
    echo "Container deployed successfully on port ${HOST_PORT}"
else
    echo "Error: Container failed to start"
    docker logs ${CONTAINER_NAME}
    exit 1
fi

# Wait for health check to pass
echo "Waiting for health check..."
for i in {1..30}; do
    if docker exec ${CONTAINER_NAME} node -e "require('http').get('http://localhost:${CONTAINER_PORT}', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" 2>/dev/null; then
        echo "Health check passed!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "Warning: Health check did not pass within timeout"
    fi
    sleep 1
done
