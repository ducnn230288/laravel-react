<?php

namespace Tests\Feature\Base;

use App\Http\Enums\EPermissions;
use App\Models\Base\Parameter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
use Tests\ERole;
use Tests\TestCase;

class ParameterTest extends TestCase
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

  public function test_admin()
  {
    $this->base(ERole::ADMIN, [
      EPermissions::P_PARAMETER_INDEX->value,
      EPermissions::P_PARAMETER_STORE->value,
      EPermissions::P_PARAMETER_SHOW->value,
      EPermissions::P_PARAMETER_UPDATE->value,
      EPermissions::P_PARAMETER_DESTROY->value,
    ]);
  }

  public function test_user()
  {
    $this->base(ERole::USER);
  }

  private function base(ERole $eRole, $permissions = []): void
  {
    $auth = $this->signIn($eRole, $permissions);

    $data = Parameter::factory()->raw();
    $this->post('/api/parameters/', $data)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('parameters', $data);

    $res = $this->get('/api/parameters/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(1, $res['data']);
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data'][0][$key]);
      }
    }

    if ($eRole !== ERole::USER) $this->assertNull($res['data'][0][Str::camel('disabled_at')]);
    $res = $this->put('/api/parameters/' . $data['code'], ['disabled_at' => true])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertNotNull($res['data'][Str::camel('disabled_at')]);

    $data = Parameter::factory()->raw(['code' => $data['code']]);
    $this->put('/api/parameters/' . $data['code'], $data)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('parameters', $data);

    $res = $this->get('/api/parameters/'. $data['code'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data'][$key]);
      }
    }
    $this->delete('/api/parameters/' . $data['code'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('parameters', $data);
  }
}
