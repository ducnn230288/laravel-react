<?php

namespace Tests\Feature\Base;

use App\Http\Enums\EPermissions;
use App\Models\Base\Content;
use App\Models\Base\ContentType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\ERole;
use Tests\TestCase;

class ContentTest extends TestCase
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
      EPermissions::P_CONTENT_TYPE_INDEX->value,
      EPermissions::P_CONTENT_TYPE_STORE->value,
      EPermissions::P_CONTENT_TYPE_SHOW->value,
      EPermissions::P_CONTENT_TYPE_UPDATE->value,
      EPermissions::P_CONTENT_TYPE_DESTROY->value,

      EPermissions::P_CONTENT_INDEX->value,
      EPermissions::P_CONTENT_STORE->value,
      EPermissions::P_CONTENT_SHOW->value,
      EPermissions::P_CONTENT_UPDATE->value,
      EPermissions::P_CONTENT_DESTROY->value,
    ]);
  }

  public function test_user()
  {
    $this->base(ERole::USER);
  }

  private function base(ERole $eRole, $permissions = []): void
  {
    $auth = $this->signIn($eRole, $permissions);
    $type = ContentType::factory()->raw();
    $this->post('/api/contents/types/', $type)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('content_types', $type);

    $res = $this->get('/api/contents/types/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(1, $res['data']);
      foreach($type as $key=>$value) {
        $this->assertEquals($value, $res['data'][0][$key]);
      }
    }

    $type = ContentType::factory()->raw(['code' => $type['code']]);
    $this->put('/api/contents/types/' . $type['code'], $type)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('content_types', $type);

    $data = Content::factory()->raw(['type_code' => $type['code']]);
    $this->post('/api/contents/', $data)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('contents', $data);

    $res = $this->get('/api/contents/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(1, $res['data']);
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data'][0][$key]);
      }
    }

    if ($eRole === ERole::USER) $data = Content::factory()->create()->getAttributes();
    $id = $eRole !== ERole::USER ? $res['data'][0]['id'] : $data['id'];
    $res = $this->get('/api/contents/'. $id. '?include=type')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data'][$key]);
      }
      foreach($type as $key=>$value) {
        $this->assertEquals($value, $res['data']['type'][$key]);
      }
    }

    $data = Content::factory()->raw(['type_code' => $type['code']]);
    $this->put('/api/contents/' . $id, $data)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('contents', $data);

    $res = $this->get('/api/contents/types/'. $type['code'] . '?include=contents')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data']['contents'][0][$key]);
      }
    }

    $this->delete('/api/contents/' . $id)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('contents', $data);

    $this->delete('/api/contents/types/' . $type['code'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('content_types', $type);
  }
}
