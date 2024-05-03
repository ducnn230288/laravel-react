<?php

namespace Database\Seeders;

use App\Models\Base\User;
use Database\Seeders\Base\CodeSeeder;
use Database\Seeders\Base\CodeTypeSeeder;
use Database\Seeders\Base\ContentTypeSeeder;
use Database\Seeders\Base\ParameterSeeder;
use Database\Seeders\Base\PostTypeSeeder;
use Database\Seeders\Base\UserRoleSeeder;
use Database\Seeders\Base\UserSeeder;
use Illuminate\Database\Seeder;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
      $this->call(UserRoleSeeder::class);
      $this->call(UserSeeder::class);
      $this->call(CodeTypeSeeder::class);
      $this->call(CodeSeeder::class);
      $this->call(ParameterSeeder::class);
      $this->call(ContentTypeSeeder::class);
      $this->call(PostTypeSeeder::class);
    }
}
