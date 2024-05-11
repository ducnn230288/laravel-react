<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostLanguageResource extends JsonResource
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
        'language' => $this->whenHas('language'),
        'name' => $this->whenHas('name'),
        'slug' => $this->whenHas('slug'),
        'description' => $this->whenHas('description'),
        'content' => $this->whenHas('content'),
        'post' => new PostResource($this->whenLoaded('post')),
      ];
    }
}
