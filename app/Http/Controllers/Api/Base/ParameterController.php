<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Resources\Base\ParameterResource;
use App\Models\Base\Parameter;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Symfony\Component\HttpFoundation\JsonResponse;

class ParameterController extends Controller implements HasMiddleware
{
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
    $this->checkPermission(EPermissions::P_PARAMETER_INDEX);
    $query = $this->loadRelationships(Parameter::query());
    return ParameterResource::collection($query->latest()->paginate());
  }

    /**
     * Store a newly created resource in storage.
     */
  public function store(Request $request): ParameterResource
  {
    $this->checkPermission(EPermissions::P_PARAMETER_STORE);
    $event = Parameter::create([
      ...$request->validate([
        'name' => 'required|string|max:255',
        'code' => 'required|string|max:255|unique:parameters',
        'vn' => 'nullable|string',
        'en' => 'nullable|string',
      ]),
    ]);
    return new ParameterResource($this->loadRelationships($event));
  }

  /**
   * Display the specified resource.
   */
  public function show(string $code) : ParameterResource
  {
    $this->checkPermission(EPermissions::P_PARAMETER_SHOW);
    return new ParameterResource($this->loadRelationships(Parameter::query()->where('code', $code)->first()));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, string $code): ParameterResource
  {
    $this->checkPermission(EPermissions::P_PARAMETER_UPDATE);
    $code = Parameter::query()->where('code', $code)->first();
    $code->update(
      $request->validate([
        'name' => 'sometimes|string|max:255',
        'vn' => 'nullable|string',
        'en' => 'nullable|string',
      ])
    );
    return new ParameterResource($this->loadRelationships($code));
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $code): JsonResponse
  {
    $this->checkPermission(EPermissions::P_PARAMETER_DESTROY);
    Parameter::query()->where('code', $code)->delete();
    return response()->json([
      'message' => 'Parameter deleted successfully'
    ]);
  }
}
