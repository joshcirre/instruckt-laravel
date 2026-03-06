<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('instruckt_sessions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('url');
            $table->string('status')->default('active'); // active | approved | closed
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('instruckt_sessions');
    }
};
