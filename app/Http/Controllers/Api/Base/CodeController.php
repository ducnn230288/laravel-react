<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\Permissions;
use App\Http\Resources\Base\CodeResource;
use App\Http\Traits\CanCheckPermissionByRole;
use App\Http\Traits\CanLoadRelationships;
use App\Models\Base\Code;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class CodeController extends Controller implements HasMiddleware
{
  use CanLoadRelationships, CanCheckPermissionByRole;
  private array $relations = ['type'];

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
      $this->checkPermission(Permissions::P_CODE_INDEX);
      $query = $this->loadRelationships(Code::query());
      return CodeResource::collection($query->latest()->paginate());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): CodeResource
    {
      $this->checkPermission(Permissions::P_CODE_STORE);
      $event = Code::create([
        ...$request->validate([
          'name' => 'required|string|max:255',
          'type_code' => 'required|string|max:255',
          'code' => 'required|string|max:255|unique:codes',
          'description' => 'nullable|string',
        ]),
      ]);
      return new CodeResource($this->loadRelationships($event));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code) : CodeResource
    {
      $this->checkPermission(Permissions::P_CODE_SHOW);
      return new CodeResource($this->loadRelationships(Code::query()->where('code', $code)->first()));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $code): CodeResource
    {
      $this->checkPermission(Permissions::P_CODE_UPDATE);
      $code = Code::query()->where('code', $code)->first();
      $code->update(
        $request->validate([
          'name' => 'sometimes|string|max:255',
          'description' => 'nullable|string',
        ])
      );
      return new CodeResource($this->loadRelationships($code));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $code): JsonResponse
    {
      $this->checkPermission(Permissions::P_CODE_DESTROY);
      Code::query()->where('code', $code)->delete();
      return response()->json([
        'message' => 'Code deleted successfully'
      ]);
    }
}
