<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\Permissions;
use App\Http\Resources\Base\UserRoleResource;
use App\Http\Traits\CanCheckPermissionByRole;
use App\Http\Traits\CanLoadRelationships;
use App\Models\Base\UserRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UserRoleController extends Controller implements HasMiddleware
{
  use CanLoadRelationships, CanCheckPermissionByRole;
  private array $relations = ['users'];
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
    $this->checkPermission(Permissions::P_USER_ROLE_INDEX);
    $query = $this->loadRelationships(UserRole::query());
    return UserRoleResource::collection($query->latest()->paginate());
  }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): UserRoleResource
    {
      $this->checkPermission(Permissions::P_USER_ROLE_STORE);
      $event = UserRole::create([
        ...$request->validate([
          'name' => 'required|string|max:255',
          'code' => 'required|string|max:255|unique:user_roles',
          'description' => 'nullable|string',
          'is_system_admin' => 'boolean',
          'permissions' => 'present|array',
          'permissions.*' => 'distinct|uuid',
        ]),
      ]);
      return new UserRoleResource($this->loadRelationships($event));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code): UserRoleResource
    {
      $this->checkPermission(Permissions::P_USER_ROLE_SHOW);
      return new UserRoleResource($this->loadRelationships(UserRole::query()->where('code', $code)->first()));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $code): UserRoleResource
    {
      $this->checkPermission(Permissions::P_USER_ROLE_UPDATE);
      $userRole = UserRole::query()->where('code', $code)->first();
      $userRole->update(
        $request->validate([
          'name' => 'sometimes|string|max:255',
          'description' => 'nullable|string',
          'is_system_admin' => 'boolean',
          'permissions' => 'sometimes|array',
          'permissions.*' => 'distinct|uuid',
        ])
      );
      return new UserRoleResource($this->loadRelationships($userRole));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $code): JsonResponse
    {
      $this->checkPermission(Permissions::P_USER_ROLE_DESTROY);
      UserRole::query()->where('code', $code)->first()->delete();
      return response()->json([
        'message' => 'User role deleted successfully'
      ]);
    }
}
