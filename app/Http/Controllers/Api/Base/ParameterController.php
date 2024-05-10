<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreParameterRequest;
use App\Http\Requests\Base\UpdateParameterRequest;
use App\Http\Resources\Base\ParameterResource;
use App\Models\Base\Parameter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class ParameterController extends Controller implements HasMiddleware
{
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
    Gate::authorize(EPermissions::P_PARAMETER_INDEX->name);
    return ParameterResource::collection($this->filter(Parameter::query())->paginate(\request()->query('perPage')))
      ->additional(['message' => __('messages.Get List Success')]);
  }

    /**
     * Store a newly created resource in storage.
     */
  public function store(StoreParameterRequest $request): ParameterResource
  {
    Gate::authorize(EPermissions::P_PARAMETER_STORE->name);
    $data = Parameter::create([...$request->validated()]);
    return (new ParameterResource($this->loadRelationships($data)))
      ->additional(['message' => __('messages.Create Success')]);
  }

  /**
   * Display the specified resource.
   */
  public function show(string $code) : ParameterResource
  {
    Gate::authorize(EPermissions::P_PARAMETER_SHOW->name);
    return (new ParameterResource($this->loadRelationships(Parameter::query()->where('code', $code)->first())))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateParameterRequest $request, string $code): ParameterResource
  {
    Gate::authorize(EPermissions::P_PARAMETER_UPDATE->name);
    $data = Parameter::query()->where('code', $code)->first();
    $data->update($request->validated());
    return (new ParameterResource($this->loadRelationships($data)))
      ->additional(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $code): JsonResponse
  {
    Gate::authorize(EPermissions::P_PARAMETER_DESTROY->name);
    Parameter::query()->where('code', $code)->delete();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}
