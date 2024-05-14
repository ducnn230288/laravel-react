<?php

namespace App\Observers\Base;

use App\Models\Base\PostLanguage;
use App\Services\Base\FileService;

class CContentObserver
{
  protected FileService $fileService;
  public function __construct(FileService $fileService)
  {
    $this->fileService = $fileService;
  }

  public function created($postLanguage): void
  {
    $postLanguage['content'] = $this->fileService->convertSrcImage(
      value: $postLanguage['content'],
      callback: fn ($path) => $this->fileService->active($path, true)
    );
  }

    /**
     * Handle the PostLanguage "updated" event.
     */
    public function updated($postLanguage): void
    {
      $oldImages = $this->fileService->getSrcImages($postLanguage->getOriginal('content'));
      $postLanguage['content'] = $this->fileService->convertSrcImage(
        value: $postLanguage['content'],
        callback: function ($path) use ($oldImages) {
          if (($key = array_search($path, $oldImages)) !== false)
            unset($oldImages[$key]);
          $this->fileService->active($path, true);
        }
      );
      foreach ($oldImages as $oldImage) $this->fileService->destroy($oldImage);
    }

    /**
     * Handle the PostLanguage "deleted" event.
     */
    public function deleted($postLanguage): void
    {
      $oldImages = $this->fileService->getSrcImages($postLanguage['content']);
      foreach ($oldImages as $oldImage) $this->fileService->destroy($oldImage);
    }
}
