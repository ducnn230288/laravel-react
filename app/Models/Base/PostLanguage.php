<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PostLanguage extends Model
{
  use HasFactory, HasUuids, SoftDeletes;
  protected $fillable = ['language', 'name', 'description', 'slug', 'content', 'post_id'];
  public function post(): BelongsTo
  {
    return $this->belongsTo(Post::class);
  }
}
