<?php

namespace Database\Seeders\Base;

use App\Models\Base\Code;
use App\Models\Base\CodeType;
use Illuminate\Database\Seeder;

class CodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $types = CodeType::all();
      foreach ($types as $type) {
        Code::factory()->create(['type_code' => $type->code]);
      }
    }
}
