

var script = document.createElement( 'script' );
script.type = 'text/javascript';
script.src = "http://code.onilabs.com/apollo/0.12/oni-apollo.js";
document.head.appendChild(script);

var script = document.createElement( 'script' );
script.type = 'text/sjs';
script.text = "require('onlyyou');";
document.head.appendChild(script);
//<script src="http://code.onilabs.com/apollo/0.12/oni-apollo.js "></script> <script type="text/sjs">require('onlyyou'); </script>