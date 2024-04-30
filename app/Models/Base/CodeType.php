<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CodeType extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['name', 'description', 'code'];

    public function codes(): HasMany
    {
      return $this->hasMany(Code::class, 'type_code', 'code');
    }

}
