<?php

namespace Tests\Feature\Base;

use App\Models\Base\User;
use App\Models\Base\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\Role;
use Tests\TestCase;

class UserTest extends TestCase
{
  use WithFaker, RefreshDatabase;
  public function test_user_super_admin()
  {
    $this->user(Role::SUPER_ADMIN);
  }

  public function test_user_admin()
  {
    $this->user(Role::ADMIN);
  }

  public function test_user_user()
  {
    $this->user(Role::USER);
  }

  public function user(Role $role): void
  {
    $auth = $this->signIn($role);
    $data = UserRole::factory()->raw();
    $this->post('/api/users/roles/', $data)->assertStatus($role !== Role::USER ? 201 : 403);
    if ($role !== Role::USER) $this->assertDatabaseHas('user_roles', [...$data, 'permissions' => json_encode($data['permissions'])]);

    $res = $this->get('/api/users/roles/')->assertStatus($role !== Role::USER ? 200 : 403);
    if ($role !== Role::USER) {
      $this->assertCount(2, $res['data']);
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data'][1][$key]);
      }
    }

    $data = UserRole::factory()->raw(['code' => $data['code']]);
    $this->put('/api/users/roles/' . $data['code'], $data)->assertStatus($role !== Role::USER ? 200 : 403);
    if ($role !== Role::USER) $this->assertDatabaseHas('user_roles', [...$data, 'permissions' => json_encode($data['permissions'])]);

    $user = User::factory()->raw(['role_code' => $data['code']]);
    $this->post('/api/users/', $user)->assertStatus($role !== Role::USER ? 201 : 403);
    unset($user['password']);
    if ($role !== Role::USER) $this->assertDatabaseHas('users', $user);

    $res = $this->get('/api/users/')->assertStatus($role !== Role::USER ? 200 : 403);
    if ($role !== Role::USER) {
      $this->assertCount(2, $res['data']);
      foreach($user as $key=>$value) {
        $this->assertEquals($value, $res['data'][1][$key]);
      }
    }

    $id = $role !== Role::USER ? $res['data'][1]['id'] : $auth['id'];

    $res = $this->get('/api/users/'. $id. '?include=role')->assertStatus($role !== Role::USER ? 200 : 403);
    if ($role !== Role::USER) {
      foreach($user as $key=>$value) {
        $this->assertEquals($value, $res['data'][$key]);
      }
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data']['role'][$key]);
      }
    }

    $user = User::factory()->raw(['role_code' => $data['code']]);
    $this->put('/api/users/' . $id, $user)->assertStatus($role !== Role::USER ? 200 : 403);
    unset($user['password']);
    if ($role !== Role::USER) $this->assertDatabaseHas('users', $user);

    $res = $this->get('/api/users/roles/'. $data['code'] . '?include=users')->assertStatus($role !== Role::USER ? 200 : 403);
    if ($role !== Role::USER) {
      foreach($user as $key=>$value) {
        $this->assertEquals($value, $res['data']['users'][0][$key]);
      }
    }

    $this->delete('/api/users/' . $id)->assertStatus($role !== Role::USER ? 200 : 403);
    if ($role !== Role::USER) $this->assertDatabaseMissing('users', $user);

    $this->delete('/api/users/roles/' . $data['code'])->assertStatus($role !== Role::USER ? 200 : 403);
    if ($role !== Role::USER) $this->assertDatabaseMissing('user_roles', $data);
  }
}
