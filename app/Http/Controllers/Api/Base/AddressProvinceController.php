<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreAddressProvinceRequest;
use App\Http\Requests\Base\UpdateAddressProvinceRequest;
use App\Http\Resources\Base\AddressProvinceResource;
use App\Models\Base\AddressProvince;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class AddressProvinceController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['districts'];
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
    Gate::authorize(EPermissions::P_ADDRESS_PROVINCE_INDEX->name);
    $perPage = intval(\request()->query('perPage'));
    return AddressProvinceResource::collection($this->filter(AddressProvince::query())->paginate($perPage))
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreAddressProvinceRequest $request): AddressProvinceResource
  {
    Gate::authorize(EPermissions::P_ADDRESS_PROVINCE_STORE->name);
    $data = AddressProvince::create([...$request->validated()]);
    return (new AddressProvinceResource($this->loadRelationships($data)))
      ->additional(['message' => __('messages.Create Success')]);
  }

  /**
   * Display the specified resource.
   */
  public function show(string $code): AddressProvinceResource
  {
    Gate::authorize(EPermissions::P_ADDRESS_PROVINCE_SHOW->name);
    return (new AddressProvinceResource($this->loadRelationships(AddressProvince::query()->where('code', $code)->first())))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateAddressProvinceRequest $request, string $code): AddressProvinceResource
  {
    Gate::authorize(EPermissions::P_ADDRESS_PROVINCE_UPDATE->name);
    $data = AddressProvince::query()->where('code', $code)->first();
    $data->update($request->validated());
    return (new AddressProvinceResource($this->loadRelationships($data)))
      ->additional(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $code): JsonResponse
  {
    Gate::authorize(EPermissions::P_ADDRESS_PROVINCE_DESTROY->name);
    AddressProvince::query()->where('code', $code)->first()->delete();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}
