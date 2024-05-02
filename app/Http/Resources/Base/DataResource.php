<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DataResource extends JsonResource
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
        'image' => $this->image,
        'order' => $this->order,
        'type_data' => $this->type_data,
        'type' => new DataTypeResource($this->whenLoaded('type')),
      ];
    }
}
