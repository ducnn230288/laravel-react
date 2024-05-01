<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserRoleResource extends JsonResource
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
        'permissions' => $this->permissions,
        'is_system_admin' => $this->is_system_admin,
        'users' => UserResource::collection($this->whenLoaded('users'))
      ];
    }
}
