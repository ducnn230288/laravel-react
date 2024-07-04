FROM ubuntu:latest

RUN  apt-get update -y
RUN  apt-get install php php-curl curl php-mysql php-sqlite3 libapache2-mod-php php-mbstring php-xmlrpc php-soap php-gd php-xml php-cli php-zip php-bcmath php-tokenizer php-json php-pear -y

RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin --filename=composer

WORKDIR /app
COPY .. .
RUN rm -rf /app/client
RUN rm -rf /app/vendor
RUN composer install

CMD php artisan key:generate && php artisan storage:link
