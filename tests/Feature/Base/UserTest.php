<?php

namespace Tests\Feature\Base;

use App\Models\Base\User;
use App\Models\Base\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserTest extends TestCase
{
  use WithFaker, RefreshDatabase;
  /**
   * A basic feature test example.
   */
  public function test_create_user(): void
  {
    $this->withoutExceptionHandling();
    $data = UserRole::factory()->raw();
    $this->post('/api/users/roles/', $data)->assertStatus(201);
    $this->assertDatabaseHas('user_roles', [...$data, 'permissions' => json_encode($data['permissions'])]);

    $res = $this->get('/api/users/roles/')->assertStatus(200);
    $this->assertCount(1, $res['data']);
    foreach($data as $key=>$value) {
      $this->assertEquals($value, $res['data'][0][$key]);
    }

    $data = UserRole::factory()->raw(['code' => $data['code']]);
    $this->put('/api/users/roles/' . $data['code'], $data)->assertStatus(200);
    $this->assertDatabaseHas('user_roles', [...$data, 'permissions' => json_encode($data['permissions'])]);

    $user = User::factory()->raw(['role_code' => $data['code']]);
    $this->post('/api/users/', $user)->assertStatus(201);
    unset($user['password']);
    $this->assertDatabaseHas('users', $user);

    $res = $this->get('/api/users/')->assertStatus(200);
    $this->assertCount(1, $res['data']);
    foreach($user as $key=>$value) {
      $this->assertEquals($value, $res['data'][0][$key]);
    }
    $id = $res['data'][0]['id'];

    $res = $this->get('/api/users/'. $id. '?include=role')->assertStatus(200);
    foreach($user as $key=>$value) {
      $this->assertEquals($value, $res['data'][$key]);
    }
    foreach($data as $key=>$value) {
      $this->assertEquals($value, $res['data']['role'][$key]);
    }

    $user = User::factory()->raw(['role_code' => $data['code']]);
    $this->put('/api/users/' . $id, $user)->assertStatus(200);
    unset($user['password']);
    $this->assertDatabaseHas('users', $user);

    $res = $this->get('/api/users/roles/'. $data['code'] . '?include=users')->assertStatus(200);
    foreach($user as $key=>$value) {
      $this->assertEquals($value, $res['data']['users'][0][$key]);
    }

    $this->delete('/api/users/' . $id)->assertStatus(200);
    $this->assertDatabaseMissing('users', $user);

    $this->delete('/api/users/roles/' . $data['code'])->assertStatus(200);
    $this->assertDatabaseMissing('user_roles', $data);
  }
}
