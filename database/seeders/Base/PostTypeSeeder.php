<?php

namespace Database\Seeders\Base;

use App\Models\Base\PostType;
use Illuminate\Database\Seeder;

class PostTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $list = array(
        ['name' => 'News', 'code' => 'NEWS'],
        ['name' => 'Projects', 'code' => 'PROJECTS'],
      );
      foreach ($list as $item) {
        PostType::factory()->create($item);
      }
    }
}
