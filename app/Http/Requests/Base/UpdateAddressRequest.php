<?php

namespace App\Http\Requests\Base;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAddressRequest extends FormRequest
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
          'address' => 'required|string|max:255',
          'province_code' => 'required|string|max:255',
          'district_code' => 'required|string|max:255',
          'ward_code' => 'required|string|max:255',
          'disabled_at' => 'boolean',
        ];
    }
}
