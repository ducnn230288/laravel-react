<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Resources\Base\CodeTypeResource;
use App\Http\Traits\CanLoadRelationships;
use App\Models\Base\CodeType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CodeTypeController extends Controller
{
    use CanLoadRelationships;
    private array $relations = ['codes'];

    public function __construct()
    {
//      $this->middleware('auth:sanctum')->except(['show']);
//      $this->middleware('throttle:60,1')->only(['store','update','destroy']);
    }
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $query = $this->loadRelationships(CodeType::query());
        return CodeTypeResource::collection($query->latest()->paginate());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): CodeTypeResource
    {
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
      return new CodeTypeResource($this->loadRelationships(CodeType::query()->where('code', $code)->first()));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $code): CodeTypeResource
    {
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
      CodeType::query()->where('code', $code)->first()->delete();
      return response()->json([
        'message' => 'Code Type deleted successfully'
      ]);
    }
}
