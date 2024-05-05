<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Address extends Model
{
    use HasFactory, HasUuids;

  protected $fillable = ['address', 'province_code', 'district_code', 'ward_code', 'user_id'];

  public function province(): BelongsTo
  {
    return $this->belongsTo(AddressProvince::class, 'province_code', 'code');
  }

  public function district(): BelongsTo
  {
    return $this->belongsTo(AddressDistrict::class, 'district_code', 'code');
  }

  public function ward(): BelongsTo
  {
    return $this->belongsTo(AddressWard::class, 'ward_code', 'code');
  }

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }
}