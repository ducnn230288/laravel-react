<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

Route::post('/login', [\App\Http\Controllers\Api\Base\AuthController::class, 'login']);
Route::post('/logout', [\App\Http\Controllers\Api\Base\AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::apiResource('users/roles', \App\Http\Controllers\Api\Base\UserRoleController::class);
Route::apiResource('users', \App\Http\Controllers\Api\Base\UserController::class);
Route::apiResource('files', \App\Http\Controllers\Api\Base\FileController::class);
Route::apiResource('parameters', \App\Http\Controllers\Api\Base\ParameterController::class);


Route::apiResource('codes/types', \App\Http\Controllers\Api\Base\CodeTypeController::class);
Route::apiResource('codes', \App\Http\Controllers\Api\Base\CodeController::class);

Route::apiResource('contents/types', \App\Http\Controllers\Api\Base\ContentTypeController::class);
Route::apiResource('contents', \App\Http\Controllers\Api\Base\ContentController::class);
