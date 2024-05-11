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
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['type', 'languages'];
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
    return PostResource::collection($this->filter(Post::query())->paginate(\request()->query('perPage')))
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StorePostRequest $request): PostResource
  {
    Gate::authorize(EPermissions::P_POST_STORE->name);
    $post = $this->savePost($request->validated());
    return (new PostResource($this->loadRelationships($post)))
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
    $this->updatePost($request->validated(), $post);
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
      foreach ($post->with('languages')->first()->languages as $language) {
        $language->delete();
      }
      $post->delete();
    });
    return response()->json(['message' => __('messages.Delete Success')]);
  }

  /**
   * @param mixed $data
   * @return mixed
   */
  public function savePost(mixed $data): mixed
  {
    return DB::transaction(function () use ($data) {
      $post = Post::create([...$data]);
      foreach ($data['languages'] as $language) {
        PostLanguage::create([...$language, 'post_id' => $post->id]);
      }
      return $post;
    });
  }

  /**
   * @param mixed $data
   * @param mixed $post
   * @return mixed
   */
  public function updatePost(mixed $data, mixed $post): mixed
  {
    return DB::transaction(function () use ($data, $post) {
      $post->update($data);
      if (isset($data['languages'])) {
        foreach ($data['languages'] as $language) {
          PostLanguage::find($language['id'])->update($language);
        }
      }
      return $post;
    });
  }
}

