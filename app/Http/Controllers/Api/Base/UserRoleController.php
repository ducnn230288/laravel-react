<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Resources\Base\UserRoleResource;
use App\Models\Base\UserRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UserRoleController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['users'];
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
    $this->checkPermission(EPermissions::P_USER_ROLE_INDEX);
    return UserRoleResource::collection($this->loadRelationships(UserRole::query())->latest()->paginate());
  }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): UserRoleResource
    {
      $this->checkPermission(EPermissions::P_USER_ROLE_STORE);
      $data = UserRole::create([
        ...$request->validate([
          'name' => 'required|string|max:255',
          'code' => 'required|string|max:255|unique:user_roles',
          'description' => 'nullable|string',
          'is_system_admin' => 'boolean',
          'permissions' => 'present|array',
          'permissions.*' => 'distinct|uuid',
        ]),
      ]);
      return new UserRoleResource($this->loadRelationships($data));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code): UserRoleResource
    {
      $this->checkPermission(EPermissions::P_USER_ROLE_SHOW);
      return new UserRoleResource($this->loadRelationships(UserRole::query()->where('code', $code)->first()));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $code): UserRoleResource
    {
      $this->checkPermission(EPermissions::P_USER_ROLE_UPDATE);
      $data = UserRole::query()->where('code', $code)->first();
      $data->update(
        $request->validate([
          'name' => 'sometimes|string|max:255',
          'description' => 'nullable|string',
          'is_system_admin' => 'boolean',
          'permissions' => 'sometimes|array',
          'permissions.*' => 'distinct|uuid',
        ])
      );
      return new UserRoleResource($this->loadRelationships($data));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $code): JsonResponse
    {
      $this->checkPermission(EPermissions::P_USER_ROLE_DESTROY);
      UserRole::query()->where('code', $code)->first()->delete();
      return response()->json([
        'message' => 'User role deleted successfully'
      ]);
    }
}
