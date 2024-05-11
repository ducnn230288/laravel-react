<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class PostResource extends JsonResource
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
        'image' => $this->whenHas('image'),
        Str::camel('type_code') => $this->whenHas('type_code'),
        Str::camel('created_at') => $this->whenHas('created_at'),
        Str::camel('disabled_at') => $this->whenHas('disabled_at'),
        'type' => new PostTypeResource($this->whenLoaded('type')),
        'languages' => PostLanguageResource::collection($this->whenLoaded('languages')),
      ];
    }
}
