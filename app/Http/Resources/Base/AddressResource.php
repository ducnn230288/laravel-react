<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
        'id' => $this->id,
        'address' => $this->address,
        'province_code' => $this->province_code,
        'province' => new AddressProvinceResource($this->whenLoaded('province')),
        'district_code' => $this->district_code,
        'district' => new AddressDistrictResource($this->whenLoaded('district')),
        'ward_code' => $this->ward_code,
        'ward' => new AddressProvinceResource($this->whenLoaded('ward')),
        'user_id' => $this->user_id,
        'user' => new UserResource($this->whenLoaded('user')),
      ];
    }
}
