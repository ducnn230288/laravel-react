<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Resources\Base\CodeResource;
use App\Models\Base\Code;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

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
      $this->checkPermission(EPermissions::P_CODE_INDEX);
      return CodeResource::collection($this->loadRelationships(Code::query())->latest()->paginate())
        ->additional(['message' => __('messages.Get List Success')]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): CodeResource
    {
      $this->checkPermission(EPermissions::P_CODE_STORE);
      $data = Code::create([
        ...$request->validate([
          'name' => 'required|string|max:255',
          'type_code' => 'required|string|max:255',
          'code' => 'required|string|max:255|unique:codes',
          'description' => 'nullable|string',
        ]),
      ]);
      return (new CodeResource($this->loadRelationships($data)))
        ->additional(['message' => __('messages.Create Success')]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code) : CodeResource
    {
      $this->checkPermission(EPermissions::P_CODE_SHOW);
      return (new CodeResource($this->loadRelationships(Code::query()->where('code', $code)->first())))
        ->additional(['message' => __('messages.Get Detail Success')]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $code): CodeResource
    {
      $this->checkPermission(EPermissions::P_CODE_UPDATE);
      $data = Code::query()->where('code', $code)->first();
      $data->update(
        $request->validate([
          'name' => 'sometimes|string|max:255',
          'description' => 'nullable|string',
        ])
      );
      return (new CodeResource($this->loadRelationships($data)))
        ->additional(['message' => __('messages.Update Success')]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $code): JsonResponse
    {
      $this->checkPermission(EPermissions::P_CODE_DESTROY);
      Code::query()->where('code', $code)->delete();
      return response()->json(['message' => __('messages.Delete Success')]);
    }
}
