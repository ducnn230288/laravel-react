<?php

namespace Database\Seeders\Base;

use App\Models\Base\DataType;
use Illuminate\Database\Seeder;

class DataTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $datas = array(
        ['name' => 'Missions', 'code' => 'MISSIONS'],
        ['name' => 'Services', 'code' => 'SERVICES'],
        ['name' => 'Values', 'code' => 'VALUES'],
        ['name' => 'Members', 'code' => 'MEMBERS'],
        ['name' => 'techniques', 'code' => 'TECHNIQUES'],
        ['name' => 'Partners', 'code' => 'PARTNERS'],
      );
      foreach ($datas as $data) {
        DataType::factory()->create($data);
      }
    }
}
