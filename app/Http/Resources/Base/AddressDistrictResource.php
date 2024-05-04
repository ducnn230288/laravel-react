<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
        'id' => $this->id,
        'name' => $this->name,
        'code' => $this->code,
        'description' => $this->description,
        'province_code' => $this->province_code,
        'province' => new AddressProvinceResource($this->whenLoaded('province')),
        'wards' => AddressWardResource::collection($this->whenLoaded('wards')),
      ];
    }
}
