<?php

namespace Tests\Feature\Base;

use App\Http\Enums\EPermissions;
use App\Models\Base\Data;
use App\Models\Base\DataType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\ERole;
use Tests\TestCase;

class DataTest extends TestCase
{
  use WithFaker, RefreshDatabase;

  public function test_super_admin()
  {
    $this->base(ERole::SUPER_ADMIN);
  }

  public function test_admin()
  {
    $this->base(ERole::ADMIN, [
      EPermissions::P_DATA_TYPE_INDEX->value,
      EPermissions::P_DATA_TYPE_STORE->value,
      EPermissions::P_DATA_TYPE_SHOW->value,
      EPermissions::P_DATA_TYPE_UPDATE->value,
      EPermissions::P_DATA_TYPE_DESTROY->value,

      EPermissions::P_DATA_INDEX->value,
      EPermissions::P_DATA_STORE->value,
      EPermissions::P_DATA_SHOW->value,
      EPermissions::P_DATA_UPDATE->value,
      EPermissions::P_DATA_DESTROY->value,
    ]);
  }

  public function test_user()
  {
    $this->base(ERole::USER);
  }

  private function base(ERole $eRole, $permissions = []): void
  {
    $auth = $this->signIn($eRole, $permissions);
    $type = DataType::factory()->raw();
    $this->post('/api/data/types/', $type)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('data_types', $type);

    $res = $this->get('/api/data/types/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(1, $res['data']);
      foreach($type as $key=>$value) {
        $this->assertEquals($value, $res['data'][0][$key]);
      }
    }

    $type = DataType::factory()->raw(['code' => $type['code']]);
    $this->put('/api/data/types/' . $type['code'], $type)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('data_types', $type);

    $data = Data::factory()->raw(['type_code' => $type['code']]);
    $this->post('/api/data/', $data)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('data', $data);

    $res = $this->get('/api/data/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(1, $res['data']);
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data'][0][$key]);
      }
    }
    $id = ERole::USER ? $res['data'][0]['id'] : $auth['id'];

    $res = $this->get('/api/data/'. $id. '?include=type')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data'][$key]);
      }
      foreach($type as $key=>$value) {
        $this->assertEquals($value, $res['data']['type'][$key]);
      }
    }

    $data = Data::factory()->raw(['type_code' => $type['code']]);
    $this->put('/api/data/' . $id, $data)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('data', $data);

    $res = $this->get('/api/data/types/'. $type['code'] . '?include=data')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data'][0][$key]);
      }
    }

    $this->delete('/api/data/' . $id)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('data', $data);

    $this->delete('/api/data/types/' . $type['code'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('data_types', $type);
  }
}
