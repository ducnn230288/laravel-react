<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

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
        'id' => $this->whenHas('id'),
        'name' => $this->whenHas('name'),
        'image' => $this->whenHas('image'),
        'order' => $this->whenHas('order'),
        Str::camel('type_code') => $this->whenHas('type_code'),
        'type' => new ContentTypeResource($this->whenLoaded('type')),
        'languages' => ContentLanguageResource::collection($this->whenLoaded('languages')),
        Str::camel('is_disable') => $this->disabled_at != null,
      ];
    }
}
