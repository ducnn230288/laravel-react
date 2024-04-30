<?php

namespace Database\Seeders\Base;

use App\Models\Base\CodeType;
use Illuminate\Database\Seeder;

class CodeTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      for ($i = 0; $i < 10; $i++) CodeType::factory()->create();
    }
}
