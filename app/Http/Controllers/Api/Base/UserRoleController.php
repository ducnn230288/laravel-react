<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Resources\Base\UserRoleResource;
use App\Http\Traits\CanLoadRelationships;
use App\Models\Base\UserRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserRoleController extends Controller
{
  use CanLoadRelationships;
  private array $relations = ['users'];
    /**
     * Display a listing of the resource.
     */
  public function index(): AnonymousResourceCollection
  {
    $query = $this->loadRelationships(UserRole::query());
    return UserRoleResource::collection($query->latest()->paginate());
  }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): UserRoleResource
    {
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
      return new UserRoleResource($this->loadRelationships(UserRole::query()->where('code', $code)->first()));

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $code): UserRoleResource
    {
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
      UserRole::query()->where('code', $code)->first()->delete();
      return response()->json([
        'message' => 'User role deleted successfully'
      ]);
    }
}
