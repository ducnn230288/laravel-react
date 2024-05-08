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
        'id' => $this->whenHas('id'),
        'name' => $this->whenHas('name'),
        'email' => $this->whenHas('email'),
        'avatar' => $this->whenHas('avatar'),
        'phoneNumber' => $this->whenHas('phone_number'),
        'created_at' => $this->whenHas('created_at'),
        'roleCode' => $this->whenHas('role_code'),
        'role' => new UserRoleResource($this->whenLoaded('role')),
        'positionCode' => $this->whenHas('position_code'),
        'position' => new CodeResource($this->whenLoaded('position')),
      ];
      return !!$this->token ? [
        'token' => $this->whenHas('token'),
        'refreshToken' => $this->whenHas('refresh-token'),
        'user' => $user
      ] : $user;
//      $this->mergeWhen($this->token, [
//        'first-secret' => 'value',
//        'second-secret' => 'value',
//      ]),
    }
}
