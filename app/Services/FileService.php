<?php

namespace App\Services;

use App\Models\Base\File;
use Illuminate\Support\Facades\Storage;

class FileService
{
  public function destroy(string $path): void
  {
    File::query()->where('path', $this->getPath($path))->first()->delete();
    $this->deleteFile($path);
  }

  public function active(string $path, bool $active): void
  {
    File::query()->where('path', $this->getPath($path))->first()->update(['is_active' => $active]);
  }

  /**
   * @param string $path
   * @return bool
   */
  public function checkMyStorage(string $path): bool
  {
    return str_starts_with($path, env('APP_URL', 'http://localhost'));
  }

  /**
   * @param string $path
   * @return string
   */
  public function getPath(string $path): string
  {
    if ($this->checkMyStorage($path)) $path = str_replace(env('APP_URL', 'http://localhost') . ':' . env('APP_PORT', '3000') . '/storage/', '', $path);
    return $path;
  }

  /**
   * @param string $path
   * @return void
   */
  public function deleteFile(string $path): void
  {
    if ($this->checkMyStorage($path)) Storage::delete($this->getPath($path));
  }
}
