<?php

namespace Tests\Feature\Base;

use App\Http\Enums\EPermissions;
use App\Models\Base\User;
use App\Models\Base\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\ERole;
use Tests\TestCase;

class UserTest extends TestCase
{
  use WithFaker, RefreshDatabase;

  public function test_super_admin()
  {
    $this->base(ERole::SUPER_ADMIN);
  }

  public function test_admin()
  {
    $this->base(ERole::ADMIN, [
      EPermissions::P_USER_ROLE_INDEX->value,
      EPermissions::P_USER_ROLE_STORE->value,
      EPermissions::P_USER_ROLE_SHOW->value,
      EPermissions::P_USER_ROLE_UPDATE->value,
      EPermissions::P_USER_ROLE_DESTROY->value,

      EPermissions::P_USER_INDEX->value,
      EPermissions::P_USER_STORE->value,
      EPermissions::P_USER_SHOW->value,
      EPermissions::P_USER_UPDATE->value,
      EPermissions::P_USER_DESTROY->value,
    ]);
  }

  public function test_user()
  {
    $this->base(ERole::USER);
  }

  private function base(ERole $eRole, $permissions = []): void
  {
    $auth = $this->signIn($eRole, $permissions);
    $role = UserRole::factory()->raw();
    $this->post('/api/users/roles/', $role)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('user_roles', [...$role, 'permissions' => json_encode($role['permissions'])]);

    $res = $this->get('/api/users/roles/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(2, $res['data']);
      foreach($role as $key=>$value) {
        $this->assertEquals($value, $res['data'][1][$key]);
      }
    }

    $role = UserRole::factory()->raw(['code' => $role['code']]);
    $this->put('/api/users/roles/' . $role['code'], $role)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('user_roles', [...$role, 'permissions' => json_encode($role['permissions'])]);

    $data = User::factory()->raw(['role_code' => $role['code']]);
    $this->post('/api/users/', $data)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    unset($data['password']);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('users', $data);

    $res = $this->get('/api/users/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(2, $res['data']);
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data'][1][$key]);
      }
    }

    $id = $eRole !== ERole::USER ? $res['data'][1]['id'] : $auth['id'];

    $res = $this->get('/api/users/'. $id. '?include=role')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data'][$key]);
      }
      foreach($role as $key=>$value) {
        $this->assertEquals($value, $res['data']['role'][$key]);
      }
    }

    $data = User::factory()->raw(['role_code' => $role['code']]);
    $this->put('/api/users/' . $id, $data)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    unset($data['password']);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('users', $data);

    $res = $this->get('/api/users/roles/'. $role['code'] . '?include=users')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data']['users'][0][$key]);
      }
    }

    $this->delete('/api/users/' . $id)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('users', $data);

    $this->delete('/api/users/roles/' . $role['code'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('user_roles', $role);
  }
}
