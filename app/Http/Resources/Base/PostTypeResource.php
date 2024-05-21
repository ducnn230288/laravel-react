<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

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
        'id' => $this->whenHas('id'),
        'name' => $this->whenHas('name'),
        'code' => $this->whenHas('code'),
        'description' => $this->whenHas('description'),
        Str::camel('posts_count') => $this->whenHas('posts_count'),
        Str::camel('post_type_id') => $this->whenHas('post_type_id'),
        'posts' => PostResource::collection($this->whenLoaded('posts')),
        'children' => PostTypeResource::collection($this->whenLoaded('children')),
        Str::camel('is_disable') => !!$this->disabled_at,
      ];
    }
}
