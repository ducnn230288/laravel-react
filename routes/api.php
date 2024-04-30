<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [\App\Http\Controllers\Api\Base\AuthController::class, 'login']);
Route::post('/logout', [\App\Http\Controllers\Api\Base\AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::apiResource('codes/types', \App\Http\Controllers\Api\Base\CodeTypeController::class)->scoped(['code' => 'type']);
Route::apiResource('codes', \App\Http\Controllers\Api\Base\CodeController::class);
