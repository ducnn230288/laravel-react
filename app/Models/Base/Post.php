<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
  use HasFactory, HasUuids, SoftDeletes;
  protected $fillable = ['type_code', 'image', 'created_at', 'disabled_at'];
  protected static function boot(): void
  {
    parent::boot();
    self::updating(function ($data) {
      if (isset($data['disabled_at'])) $data['disabled_at'] = $data['disabled_at'] ? now() : null;
    });
  }
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
