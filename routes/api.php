<?php

use App\Http\Enums\ETokenAbility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

Route::post('/auth/login', [\App\Http\Controllers\Api\Base\AuthController::class, 'login']);
Route::post('/auth/logout', [\App\Http\Controllers\Api\Base\AuthController::class, 'logout'])->middleware('auth:sanctum', 'ability:' . ETokenAbility::ACCESS_API->value);
Route::middleware('auth:sanctum', 'ability:' . ETokenAbility::ISSUE_ACCESS_TOKEN->value)->group(function () {
  Route::get('/auth/refresh-token', [\App\Http\Controllers\Api\Base\AuthController::class, 'refreshToken']);
});
Route::apiResource('users/roles', \App\Http\Controllers\Api\Base\UserRoleController::class);
Route::apiResource('users', \App\Http\Controllers\Api\Base\UserController::class);
Route::apiResource('files', \App\Http\Controllers\Api\Base\FileController::class);
Route::apiResource('parameters', \App\Http\Controllers\Api\Base\ParameterController::class);

Route::apiResource('codes/types', \App\Http\Controllers\Api\Base\CodeTypeController::class);
Route::apiResource('codes', \App\Http\Controllers\Api\Base\CodeController::class);

Route::apiResource('contents/types', \App\Http\Controllers\Api\Base\ContentTypeController::class);
Route::apiResource('contents', \App\Http\Controllers\Api\Base\ContentController::class);

Route::apiResource('posts/types', \App\Http\Controllers\Api\Base\PostTypeController::class);
Route::apiResource('posts', \App\Http\Controllers\Api\Base\PostController::class);

Route::apiResource('addresses/provinces', \App\Http\Controllers\Api\Base\AddressProvinceController::class);
Route::apiResource('addresses/districts', \App\Http\Controllers\Api\Base\AddressDistrictController::class);
Route::apiResource('addresses/wards', \App\Http\Controllers\Api\Base\AddressWardController::class);
Route::apiResource('addresses', \App\Http\Controllers\Api\Base\AddressController::class);
