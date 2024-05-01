<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\Permissions;
use App\Http\Resources\Base\CodeTypeResource;
use App\Http\Traits\CanCheckPermissionByRole;
use App\Http\Traits\CanLoadRelationships;
use App\Models\Base\CodeType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CodeTypeController extends Controller implements HasMiddleware
{
    use CanLoadRelationships, CanCheckPermissionByRole;
    private array $relations = ['codes'];

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
      $this->checkPermission(Permissions::P_CODE_TYPE_INDEX);
        $query = $this->loadRelationships(CodeType::query());
        return CodeTypeResource::collection($query->latest()->paginate());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): CodeTypeResource
    {
      $this->checkPermission(Permissions::P_CODE_TYPE_STORE);
      $event = CodeType::create([
        ...$request->validate([
          'name' => 'required|string|max:255',
          'code' => 'required|string|max:255|unique:code_types',
          'description' => 'nullable|string',
        ]),
      ]);
      return new CodeTypeResource($this->loadRelationships($event));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code): CodeTypeResource
    {
      $this->checkPermission(Permissions::P_CODE_TYPE_SHOW);
      return new CodeTypeResource($this->loadRelationships(CodeType::query()->where('code', $code)->first()));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $code): CodeTypeResource
    {
      $this->checkPermission(Permissions::P_CODE_TYPE_UPDATE);
      $codeType = CodeType::query()->where('code', $code)->first();
      $codeType->update(
        $request->validate([
          'name' => 'sometimes|string|max:255',
          'description' => 'nullable|string',
        ])
      );
      return new CodeTypeResource($this->loadRelationships($codeType));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $code): JsonResponse
    {
      $this->checkPermission(Permissions::P_CODE_TYPE_DESTROY);
      CodeType::query()->where('code', $code)->first()->delete();
      return response()->json([
        'message' => 'Code Type deleted successfully'
      ]);
    }
}
