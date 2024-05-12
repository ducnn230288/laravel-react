<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AddressWard extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

  protected $fillable = ['name', 'description', 'code', 'district_code', 'disabled_at'];
  protected static function boot(): void
  {
    parent::boot();
    self::updating(function ($data) {
      if (isset($data['disabled_at'])) $data['disabled_at'] = $data['disabled_at'] ? now() : null;
    });
  }
  public function district(): BelongsTo
  {
    return $this->belongsTo(AddressDistrict::class, 'district_code', 'code');
  }
}
