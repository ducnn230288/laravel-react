<?php

namespace Base;

use App\Models\Base\Code;
use App\Models\Base\CodeType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\Role;
use Tests\TestCase;

class CodeTest extends TestCase
{
  use WithFaker, RefreshDatabase;

  public function test_code_super_admin()
  {
    $this->code(Role::SUPER_ADMIN);
  }

  public function test_code_admin()
  {
    $this->code(Role::ADMIN);
  }

  public function test_code_user()
  {
    $this->code(Role::USER);
  }

  public function code(Role $role): void
  {
    $this->signIn($role);

    $data = CodeType::factory()->raw();
    $this->post('/api/codes/types/', $data)->assertStatus($role !== Role::USER ? 201 : 403);
    if ($role !== Role::USER) $this->assertDatabaseHas('code_types', $data);

    $res = $this->get('/api/codes/types/')->assertStatus($role !== Role::USER ? 200 : 403);
    if ($role !== Role::USER) {
      $this->assertCount(1, $res['data']);
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data'][0][$key]);
      }
    }

    $data = CodeType::factory()->raw(['code' => $data['code']]);
    $this->put('/api/codes/types/' . $data['code'], $data)->assertStatus($role !== Role::USER ? 200 : 403);
    if ($role !== Role::USER) $this->assertDatabaseHas('code_types', $data);

    $code = Code::factory()->raw(['type_code' => $data['code']]);
    $this->post('/api/codes/', $code)->assertStatus($role !== Role::USER ? 201 : 403);
    if ($role !== Role::USER) $this->assertDatabaseHas('codes', $code);

    $res = $this->get('/api/codes/')->assertStatus($role !== Role::USER ? 200 : 403);
    if ($role !== Role::USER) {
      $this->assertCount(1, $res['data']);
      foreach($code as $key=>$value) {
        $this->assertEquals($value, $res['data'][0][$key]);
      }
    }

    $res = $this->get('/api/codes/'. $code['code']. '?include=type')->assertStatus($role !== Role::USER ? 200 : 403);
    if ($role !== Role::USER) {
      foreach($code as $key=>$value) {
        $this->assertEquals($value, $res['data'][$key]);
      }
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data']['type'][$key]);
      }
    }

    $code = Code::factory()->raw(['code' => $code['code'], 'type_code' => $data['code']]);
    $this->put('/api/codes/' . $code['code'], $code)->assertStatus($role !== Role::USER ? 200 : 403);
    if ($role !== Role::USER) $this->assertDatabaseHas('codes', $code);

    $res = $this->get('/api/codes/types/'. $data['code'] . '?include=codes')->assertStatus($role !== Role::USER ? 200 : 403);
    if ($role !== Role::USER) {
      foreach($code as $key=>$value) {
        $this->assertEquals($value, $res['data']['codes'][0][$key]);
      }
    }

    $this->delete('/api/codes/' . $code['code'])->assertStatus($role !== Role::USER ? 200 : 403);
    if ($role !== Role::USER) $this->assertDatabaseMissing('codes', $code);

    $this->delete('/api/codes/types/' . $data['code'])->assertStatus($role !== Role::USER ? 200 : 403);
    if ($role !== Role::USER) $this->assertDatabaseMissing('code_types', $data);
  }
}
