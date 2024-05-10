<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostLanguage extends Model
{
  use HasFactory, HasUuids;
  protected $fillable = ['language', 'name', 'description', 'slug', 'content', 'post_id'];
  public function post(): BelongsTo
  {
    return $this->belongsTo(Post::class);
  }
}
