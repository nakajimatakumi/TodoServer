FROM ubuntu:latest

ENV TZ=Asia/Tokyo
RUN apt update && apt install -y tzdata git
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt install -y nodejs npm

WORKDIR /app
COPY . .

EXPOSE 8787