<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Resources\Base\UserResource;
use App\Http\Traits\CanLoadRelationships;
use App\Models\Base\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
  use CanLoadRelationships;
  private array $relations = ['role'];
  /**
   * Display a listing of the resource.
   */
  public function index(): AnonymousResourceCollection
  {
    $query = $this->loadRelationships(User::query());
    return UserResource::collection($query->latest()->paginate());
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request): UserResource
  {
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
    return new UserResource($this->loadRelationships($user));

  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, User $user): UserResource
  {
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
    $user->delete();
    return response()->json([
      'message' => 'User deleted successfully'
    ]);
  }
}
