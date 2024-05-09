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
use Illuminate\Support\Facades\Gate;

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
    Gate::authorize(EPermissions::P_USER_INDEX->name);
    return UserResource::collection($this->filter(User::query())->paginate($request->get('perPage')))
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request): UserResource
  {
    Gate::authorize(EPermissions::P_USER_STORE->name);
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
    Gate::authorize(EPermissions::P_USER_SHOW->name);
    return (new UserResource($this->loadRelationships($user)))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, User $user): UserResource
  {
    Gate::authorize(EPermissions::P_USER_UPDATE->name);
    $data = $request->validate([
      'name' => 'string|max:255',
      'avatar' => 'string|max:255',
      'password' => 'string|max:255',
      'role_code' => 'string|max:255',
      'position_code' => 'string|max:255',
      'email' => 'string|unique:users,email,'.$user->id,
      'phone_number' => 'string|unique:users,phone_number,'.$user->id,
      'disabled_at' => 'bool'
    ]);
    if ($data) {
      if (isset($data['disabled_at'])) $data['disabled_at'] = $data['disabled_at'] ? now() : null;
      $user->update($data);
    }
    return (new UserResource($this->loadRelationships($user)))
      ->additional(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(User $user): JsonResponse
  {
    Gate::authorize(EPermissions::P_USER_DESTROY->name);
    $user->delete();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}
