<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ContentType extends Model
{
    use HasFactory, HasUuids;
  protected $fillable = ['code', 'name', 'description', 'disabled_at'];
  protected static function boot(): void
  {
    parent::boot();
    self::updating(function ($data) {
      if (isset($data['disabled_at'])) $data['disabled_at'] = $data['disabled_at'] ? now() : null;
    });
  }

  public function contents(): HasMany
  {
    return $this->hasMany(Content::class, 'type_code', 'code');
  }
}
