<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContentResource extends JsonResource
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
        'type_code' => $this->type_code,
        'type' => new ContentTypeResource($this->whenLoaded('type')),
      ];
    }
}
