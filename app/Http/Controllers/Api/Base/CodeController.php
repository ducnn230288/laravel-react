<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Resources\CodeResource;
use App\Http\Traits\CanLoadRelationships;
use App\Models\Base\Code;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CodeController extends Controller
{
  use CanLoadRelationships;
  private array $relations = ['type'];

  public function __construct()
  {
//    $this->middleware('auth:sanctum')->except(['index']);
//    $this->middleware('throttle:60,1')->only(['store','update','destroy']);
  }
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
      $query = $this->loadRelationships(Code::query());
      return CodeResource::collection($query->latest()->paginate());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): CodeResource
    {
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
      return new CodeResource($this->loadRelationships(Code::query()->where('code', $code)->first()));

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $code): CodeResource
    {
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
      Code::query()->where('code', $code)->delete();

      return response()->json([
        'message' => 'Code Type deleted successfully'
      ]);
    }
}
