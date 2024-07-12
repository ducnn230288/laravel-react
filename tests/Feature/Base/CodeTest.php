<?php

namespace Tests\Feature\Base;

use App\Http\Enums\EPermissions;
use App\Models\Base\Code;
use App\Models\Base\CodeType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
use Tests\ERole;
use Tests\TestCase;

class CodeTest extends CodeBase
{
  use WithFaker, RefreshDatabase;
  protected function setUp(): void
  {
    parent::setUp();
    $this->withoutMiddleware(\App\Http\Middleware\FrontendCaseMiddleware::class);
  }
  public function test_super_admin()
  {
    $this->base(ERole::SUPER_ADMIN);
  }
}
class CodeTestAdmin extends CodeBase
{
  use WithFaker, RefreshDatabase;
  protected function setUp(): void
  {
    parent::setUp();
    $this->withoutMiddleware(\App\Http\Middleware\FrontendCaseMiddleware::class);
  }
  public function test_admin()
  {
    $this->base(ERole::ADMIN, [
      EPermissions::P_CODE_TYPE_INDEX->value,
      EPermissions::P_CODE_TYPE_STORE->value,
      EPermissions::P_CODE_TYPE_SHOW->value,
      EPermissions::P_CODE_TYPE_UPDATE->value,
      EPermissions::P_CODE_TYPE_DESTROY->value,

      EPermissions::P_CODE_INDEX->value,
      EPermissions::P_CODE_STORE->value,
      EPermissions::P_CODE_SHOW->value,
      EPermissions::P_CODE_UPDATE->value,
      EPermissions::P_CODE_DESTROY->value,
    ]);
  }
}
class CodeTestUser extends CodeBase
{
  use WithFaker, RefreshDatabase;
  protected function setUp(): void
  {
    parent::setUp();
    $this->withoutMiddleware(\App\Http\Middleware\FrontendCaseMiddleware::class);
  }
  public function test_user()
  {
    $this->base(ERole::USER);
  }
}
class CodeBase extends TestCase {
  function base(ERole $eRole, $permissions = []): void
  {
    $auth = $this->signIn($eRole, $permissions);
    $type = CodeType::factory()->raw();
    $this->post('/api/codes/types/', $type)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('code_types', $type);

    $res = $this->get('/api/codes/types/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(2, $res['data']);
      foreach($type as $key=>$value) {
        $this->assertEquals($value, $res['data'][1][Str::camel($key)]);
      }
    }

    if ($eRole !== ERole::USER) {
      $this->assertFalse($res['data'][1][Str::camel('is_disable')]);
      $res = $this->put('/api/codes/types/' . $res['data'][1]['code'], ['is_disable' => true])->assertStatus($eRole !== ERole::USER ? 200 : 403);
      $this->assertTrue($res['data'][Str::camel('is_disable')]);
    }

    $type = CodeType::factory()->raw(['code' => $type['code']]);
    $this->put('/api/codes/types/' . $type['code'], $type)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('code_types', $type);

    $data = Code::factory()->raw(['type_code' => $type['code']]);
    $this->post('/api/codes/', $data)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('codes', $data);

    $res = $this->get('/api/codes/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(2, $res['data']);
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data'][1][Str::camel($key)]);
      }
    }

    $res = $this->get('/api/codes/'. $data['code']. '?include=type')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data'][Str::camel($key)]);
      }
      foreach($type as $key=>$value) {
        $this->assertEquals($value, $res['data']['type'][Str::camel($key)]);
      }
    }

    if ($eRole !== ERole::USER)
      $this->assertFalse($res['data'][Str::camel('is_disable')]);
    $res = $this->put('/api/codes/' . $data['code']. '?include=type', ['is_disable' => true])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER)
      $this->assertTrue($res['data'][Str::camel('is_disable')]);

    $data = Code::factory()->raw(['code' => $data['code'], 'type_code' => $type['code']]);
    $this->put('/api/codes/' . $data['code'], $data)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('codes', $data);

    $res = $this->get('/api/codes/types/'. $type['code'] . '?include=codes')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data']['codes'][0][Str::camel($key)]);
      }
    }

    $this->delete('/api/codes/' . $data['code'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('codes', $data);

    $this->delete('/api/codes/types/' . $type['code'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('code_types', $type);
  }
}
