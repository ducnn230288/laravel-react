<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Resources\Base\UserResource;
use App\Models\Base\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UserController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['role', 'position'];
  }

  public static function middleware(): array
  {
    return [
      new Middleware(['auth:sanctum', 'ability:' . ETokenAbility::ACCESS_API->value]),
      new Middleware('throttle:60,1', only: ['store','update','destroy'])
    ];
  }
  /**
   * Display a listing of the resource.
   */
  public function index(Request $request): AnonymousResourceCollection
  {
    $this->checkPermission(EPermissions::P_USER_INDEX);
    $paginate = User::filter()->latest();
    return UserResource::collection($this->loadRelationships($paginate)->paginate($request->get('perPage')))
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request): UserResource
  {
    $this->checkPermission(EPermissions::P_USER_STORE);
    $data = User::create([
      ...$request->validate([
        'name' => 'required|string|max:255',
        'avatar' => 'string|max:255',
        'password' => 'required|string|max:255',
        'role_code' => 'required|string|max:255',
        'position_code' => 'required|string|max:255',
        'email' => 'required|string|unique:users',
        'phone_number' => 'required|string|unique:users',
      ]),
    ]);
    return (new UserResource($this->loadRelationships($data)))
      ->additional(['message' => __('messages.Create Success')]);
  }

  /**
   * Display the specified resource.
   */
  public function show(User $user): UserResource
  {
    $this->checkPermission(EPermissions::P_USER_SHOW);
    return (new UserResource($this->loadRelationships($user)))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, User $user): UserResource
  {
    $this->checkPermission(EPermissions::P_USER_UPDATE);
    $user->update(
      $request->validate([
        'name' => 'sometimes|string|max:255',
        'avatar' => 'sometimes|string|max:255',
        'password' => 'sometimes|string|max:255',
        'role_code' => 'sometimes|string|max:255',
        'position_code' => 'sometimes|string|max:255',
        'email' => 'sometimes|string|unique:users',
        'phone_number' => 'sometimes|string|unique:users',
      ])
    );
    return (new UserResource($this->loadRelationships($user)))
      ->additional(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(User $user): JsonResponse
  {
    $this->checkPermission(EPermissions::P_USER_DESTROY);
    $user->delete();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}
