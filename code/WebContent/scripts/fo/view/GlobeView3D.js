$ns("fo.view");

$import("fo.view.View3D");

$include("fo.res.GlobeView3D.css");

fo.view.GlobeView3D = function()
{
    var me = $extend(fo.view.View3D);
    me.elementClass = "GlobeView3D";
    me.isAnimating = true;
    me.antialias = true;
    var base = {};

    me.data = null;
    me.maxLineLength = 80;
    
    me.sphereGeometry = null;
    me.earth = null;
    me.points = null;
    
    var _pointGeometrys = null;
    var _point = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        var geometry = new THREE.CubeGeometry(0.75, 0.75, 1, 1, 1, 1, null, false);
        for ( var i = 0; i < geometry.vertices.length; i++)
        {
            var vertex = geometry.vertices[i];
            vertex.z += 0.5;
        }
        _point = new THREE.Mesh(geometry);
    };
    
    me.initTrackballControl = function()
    {
        if (me.trackballControl == null)
        {
            me.trackballControl = new THREE.TrackballControls(me.camera, me.renderer.domElement);
            me.trackballControl.rotateSpeed = 0.5;
            //me.trackballControl.noRotateY = true;
            me.trackballControl.addEventListener("change", function(){
                me.render();
            });
        }
    };

    me.initCamera = function()
    {
        me.camera = new THREE.PerspectiveCamera(45, me.frame.width / me.frame.height, 0.1, 10000);
        me.camera.position.x = 0;
        me.camera.position.y = 0;
        me.camera.position.z = 0;
    };

    base.initObjects = me.initObjects;
    me.initObjects = function()
    {
        //me.geometry = new THREE.SphereGeometry(200, 30, 30);
        me.geometry = new THREE.IcosahedronGeometry(200, 4);
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
        me.earth.matrixAutoUpdate = false;
        me.scene.add(me.earth);
    };

    me.render = function ()
    {
        if (me.isRendering)
        {
            me.trigger("rendering");
            me.renderer.render(me.scene, me.camera);
        }
    };
    
    me.startAnimation = function()
    {
        me.isAnimating = true;
        me.loop();
        
        if (me.trackballControl == null)
        {
            var duration = 2500;
            new TWEEN.Tween(me.camera.position)
                .to({ x: 0, y: 0, z: 650 }, duration)
                .easing(TWEEN.Easing.Exponential.Out)
                .onUpdate(function()
                {
                    me.camera.lookAt(me.scene.position);
                    me.render();
                })
                .start();
            me.initTrackballControl();
        }
    };
    
    me.stopAnimation = function()
    {
        me.isAnimating = false;
    };
    
    me.loop = function()
    {
        if (me.isAnimating)
        {
            requestAnimationFrame(me.loop);
        }
        else
        {
            return;
        }
        
        TWEEN.update();
        
        if (me.trackballControl != null)
        {
            me.trackballControl.update();
        }
    };
    

    me.addPoint = function(p_location, p_size, p_color)
    {
        var lat = p_location.lat;
        var lng = p_location.lng;
        var phi = (90 - lat) * Math.PI / 180;
        var theta = (180 - lng) * Math.PI / 180;

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

        THREE.GeometryUtils.merge(_pointGeometrys, _point);
    };
    
    me.setData = function(p_data, p_maxValue)
    {
        me.data = p_data;
        
        if (me.points != null)
        {
            me.scene.remove(me.points);
        }
        me.points = null;
        _pointGeometrys = new THREE.Geometry();
        
        var maxValue = null;
        if (p_maxValue == null)
        {
            maxValue = d3.max(p_data, function(d) { return d.value; });
        }
        else
        {
            maxValue = p_maxValue;
        }
        for (var i = 0; i < p_data.length; i++)
        {
            var item = p_data[i];
            var percentage = item.value / maxValue;
            if (percentage == 0)
            {
                length = 0;
            }
            else
            {
                length = percentage * me.maxLineLength;
            }
            me.addPoint(item.location, length, me.colorScale(percentage));
        }
        
        me.points = new THREE.Mesh(_pointGeometrys, new THREE.MeshBasicMaterial(
        {
            color : 0xffffff,
            vertexColors : THREE.FaceColors,
            morphTargets : false
        }));
        me.scene.add(me.points);
    };
    
    
    me.colorScale = function(x)
    {
        var c = new THREE.Color();
        c.setHSV((0.6 - (x * 0.5)), 1.0, 1.0);
        return c;
    };
    
    
    
    base.render = me.render;
    me.render = function()
    {
        if (me.isRendering)
        {
            base.render();
        }
        
        var max = 5000;
        var zoom = (max - me.camera.position.z) / max;
        var z = 4000 * zoom;
        me.$container.css({
            backgroundSize: z + "px auto",
            backgroundPositionX: Math.sqrt(z) + "px"
        });
    };

    return me.endOfClass(arguments);
};
