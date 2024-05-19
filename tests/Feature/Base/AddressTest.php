<?php

namespace Tests\Feature\Base;

use App\Http\Enums\EPermissions;
use App\Models\Base\Address;
use App\Models\Base\AddressDistrict;
use App\Models\Base\AddressProvince;
use App\Models\Base\AddressWard;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
use Tests\ERole;
use Tests\TestCase;

class AddressTest extends TestCase
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
      EPermissions::P_ADDRESS_PROVINCE_INDEX->value,
      EPermissions::P_ADDRESS_PROVINCE_STORE->value,
      EPermissions::P_ADDRESS_PROVINCE_SHOW->value,
      EPermissions::P_ADDRESS_PROVINCE_UPDATE->value,
      EPermissions::P_ADDRESS_PROVINCE_DESTROY->value,

      EPermissions::P_ADDRESS_DISTRICT_INDEX->value,
      EPermissions::P_ADDRESS_DISTRICT_STORE->value,
      EPermissions::P_ADDRESS_DISTRICT_SHOW->value,
      EPermissions::P_ADDRESS_DISTRICT_UPDATE->value,
      EPermissions::P_ADDRESS_DISTRICT_DESTROY->value,

      EPermissions::P_ADDRESS_WARD_INDEX->value,
      EPermissions::P_ADDRESS_WARD_STORE->value,
      EPermissions::P_ADDRESS_WARD_SHOW->value,
      EPermissions::P_ADDRESS_WARD_UPDATE->value,
      EPermissions::P_ADDRESS_WARD_DESTROY->value,

      EPermissions::P_ADDRESS_INDEX->value,
      EPermissions::P_ADDRESS_STORE->value,
      EPermissions::P_ADDRESS_SHOW->value,
      EPermissions::P_ADDRESS_UPDATE->value,
      EPermissions::P_ADDRESS_DESTROY->value,
    ]);
  }

  public function test_user()
  {
    $this->base(ERole::USER);
  }

  private function base(ERole $eRole, $permissions = []): void
  {
    $auth = $this->signIn($eRole, $permissions);
    $province = AddressProvince::factory()->raw();
    $this->post('/api/addresses/provinces/', $province)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('address_provinces', $province);

    $res = $this->get('/api/addresses/provinces/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(1, $res['data']);
      foreach($province as $key=>$value) {
        $this->assertEquals($value, $res['data'][0][$key]);
      }
    }

    if ($eRole !== ERole::USER) {
      $this->assertNull($res['data'][0][Str::camel('disabled_at')]);
      $res = $this->put('/api/addresses/provinces/' . $res['data'][0]['code'], ['disabled_at' => true])->assertStatus($eRole !== ERole::USER ? 200 : 403);
      $this->assertNotNull($res['data'][Str::camel('disabled_at')]);
    }

    $province = AddressProvince::factory()->raw(['code' => $province['code']]);
    $this->put('/api/addresses/provinces/' . $province['code'], $province)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('address_provinces', $province);

    $district = AddressDistrict::factory()->raw(['province_code' => $province['code']]);
    $this->post('/api/addresses/districts/', $district)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('address_districts', $district);

    $res = $this->get('/api/addresses/districts?include=province')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(1, $res['data']);

      foreach($district as $key=>$value) {
        $this->assertEquals($value, $res['data'][0][Str::camel($key)]);
      }
    }

    $res = $this->get('/api/addresses/districts/'. $district['code']. '?include=province')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($district as $key=>$value) {
        $this->assertEquals($value, $res['data'][Str::camel($key)]);
      }
      foreach($province as $key=>$value) {
        $this->assertEquals($value, $res['data']['province'][Str::camel($key)]);
      }
    }

    if ($eRole !== ERole::USER) $this->assertNull($res['data'][Str::camel('disabled_at')]);
    $res = $this->put('/api/addresses/districts/' . $district['code'], ['disabled_at' => true])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertNotNull($res['data'][Str::camel('disabled_at')]);

    $district = AddressDistrict::factory()->raw(['code' => $district['code'], 'province_code' => $province['code']]);
    $this->put('/api/addresses/districts/' . $district['code'], $district)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('address_districts', $district);

    $res = $this->get('/api/addresses/provinces/'. $province['code'] . '?include=districts')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($district as $key=>$value) {
        $this->assertEquals($value, $res['data']['districts'][0][Str::camel($key)]);
      }
    }

    $ward = AddressWard::factory()->raw(['district_code' => $district['code']]);
    $this->post('/api/addresses/wards/', $ward)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('address_wards', $ward);

    $res = $this->get('/api/addresses/wards/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(1, $res['data']);
      foreach($ward as $key=>$value) {
        $this->assertEquals($value, $res['data'][0][Str::camel($key)]);
      }
    }

    $res = $this->get('/api/addresses/wards/'. $ward['code']. '?include=district')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($ward as $key=>$value) {
        $this->assertEquals($value, $res['data'][Str::camel($key)]);
      }
      foreach($district as $key=>$value) {
        $this->assertEquals($value, $res['data']['district'][Str::camel($key)]);
      }
    }

    if ($eRole !== ERole::USER) $this->assertNull($res['data'][Str::camel('disabled_at')]);
    $res = $this->put('/api/addresses/wards/' . $ward['code'], ['disabled_at' => true])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertNotNull($res['data'][Str::camel('disabled_at')]);

    $ward = AddressWard::factory()->raw(['code' => $ward['code'], 'district_code' => $district['code']]);
    $this->put('/api/addresses/wards/' . $ward['code'], $ward)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('address_wards', $ward);

    $res = $this->get('/api/addresses/districts/'. $district['code'] . '?include=wards')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($ward as $key=>$value) {
        $this->assertEquals($value, $res['data']['wards'][0][Str::camel($key)]);
      }
    }

    $address = Address::factory()->raw(['user_id' => $auth['id'], 'province_code' => $province['code'], 'district_code' => $district['code'], 'ward_code' => $ward['code']]);
    $this->post('/api/addresses/', $address)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('addresses', $address);

    $res = $this->get('/api/addresses/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(1, $res['data']);
      foreach($address as $key=>$value) {
        $this->assertEquals($value, $res['data'][0][Str::camel($key)]);
      }
    }

    if ($eRole === ERole::USER) $address = Address::factory()->create(['user_id' => $auth['id']])->getAttributes();
    $id = $eRole !== ERole::USER ? $res['data'][0]['id'] : $address['id'];
    $this->put('/api/addresses/' . $id, $address)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('addresses', $address);

    $res = $this->get('/api/addresses/'. $id)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($address as $key=>$value) {
        $this->assertEquals($value, $res['data'][Str::camel($key)]);
      }
    }
    $this->delete('/api/addresses/' . $id)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('addresses', $address);

    $this->delete('/api/addresses/wards/' . $ward['code'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('address_wards', $ward);

    $this->delete('/api/addresses/districts/' . $district['code'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('address_districts', $district);

    $this->delete('/api/addresses/provinces/' . $province['code'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('address_provinces', $province);
  }
}
