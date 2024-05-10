<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreCodeRequest;
use App\Http\Requests\Base\UpdateCodeRequest;
use App\Http\Resources\Base\CodeResource;
use App\Models\Base\Code;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class CodeController extends Controller implements HasMiddleware
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
      Gate::authorize(EPermissions::P_CODE_INDEX->name);
      return CodeResource::collection($this->loadRelationships(Code::query())->latest()->paginate())
        ->additional(['message' => __('messages.Get List Success')]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCodeRequest $request): CodeResource
    {
      Gate::authorize(EPermissions::P_CODE_STORE->name);
      $data = Code::create([...$request->validated()]);
      return (new CodeResource($this->loadRelationships($data)))
        ->additional(['message' => __('messages.Create Success')]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code) : CodeResource
    {
      Gate::authorize(EPermissions::P_CODE_SHOW->name);
      return (new CodeResource($this->loadRelationships(Code::query()->where('code', $code)->first())))
        ->additional(['message' => __('messages.Get Detail Success')]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCodeRequest $request, string $code): CodeResource
    {
      Gate::authorize(EPermissions::P_CODE_UPDATE->name);
      $data = Code::query()->where('code', $code)->first();
      $data->update($request->validated());
      return (new CodeResource($this->loadRelationships($data)))
        ->additional(['message' => __('messages.Update Success')]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $code): JsonResponse
    {
      Gate::authorize(EPermissions::P_CODE_DESTROY->name);
      Code::query()->where('code', $code)->delete();
      return response()->json(['message' => __('messages.Delete Success')]);
    }
}
