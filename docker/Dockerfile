FROM debian AS base
WORKDIR /app
COPY .. .
RUN rm -rf /app/client
RUN rm -rf /app/vendor

FROM php:8.3-rc-fpm-alpine

RUN docker-php-ext-install pdo pdo_mysql
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin --filename=composer

WORKDIR /app
COPY --from=base / .
RUN composer install

# CMD php artisan serve --host 0.0.0.0 --port=3000

CMD php artisan key:generate && php artisan storage:link
