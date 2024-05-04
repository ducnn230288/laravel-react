<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Resources\Base\AddressDistrictResource;
use App\Models\Base\AddressDistrict;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class AddressDistrictController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['wards', 'province'];
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
    $this->checkPermission(EPermissions::P_ADDRESS_DISTRICT_INDEX);
    return AddressDistrictResource::collection($this->loadRelationships(AddressDistrict::query())->latest()->paginate());
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request): AddressDistrictResource
  {
    $this->checkPermission(EPermissions::P_ADDRESS_DISTRICT_STORE);
    $data = AddressDistrict::create([
      ...$request->validate([
        'name' => 'required|string|max:255',
        'code' => 'required|string|max:255|unique:address_districts',
        'province_code' => 'required|string|max:255',
        'description' => 'nullable|string',
      ]),
    ]);
    return new AddressDistrictResource($this->loadRelationships($data));
  }

  /**
   * Display the specified resource.
   */
  public function show(string $code): AddressDistrictResource
  {
    $this->checkPermission(EPermissions::P_ADDRESS_DISTRICT_SHOW);
    return new AddressDistrictResource($this->loadRelationships(AddressDistrict::query()->where('code', $code)->first()));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, string $code): AddressDistrictResource
  {
    $this->checkPermission(EPermissions::P_ADDRESS_DISTRICT_UPDATE);
    $data = AddressDistrict::query()->where('code', $code)->first();
    $data->update(
      $request->validate([
        'name' => 'sometimes|string|max:255',
        'description' => 'nullable|string',
      ])
    );
    return new AddressDistrictResource($this->loadRelationships($data));
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $code): JsonResponse
  {
    $this->checkPermission(EPermissions::P_ADDRESS_DISTRICT_DESTROY);
    AddressDistrict::query()->where('code', $code)->first()->delete();
    return response()->json([
      'message' => 'Code Type deleted successfully'
    ]);
  }
}
