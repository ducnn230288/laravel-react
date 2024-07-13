<?php

namespace Tests\Feature\Base;

use App\Http\Enums\EPermissions;
use App\Models\Base\Post;
use App\Models\Base\PostLanguage;
use App\Models\Base\PostType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
use Tests\ERole;
use Tests\TestCase;

class PostTest extends TestCase
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
    $res = $this->post('/api/posts/types/', $type)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertDatabaseHas('post_types', $type);
      $type = $res['data'];
    }

    $res = $this->get('/api/posts/types/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(1, $res['data']);
      $check = false;
      foreach ($res['data'] as $item) {
        if ($item['id'] == $type['id']) {
          foreach($type as $key=>$value) {
            $check = true;
            $this->assertEquals($value, $item[Str::camel($key)]);
          }
        }
      }
      $this->assertTrue($check);
    }

    if ($eRole !== ERole::USER) {
      $this->assertFalse($res['data'][0][Str::camel('is_disable')]);
      $res = $this->put('/api/posts/types/' . $res['data'][0]['code'], ['is_disable' => true])->assertStatus($eRole !== ERole::USER ? 200 : 403);
      $this->assertTrue($res['data'][Str::camel('is_disable')]);
    }

    $type = PostType::factory()->raw(['code' => $type['code']]);
    $this->put('/api/posts/types/' . $type['code'], $type)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('post_types', $type);

    $data = Post::factory()->raw(['type_code' => $type['code']]);
    $data['languages'] = array(PostLanguage::factory()->raw());
    $res = $this->post('/api/posts/', $data)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) {
      unset($data['languages']);
      $this->assertDatabaseHas('posts', $data);
      $data = $res['data'];
    }

    $res = $this->get('/api/posts/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(1, $res['data']);
      $check = false;
      foreach ($res['data'] as $item) {
        if ($item['id'] == $data['id']) {
          foreach($data as $key=>$value) {
            $check = true;
            $this->assertEquals($value, $item[Str::camel($key)]);
          }
        }
      }
      $this->assertTrue($check);
    }

    if ($eRole === ERole::USER) $data = Post::factory()->create()->getAttributes();
    $id = $eRole !== ERole::USER ? $res['data'][0]['id'] : $data['id'];
    $res = $this->get('/api/posts/'. $id. '?include=type')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data'][Str::camel($key)]);
      }
      foreach($type as $key=>$value) {
        $this->assertEquals($value, $res['data']['type'][Str::camel($key)]);
      }
    }

    if ($eRole !== ERole::USER) $this->assertFalse($res['data'][Str::camel('is_disable')]);
    $res = $this->put('/api/posts/' . $id, ['is_disable' => true])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertTrue($res['data'][Str::camel('is_disable')]);

    $data = Post::factory()->raw(['type_code' => $type['code']]);
    if (property_exists($res, 'data')) {
      $data['languages'] = [];
      array_push(
        $data['languages'],
        PostLanguage::factory()->raw(["id" => $res['data']['languages'][0]['id']]),
        PostLanguage::factory()->raw(["id" => $res['data']['languages'][1]['id']])
      );
    }
    $this->put('/api/posts/' . $id, $data)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      unset($data['languages']);
      $this->assertDatabaseHas('posts', $data);
    }

    $res = $this->get('/api/posts/types/'. $type['code'] . '?include=posts')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data']['posts'][0][Str::camel($key)]);
      }
    }

    $this->delete('/api/posts/' . $id)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('posts', $data);

    $this->delete('/api/posts/types/' . $type['code'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('post_types', $type);
  }
}
