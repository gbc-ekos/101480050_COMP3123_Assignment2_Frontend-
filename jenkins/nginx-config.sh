#!/bin/bash
echo "========================================="
echo "Step 4: Configuring Nginx reverse proxy"
echo "========================================="

# Load variables
source /tmp/jenkins_build_vars_${BUILD_NUMBER}.env

# Create nginx configuration
cat > /tmp/${CONTAINER_NAME}-nginx.conf << EOF
server {
    listen 80;
    server_name ${DOMAIN};

    location / {
        proxy_pass http://localhost:${HOST_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Deploy nginx configuration
sudo cp /tmp/${CONTAINER_NAME}-nginx.conf /etc/nginx/sites-available/${CONTAINER_NAME}
sudo ln -sf /etc/nginx/sites-available/${CONTAINER_NAME} /etc/nginx/sites-enabled/

# Test and reload nginx
sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    echo "Nginx configuration updated successfully"
else
    echo "Error: Nginx configuration test failed"
    exit 1
fi
