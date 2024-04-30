<?php

namespace Tests\Feature;

use App\Models\Base\Code;
use App\Models\Base\CodeType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use function PHPUnit\Framework\assertEquals;

class CodeTest extends TestCase
{
  use WithFaker, RefreshDatabase;
  /**
   * A basic feature test example.
   */
  public function test_create_code_type(): void
  {
    $this->withoutExceptionHandling();
    $data = CodeType::factory()->raw();
    $this->post('/api/codes/types/', $data)->assertStatus(201);
    $this->assertDatabaseHas('code_types', $data);

    $res = $this->get('/api/codes/types/')->assertStatus(200);
    $this->assertCount(1, $res['data']);
    foreach($data as $key=>$value) {
      $this->assertEquals($value, $res['data'][0][$key]);
    }

    $data = CodeType::factory()->raw(['code' => $data['code']]);
    $this->put('/api/codes/types/' . $data['code'], $data)->assertStatus(200);
    $this->assertDatabaseHas('code_types', $data);

    $code = Code::factory()->raw(['type_code' => $data['code']]);
    $this->post('/api/codes/', $code)->assertStatus(201);
    $this->assertDatabaseHas('codes', $code);

    $res = $this->get('/api/codes/')->assertStatus(200);
    $this->assertCount(1, $res['data']);
    foreach($code as $key=>$value) {
      $this->assertEquals($value, $res['data'][0][$key]);
    }

    $res = $this->get('/api/codes/'. $code['code']. '?include=type')->assertStatus(200);
    foreach($code as $key=>$value) {
      $this->assertEquals($value, $res['data'][$key]);
    }
    foreach($data as $key=>$value) {
      $this->assertEquals($value, $res['data']['type'][$key]);
    }

    $code = Code::factory()->raw(['code' => $code['code'], 'type_code' => $data['code']]);
    $this->put('/api/codes/' . $code['code'], $code)->assertStatus(200);
    $this->assertDatabaseHas('codes', $code);

    $res = $this->get('/api/codes/types/'. $data['code'] . '?include=codes')->assertStatus(200);
    foreach($code as $key=>$value) {
      $this->assertEquals($value, $res['data']['codes'][0][$key]);
    }

    $this->delete('/api/codes/' . $code['code'])->assertStatus(200);
    $this->assertDatabaseMissing('codes', $code);

    $this->delete('/api/codes/types/' . $data['code'])->assertStatus(200);
    $this->assertDatabaseMissing('code_types', $data);
  }
}
