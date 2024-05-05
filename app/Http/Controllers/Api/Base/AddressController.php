<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Resources\Base\AddressResource;
use App\Models\Base\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

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
    $this->checkPermission(EPermissions::P_ADDRESS_INDEX);
    return AddressResource::collection($this->loadRelationships(Address::query())->latest()->paginate())
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request): AddressResource
  {
    $this->checkPermission(EPermissions::P_ADDRESS_STORE);
    $data = Address::create([
      ...$request->validate([
        'address' => 'required|string|max:255',
        'province_code' => 'required|string|max:255',
        'district_code' => 'required|string|max:255',
        'ward_code' => 'required|string|max:255',
      ]),
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
    $this->checkPermission(EPermissions::P_ADDRESS_SHOW);
    return (new AddressResource($this->loadRelationships($address)))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Address $address): AddressResource
  {
    $this->checkPermission(EPermissions::P_ADDRESS_UPDATE);
    $address->update(
      $request->validate([
        'address' => 'required|string|max:255',
        'province_code' => 'required|string|max:255',
        'district_code' => 'required|string|max:255',
        'ward_code' => 'required|string|max:255',
      ])
    );
    return (new AddressResource($this->loadRelationships($address)))
      ->additional(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Address $address): JsonResponse
  {
    $this->checkPermission(EPermissions::P_ADDRESS_DESTROY);
    $address->delete();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}
