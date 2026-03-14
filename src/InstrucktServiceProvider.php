<?php

declare(strict_types=1);

namespace Instruckt\Laravel;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Instruckt\Laravel\Components\Toolbar;
use Instruckt\Laravel\Console\InstallCommand;
use Instruckt\Laravel\Console\RunAgentServerCommand;
use Instruckt\Laravel\Console\UninstallCommand;
use Instruckt\Laravel\Http\Controllers\AnnotationController;
use Instruckt\Laravel\Http\Middleware\TrackBladeViews;

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
        $this->registerBladeTracking();

        if ($this->app->runningInConsole()) {
            $this->commands([InstallCommand::class, UninstallCommand::class, RunAgentServerCommand::class]);
        }
    }

    private function registerHttpRoutes(): void
    {
        if (! config('instruckt.enabled', false)) {
            return;
        }

        // Use 'api' middleware by default — no CSRF verification needed for this dev-tool API.
        // Users can override via config('instruckt.middleware') if they need session/auth.
        Route::middleware(config('instruckt.middleware', ['api']))
            ->prefix(config('instruckt.route_prefix', 'instruckt'))
            ->name('instruckt.')
            ->group(function () {
                Route::get('annotations', [AnnotationController::class, 'index'])->name('annotations.index');
                Route::post('annotations', [AnnotationController::class, 'store'])->name('annotations.store');
                Route::patch('annotations/{id}', [AnnotationController::class, 'update'])->name('annotations.update');
                Route::post('resolve-source', [AnnotationController::class, 'resolveSource'])->name('resolve-source');
                Route::get('screenshots/{filename}', [AnnotationController::class, 'screenshot'])->name('screenshots.show');
                Route::post('run', [AnnotationController::class, 'run'])->name('run');
            });
    }

    private function registerMcpRoutes(): void
    {
        if (! config('instruckt.enabled', false)) {
            return;
        }

        if (! class_exists(\Laravel\Mcp\Facades\Mcp::class)) {
            return;
        }

        $this->loadRoutesFrom(__DIR__ . '/../routes/mcp.php');
    }

    private function registerBladeTracking(): void
    {
        if (! config('instruckt.enabled', false)) {
            return;
        }

        /** @var \Illuminate\Routing\Router $router */
        $router = $this->app->make('router');
        $router->pushMiddlewareToGroup('web', TrackBladeViews::class);
    }

    private function publishAssets(): void
    {
        $this->publishes([
            __DIR__ . '/../config/instruckt.php' => config_path('instruckt.php'),
        ], 'instruckt-config');
    }
}
