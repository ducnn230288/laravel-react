<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Resources\Base\FileResource;
use App\Models\Base\File;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class FileController extends Controller implements HasMiddleware
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
      $this->checkPermission(EPermissions::P_FILE_INDEX);
      $query = $this->loadRelationships(File::query());
      return FileResource::collection($query->latest()->paginate());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): FileResource
    {
      $this->checkPermission(EPermissions::P_FILE_STORE);
      $userId = $request->user()->id;
      $path = $request->file('file')->store($userId);

      $event = File::create([
        'path' => $path,
        'user_id' => $userId
      ]);
      return new FileResource($this->loadRelationships($event));
    }

    /**
     * Display the specified resource.
     */
    public function show(File $file): FileResource
    {
      $this->checkPermission(EPermissions::P_FILE_SHOW);
      return new FileResource($this->loadRelationships($file));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, File $file): FileResource
    {
      $this->checkPermission(EPermissions::P_FILE_UPDATE);
      $file->update(
        $request->validate([
          'description' => 'nullable|string',
          'is_active' => 'sometimes',
        ])
      );
      return new FileResource($this->loadRelationships($file));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(File $file): JsonResponse
    {
      $this->checkPermission(EPermissions::P_FILE_DESTROY);
      $file->delete();
      return response()->json([
        'message' => 'File deleted successfully'
      ]);
    }
}
