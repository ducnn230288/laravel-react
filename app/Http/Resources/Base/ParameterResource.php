<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class ParameterResource extends JsonResource
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
        'code' => $this->whenHas('code'),
        'name' => $this->whenHas('name'),
        'vi' => $this->whenHas('vi'),
        'en' => $this->whenHas('en'),
        Str::camel('is_disable') => $this->disabled_at != null,
      ];
    }
}
