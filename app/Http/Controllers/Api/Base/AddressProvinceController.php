<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Resources\Base\AddressProvinceResource;
use App\Models\Base\AddressProvince;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class AddressProvinceController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['districts'];
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
    $this->checkPermission(EPermissions::P_ADDRESS_PROVINCE_INDEX);
    return AddressProvinceResource::collection($this->loadRelationships(AddressProvince::query())->latest()->paginate());
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request): AddressProvinceResource
  {
    $this->checkPermission(EPermissions::P_ADDRESS_PROVINCE_STORE);
    $data = AddressProvince::create([
      ...$request->validate([
        'name' => 'required|string|max:255',
        'code' => 'required|string|max:255|unique:address_provinces',
        'description' => 'nullable|string',
      ]),
    ]);
    return new AddressProvinceResource($this->loadRelationships($data));
  }

  /**
   * Display the specified resource.
   */
  public function show(string $code): AddressProvinceResource
  {
    $this->checkPermission(EPermissions::P_ADDRESS_PROVINCE_SHOW);
    return new AddressProvinceResource($this->loadRelationships(AddressProvince::query()->where('code', $code)->first()));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, string $code): AddressProvinceResource
  {
    $this->checkPermission(EPermissions::P_ADDRESS_PROVINCE_UPDATE);
    $data = AddressProvince::query()->where('code', $code)->first();
    $data->update(
      $request->validate([
        'name' => 'sometimes|string|max:255',
        'description' => 'nullable|string',
      ])
    );
    return new AddressProvinceResource($this->loadRelationships($data));
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $code): JsonResponse
  {
    $this->checkPermission(EPermissions::P_ADDRESS_PROVINCE_DESTROY);
    AddressProvince::query()->where('code', $code)->first()->delete();
    return response()->json([
      'message' => 'Address provinces Type deleted successfully'
    ]);
  }
}
