<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Resources\Base\AddressWardResource;
use App\Models\Base\AddressWard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class AddressWardController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['district'];
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
    $this->checkPermission(EPermissions::P_ADDRESS_WARD_INDEX);
    return AddressWardResource::collection($this->loadRelationships(AddressWard::query())->latest()->paginate());
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request): AddressWardResource
  {
    $this->checkPermission(EPermissions::P_ADDRESS_WARD_STORE);
    $data = AddressWard::create([
      ...$request->validate([
        'name' => 'required|string|max:255',
        'code' => 'required|string|max:255|unique:address_wards',
        'district_code' => 'required|string|max:255',
        'description' => 'nullable|string',
      ]),
    ]);
    return new AddressWardResource($this->loadRelationships($data));
  }

  /**
   * Display the specified resource.
   */
  public function show(string $code): AddressWardResource
  {
    $this->checkPermission(EPermissions::P_ADDRESS_WARD_SHOW);
    return new AddressWardResource($this->loadRelationships(AddressWard::query()->where('code', $code)->first()));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, string $code): AddressWardResource
  {
    $this->checkPermission(EPermissions::P_ADDRESS_WARD_UPDATE);
    $data = AddressWard::query()->where('code', $code)->first();
    $data->update(
      $request->validate([
        'name' => 'sometimes|string|max:255',
        'description' => 'nullable|string',
      ])
    );
    return new AddressWardResource($this->loadRelationships($data));
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $code): JsonResponse
  {
    $this->checkPermission(EPermissions::P_ADDRESS_WARD_DESTROY);
    AddressWard::query()->where('code', $code)->first()->delete();
    return response()->json([
      'message' => 'Code Type deleted successfully'
    ]);
  }
}
