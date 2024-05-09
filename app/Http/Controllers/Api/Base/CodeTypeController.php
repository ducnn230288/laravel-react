<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Resources\Base\CodeTypeResource;
use App\Models\Base\CodeType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class CodeTypeController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['codes'];
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
      Gate::authorize(EPermissions::P_CODE_TYPE_INDEX->name);
        return CodeTypeResource::collection($this->loadRelationships(CodeType::query())->latest()->paginate())
          ->additional(['message' => __('messages.Get List Success')]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): CodeTypeResource
    {
      Gate::authorize(EPermissions::P_CODE_TYPE_STORE->name);
      $data = CodeType::create([
        ...$request->validate([
          'name' => 'required|string|max:255',
          'code' => 'required|string|max:255|unique:code_types',
          'description' => 'nullable|string',
        ]),
      ]);
      return (new CodeTypeResource($this->loadRelationships($data)))
        ->additional(['message' => __('messages.Create Success')]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code): CodeTypeResource
    {
      Gate::authorize(EPermissions::P_CODE_TYPE_SHOW->name);
      return (new CodeTypeResource($this->loadRelationships(CodeType::query()->where('code', $code)->first())))
        ->additional(['message' => __('messages.Get Detail Success')]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $code): CodeTypeResource
    {
      Gate::authorize(EPermissions::P_CODE_TYPE_UPDATE->name);
      $data = CodeType::query()->where('code', $code)->first();
      $data->update(
        $request->validate([
          'name' => 'sometimes|string|max:255',
          'description' => 'nullable|string',
        ])
      );
      return (new CodeTypeResource($this->loadRelationships($data)))
        ->additional(['message' => __('messages.Update Success')]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $code): JsonResponse
    {
      Gate::authorize(EPermissions::P_CODE_TYPE_DESTROY->name);
      CodeType::query()->where('code', $code)->first()->delete();
      return response()->json(['message' => __('messages.Delete Success')]);
    }
}
