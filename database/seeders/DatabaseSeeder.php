<?php

namespace Database\Seeders;

use App\Models\Base\User;
use Database\Seeders\Base\CodeSeeder;
use Database\Seeders\Base\CodeTypeSeeder;
use Illuminate\Database\Seeder;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
      User::factory(1)->create();

      $this->call(CodeTypeSeeder::class);
      $this->call(CodeSeeder::class);
    }
}
