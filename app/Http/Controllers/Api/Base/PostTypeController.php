<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Resources\Base\PostTypeResource;
use App\Models\Base\PostType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PostTypeController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['posts'];
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
    $this->checkPermission(EPermissions::P_POST_TYPE_INDEX);
    return PostTypeResource::collection($this->loadRelationships(PostType::query())->latest()->paginate());
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request): PostTypeResource
  {
    $this->checkPermission(EPermissions::P_POST_TYPE_STORE);
    $data = PostType::create([
      ...$request->validate([
        'name' => 'required|string|max:255',
        'code' => 'required|string|max:255|unique:code_types',
        'description' => 'nullable|string',
      ]),
    ]);
    return new PostTypeResource($this->loadRelationships($data));
  }

  /**
   * Display the specified resource.
   */
  public function show(string $code): PostTypeResource
  {
    $this->checkPermission(EPermissions::P_POST_TYPE_SHOW);
    return new PostTypeResource($this->loadRelationships(PostType::query()->where('code', $code)->first()));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, string $code): PostTypeResource
  {
    $this->checkPermission(EPermissions::P_POST_TYPE_UPDATE);
    $data = PostType::query()->where('code', $code)->first();
    $data->update(
      $request->validate([
        'name' => 'sometimes|string|max:255',
        'description' => 'nullable|string',
      ])
    );
    return new PostTypeResource($this->loadRelationships($data));
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $code): JsonResponse
  {
    $this->checkPermission(EPermissions::P_POST_TYPE_DESTROY);
    PostType::query()->where('code', $code)->first()->delete();
    return response()->json([
      'message' => 'Post Type deleted successfully'
    ]);
  }
}
