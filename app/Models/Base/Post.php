<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
  use HasFactory, HasUuids;
  protected $fillable = ['type_code', 'image'];

  public function type(): BelongsTo
  {
    return $this->belongsTo(PostType::class, 'type_code', 'code');
  }

  public function languages(): HasMany
  {
    return $this->hasMany(PostLanguage::class);
  }
}
