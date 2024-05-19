<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

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
        'dob' => $this->whenHas('dob'),
        Str::camel('phone_number') => $this->whenHas('phone_number'),
        Str::camel('created_at') => $this->whenHas('created_at'),
        Str::camel('disabled_at') => $this->whenHas('disabled_at'),
        Str::camel('role_code') => $this->whenHas('role_code'),
        'role' => new UserRoleResource($this->whenLoaded('role')),
        Str::camel('position_code') => $this->whenHas('position_code'),
        'position' => new CodeResource($this->whenLoaded('position')),
      ];
      return !!$this->token ? [
        'token' => $this->whenHas('token'),
        Str::camel('refresh-token') => $this->whenHas('refresh-token'),
        'user' => $user
      ] : $user;
//      $this->mergeWhen($this->token, [
//        'first-secret' => 'value',
//        'second-secret' => 'value',
//      ]),
    }
}
