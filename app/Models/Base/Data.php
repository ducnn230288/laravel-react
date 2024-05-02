<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Data extends Model
{
    use HasFactory, HasUuids;
  protected $fillable = ['type_data', 'name', 'image', 'order'];

  public function type(): BelongsTo
  {
    return $this->belongsTo(DataType::class, 'data_code', 'code');
  }
}
