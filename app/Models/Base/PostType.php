<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PostType extends Model
{
  use HasFactory, HasUuids;
  protected $fillable = ['code', 'name', 'description', 'post_type_id', 'disabled_at'];
  protected static function boot(): void
  {
    parent::boot();
    self::updating(function ($data) {
      if (isset($data['disabled_at'])) $data['disabled_at'] = $data['disabled_at'] ? now() : null;
    });
  }
  public function posts(): HasMany
  {
    return $this->hasMany(Post::class, 'type_code', 'code');
  }

  public function children(): HasMany
  {
    return $this->hasMany(PostType::class)->with(['children' => function ($query) {
      $query->withCount('posts');
    }]);
  }
}
