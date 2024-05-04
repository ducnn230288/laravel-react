<?php

namespace Tests\Feature\Base;

use App\Http\Enums\EPermissions;
use App\Models\Base\Post;
use App\Models\Base\PostType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\ERole;
use Tests\TestCase;

class PostTest extends TestCase
{
  use WithFaker, RefreshDatabase;

  public function test_super_admin()
  {
    $this->base(ERole::SUPER_ADMIN);
  }

  public function test_admin()
  {
    $this->base(ERole::ADMIN, [
      EPermissions::P_POST_TYPE_INDEX->value,
      EPermissions::P_POST_TYPE_STORE->value,
      EPermissions::P_POST_TYPE_SHOW->value,
      EPermissions::P_POST_TYPE_UPDATE->value,
      EPermissions::P_POST_TYPE_DESTROY->value,

      EPermissions::P_POST_INDEX->value,
      EPermissions::P_POST_STORE->value,
      EPermissions::P_POST_SHOW->value,
      EPermissions::P_POST_UPDATE->value,
      EPermissions::P_POST_DESTROY->value,
    ]);
  }

  public function test_user()
  {
    $this->base(ERole::USER);
  }

  private function base(ERole $eRole, $permissions = []): void
  {
    $auth = $this->signIn($eRole, $permissions);
    $type = PostType::factory()->raw();
    $this->post('/api/posts/types/', $type)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('post_types', $type);

    $res = $this->get('/api/posts/types/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(1, $res['data']);
      foreach($type as $key=>$value) {
        $this->assertEquals($value, $res['data'][0][$key]);
      }
    }

    $type = PostType::factory()->raw(['code' => $type['code']]);
    $this->put('/api/posts/types/' . $type['code'], $type)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('post_types', $type);

    $data = Post::factory()->raw(['type_code' => $type['code']]);
    $this->post('/api/posts/', $data)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('posts', $data);

    $res = $this->get('/api/posts/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(1, $res['data']);
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data'][0][$key]);
      }
    }

    if ($eRole === ERole::USER) $data = Post::factory()->create()->getAttributes();
    $id = $eRole !== ERole::USER ? $res['data'][0]['id'] : $data['id'];
    $res = $this->get('/api/posts/'. $id. '?include=type')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data'][$key]);
      }
      foreach($type as $key=>$value) {
        $this->assertEquals($value, $res['data']['type'][$key]);
      }
    }

    $data = Post::factory()->raw(['type_code' => $type['code']]);
    $this->put('/api/posts/' . $id, $data)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('posts', $data);

    $res = $this->get('/api/posts/types/'. $type['code'] . '?include=posts')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data']['posts'][0][$key]);
      }
    }

    $this->delete('/api/posts/' . $id)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('posts', $data);

    $this->delete('/api/posts/types/' . $type['code'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('post_types', $type);
  }
}
