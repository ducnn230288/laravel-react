<?php

namespace App\Http\Resources;

use App\Models\Base\Code;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CodeTypeResource extends JsonResource
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
        'codes' => CodeResource::collection($this->whenLoaded('codes'))
      ];
    }
}
