<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreUserRoleRequest;
use App\Http\Requests\Base\UpdateRoleUserRequest;
use App\Http\Resources\Base\UserRoleResource;
use App\Models\Base\UserRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class UserRoleController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['users'];
    $this->fullTextSearch = ['name', 'code', 'description'];
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
  public function index(): AnonymousResourceCollection
  {
    Gate::authorize(EPermissions::P_USER_ROLE_INDEX->name);
    $perPage = intval(\request()->query('perPage'));
    return UserRoleResource::collection($this->filter(UserRole::query())->paginate($perPage))
      ->additional(['message' => __('messages.Get List Success')]);
  }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRoleRequest $request): UserRoleResource
    {
      Gate::authorize(EPermissions::P_USER_ROLE_STORE->name);
      $data = UserRole::create([...$request->validated()]);
      return (new UserRoleResource($this->loadRelationships($data)))
        ->additional(['message' => __('messages.Create Success')]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code): UserRoleResource
    {
      Gate::authorize(EPermissions::P_USER_ROLE_SHOW->name);
      return (new UserRoleResource($this->loadRelationships(UserRole::query()->where('code', $code)->first())))
        ->additional(['message' => __('messages.Get Detail Success')]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleUserRequest $request, string $code): UserRoleResource
    {
      Gate::authorize(EPermissions::P_USER_ROLE_UPDATE->name);
      $data = UserRole::query()->where('code', $code)->first();
      $data->update($request->validated());
      return (new UserRoleResource($this->loadRelationships($data)))
        ->additional(['message' => __('messages.Update Success')]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $code): JsonResponse
    {
      Gate::authorize(EPermissions::P_USER_ROLE_DESTROY->name);
      UserRole::query()->where('code', $code)->first()->delete();
      return response()->json(['message' => __('messages.Delete Success')]);
    }
}
