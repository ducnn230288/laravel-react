<?php

namespace App\Models\Base;

use App\Observers\Base\PostObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ObservedBy([PostObserver::class])]
class Post extends Model
{
  use HasFactory, HasUuids, SoftDeletes;
  protected $fillable = ['type_code', 'image', 'created_at', 'disabled_at'];
  public function type(): BelongsTo
  {
    return $this->belongsTo(PostType::class, 'type_code', 'code');
  }
  protected function image(): Attribute
  {
    return Attribute::make(
      get: fn (?string $value) => $value ? env('APP_URL', 'http://localhost').':'.env('APP_PORT', '3000').'/storage/' .$value : null,
      set: fn (?string $value) => str_replace(env('APP_URL', 'http://localhost').':'.env('APP_PORT', '3000').'/storage/', '', $value),
    );
  }
  public function languages(): HasMany
  {
    return $this->hasMany(PostLanguage::class);
  }
}
