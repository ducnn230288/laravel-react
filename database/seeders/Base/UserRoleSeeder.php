<?php

namespace Database\Seeders\Base;

use App\Models\Base\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      for ($i = 0; $i < 10; $i++) UserRole::factory()->create();
    }
}
