<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\Permissions;
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
    $this->relations = ['role'];
  }

  public static function middleware(): array
  {
    return [
      new Middleware('auth:sanctum'),
      new Middleware('throttle:60,1', only: ['store','update','destroy'])
    ];
  }
  /**
   * Display a listing of the resource.
   */
  public function index(): AnonymousResourceCollection
  {
    $this->checkPermission(Permissions::P_USER_INDEX);
    $query = $this->loadRelationships(User::query());
    return UserResource::collection($query->latest()->paginate());
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request): UserResource
  {
    $this->checkPermission(Permissions::P_USER_STORE);
    $event = User::create([
      ...$request->validate([
        'name' => 'required|string|max:255',
        'password' => 'required|string|max:255',
        'role_code' => 'required|string|max:255',
        'email' => 'required|string|unique:users',
      ]),
    ]);
    return new UserResource($this->loadRelationships($event));
  }

  /**
   * Display the specified resource.
   */
  public function show(User $user): UserResource
  {
    $this->checkPermission(Permissions::P_USER_SHOW);
    return new UserResource($this->loadRelationships($user));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, User $user): UserResource
  {
    $this->checkPermission(Permissions::P_USER_UPDATE);
    $user->update(
      $request->validate([
        'name' => 'sometimes|string|max:255',
        'password' => 'sometimes|string|max:255',
        'role_code' => 'sometimes|string|max:255',
        'email' => 'sometimes|string|unique:users',
      ])
    );
    return new UserResource($this->loadRelationships($user));
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(User $user): JsonResponse
  {
    $this->checkPermission(Permissions::P_USER_DESTROY);
    $user->delete();
    return response()->json([
      'message' => 'User deleted successfully'
    ]);
  }
}
