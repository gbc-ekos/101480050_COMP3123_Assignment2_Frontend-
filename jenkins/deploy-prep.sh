#!/bin/bash
echo "========================================="
echo "Step 2: Finding available port and stopping old container"
echo "========================================="

# Load variables
source /tmp/jenkins_build_vars_${BUILD_NUMBER}.env

# Function to find an available port
find_available_port() {
    local port=${PORT_RANGE_START}
    local max_port=${PORT_RANGE_END}
    while [ $port -le $max_port ]; do
        if ! netstat -tuln | grep -q ":$port "; then
            echo $port
            return
        fi
        port=$((port + 1))
    done
    echo "0"
}

# Find available port
HOST_PORT=$(find_available_port)
if [ "$HOST_PORT" = "0" ]; then
    echo "Error: No available ports found in range 3001-3100"
    exit 1
fi

echo "Selected port: $HOST_PORT"
echo "HOST_PORT=${HOST_PORT}" >> /tmp/jenkins_build_vars_${BUILD_NUMBER}.env

# Stop and remove old container if it exists
if docker ps -a | grep -q ${CONTAINER_NAME}; then
    echo "Stopping old container..."
    docker stop ${CONTAINER_NAME} || true
    docker rm ${CONTAINER_NAME} || true
    echo "Old container removed"
else
    echo "No existing container found"
fi
