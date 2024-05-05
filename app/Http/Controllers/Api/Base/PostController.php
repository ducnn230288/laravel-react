<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Resources\Base\PostResource;
use App\Models\Base\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PostController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['type'];
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
    $this->checkPermission(EPermissions::P_POST_INDEX);
    return PostResource::collection($this->loadRelationships(Post::query())->latest()->paginate())
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request): PostResource
  {
    $this->checkPermission(EPermissions::P_POST_STORE);
    $data = Post::create([
      ...$request->validate([
        'type_code' => 'required|string|max:255',
        'image' => 'nullable|string',
      ]),
    ]);
    return (new PostResource($this->loadRelationships($data)))
      ->additional(['message' => __('messages.Create Success')]);
  }

  /**
   * Display the specified resource.
   */
  public function show(Post $post) : PostResource
  {
    $this->checkPermission(EPermissions::P_POST_SHOW);
    return (new PostResource($this->loadRelationships($post)))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Post $post): PostResource
  {
    $this->checkPermission(EPermissions::P_POST_UPDATE);
    $post->update(
      $request->validate([
        'type_code' => 'sometimes|string|max:255',
        'image' => 'nullable|string',
      ])
    );
    return (new PostResource($this->loadRelationships($post)))
      ->additional(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Post $post): JsonResponse
  {
    $this->checkPermission(EPermissions::P_POST_DESTROY);
    $post->delete();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}

