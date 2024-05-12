<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContentLanguage extends Model
{
  use HasFactory, HasUuids, SoftDeletes;
  protected $fillable = ['language', 'name', 'description', 'content', 'content_id'];

  public function content(): BelongsTo
  {
    return $this->belongsTo(Content::class);
  }
}
