<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DataType extends Model
{
    use HasFactory, HasUuids;
  protected $fillable = ['code', 'name', 'description'];

  public function data(): HasMany
  {
    return $this->hasMany(Data::class, 'data_code', 'code');
  }
}
