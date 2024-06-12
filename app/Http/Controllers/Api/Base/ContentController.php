<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreContentRequest;
use App\Http\Requests\Base\UpdateContentRequest;
use App\Http\Resources\Base\ContentResource;
use App\Models\Base\Content;
use App\Services\Base\ContentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class ContentController extends Controller implements HasMiddleware
{
  protected ContentService $contentService;
  public function __construct(ContentService $contentService)
  {
    $this->relations = ['type', 'languages'];
    $this->fullTextSearch = ['name'];
    $this->contentService = $contentService;
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
    Gate::authorize(EPermissions::P_CONTENT_INDEX->name);
    $perPage = intval(\request()->query('perPage'));
    return ContentResource::collection($this->filter(Content::query())->paginate($perPage))
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreContentRequest $request): ContentResource
  {
    Gate::authorize(EPermissions::P_CONTENT_STORE->name);
    $data = $this->contentService->save($request->validated());
    return (new ContentResource($this->loadRelationships($data)))
      ->additional(['message' => __('messages.Create Success')]);
  }

  /**
   * Display the specified resource.
   */
  public function show(Content $content) : ContentResource
  {
    Gate::authorize(EPermissions::P_CONTENT_SHOW->name);
    return (new ContentResource($this->loadRelationships($content)))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateContentRequest $request, Content $content): ContentResource
  {
    Gate::authorize(EPermissions::P_CONTENT_UPDATE->name);
    $this->contentService->update($request->validated(), $content);
    return (new ContentResource($this->loadRelationships($content)))
      ->additional(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Content $content): JsonResponse
  {
    Gate::authorize(EPermissions::P_CONTENT_DESTROY->name);
    $content->delete();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}
