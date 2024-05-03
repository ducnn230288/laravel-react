<?php

namespace Database\Seeders\Base;

use App\Models\Base\Parameter;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ParameterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $list = array(
        ['name' => 'Address', 'code' => 'ADDRESS', 'vn' => 'P3A.01.03, Picity High Park, 9A đường Thạnh ân 13, P. Thạnh Xuân, Q.12, TP. Hồ Chí Minh, Việt Nam.', 'en' => '7 Cong Hoa St., Ward 4, Tan Binh Dist., Ho Chi Minh City, Vietnam.'],
        ['name' => 'Email', 'code' => 'EMAIL', 'vn' => 'contact@ari.com.vn', 'en' => 'contact@ari.com.vn'],
        ['name' => 'Phone number', 'code' => 'PHONE', 'vn' => '(+84)363672405', 'en' => '(+84)363672405'],
        ['name' => 'Link Facebook', 'code' => 'FACEBOOK', 'vn' => 'https://www.facebook.com/ARI-Technology-103059672364812', 'en' => 'https://www.facebook.com/ARI-Technology-103059672364812'],
        ['name' => 'Link LinkedIn', 'code' => 'LINKEDIN', 'vn' => 'https://www.linkedin.com/company/aritechnology', 'en' => 'https://www.linkedin.com/company/aritechnology'],
      );
      foreach ($list as $item) {
        Parameter::factory()->create($item);
      }
    }
}
