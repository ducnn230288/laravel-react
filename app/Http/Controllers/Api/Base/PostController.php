<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StorePostRequest;
use App\Http\Requests\Base\UpdatePostRequest;
use App\Http\Resources\Base\PostResource;
use App\Models\Base\Post;
use App\Models\Base\PostLanguage;
use App\Services\Base\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller implements HasMiddleware
{
  protected PostService $postService;
  public function __construct(PostService $postService)
  {
    $this->relations = ['type', 'languages'];
    $this->fullTextSearch = ['languages.name', 'languages.slug', 'languages.description'];
    $this->postService = $postService;
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
    Gate::authorize(EPermissions::P_POST_INDEX->name);
    $perPage = intval(\request()->query('perPage'));
    return PostResource::collection($this->filter(Post::query())->paginate($perPage))
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StorePostRequest $request): PostResource
  {
    Gate::authorize(EPermissions::P_POST_STORE->name);
    $data = $this->postService->save($request->validated());
    return (new PostResource($this->loadRelationships($data)))
      ->additional(['message' => __('messages.Create Success')]);
  }

  /**
   * Display the specified resource.
   */
  public function show(Post $post) : PostResource
  {
    Gate::authorize(EPermissions::P_POST_SHOW->name);
    return (new PostResource($this->loadRelationships($post)))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdatePostRequest $request, Post $post): PostResource
  {
    Gate::authorize(EPermissions::P_POST_UPDATE->name);
    $this->postService->update($request->validated(), $post);
    return (new PostResource($this->loadRelationships($post)))
      ->additional(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Post $post): JsonResponse
  {
    Gate::authorize(EPermissions::P_POST_DESTROY->name);

    DB::transaction(function () use ($post) {
      $languages = PostLanguage::where('post_id', $post->id)->get();
      foreach ($languages as $language) {
        $language->delete();
      }
      $post->delete();
    });
    return response()->json(['message' => __('messages.Delete Success')]);
  }


}

