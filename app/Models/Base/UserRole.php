<?php

namespace App\Models\Base;

use App\Casts\Json;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserRole extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
  protected $fillable = ['name', 'description', 'code', 'permissions'];

  protected $casts = [
    'permissions' => Json::class,
  ];

  protected $attributes = [
    'permissions' => [],
  ];

  public function users(): HasMany
  {
    return $this->hasMany(User::class, 'role_code', 'code');
  }
}
