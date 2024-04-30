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
        Schema::create('codes', function (Blueprint $table) {
          $table->engine = 'InnoDB';
          $table->uuid('id');
            $table->string('type_code');
            $table->foreign('type_code')->references('code')->on('code_types')->onDelete('cascade')->onUpdate('cascade');
            $table->string('name');
            $table->string('code');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('codes');
    }
};
