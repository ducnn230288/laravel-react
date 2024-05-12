<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CodeType extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = ['name', 'description', 'code', 'disabled_at'];
  protected static function boot(): void
  {
    parent::boot();
    self::updating(function ($data) {
      if (isset($data['disabled_at'])) $data['disabled_at'] = $data['disabled_at'] ? now() : null;
    });
  }
    public function codes(): HasMany
    {
      return $this->hasMany(Code::class, 'type_code', 'code');
    }

}
