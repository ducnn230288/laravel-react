<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PostType extends Model
{
  use HasFactory, HasUuids;
  protected $fillable = ['code', 'name', 'description'];

  public function posts(): HasMany
  {
    return $this->hasMany(Post::class, 'type_code', 'code');
  }
}
