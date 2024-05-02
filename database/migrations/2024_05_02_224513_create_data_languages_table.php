<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('data_languages', function (Blueprint $table) {
          $table->uuid('id');
          $table->string('language');
          $table->string('name');
          $table->text('description');
          $table->string('position');
          $table->text('content');
          $table->foreignUuid('data_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_languages');
    }
};
