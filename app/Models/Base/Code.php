<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Code extends Model
{
    use HasFactory, HasUuids;
    protected $fillable = ['name', 'description', 'code', 'type_code'];

    public function type(): BelongsTo
    {
      return $this->belongsTo(CodeType::class, 'type_code', 'code');
    }
}
