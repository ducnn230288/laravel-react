<?php

use Illuminate\Support\Facades\Route;

Route::get('/administrator', function () {
    return view('administrator');
});
