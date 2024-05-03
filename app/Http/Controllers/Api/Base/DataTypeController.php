<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Resources\Base\DataTypeResource;
use App\Models\Base\DataType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Symfony\Component\HttpFoundation\JsonResponse;

class DataTypeController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['data'];
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
    $this->checkPermission(EPermissions::P_DATA_TYPE_INDEX);
    $query = $this->loadRelationships(DataType::query());
    return DataTypeResource::collection($query->latest()->paginate());
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request): DataTypeResource
  {
    $this->checkPermission(EPermissions::P_DATA_TYPE_STORE);
    $event = DataType::create([
      ...$request->validate([
        'name' => 'required|string|max:255',
        'code' => 'required|string|max:255|unique:code_types',
        'description' => 'nullable|string',
      ]),
    ]);
    return new DataTypeResource($this->loadRelationships($event));
  }

  /**
   * Display the specified resource.
   */
  public function show(string $code): DataTypeResource
  {
    $this->checkPermission(EPermissions::P_DATA_TYPE_SHOW);
    return new DataTypeResource($this->loadRelationships(DataType::query()->where('code', $code)->first()));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, string $code): DataTypeResource
  {
    $this->checkPermission(EPermissions::P_DATA_TYPE_UPDATE);
    $codeType = DataType::query()->where('code', $code)->first();
    $codeType->update(
      $request->validate([
        'name' => 'sometimes|string|max:255',
        'description' => 'nullable|string',
      ])
    );
    return new DataTypeResource($this->loadRelationships($codeType));
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $code): JsonResponse
  {
    $this->checkPermission(EPermissions::P_DATA_TYPE_DESTROY);
    DataType::query()->where('code', $code)->first()->delete();
    return response()->json([
      'message' => 'Data Type deleted successfully'
    ]);
  }
}
