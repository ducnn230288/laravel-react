<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Content extends Model
{
    use HasFactory, HasUuids;
  protected $fillable = ['type_code', 'name', 'image', 'order'];

  public function type(): BelongsTo
  {
    return $this->belongsTo(ContentType::class, 'type_code', 'code');
  }
}