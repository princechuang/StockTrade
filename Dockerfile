# 基于Node镜像来构建Vue项目
FROM node:lts-alpine as build-stage
# 设置工作目录
WORKDIR /app

# 复制`package.json`和`package-lock.json`（如果有）
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件和目录到工作目录
COPY . .

# 构建Vue项目
RUN npm run build

# 用Nginx作为服务器来托管静态文件
FROM nginx:stable-alpine as production-stage

# language=nginx configuration
COPY <<EOF /etc/nginx/conf.d/default.conf
upstream happyshopapi_server {
        #ip_hash;
        server 192.168.3.124:9010 weight=5 max_fails=10 fail_timeout=30s;
}
server {
  listen 80;
  listen [::]:80;
  server_name  localhost;
  gzip_static on;
  access_log  /var/log/nginx/access.log;
  location / {
    root   /usr/share/nginx/html;
    index  index.html index.htm;
    try_files  $uri $uri/ /index.html;
  }
  location /hpapi/ {
    proxy_pass http://happyshopapi_server/;
    proxy_http_version 1.1;
  }
  error_page   500 502 503 504  /50x.html;
  location = /50x.html {
    root /usr/share/nginx/html;
  }
}
EOF

# 从构建阶段复制构建结果到Nginx服务器
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 暴露80端口
EXPOSE 80

# 启动Nginx，并且Nginx将持续运行
CMD ["nginx", "-g", "daemon off;"]
