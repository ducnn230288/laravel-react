<?php

namespace App\Models\Base;

use App\Observers\Base\CImageObserver;
use App\Services\Base\FileService;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[ObservedBy([CImageObserver::class])]
class Content extends Model
{
    use HasFactory, HasUuids;
  protected $fillable = ['type_code', 'name', 'image', 'order', 'is_disable'];
  protected FileService $fileService;
  protected function image(): Attribute
  {
    $this->fileService = new FileService();
    return Attribute::make(
      get: fn (?string $value) => $value ? $this->fileService->getAbsolutePath($value) : null,
      set: fn (?string $value) => $value ? $this->fileService->getRelativePath($value) : null,
    );
  }
  public function type(): BelongsTo
  {
    return $this->belongsTo(ContentType::class, 'type_code', 'code');
  }
  public function languages(): HasMany
  {
    return $this->hasMany(ContentLanguage::class);
  }
}
