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
        Schema::create('data', function (Blueprint $table) {
          $table->engine = 'InnoDB';
          $table->uuid('id');
          $table->string('type_data');
          $table->foreign('type_data')->references('code')->on('data_types')->onDelete('cascade')->onUpdate('cascade');
          $table->string('name');
          $table->string('image');
          $table->decimal('order');
          $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data');
    }
};
