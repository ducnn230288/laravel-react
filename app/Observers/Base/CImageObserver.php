<?php

namespace App\Observers\Base;

use App\Services\Base\FileService;

class CImageObserver
{
  protected FileService $fileService;
  public function __construct(FileService $fileService)
  {
    $this->fileService = $fileService;
  }
  public function created(mixed $data): void
  {
    if (isset($data['image']) && $this->fileService->isRelativePath($data['image'])) {
      $this->fileService->active($data['image'], true);
    }
  }
  public function updating(mixed $data): void
  {
    if (isset($data['is_disable'])) {
      $data['disabled_at'] = $data['is_disable'] ? now() : null;
      unset($data['is_disable']);
    }
  }
  public function updated(mixed $data): void
  {
    $oldImage = $data->getOriginal('image');
    if ($oldImage && $oldImage !== $data['image']) {
      $this->fileService->destroy($oldImage);
    }
    if (isset($data['image']) && $this->fileService->isRelativePath($data['image'])) {
      $this->fileService->active($data['image'], true);
    }
  }
  public function deleted(mixed $data): void
  {
    if (isset($data['image'])) {
      $this->fileService->destroy($data['image']);
    }
  }
}
