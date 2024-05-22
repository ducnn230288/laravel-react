<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class AddressDistrictResource extends JsonResource
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
        'name' => $this->whenHas('name'),
        'code' => $this->whenHas('code'),
        'description' => $this->whenHas('description'),
        Str::camel('province_code') => $this->whenHas('province_code'),
        'province' => new AddressProvinceResource($this->whenLoaded('province')),
        'wards' => AddressWardResource::collection($this->whenLoaded('wards')),
        Str::camel('is_disable') => $this->disabled_at != null,
      ];
    }
}
