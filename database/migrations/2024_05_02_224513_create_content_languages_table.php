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
        Schema::create('content_languages', function (Blueprint $table) {
          $table->uuid('id');
          $table->string('language');
          $table->string('name');
          $table->text('description');
          $table->string('position');
          $table->longText('content');
          $table->foreignUuid('content_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_languages');
    }
};
