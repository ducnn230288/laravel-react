<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostTypeResource extends JsonResource
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
        'posts' => ContentResource::collection($this->whenLoaded('posts'))
      ];
    }
}
