@if(config('instruckt.enabled', false))
<div id="instruckt-root">
    <script>
        (function() {
            function boot() {
                if (window.__instruckt) return;
                if (typeof Instruckt === 'undefined') return;
                var opts = {
                    endpoint: @json($endpoint),
                    adapters: {!! $adapters !!},
                    theme: @json($theme),
                    position: @json($position),
                };
                var colors = {!! $colors !!};
                var keys = {!! $keys !!};
                var tools = {!! $tools !!};
                if (Object.keys(colors).length) opts.colors = colors;
                if (Object.keys(keys).length) opts.keys = keys;
                if (Object.keys(tools).length) opts.tools = tools;
                window.__instruckt = Instruckt.init(opts);
            }

            var s = document.createElement('script');
            s.src = @json($scriptSrc);
            s.onload = boot;
            document.getElementById('instruckt-root').appendChild(s);
        })();
    </script>
</div>
@endif
