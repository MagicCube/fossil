$ns("fo.view");

$import("fo.view.View3D");

$include("fo.res.GlobeView3D.css");

fo.view.GlobeView3D = function()
{
    var me = $extend(fo.view.View3D);
    me.elementClass = "GlobeView3D";
    me.isAnimating = true;
    var base = {};

    me.sphereGeometry = null;
    me.earth = null;
    me.points = null;
    
    var _baseGeometry = null;
    var _point = null;
    

    THREE.Color.prototype.setHSV = function(b, d, e)
    {
        var g, h, o, n, q, r;
        if (e == 0)
            g = h = o = 0;
        else
        {
            n = Math.floor(b * 6);
            q = b * 6 - n;
            b = e * (1 - d);
            r = e * (1 - d * q);
            d = e * (1 - d * (1 - q));
            switch (n)
            {
            case 1:
                g = r;
                h = e;
                o = b;
                break;
            case 2:
                g = b;
                h = e;
                o = d;
                break;
            case 3:
                g = b;
                h = r;
                o = e;
                break;
            case 4:
                g = d;
                h = b;
                o = e;
                break;
            case 5:
                g = e;
                h = b;
                o = r;
                break;
            case 6:
            case 0:
                g = e;
                h = d;
                o = b
            }
        }
        this.r = g;
        this.g = h;
        this.b = o;
        if (this.autoUpdate)
        {
            this.updateHex();
            this.updateStyleString();
        }
    };

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        _baseGeometry = new THREE.Geometry();
        
        var geometry = new THREE.CubeGeometry(0.75, 0.75, 1, 1, 1, 1, null, false);
        for ( var i = 0; i < geometry.vertices.length; i++)
        {
            var vertex = geometry.vertices[i];
            vertex.z += 0.5;
        }
        _point = new THREE.Mesh(geometry);
        
        me.addPoint({ lng: 118, lat: 32 }, 20, me.colorScale(0.1));
        

        me.points = new THREE.Mesh(_baseGeometry, new THREE.MeshBasicMaterial(
        {
            color : 0xffffff,
            vertexColors : THREE.FaceColors,
            morphTargets : false
        }));
        me.scene.add(me.points);
    };

    me.initCamera = function()
    {
        me.camera = new THREE.PerspectiveCamera(45, me.frame.width / me.frame.height, 0.1, 10000);
        me.camera.position.z = 650;
    };

    base.initObjects = me.initObjects;
    me.initObjects = function()
    {
        me.geometry = new THREE.SphereGeometry(200, 40, 30);
        me.initEarth();
    };

    me.initEarth = function()
    {
        var material = new THREE.ShaderMaterial(
        {
            uniforms :
            {
                texture :
                {
                    type : 't',
                    value : THREE.ImageUtils.loadTexture(mx.getResourcePath("fo.res.images.world", "jpg"))
                }
            },
            vertexShader : [ 'varying vec3 vNormal;', 'varying vec2 vUv;', 'void main() {', 'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );', 'vNormal = normalize( normalMatrix * normal );', 'vUv = uv;', '}' ].join('\n'),
            fragmentShader : [ 'uniform sampler2D texture;', 'varying vec3 vNormal;', 'varying vec2 vUv;', 'void main() {', 'vec3 diffuse = texture2D( texture, vUv ).xyz;', 'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );', 'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );', 'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );', '}' ].join('\n')
        });
        me.earth = new THREE.Mesh(me.geometry, material);
        me.scene.add(me.earth);
    };

    base.startAnimate = me.startAnimate;
    me.startAnimate = function()
    {
        base.startAnimate();
        if (me.trackballControl == null)
        {
            me.initTrackballControl();
        }
    };

    me.addPoint = function(p_location, p_size, p_color)
    {
        var lat = p_location.lat;
        var lng = p_location.lng;
        var phi = (90 - lat) * Math.PI / 180;
        var theta = (- lng) * Math.PI / 180;

        _point.position.x = 200 * Math.sin(phi) * Math.cos(theta);
        _point.position.y = 200 * Math.cos(phi);
        _point.position.z = 200 * Math.sin(phi) * Math.sin(theta);

       _point.lookAt(me.earth.position);

        _point.scale.z = -p_size;
        _point.updateMatrix();

        for (var i = 0; i < _point.geometry.faces.length; i++)
        {
            _point.geometry.faces[i].color = p_color;
        }

        THREE.GeometryUtils.merge(_baseGeometry, _point);
    };
    
    
    
    me.colorScale = function(x)
    {
        var c = new THREE.Color();
        c.setHSL( ( 0.6 - ( x * 0.5 ) ), 1.0, 1.0 );
        return c;
    };

    return me.endOfClass(arguments);
};
