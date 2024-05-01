<?php

namespace Database\Seeders\Base;

use App\Models\Base\User;
use App\Models\Base\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $roles = UserRole::all();
      foreach ($roles as $role) {
        User::factory()->create(['role_code' => $role->code]);
      }
    }
}
