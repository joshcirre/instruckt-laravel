<?php

declare(strict_types=1);

namespace Instruckt\Laravel;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Instruckt\Laravel\Components\Toolbar;
use Instruckt\Laravel\Console\InstallCommand;
use Instruckt\Laravel\Http\Controllers\AnnotationController;
use Instruckt\Laravel\Http\Controllers\SessionController;

final class InstrucktServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../config/instruckt.php', 'instruckt');
    }

    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'instruckt');
        $this->loadViewComponentsAs('instruckt', [Toolbar::class]);

        $this->publishAssets();
        $this->registerHttpRoutes();
        $this->registerMcpRoutes();

        if ($this->app->runningInConsole()) {
            $this->commands([InstallCommand::class]);
        }
    }

    private function registerHttpRoutes(): void
    {
        if (! config('instruckt.enabled', true)) {
            return;
        }

        // Use 'api' middleware by default — no CSRF verification needed for this dev-tool API.
        // Users can override via config('instruckt.middleware') if they need session/auth.
        Route::middleware(config('instruckt.middleware', ['api']))
            ->prefix(config('instruckt.route_prefix', 'instruckt'))
            ->name('instruckt.')
            ->group(function () {
                Route::get('sessions', [SessionController::class, 'index'])->name('sessions.index');
                Route::post('sessions', [SessionController::class, 'store'])->name('sessions.store');
                Route::get('sessions/{id}', [SessionController::class, 'show'])->name('sessions.show');
                Route::get('sessions/{id}/events', [SessionController::class, 'events'])->name('sessions.events');
                Route::post('sessions/{sessionId}/annotations', [AnnotationController::class, 'store'])->name('annotations.store');
                Route::patch('annotations/{id}', [AnnotationController::class, 'update'])->name('annotations.update');
                Route::post('annotations/{id}/reply', [AnnotationController::class, 'reply'])->name('annotations.reply');
            });
    }

    private function registerMcpRoutes(): void
    {
        if (! config('instruckt.enabled', true)) {
            return;
        }

        if (! class_exists(\Laravel\Mcp\Facades\Mcp::class)) {
            return;
        }

        $this->loadRoutesFrom(__DIR__ . '/../routes/mcp.php');
    }

    private function publishAssets(): void
    {
        $this->publishes([
            __DIR__ . '/../config/instruckt.php' => config_path('instruckt.php'),
        ], 'instruckt-config');

        $this->publishes([
            __DIR__ . '/../dist' => public_path('vendor/instruckt'),
        ], 'instruckt-assets');
    }
}
