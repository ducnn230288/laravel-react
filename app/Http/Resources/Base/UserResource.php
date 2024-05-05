<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
      $user = [
        'id' => $this->id,
        'name' => $this->name,
        'email' => $this->email,
        'role_code' => $this->role_code,
        'created_at' => $this->created_at,
        'role' => new UserRoleResource($this->whenLoaded('role')),
      ];
      return !!$this->token ? [
        'token' => $this->whenHas('token'),
        'refresh-token' => $this->whenHas('refresh-token'),
        'user' => $user
      ] : $user;
//      $this->mergeWhen($this->token, [
//        'first-secret' => 'value',
//        'second-secret' => 'value',
//      ]),
    }
}
