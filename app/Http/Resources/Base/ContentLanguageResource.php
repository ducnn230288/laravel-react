<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class ContentLanguageResource extends JsonResource
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
        'description' => $this->whenHas('description'),
        'content' => $this->whenHas('content'),
        'parent' => new ContentResource($this->whenLoaded('content')),
        Str::camel('disabled_at') => $this->whenHas('disabled_at'),
      ];
    }
}
