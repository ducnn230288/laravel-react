<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreAuthRequest;
use App\Http\Requests\Base\UpdateAuthRequest;
use App\Http\Resources\Base\UserResource;
use App\Models\Base\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\JsonResponse;

class AuthController extends Controller
{
    public function login(Request $request): UserResource
  {
    $request->validate([
      'email' => 'required|email',
      'password' => 'required'
    ]);
    $user = User::where('email', $request->email)->first();
    if (!$user) throw ValidationException::withMessages([
      'email' => __('auth.failed')
    ]);
    if (!Hash::check($request->password, $user->password))
      throw ValidationException::withMessages([
      'email' => __('auth.password')
    ]);

    $user['token'] = $user->createToken('access_token', [ETokenAbility::ACCESS_API->value], Carbon::now()->addMinutes(config('sanctum.ac_expiration')))->plainTextToken;
    $user['refresh-token'] = $user->createToken('refresh_token', [ETokenAbility::ISSUE_ACCESS_TOKEN->value], Carbon::now()->addMinutes(config('sanctum.rt_expiration')))->plainTextToken;
    return (new UserResource($this->loadRelationships($user, ['role'])))->additional(['message' => __('messages.Success')]);
  }
  public function refreshToken(Request $request): JsonResponse
  {
    $accessToken = $request->user()->createToken('access_token', [ETokenAbility::ACCESS_API->value], Carbon::now()->addMinutes(config('sanctum.ac_expiration')));
    return response()->json(['message' => __('messages.Success'), 'data' => ['token' => $accessToken->plainTextToken] ]);
  }
  public function logout(Request $request): JsonResponse
  {
    $request->user()->tokens()->delete();
    return response()->json(['message' => __('messages.Success')]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreAuthRequest $request): UserResource
  {
    $data = User::create($request->validated());
    return (new UserResource($this->loadRelationships($data)))
      ->additional(['message' => __('messages.Create Success')]);
  }

  /**
   * Display the specified resource.
   */
  public function show(User $user): UserResource
  {
    return (new UserResource($this->loadRelationships($user)))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateAuthRequest $request, User $user): UserResource
  {
    $user->update($request->validated());
    return (new UserResource($this->loadRelationships($user)))
      ->additional(['message' => __('messages.Update Success')]);
  }

}
