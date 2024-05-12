<?php

namespace App\Models\Base;

use App\Observers\Base\PostLanguageObserver;
use App\Services\Base\FileService;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[ObservedBy([PostLanguageObserver::class])]
class ContentLanguage extends Model
{
  use HasFactory, HasUuids;
  protected $fillable = ['language', 'name', 'description', 'content', 'content_id', 'disabled_at'];
  protected FileService $fileService;
  protected function content(): Attribute
  {
    $this->fileService = new FileService();
    return Attribute::make(
      get: fn (?string $value) => $this->fileService->convertSrcImage(value: $value, isGetAbsolutePath: true),
      set: fn (?string $value) => $this->fileService->convertSrcImage(value: $value)
    );
  }
  public function parent(): BelongsTo
  {
    return $this->belongsTo(Content::class);
  }
}
