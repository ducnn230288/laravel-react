<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class AddressResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
      return [
        'id' => $this->whenHas('id'),
        'address' => $this->whenHas('address'),
        Str::camel('province_code') => $this->whenHas('province_code'),
        'province' => new AddressProvinceResource($this->whenLoaded('province')),
        Str::camel('district_code') => $this->whenHas('district_code'),
        'district' => new AddressDistrictResource($this->whenLoaded('district')),
        Str::camel('ward_code') => $this->whenHas('ward_code'),
        'ward' => new AddressProvinceResource($this->whenLoaded('ward')),
        Str::camel('user_id') => $this->whenHas('user_id'),
        'user' => new UserResource($this->whenLoaded('user')),
        Str::camel('is_disable') => $this->disabled_at != null,
      ];
    }
}
