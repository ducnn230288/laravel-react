<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressWardResource extends JsonResource
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
        'district_code' => $this->district_code,
        'district' => new AddressDistrictResource($this->whenLoaded('district')),
      ];
    }
}
