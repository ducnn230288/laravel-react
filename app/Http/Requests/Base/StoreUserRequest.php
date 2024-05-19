<?php

namespace App\Http\Requests\Base;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
          'name' => 'required|string|max:255',
          'avatar' => 'string|max:255',
          'password' => 'required|confirmed|string|max:255',
          'dob' => 'nullable|date',
          'role_code' => 'required|string|max:255',
          'position_code' => 'required|string|max:255',
          'email' => 'required|string|unique:users',
          'phone_number' => 'required|string|unique:users',
        ];
    }

//    public function prepareForValidation()
//    {
//      $this->merge([
//        'role_code1' => $this->role_code
//      ]);
//    }
}
