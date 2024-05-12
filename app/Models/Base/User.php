<?php

namespace App\Models\Base;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids;
    public static $snakeAttributes = true;
    protected static function boot(): void
    {
      parent::boot();
      self::updating(function ($data) {
        if (isset($data['disabled_at'])) $data['disabled_at'] = $data['disabled_at'] ? now() : null;
      });
    }

  /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'phone_number',
        'role_code',
        'position_code',
        'disabled_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

  public function role(): BelongsTo
  {
    return $this->belongsTo(UserRole::class, 'role_code', 'code');
  }

  public function position(): BelongsTo
  {
    return $this->belongsTo(Code::class, 'position_code', 'code');
  }
}
