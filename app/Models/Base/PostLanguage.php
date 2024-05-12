<?php

namespace App\Models\Base;

use App\Observers\Base\PostLanguageObserver;
use App\Services\FileService;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[ObservedBy([PostLanguageObserver::class])]
class PostLanguage extends Model
{
  use HasFactory, HasUuids;
  protected $fillable = ['language', 'name', 'description', 'slug', 'content', 'post_id'];
  protected FileService $fileService;
  protected function content(): Attribute
  {
    $this->fileService = new FileService();
    return Attribute::make(
      get: fn (?string $value) => $this->fileService->convertSrcImage(value: $value, isGetAbsolutePath: true),
      set: fn (?string $value) => $this->fileService->convertSrcImage(value: $value)
    );
  }
  public function post(): BelongsTo
  {
    return $this->belongsTo(Post::class);
  }
}
