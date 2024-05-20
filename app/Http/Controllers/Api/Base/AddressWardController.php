<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreAddressWardRequest;
use App\Http\Requests\Base\UpdateAddressWardRequest;
use App\Http\Resources\Base\AddressWardResource;
use App\Models\Base\AddressWard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class AddressWardController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['district'];
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
    Gate::authorize(EPermissions::P_ADDRESS_WARD_INDEX->name);
    $perPage = intval(\request()->query('perPage'));
    return AddressWardResource::collection($this->filter(AddressWard::query())->paginate($perPage))
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreAddressWardRequest $request): AddressWardResource
  {
    Gate::authorize(EPermissions::P_ADDRESS_WARD_STORE->name);
    $data = AddressWard::create([...$request->validated()]);
    return (new AddressWardResource($this->loadRelationships($data)))
      ->additional(['message' => __('messages.Create Success')]);
  }

  /**
   * Display the specified resource.
   */
  public function show(string $code): AddressWardResource
  {
    Gate::authorize(EPermissions::P_ADDRESS_WARD_SHOW->name);
    return (new AddressWardResource($this->loadRelationships(AddressWard::query()->where('code', $code)->first())))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateAddressWardRequest $request, string $code): AddressWardResource
  {
    Gate::authorize(EPermissions::P_ADDRESS_WARD_UPDATE->name);
    $data = AddressWard::query()->where('code', $code)->first();
    $data->update($request->validated());
    return (new AddressWardResource($this->loadRelationships($data)))
      ->additional(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $code): JsonResponse
  {
    Gate::authorize(EPermissions::P_ADDRESS_WARD_DESTROY->name);
    AddressWard::query()->where('code', $code)->first()->delete();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}
