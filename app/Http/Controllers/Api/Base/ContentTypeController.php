<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Resources\Base\ContentTypeResource;
use App\Models\Base\ContentType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Symfony\Component\HttpFoundation\JsonResponse;

class ContentTypeController extends Controller implements HasMiddleware
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
    $this->checkPermission(EPermissions::P_CONTENT_TYPE_INDEX);
    return ContentTypeResource::collection($this->loadRelationships(ContentType::query())->latest()->paginate());
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request): ContentTypeResource
  {
    $this->checkPermission(EPermissions::P_CONTENT_TYPE_STORE);
    $data = ContentType::create([
      ...$request->validate([
        'name' => 'required|string|max:255',
        'code' => 'required|string|max:255|unique:code_types',
        'description' => 'nullable|string',
      ]),
    ]);
    return new ContentTypeResource($this->loadRelationships($data));
  }

  /**
   * Display the specified resource.
   */
  public function show(string $code): ContentTypeResource
  {
    $this->checkPermission(EPermissions::P_CONTENT_TYPE_SHOW);
    return new ContentTypeResource($this->loadRelationships(ContentType::query()->where('code', $code)->first()));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, string $code): ContentTypeResource
  {
    $this->checkPermission(EPermissions::P_CONTENT_TYPE_UPDATE);
    $data = ContentType::query()->where('code', $code)->first();
    $data->update(
      $request->validate([
        'name' => 'sometimes|string|max:255',
        'description' => 'nullable|string',
      ])
    );
    return new ContentTypeResource($this->loadRelationships($data));
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $code): JsonResponse
  {
    $this->checkPermission(EPermissions::P_CONTENT_TYPE_DESTROY);
    ContentType::query()->where('code', $code)->first()->delete();
    return response()->json([
      'message' => 'Data Type deleted successfully'
    ]);
  }
}
