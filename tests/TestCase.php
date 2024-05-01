<?php

namespace Tests;

use App\Http\Enums\Permissions;
use App\Models\Base\User;
use App\Models\Base\UserRole;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
  protected function signIn(Role $role, $permissions = [])
  {
    switch ($role) {
      case Role::SUPER_ADMIN:
        UserRole::factory()->create(['name' => 'Super Admin', 'code' => 'SUPER-ADMIN', 'is_system_admin' => true, 'permissions' => []]);
        $user = User::factory()->create(['role_code' => 'SUPER-ADMIN', 'email' => 'super-admin@gmail.com']);
        $this->actingAs($user);
        return $user;
      case Role::ADMIN:
        UserRole::factory()->create(['name' => 'Admin', 'code' => 'ADMIN', 'is_system_admin' => false, 'permissions' => Permissions::values()]);
        $user = User::factory()->create(['role_code' => 'ADMIN', 'email' => 'admin@gmail.com']);
        $this->actingAs($user);
        return $user;
      case Role::USER:
        $user = User::factory()->create();
        $this->actingAs($user);
        return $user;
    }
  }
}
enum Role: string
{
  case ADMIN = 'ADMIN';
  case SUPER_ADMIN = 'SUPER-ADMIN';
  case USER = 'USER';
}
