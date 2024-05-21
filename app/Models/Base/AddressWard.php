<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AddressWard extends Model
{
    use HasFactory, HasUuids;

  protected $fillable = ['name', 'description', 'code', 'district_code', 'is_disable'];
  protected static function boot(): void
  {
    parent::boot();
    self::updating(function ($data) {
      if (isset($data['is_disable'])) {
        $data['disabled_at'] = $data['is_disable'] ? now() : null;
        unset($data['is_disable']);
      }
    });
  }
  public function district(): BelongsTo
  {
    return $this->belongsTo(AddressDistrict::class, 'district_code', 'code');
  }
}
