<?php

namespace App\Observers\Base;

use App\Services\Base\FileService;

class PostObserver
{
  protected FileService $fileService;
  public function __construct(FileService $fileService)
  {
    $this->fileService = $fileService;
  }
  public function created($post): void
  {
    if (isset($post['image'])) $this->fileService->active($post['image'], true);

  }
  public function updating($post): void
  {
    if (isset($post['disabled_at'])) $post['disabled_at'] = $post['disabled_at'] ? now() : null;
  }
  public function updated($post): void
  {
    $oldImage = $post->getOriginal('image');
    if ($oldImage && $oldImage !== $post['image']) $this->fileService->destroy($oldImage);
    if (isset($post['image'])) $this->fileService->active($post['image'], true);
  }
    public function deleted($post): void
    {
      if (isset($post['image'])) $this->fileService->destroy($post['image']);
    }
}
