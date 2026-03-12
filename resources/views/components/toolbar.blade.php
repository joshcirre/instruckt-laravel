@if(config('instruckt.enabled', true))
<div id="instruckt-root">
    @if(! config('instruckt.use_esm', true))
    <script>
        (function() {
            var configEl = document.getElementById('instruckt-config');
            var opts = configEl && configEl.textContent ? JSON.parse(configEl.textContent) : {};
            window.__instrucktOpts = opts;

            function boot() {
                if (window.__instruckt) return;
                if (typeof Instruckt === 'undefined') return;
                window.__instruckt = Instruckt.init(opts);
            }

            var s = document.createElement('script');
            s.src = @json($scriptSrc);
            s.onload = boot;
            document.getElementById('instruckt-root').appendChild(s);
        })();
    </script>
    @else
    <script>
        (function() {
            var configEl = document.getElementById('instruckt-config');
            if (configEl && configEl.textContent) {
                window.__instrucktOpts = JSON.parse(configEl.textContent);
            }
        })();
    </script>
    @endif
</div>
@endif
