<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AddressProvince extends Model
{
    use HasFactory, HasUuids;

  protected $fillable = ['name', 'description', 'code'];

  public function districts(): HasMany
  {
    return $this->hasMany(AddressDistrict::class, 'province_code', 'code');
  }
}
