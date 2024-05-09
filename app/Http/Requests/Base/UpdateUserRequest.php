<?php

namespace App\Http\Requests\Base;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
          'name' => 'string|max:255',
          'avatar' => 'string|max:255',
          'password' => 'string|max:255',
          'role_code' => 'string|max:255',
          'position_code' => 'string|max:255',
          'email' => 'string|unique:users,email,'.$this->user->id,
          'phone_number' => 'string|unique:users,phone_number,'.$this->user->id,
          'disabled_at' => 'bool'
        ];
    }
}
