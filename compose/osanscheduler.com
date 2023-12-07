server {

  root /var/www/osanscheduler.com/html;
  index index.html index.htm;

  server_name osanscheduler.com www.osanscheduler.com;

  location / {
    try_files $uri $uri/ =404;
  }

  location /metrics/ {
    proxy_pass http://localhost:8080/metrics/;
  }

  location /scheduler/ {
    proxy_pass http://localhost:8083/scheduler/;
  }

  location /multiview/ {
    proxy_pass http://localhost:8090/multiview/;
  }

  location /authentication/ {
    proxy_pass http://localhost:6000/authentication/;
  }

  location /query/ {
    proxy_pass http://localhost:6003/query/;
  }

  location /metrics/reportlists {
    alias /data/reports;
    autoindex on;
  }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/osanscheduler.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/osanscheduler.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}
server {
    if ($host = www.osanscheduler.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = osanscheduler.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


  listen 80;
  listen [::]:80;

  server_name osanscheduler.com www.osanscheduler.com;
    return 404; # managed by Certbot




}
