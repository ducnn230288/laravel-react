<?php

namespace App\Observers\Base;

use App\Models\Base\Post;
use App\Services\FileService;

class PostObserver
{
  protected FileService $fileService;
  public function __construct(FileService $fileService)
  {
    $this->fileService = $fileService;
  }
  public function created(Post $post): void
  {
    if (isset($post['image'])) $this->fileService->active($post['image'], true);
  }
  public function updating(Post $post): void
  {
    if (isset($post['disabled_at'])) $post['disabled_at'] = $post['disabled_at'] ? now() : null;
  }
  public function updated(Post $post): void
  {
    $oldImage = $post->getOriginal('image');
    if ($oldImage && $oldImage !== $post['image']) $this->fileService->destroy($oldImage);
    if (isset($post['image'])) $this->fileService->active($post['image'], true);
  }
    public function deleted(Post $post): void
    {
      if (isset($post['image'])) $this->fileService->destroy($post['image']);
    }
}
