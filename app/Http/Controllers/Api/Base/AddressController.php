<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreAddressRequest;
use App\Http\Requests\Base\UpdateAddressRequest;
use App\Http\Resources\Base\AddressResource;
use App\Models\Base\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class AddressController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['province', 'district', 'ward', 'user'];
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
    Gate::authorize(EPermissions::P_ADDRESS_INDEX->name);
    return AddressResource::collection($this->filter(Address::query())->paginate(\request()->query('perPage')))
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreAddressRequest $request): AddressResource
  {
    Gate::authorize(EPermissions::P_ADDRESS_STORE->name);
    $data = Address::create([
      ...$request->validated(),
      'user_id' => $request->user()->id,
    ]);
    return (new AddressResource($this->loadRelationships($data)))
      ->additional(['message' => __('messages.Create Success')]);
  }

  /**
   * Display the specified resource.
   */
  public function show(Address $address) : AddressResource
  {
    Gate::authorize(EPermissions::P_ADDRESS_SHOW->name);
    return (new AddressResource($this->loadRelationships($address)))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateAddressRequest $request, Address $address): AddressResource
  {
    Gate::authorize(EPermissions::P_ADDRESS_UPDATE->name);
    $address->update($request->validated());
    return (new AddressResource($this->loadRelationships($address)))
      ->additional(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Address $address): JsonResponse
  {
    Gate::authorize(EPermissions::P_ADDRESS_DESTROY->name);
    $address->delete();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}
