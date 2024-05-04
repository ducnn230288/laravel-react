<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AddressDistrict extends Model
{
    use HasFactory, HasUuids;

  protected $fillable = ['name', 'description', 'code', 'province_code'];

  public function wards(): HasMany
  {
    return $this->hasMany(AddressWard::class, 'district_code', 'code');
  }

  public function province(): BelongsTo
  {
    return $this->belongsTo(AddressProvince::class, 'province_code', 'code');
  }
}
