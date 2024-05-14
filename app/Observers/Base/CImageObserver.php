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
  public function created($data): void
  {
    if (isset($data['image']) && !$this->fileService->isRelativePath($data['image'])) $this->fileService->active($data['image'], true);

  }
  public function updating($data): void
  {
    if (isset($data['disabled_at'])) $data['disabled_at'] = $data['disabled_at'] ? now() : null;
  }
  public function updated($data): void
  {
    $oldImage = $data->getOriginal('image');
    if ($oldImage && $oldImage !== $data['image']) $this->fileService->destroy($oldImage);
    if (isset($data['image']) && !$this->fileService->isRelativePath($data['image'])) $this->fileService->active($data['image'], true);
  }
    public function deleted($data): void
    {
      if (isset($data['image'])) $this->fileService->destroy($data['image']);
    }
}
