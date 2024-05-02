<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\Permissions;
use App\Http\Resources\Base\DataResource;
use App\Models\Base\Data;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Symfony\Component\HttpFoundation\JsonResponse;

class DataController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['type'];
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
    $this->checkPermission(Permissions::P_DATA_INDEX);
    $query = $this->loadRelationships(Data::query());
    return DataResource::collection($query->latest()->paginate());
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request): DataResource
  {
    $this->checkPermission(Permissions::P_DATA_STORE);
    $event = Data::create([
      ...$request->validate([
        'name' => 'required|string|max:255',
        'type_data' => 'required|string|max:255',
        'image' => 'nullable|string',
        'order' => 'nullable|decimal:2',
      ]),
    ]);
    return new DataResource($this->loadRelationships($event));
  }

  /**
   * Display the specified resource.
   */
  public function show(string $code) : DataResource
  {
    $this->checkPermission(Permissions::P_DATA_SHOW);
    return new DataResource($this->loadRelationships(Data::query()->where('code', $code)->first()));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, string $code): DataResource
  {
    $this->checkPermission(Permissions::P_DATA_UPDATE);
    $code = Data::query()->where('code', $code)->first();
    $code->update(
      $request->validate([
        'name' => 'sometimes|string|max:255',
        'image' => 'nullable|string',
        'order' => 'nullable|decimal:2',
      ])
    );
    return new DataResource($this->loadRelationships($code));
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $code): JsonResponse
  {
    $this->checkPermission(Permissions::P_CODE_DESTROY);
    Data::query()->where('code', $code)->delete();
    return response()->json([
      'message' => 'Data deleted successfully'
    ]);
  }
}
