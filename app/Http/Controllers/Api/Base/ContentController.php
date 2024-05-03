<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Resources\Base\ContentResource;
use App\Models\Base\Content;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ContentController extends Controller implements HasMiddleware
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
    $this->checkPermission(EPermissions::P_CONTENT_INDEX);
    return ContentResource::collection($this->loadRelationships(Content::query())->latest()->paginate());
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request): ContentResource
  {
    $this->checkPermission(EPermissions::P_CONTENT_STORE);
    $data = Content::create([
      ...$request->validate([
        'name' => 'required|string|max:255',
        'type_code' => 'required|string|max:255',
        'image' => 'nullable|string',
        'order' => 'nullable|integer',
      ]),
    ]);
    return new ContentResource($this->loadRelationships($data));
  }

  /**
   * Display the specified resource.
   */
  public function show(Content $content) : ContentResource
  {
    $this->checkPermission(EPermissions::P_CONTENT_SHOW);
    return new ContentResource($this->loadRelationships($content));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Content $content): ContentResource
  {
    $this->checkPermission(EPermissions::P_CONTENT_UPDATE);
    $content->update(
      $request->validate([
        'name' => 'sometimes|string|max:255',
        'image' => 'nullable|string',
        'order' => 'nullable|integer',
      ])
    );
    return new ContentResource($this->loadRelationships($content));
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Content $content): JsonResponse
  {
    $this->checkPermission(EPermissions::P_CONTENT_DESTROY);
    $content->delete();
    return response()->json([
      'message' => 'Content deleted successfully'
    ]);
  }
}
