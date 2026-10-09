import{U as Lt,c as sa,N as Ut,S as ca,C as je,R as la,e as tt,w as Xe,V as St,l as hi,M as jt,F as Rr,W as mi,a as At,b as rt,L as Zt,H as yt,D as wt,B as Et,d as pn,f as Ne,p as fa,g as _i,h as da,i as ua,A as on,O as pa,j as ha,k as ma,m as _a,n as ga,o as va,q as Sa,r as Ea,s as xa,t as Ma,u as Ta,v as Aa,x as Ra,y as ba,Z as Ca,z as Pa,E as Kn,G as La,I as Dn,J as xt,K as vn,P as wa,Q as Wt,T as Ua,X as Da,Y as ei,_ as Ia,$ as ti,a0 as Na,a1 as ya,a2 as Fa,a3 as Oa,a4 as Ba,a5 as Dt,a6 as gt,a7 as en,a8 as qn,a9 as pt,aa as xn,ab as Ga,ac as Nt,ad as fn,ae as tn,af as An,ag as Gt,ah as nn,ai as Ha,aj as kt,ak as Rn,al as Va,am as br,an as Je,ao as Wa,ap as un,aq as ka,ar as In,as as It,at as $t,au as hn,av as za,aw as Xa,ax as Ya,ay as Kt,az as Oe,aA as Ka,aB as Cr,aC as Pr,aD as Lr,aE as bn,aF as wr,aG as Ur,aH as qa,aI as Za,aJ as $a,aK as Qa,aL as Ja,aM as ja,aN as eo,aO as to,aP as gi,aQ as no,aR as Mn,aS as io,aT as vi,aU as Si,aV as Qt,aW as ro,aX as Cn,aY as Ei,aZ as ao,a_ as ni,a$ as Zn,b0 as Dr,b1 as Ir,b2 as Nr,b3 as oo,b4 as yr,b5 as so,b6 as co,b7 as lo,b8 as fo,b9 as Fr,ba as uo,bb as po,bc as ho,bd as Nn,be as yn,bf as Fn,bg as On,bh as xi,bi as Mi,bj as Ti,bk as Ai,bl as Ri,bm as bi,bn as Ci,bo as Pi,bp as Li,bq as $n,br as wi,bs as Ui,bt as Di,bu as Ii,bv as Ni,bw as yi,bx as Fi,by as Oi,bz as Bi,bA as Gi,bB as Hi,bC as Vi,bD as Wi,bE as ki,bF as zi,bG as Xi,bH as Yi,bI as Ki,bJ as qi,bK as Zi,bL as Qn,bM as $i,bN as Or,bO as Qi,bP as Br,bQ as Ji,bR as vt,bS as mo,bT as Gr,bU as Hr,bV as Vr,bW as ii,bX as Wr,bY as kr,bZ as zr,b_ as Bn,b$ as Gn,c0 as _o,c1 as go,c2 as Xr,c3 as mn,c4 as rn,c5 as qt,c6 as vo,c7 as So,c8 as Eo,c9 as xo,ca as Mo,cb as To,cc as Ao,cd as Ro,ce as bo,cf as mt,cg as Co,ch as Po,ci as ji,cj as Hn,ck as sn,cl as Lo,cm as wo,cn as er,co as Uo,cp as Do,cq as Io,cr as tr,cs as No,ct as yo,cu as Fo,cv as nr,cw as Oo,cx as Bo,cy as Go}from"./index-AZPJPM2i.js";/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Yr(){let e=null,n=!1,t=null,i=null;function l(o,d){i=e.requestAnimationFrame(l),t(o,d)}return{start:function(){n!==!0&&t!==null&&e!==null&&(i=e.requestAnimationFrame(l),n=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(i),n=!1},setAnimationLoop:function(o){t=o},setContext:function(o){e=o}}}function Ho(e){const n=new WeakMap;function t(g,b){const T=g.array,G=g.usage,y=T.byteLength,p=e.createBuffer();e.bindBuffer(b,p),e.bufferData(b,T,G),g.onUploadCallback();let M;if(T instanceof Float32Array)M=e.FLOAT;else if(typeof Float16Array<"u"&&T instanceof Float16Array)M=e.HALF_FLOAT;else if(T instanceof Uint16Array)g.isFloat16BufferAttribute?M=e.HALF_FLOAT:M=e.UNSIGNED_SHORT;else if(T instanceof Int16Array)M=e.SHORT;else if(T instanceof Uint32Array)M=e.UNSIGNED_INT;else if(T instanceof Int32Array)M=e.INT;else if(T instanceof Int8Array)M=e.BYTE;else if(T instanceof Uint8Array)M=e.UNSIGNED_BYTE;else if(T instanceof Uint8ClampedArray)M=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+T);return{buffer:p,type:M,bytesPerElement:T.BYTES_PER_ELEMENT,version:g.version,size:y}}function i(g,b,T){const G=b.array,y=b.updateRanges;if(e.bindBuffer(T,g),y.length===0)e.bufferSubData(T,0,G);else{y.sort((M,N)=>M.start-N.start);let p=0;for(let M=1;M<y.length;M++){const N=y[p],z=y[M];z.start<=N.start+N.count+1?N.count=Math.max(N.count,z.start+z.count-N.start):(++p,y[p]=z)}y.length=p+1;for(let M=0,N=y.length;M<N;M++){const z=y[M];e.bufferSubData(T,z.start*G.BYTES_PER_ELEMENT,G,z.start,z.count)}b.clearUpdateRanges()}b.onUploadCallback()}function l(g){return g.isInterleavedBufferAttribute&&(g=g.data),n.get(g)}function o(g){g.isInterleavedBufferAttribute&&(g=g.data);const b=n.get(g);b&&(e.deleteBuffer(b.buffer),n.delete(g))}function d(g,b){if(g.isInterleavedBufferAttribute&&(g=g.data),g.isGLBufferAttribute){const G=n.get(g);(!G||G.version<g.version)&&n.set(g,{buffer:g.buffer,type:g.type,bytesPerElement:g.elementSize,version:g.version});return}const T=n.get(g);if(T===void 0)n.set(g,t(g,b));else if(T.version<g.version){if(T.size!==g.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(T.buffer,g,b),T.version=g.version}}return{get:l,remove:o,update:d}}var Vo=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Wo=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,ko=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,zo=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Xo=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Yo=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ko=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,qo=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Zo=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,$o=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Qo=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Jo=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,jo=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,es=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ts=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ns=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,is=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,rs=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,as=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,os=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,ss=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,cs=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,ls=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,fs=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,ds=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,us=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,ps=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,hs=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ms=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,_s=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,gs="gl_FragColor = linearToOutputTexel( gl_FragColor );",vs=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ss=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Es=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,xs=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Ms=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ts=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,As=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Rs=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,bs=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Cs=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ps=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ls=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ws=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Us=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ds=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Is=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Ns=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ys=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Fs=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Os=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Bs=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Gs=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Hs=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Vs=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Ws=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ks=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,zs=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Xs=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ys=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ks=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,qs=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Zs=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$s=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Qs=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Js=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,js=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ec=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,tc=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,nc=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ic=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,rc=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ac=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,oc=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,sc=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cc=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lc=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,fc=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,dc=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,uc=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,pc=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,hc=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,mc=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,_c=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,gc=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,vc=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Sc=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ec=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,xc=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Mc=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Tc=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Ac=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Rc=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,bc=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Cc=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Pc=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Lc=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,wc=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Uc=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Dc=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ic=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Nc=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,yc=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Fc=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Oc=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Bc=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Gc=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Hc=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Vc=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Wc=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kc=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,zc=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xc=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yc=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kc=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,qc=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Zc=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,$c=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Qc=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Jc=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jc=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,el=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,tl=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,nl=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,il=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,rl=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,al=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ol=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sl=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,cl=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,ll=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fl=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dl=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,ul=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pl=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hl=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ml=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,_l=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,gl=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vl=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Sl=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,El=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ue={alphahash_fragment:Vo,alphahash_pars_fragment:Wo,alphamap_fragment:ko,alphamap_pars_fragment:zo,alphatest_fragment:Xo,alphatest_pars_fragment:Yo,aomap_fragment:Ko,aomap_pars_fragment:qo,batching_pars_vertex:Zo,batching_vertex:$o,begin_vertex:Qo,beginnormal_vertex:Jo,bsdfs:jo,iridescence_fragment:es,bumpmap_pars_fragment:ts,clipping_planes_fragment:ns,clipping_planes_pars_fragment:is,clipping_planes_pars_vertex:rs,clipping_planes_vertex:as,color_fragment:os,color_pars_fragment:ss,color_pars_vertex:cs,color_vertex:ls,common:fs,cube_uv_reflection_fragment:ds,defaultnormal_vertex:us,displacementmap_pars_vertex:ps,displacementmap_vertex:hs,emissivemap_fragment:ms,emissivemap_pars_fragment:_s,colorspace_fragment:gs,colorspace_pars_fragment:vs,envmap_fragment:Ss,envmap_common_pars_fragment:Es,envmap_pars_fragment:xs,envmap_pars_vertex:Ms,envmap_physical_pars_fragment:Is,envmap_vertex:Ts,fog_vertex:As,fog_pars_vertex:Rs,fog_fragment:bs,fog_pars_fragment:Cs,gradientmap_pars_fragment:Ps,lightmap_pars_fragment:Ls,lights_lambert_fragment:ws,lights_lambert_pars_fragment:Us,lights_pars_begin:Ds,lights_toon_fragment:Ns,lights_toon_pars_fragment:ys,lights_phong_fragment:Fs,lights_phong_pars_fragment:Os,lights_physical_fragment:Bs,lights_physical_pars_fragment:Gs,lights_fragment_begin:Hs,lights_fragment_maps:Vs,lights_fragment_end:Ws,lightprobes_pars_fragment:ks,logdepthbuf_fragment:zs,logdepthbuf_pars_fragment:Xs,logdepthbuf_pars_vertex:Ys,logdepthbuf_vertex:Ks,map_fragment:qs,map_pars_fragment:Zs,map_particle_fragment:$s,map_particle_pars_fragment:Qs,metalnessmap_fragment:Js,metalnessmap_pars_fragment:js,morphinstance_vertex:ec,morphcolor_vertex:tc,morphnormal_vertex:nc,morphtarget_pars_vertex:ic,morphtarget_vertex:rc,normal_fragment_begin:ac,normal_fragment_maps:oc,normal_pars_fragment:sc,normal_pars_vertex:cc,normal_vertex:lc,normalmap_pars_fragment:fc,clearcoat_normal_fragment_begin:dc,clearcoat_normal_fragment_maps:uc,clearcoat_pars_fragment:pc,iridescence_pars_fragment:hc,opaque_fragment:mc,packing:_c,premultiplied_alpha_fragment:gc,project_vertex:vc,dithering_fragment:Sc,dithering_pars_fragment:Ec,roughnessmap_fragment:xc,roughnessmap_pars_fragment:Mc,shadowmap_pars_fragment:Tc,shadowmap_pars_vertex:Ac,shadowmap_vertex:Rc,shadowmask_pars_fragment:bc,skinbase_vertex:Cc,skinning_pars_vertex:Pc,skinning_vertex:Lc,skinnormal_vertex:wc,specularmap_fragment:Uc,specularmap_pars_fragment:Dc,tonemapping_fragment:Ic,tonemapping_pars_fragment:Nc,transmission_fragment:yc,transmission_pars_fragment:Fc,uv_pars_fragment:Oc,uv_pars_vertex:Bc,uv_vertex:Gc,worldpos_vertex:Hc,background_vert:Vc,background_frag:Wc,backgroundCube_vert:kc,backgroundCube_frag:zc,cube_vert:Xc,cube_frag:Yc,depth_vert:Kc,depth_frag:qc,distance_vert:Zc,distance_frag:$c,equirect_vert:Qc,equirect_frag:Jc,linedashed_vert:jc,linedashed_frag:el,meshbasic_vert:tl,meshbasic_frag:nl,meshlambert_vert:il,meshlambert_frag:rl,meshmatcap_vert:al,meshmatcap_frag:ol,meshnormal_vert:sl,meshnormal_frag:cl,meshphong_vert:ll,meshphong_frag:fl,meshphysical_vert:dl,meshphysical_frag:ul,meshtoon_vert:pl,meshtoon_frag:hl,points_vert:ml,points_frag:_l,shadow_vert:gl,shadow_frag:vl,sprite_vert:Sl,sprite_frag:El},de={common:{diffuse:{value:new je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},envMapRotation:{value:new Oe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new gt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new Ne},probesMax:{value:new Ne},probesResolution:{value:new Ne}},points:{diffuse:{value:new je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new je(16777215)},opacity:{value:1},center:{value:new gt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},Pt={basic:{uniforms:vt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:Ue.meshbasic_vert,fragmentShader:Ue.meshbasic_frag},lambert:{uniforms:vt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new je(0)},envMapIntensity:{value:1}}]),vertexShader:Ue.meshlambert_vert,fragmentShader:Ue.meshlambert_frag},phong:{uniforms:vt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new je(0)},specular:{value:new je(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ue.meshphong_vert,fragmentShader:Ue.meshphong_frag},standard:{uniforms:vt([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag},toon:{uniforms:vt([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new je(0)}}]),vertexShader:Ue.meshtoon_vert,fragmentShader:Ue.meshtoon_frag},matcap:{uniforms:vt([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:Ue.meshmatcap_vert,fragmentShader:Ue.meshmatcap_frag},points:{uniforms:vt([de.points,de.fog]),vertexShader:Ue.points_vert,fragmentShader:Ue.points_frag},dashed:{uniforms:vt([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ue.linedashed_vert,fragmentShader:Ue.linedashed_frag},depth:{uniforms:vt([de.common,de.displacementmap]),vertexShader:Ue.depth_vert,fragmentShader:Ue.depth_frag},normal:{uniforms:vt([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:Ue.meshnormal_vert,fragmentShader:Ue.meshnormal_frag},sprite:{uniforms:vt([de.sprite,de.fog]),vertexShader:Ue.sprite_vert,fragmentShader:Ue.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ue.background_vert,fragmentShader:Ue.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Oe}},vertexShader:Ue.backgroundCube_vert,fragmentShader:Ue.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ue.cube_vert,fragmentShader:Ue.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ue.equirect_vert,fragmentShader:Ue.equirect_frag},distance:{uniforms:vt([de.common,de.displacementmap,{referencePosition:{value:new Ne},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ue.distance_vert,fragmentShader:Ue.distance_frag},shadow:{uniforms:vt([de.lights,de.fog,{color:{value:new je(0)},opacity:{value:1}}]),vertexShader:Ue.shadow_vert,fragmentShader:Ue.shadow_frag}};Pt.physical={uniforms:vt([Pt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new gt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new gt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new je(0)},specularColor:{value:new je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new gt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag};const Sn={r:0,b:0,g:0},xl=new jt,Kr=new Oe;Kr.set(-1,0,0,0,1,0,0,0,1);function Ml(e,n,t,i,l,o){const d=new je(0);let g=l===!0?0:1,b,T,G=null,y=0,p=null;function M(U){let D=U.isScene===!0?U.background:null;if(D&&D.isTexture){const m=U.backgroundBlurriness>0;D=n.get(D,m)}return D}function N(U){let D=!1;const m=M(U);m===null?f(d,g):m&&m.isColor&&(f(m,1),D=!0);const S=e.xr.getEnvironmentBlendMode();S==="additive"?t.buffers.color.setClear(0,0,0,1,o):S==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,o),(e.autoClear||D)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function z(U,D){const m=M(D);m&&(m.isCubeTexture||m.mapping===Cn)?(T===void 0&&(T=new pt(new ni(1,1,1),new Dt({name:"BackgroundCubeMaterial",uniforms:Zn(Pt.backgroundCube.uniforms),vertexShader:Pt.backgroundCube.vertexShader,fragmentShader:Pt.backgroundCube.fragmentShader,side:Et,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),T.geometry.deleteAttribute("normal"),T.geometry.deleteAttribute("uv"),T.onBeforeRender=function(S,h,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(T.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(T)),T.material.uniforms.envMap.value=m,T.material.uniforms.backgroundBlurriness.value=D.backgroundBlurriness,T.material.uniforms.backgroundIntensity.value=D.backgroundIntensity,T.material.uniforms.backgroundRotation.value.setFromMatrix4(xl.makeRotationFromEuler(D.backgroundRotation)).transpose(),m.isCubeTexture&&m.isRenderTargetTexture===!1&&T.material.uniforms.backgroundRotation.value.premultiply(Kr),T.material.toneMapped=rt.getTransfer(m.colorSpace)!==Je,(G!==m||y!==m.version||p!==e.toneMapping)&&(T.material.needsUpdate=!0,G=m,y=m.version,p=e.toneMapping),T.layers.enableAll(),U.unshift(T,T.geometry,T.material,0,0,null)):m&&m.isTexture&&(b===void 0&&(b=new pt(new Dr(2,2),new Dt({name:"BackgroundMaterial",uniforms:Zn(Pt.background.uniforms),vertexShader:Pt.background.vertexShader,fragmentShader:Pt.background.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),b.geometry.deleteAttribute("normal"),Object.defineProperty(b.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(b)),b.material.uniforms.t2D.value=m,b.material.uniforms.backgroundIntensity.value=D.backgroundIntensity,b.material.toneMapped=rt.getTransfer(m.colorSpace)!==Je,m.matrixAutoUpdate===!0&&m.updateMatrix(),b.material.uniforms.uvTransform.value.copy(m.matrix),(G!==m||y!==m.version||p!==e.toneMapping)&&(b.material.needsUpdate=!0,G=m,y=m.version,p=e.toneMapping),b.layers.enableAll(),U.unshift(b,b.geometry,b.material,0,0,null))}function f(U,D){U.getRGB(Sn,Ir(e)),t.buffers.color.setClear(Sn.r,Sn.g,Sn.b,D,o)}function s(){T!==void 0&&(T.geometry.dispose(),T.material.dispose(),T=void 0),b!==void 0&&(b.geometry.dispose(),b.material.dispose(),b=void 0)}return{getClearColor:function(){return d},setClearColor:function(U,D=1){d.set(U),g=D,f(d,g)},getClearAlpha:function(){return g},setClearAlpha:function(U){g=U,f(d,g)},render:N,addToRenderList:z,dispose:s}}function Tl(e,n){const t=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},l=p(null);let o=l,d=!1;function g(O,W,$,A,q){let Z=!1;const X=y(O,A,$,W);o!==X&&(o=X,T(o.object)),Z=M(O,A,$,q),Z&&N(O,A,$,q),q!==null&&n.update(q,e.ELEMENT_ARRAY_BUFFER),(Z||d)&&(d=!1,m(O,W,$,A),q!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.get(q).buffer))}function b(){return e.createVertexArray()}function T(O){return e.bindVertexArray(O)}function G(O){return e.deleteVertexArray(O)}function y(O,W,$,A){const q=A.wireframe===!0;let Z=i[W.id];Z===void 0&&(Z={},i[W.id]=Z);const X=O.isInstancedMesh===!0?O.id:0;let ne=Z[X];ne===void 0&&(ne={},Z[X]=ne);let Q=ne[$.id];Q===void 0&&(Q={},ne[$.id]=Q);let ie=Q[q];return ie===void 0&&(ie=p(b()),Q[q]=ie),ie}function p(O){const W=[],$=[],A=[];for(let q=0;q<t;q++)W[q]=0,$[q]=0,A[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:W,enabledAttributes:$,attributeDivisors:A,object:O,attributes:{},index:null}}function M(O,W,$,A){const q=o.attributes,Z=W.attributes;let X=0;const ne=$.getAttributes();for(const Q in ne)if(ne[Q].location>=0){const re=q[Q];let Ce=Z[Q];if(Ce===void 0&&(Q==="instanceMatrix"&&O.instanceMatrix&&(Ce=O.instanceMatrix),Q==="instanceColor"&&O.instanceColor&&(Ce=O.instanceColor)),re===void 0||re.attribute!==Ce||Ce&&re.data!==Ce.data)return!0;X++}return o.attributesNum!==X||o.index!==A}function N(O,W,$,A){const q={},Z=W.attributes;let X=0;const ne=$.getAttributes();for(const Q in ne)if(ne[Q].location>=0){let re=Z[Q];re===void 0&&(Q==="instanceMatrix"&&O.instanceMatrix&&(re=O.instanceMatrix),Q==="instanceColor"&&O.instanceColor&&(re=O.instanceColor));const Ce={};Ce.attribute=re,re&&re.data&&(Ce.data=re.data),q[Q]=Ce,X++}o.attributes=q,o.attributesNum=X,o.index=A}function z(){const O=o.newAttributes;for(let W=0,$=O.length;W<$;W++)O[W]=0}function f(O){s(O,0)}function s(O,W){const $=o.newAttributes,A=o.enabledAttributes,q=o.attributeDivisors;$[O]=1,A[O]===0&&(e.enableVertexAttribArray(O),A[O]=1),q[O]!==W&&(e.vertexAttribDivisor(O,W),q[O]=W)}function U(){const O=o.newAttributes,W=o.enabledAttributes;for(let $=0,A=W.length;$<A;$++)W[$]!==O[$]&&(e.disableVertexAttribArray($),W[$]=0)}function D(O,W,$,A,q,Z,X){X===!0?e.vertexAttribIPointer(O,W,$,q,Z):e.vertexAttribPointer(O,W,$,A,q,Z)}function m(O,W,$,A){z();const q=A.attributes,Z=$.getAttributes(),X=W.defaultAttributeValues;for(const ne in Z){const Q=Z[ne];if(Q.location>=0){let ie=q[ne];if(ie===void 0&&(ne==="instanceMatrix"&&O.instanceMatrix&&(ie=O.instanceMatrix),ne==="instanceColor"&&O.instanceColor&&(ie=O.instanceColor)),ie!==void 0){const re=ie.normalized,Ce=ie.itemSize,be=n.get(ie);if(be===void 0)continue;const nt=be.buffer,He=be.type,Ve=be.bytesPerElement,k=He===e.INT||He===e.UNSIGNED_INT||ie.gpuType===Fr;if(ie.isInterleavedBufferAttribute){const J=ie.data,xe=J.stride,Pe=ie.offset;if(J.isInstancedInterleavedBuffer){for(let ve=0;ve<Q.locationSize;ve++)s(Q.location+ve,J.meshPerAttribute);O.isInstancedMesh!==!0&&A._maxInstanceCount===void 0&&(A._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let ve=0;ve<Q.locationSize;ve++)f(Q.location+ve);e.bindBuffer(e.ARRAY_BUFFER,nt);for(let ve=0;ve<Q.locationSize;ve++)D(Q.location+ve,Ce/Q.locationSize,He,re,xe*Ve,(Pe+Ce/Q.locationSize*ve)*Ve,k)}else{if(ie.isInstancedBufferAttribute){for(let J=0;J<Q.locationSize;J++)s(Q.location+J,ie.meshPerAttribute);O.isInstancedMesh!==!0&&A._maxInstanceCount===void 0&&(A._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let J=0;J<Q.locationSize;J++)f(Q.location+J);e.bindBuffer(e.ARRAY_BUFFER,nt);for(let J=0;J<Q.locationSize;J++)D(Q.location+J,Ce/Q.locationSize,He,re,Ce*Ve,Ce/Q.locationSize*J*Ve,k)}}else if(X!==void 0){const re=X[ne];if(re!==void 0)switch(re.length){case 2:e.vertexAttrib2fv(Q.location,re);break;case 3:e.vertexAttrib3fv(Q.location,re);break;case 4:e.vertexAttrib4fv(Q.location,re);break;default:e.vertexAttrib1fv(Q.location,re)}}}}U()}function S(){_();for(const O in i){const W=i[O];for(const $ in W){const A=W[$];for(const q in A){const Z=A[q];for(const X in Z)G(Z[X].object),delete Z[X];delete A[q]}}delete i[O]}}function h(O){if(i[O.id]===void 0)return;const W=i[O.id];for(const $ in W){const A=W[$];for(const q in A){const Z=A[q];for(const X in Z)G(Z[X].object),delete Z[X];delete A[q]}}delete i[O.id]}function C(O){for(const W in i){const $=i[W];for(const A in $){const q=$[A];if(q[O.id]===void 0)continue;const Z=q[O.id];for(const X in Z)G(Z[X].object),delete Z[X];delete q[O.id]}}}function c(O){for(const W in i){const $=i[W],A=O.isInstancedMesh===!0?O.id:0,q=$[A];if(q!==void 0){for(const Z in q){const X=q[Z];for(const ne in X)G(X[ne].object),delete X[ne];delete q[Z]}delete $[A],Object.keys($).length===0&&delete i[W]}}}function _(){P(),d=!0,o!==l&&(o=l,T(o.object))}function P(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:g,reset:_,resetDefaultState:P,dispose:S,releaseStatesOfGeometry:h,releaseStatesOfObject:c,releaseStatesOfProgram:C,initAttributes:z,enableAttribute:f,disableUnusedAttributes:U}}function Al(e,n,t){let i;function l(b){i=b}function o(b,T){e.drawArrays(i,b,T),t.update(T,i,1)}function d(b,T,G){G!==0&&(e.drawArraysInstanced(i,b,T,G),t.update(T,i,G))}function g(b,T,G){if(G===0)return;n.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,b,0,T,0,G);let p=0;for(let M=0;M<G;M++)p+=T[M];t.update(p,i,1)}this.setMode=l,this.render=o,this.renderInstances=d,this.renderMultiDraw=g}function Rl(e,n,t,i){let l;function o(){if(l!==void 0)return l;if(n.has("EXT_texture_filter_anisotropic")===!0){const C=n.get("EXT_texture_filter_anisotropic");l=e.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function d(C){return!(C!==It&&i.convert(C)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function g(C){const c=C===yt&&(n.has("EXT_color_buffer_half_float")||n.has("EXT_color_buffer_float"));return!(C!==Lt&&C!==Gt&&!c&&i.convert(C)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function b(C){if(C==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let T=t.precision!==void 0?t.precision:"highp";const G=b(T);G!==T&&(Xe("WebGLRenderer:",T,"not supported, using",G,"instead."),T=G);const y=t.logarithmicDepthBuffer===!0,p=t.reversedDepthBuffer===!0&&n.has("EXT_clip_control");t.reversedDepthBuffer===!0&&p===!1&&Xe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const M=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),N=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),z=e.getParameter(e.MAX_TEXTURE_SIZE),f=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),s=e.getParameter(e.MAX_VERTEX_ATTRIBS),U=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),D=e.getParameter(e.MAX_VARYING_VECTORS),m=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),S=e.getParameter(e.MAX_SAMPLES),h=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:b,textureFormatReadable:d,textureTypeReadable:g,precision:T,logarithmicDepthBuffer:y,reversedDepthBuffer:p,maxTextures:M,maxVertexTextures:N,maxTextureSize:z,maxCubemapSize:f,maxAttributes:s,maxVertexUniforms:U,maxVaryings:D,maxFragmentUniforms:m,maxSamples:S,samples:h}}function bl(e){const n=this;let t=null,i=0,l=!1,o=!1;const d=new Ka,g=new Oe,b={value:null,needsUpdate:!1};this.uniform=b,this.numPlanes=0,this.numIntersection=0,this.init=function(y,p){const M=y.length!==0||p||i!==0||l;return l=p,i=y.length,M},this.beginShadows=function(){o=!0,G(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(y,p){t=G(y,p,0)},this.setState=function(y,p,M){const N=y.clippingPlanes,z=y.clipIntersection,f=y.clipShadows,s=e.get(y);if(!l||N===null||N.length===0||o&&!f)o?G(null):T();else{const U=o?0:i,D=U*4;let m=s.clippingState||null;b.value=m,m=G(N,p,D,M);for(let S=0;S!==D;++S)m[S]=t[S];s.clippingState=m,this.numIntersection=z?this.numPlanes:0,this.numPlanes+=U}};function T(){b.value!==t&&(b.value=t,b.needsUpdate=i>0),n.numPlanes=i,n.numIntersection=0}function G(y,p,M,N){const z=y!==null?y.length:0;let f=null;if(z!==0){if(f=b.value,N!==!0||f===null){const s=M+z*4,U=p.matrixWorldInverse;g.getNormalMatrix(U),(f===null||f.length<s)&&(f=new Float32Array(s));for(let D=0,m=M;D!==z;++D,m+=4)d.copy(y[D]).applyMatrix4(U,g),d.normal.toArray(f,m),f[m+3]=d.constant}b.value=f,b.needsUpdate=!0}return n.numPlanes=z,n.numIntersection=0,f}}const Jt=4,Cl=6,Pl=20,Ll=256,cn=new br,ir=new je;let Vn=null,Wn=0,kn=0,zn=!1;const wl=new Ne,Vt=new Ne;class rr{constructor(n){this._renderer=n,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(n,t=0,i=.1,l=100,o={}){const{size:d=256,position:g=wl}=o;Vn=this._renderer.getRenderTarget(),Wn=this._renderer.getActiveCubeFace(),kn=this._renderer.getActiveMipmapLevel(),zn=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(d);const b=this._allocateTargets();return b.depthBuffer=!0,this._sceneToCubeUV(n,i,l,b,g),t>0&&this._blur(b,0,0,t),this._applyPMREM(b),this._cleanup(b),b}fromEquirectangular(n,t=null){return this._fromTexture(n,t)}fromCubemap(n,t=null){return this._fromTexture(n,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=sr(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=or(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(n){this._lodMax=Math.floor(Math.log2(n)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let n=0;n<this._lodMeshes.length;n++)this._lodMeshes[n].geometry.dispose()}_cleanup(n){this._renderer.setRenderTarget(Vn,Wn,kn),this._renderer.xr.enabled=zn,n.scissorTest=!1,Yt(n,0,0,n.width,n.height)}_fromTexture(n,t){n.mapping===mn||n.mapping===rn?this._setSize(n.image.length===0?16:n.image[0].width||n.image[0].image.width):this._setSize(n.image.width/4),Vn=this._renderer.getRenderTarget(),Wn=this._renderer.getActiveCubeFace(),kn=this._renderer.getActiveMipmapLevel(),zn=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(n,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const n=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:xt,minFilter:xt,generateMipmaps:!1,type:yt,format:It,colorSpace:Xr,depthBuffer:!1},l=ar(n,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==n||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ar(n,t,i);const{_lodMax:o}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Ul(o)),this._blurMaterial=Il(o,n,t),this._ggxMaterial=Dl(o,n,t)}return l}_compileMaterial(n){const t=new pt(new en,n);this._renderer.compile(t,cn)}_sceneToCubeUV(n,t,i,l,o){const b=new un(90,1,t,i),T=[1,-1,1,1,1,1],G=[1,1,1,-1,-1,-1],y=this._renderer,p=y.autoClear,M=y.toneMapping;y.getClearColor(ir),y.toneMapping=Ut,y.autoClear=!1,y.state.buffers.depth.getReversed()&&(y.setRenderTarget(l),y.clearDepth(),y.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new pt(new ni,new qt({name:"PMREM.Background",side:Et,depthWrite:!1,depthTest:!1})));const z=this._backgroundBox,f=z.material;let s=!1;const U=n.background;U?U.isColor&&(f.color.copy(U),n.background=null,s=!0):(f.color.copy(ir),s=!0);for(let D=0;D<6;D++){const m=D%3;m===0?(b.up.set(0,T[D],0),b.position.set(o.x,o.y,o.z),b.lookAt(o.x+G[D],o.y,o.z)):m===1?(b.up.set(0,0,T[D]),b.position.set(o.x,o.y,o.z),b.lookAt(o.x,o.y+G[D],o.z)):(b.up.set(0,T[D],0),b.position.set(o.x,o.y,o.z),b.lookAt(o.x,o.y,o.z+G[D]));const S=this._cubeSize;Yt(l,m*S,D>2?S:0,S,S),y.setRenderTarget(l),s&&y.render(z,b),y.render(n,b)}y.toneMapping=M,y.autoClear=p,n.background=U}_textureToCubeUV(n,t){const i=this._renderer,l=n.mapping===mn||n.mapping===rn;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=sr()),this._cubemapMaterial.uniforms.flipEnvMap.value=n.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=or());const o=l?this._cubemapMaterial:this._equirectMaterial,d=this._lodMeshes[0];d.material=o;const g=o.uniforms;g.envMap.value=n;const b=this._cubeSize;Yt(t,0,0,3*b,2*b),i.setRenderTarget(t),i.render(d,cn)}_applyPMREM(n){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const l=this._lodMeshes.length;for(let o=1;o<l;o++)this._applyGGXFilter(n,o-1,o);t.autoClear=i}_applyGGXFilter(n,t,i){const l=this._renderer,o=this._pingPongRenderTarget,d=this._ggxMaterial,g=this._lodMeshes[i];g.material=d;const b=d.uniforms,T=i/(this._lodMeshes.length-1),G=t/(this._lodMeshes.length-1),y=Math.sqrt(T*T-G*G),p=T*1.25,M=y*p,{_lodMax:N}=this,z=this._sizeLods[i],f=3*z*(i>N-Jt?i-N+Jt:0),s=4*(this._cubeSize-z);b.envMap.value=n.texture,b.roughness.value=M,b.mipInt.value=N-t,Yt(o,f,s,3*z,2*z),l.setRenderTarget(o),l.render(g,cn),b.envMap.value=o.texture,b.roughness.value=0,b.mipInt.value=N-i,Yt(n,f,s,3*z,2*z),l.setRenderTarget(n),l.render(g,cn)}_blur(n,t,i,l){const o=this._pingPongRenderTarget,d=Math.min(l,Math.PI)/Math.SQRT2;this._blurPass(n,o,t,i,d),this._blurPass(o,n,i,i,d)}_blurPass(n,t,i,l,o){const d=this._renderer,g=this._blurMaterial,b=this._lodMeshes[l];b.material=g;const T=g.uniforms;T.envMap.value=n.texture,T.sigma.value=o,T.mipInt.value=this._lodMax-i;const G=this._sizeLods[l],y=3*G*(l>this._lodMax-Jt?l-this._lodMax+Jt:0),p=4*(this._cubeSize-G);Yt(t,y,p,3*G,2*G),d.setRenderTarget(t),d.render(b,cn)}}function Ul(e){const n=[],t=[];let i=e;const l=e-Jt+1+Cl;for(let o=0;o<l;o++){const d=Math.pow(2,i);n.push(d);const g=1/(d-2),b=-g,T=1+g,G=[b,b,T,b,T,T,b,b,T,T,b,T],y=6,p=6,M=3,N=new Float32Array(M*p*y),z=new Float32Array(M*p*y);for(let s=0;s<y;s++){const U=s%3*2/3-1,D=s>2?0:-1,m=[U,D,0,U+2/3,D,0,U+2/3,D+1,0,U,D,0,U+2/3,D+1,0,U,D+1,0];N.set(m,M*p*s);for(let S=0;S<p;S++){const h=G[S*2]*2-1,C=G[S*2+1]*2-1;s===0?Vt.set(1,C,h):s===1?Vt.set(-h,1,-C):s===2?Vt.set(-h,C,1):s===3?Vt.set(-1,C,-h):s===4?Vt.set(-h,-1,C):Vt.set(h,C,-1),Vt.toArray(z,(s*p+S)*M)}}const f=new en;f.setAttribute("position",new qn(N,M)),f.setAttribute("outputDirection",new qn(z,M)),t.push(new pt(f,null)),i>Jt&&i--}return{lodMeshes:t,sizeLods:n}}function ar(e,n,t){const i=new At(e,n,t);return i.texture.mapping=Cn,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Yt(e,n,t,i,l){e.viewport.set(n,t,i,l),e.scissor.set(n,t,i,l)}function Dl(e,n,t){return new Dt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Ll,CUBEUV_TEXEL_WIDTH:1/n,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Pn(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Nt,depthTest:!1,depthWrite:!1})}function Il(e,n,t){return new Dt({name:"SphericalGaussianBlur",defines:{SAMPLES:Pl,CUBEUV_TEXEL_WIDTH:1/n,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Pn(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Nt,depthTest:!1,depthWrite:!1})}function or(){return new Dt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Pn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Nt,depthTest:!1,depthWrite:!1})}function sr(){return new Dt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Pn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Nt,depthTest:!1,depthWrite:!1})}function Pn(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class qr extends At{constructor(n=1,t={}){super(n,n,t),this.isWebGLCubeRenderTarget=!0;const i={width:n,height:n,depth:1},l=[i,i,i,i,i,i];this.texture=new Nr(l),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(n,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},l=new ni(5,5,5),o=new Dt({name:"CubemapFromEquirect",uniforms:Zn(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Et,blending:Nt});o.uniforms.tEquirect.value=t;const d=new pt(l,o),g=t.minFilter;return t.minFilter===Zt&&(t.minFilter=xt),new oo(1,10,this).update(n,d),t.minFilter=g,d.geometry.dispose(),d.material.dispose(),this}clear(n,t=!0,i=!0,l=!0){const o=n.getRenderTarget();for(let d=0;d<6;d++)n.setRenderTarget(this,d),n.clear(t,i,l);n.setRenderTarget(o)}}function Nl(e){let n=new WeakMap,t=new WeakMap,i=null;function l(p,M=!1){return p==null?null:M?d(p):o(p)}function o(p){if(p&&p.isTexture){const M=p.mapping;if(M===Bn||M===Gn)if(n.has(p)){const N=n.get(p).texture;return g(N,p.mapping)}else{const N=p.image;if(N&&N.height>0){const z=new qr(N.height);return z.fromEquirectangularTexture(e,p),n.set(p,z),p.addEventListener("dispose",T),g(z.texture,p.mapping)}else return null}}return p}function d(p){if(p&&p.isTexture){const M=p.mapping,N=M===Bn||M===Gn,z=M===mn||M===rn;if(N||z){let f=t.get(p);const s=f!==void 0?f.texture.pmremVersion:0;if(p.isRenderTargetTexture&&p.pmremVersion!==s)return i===null&&(i=new rr(e)),f=N?i.fromEquirectangular(p,f):i.fromCubemap(p,f),f.texture.pmremVersion=p.pmremVersion,t.set(p,f),f.texture;if(f!==void 0)return f.texture;{const U=p.image;return N&&U&&U.height>0||z&&U&&b(U)?(i===null&&(i=new rr(e)),f=N?i.fromEquirectangular(p):i.fromCubemap(p),f.texture.pmremVersion=p.pmremVersion,t.set(p,f),p.addEventListener("dispose",G),f.texture):null}}}return p}function g(p,M){return M===Bn?p.mapping=mn:M===Gn&&(p.mapping=rn),p}function b(p){let M=0;const N=6;for(let z=0;z<N;z++)p[z]!==void 0&&M++;return M===N}function T(p){const M=p.target;M.removeEventListener("dispose",T);const N=n.get(M);N!==void 0&&(n.delete(M),N.dispose())}function G(p){const M=p.target;M.removeEventListener("dispose",G);const N=t.get(M);N!==void 0&&(t.delete(M),N.dispose())}function y(){n=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:l,dispose:y}}function yl(e){const n={};function t(i){if(n[i]!==void 0)return n[i];const l=e.getExtension(i);return n[i]=l,l}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const l=t(i);return l===null&&Ya("WebGLRenderer: "+i+" extension not supported."),l}}}function Fl(e,n,t,i){const l={},o=new WeakMap;function d(y){const p=y.target;p.index!==null&&n.remove(p.index);for(const N in p.attributes)n.remove(p.attributes[N]);p.removeEventListener("dispose",d),delete l[p.id];const M=o.get(p);M&&(n.remove(M),o.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function g(y,p){return l[p.id]===!0||(p.addEventListener("dispose",d),l[p.id]=!0,t.memory.geometries++),p}function b(y){const p=y.attributes;for(const M in p)n.update(p[M],e.ARRAY_BUFFER)}function T(y){const p=[],M=y.index,N=y.attributes.position;let z=0;if(N===void 0)return;if(M!==null){const U=M.array;z=M.version;for(let D=0,m=U.length;D<m;D+=3){const S=U[D+0],h=U[D+1],C=U[D+2];p.push(S,h,h,C,C,S)}}else{const U=N.array;z=N.version;for(let D=0,m=U.length/3-1;D<m;D+=3){const S=D+0,h=D+1,C=D+2;p.push(S,h,h,C,C,S)}}const f=new(N.count>=65535?_o:go)(p,1);f.version=z;const s=o.get(y);s&&n.remove(s),o.set(y,f)}function G(y){const p=o.get(y);if(p){const M=y.index;M!==null&&p.version<M.version&&T(y)}else T(y);return o.get(y)}return{get:g,update:b,getWireframeAttribute:G}}function Ol(e,n,t){let i;function l(y){i=y}let o,d;function g(y){o=y.type,d=y.bytesPerElement}function b(y,p){e.drawElements(i,p,o,y*d),t.update(p,i,1)}function T(y,p,M){M!==0&&(e.drawElementsInstanced(i,p,o,y*d,M),t.update(p,i,M))}function G(y,p,M){if(M===0)return;n.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,o,y,0,M);let z=0;for(let f=0;f<M;f++)z+=p[f];t.update(z,i,1)}this.setMode=l,this.setIndex=g,this.render=b,this.renderInstances=T,this.renderMultiDraw=G}function Bl(e){const n={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(o,d,g){switch(t.calls++,d){case e.TRIANGLES:t.triangles+=g*(o/3);break;case e.LINES:t.lines+=g*(o/2);break;case e.LINE_STRIP:t.lines+=g*(o-1);break;case e.LINE_LOOP:t.lines+=g*o;break;case e.POINTS:t.points+=g*o;break;default:tt("WebGLInfo: Unknown draw mode:",d);break}}function l(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:n,render:t,programs:null,autoReset:!0,reset:l,update:i}}function Gl(e,n,t){const i=new WeakMap,l=new St;function o(d,g,b){const T=d.morphTargetInfluences,G=g.morphAttributes.position||g.morphAttributes.normal||g.morphAttributes.color,y=G!==void 0?G.length:0;let p=i.get(g);if(p===void 0||p.count!==y){let _=function(){C.dispose(),i.delete(g),g.removeEventListener("dispose",_)};p!==void 0&&p.texture.dispose();const M=g.morphAttributes.position!==void 0,N=g.morphAttributes.normal!==void 0,z=g.morphAttributes.color!==void 0,f=g.morphAttributes.position||[],s=g.morphAttributes.normal||[],U=g.morphAttributes.color||[];let D=0;M===!0&&(D=1),N===!0&&(D=2),z===!0&&(D=3);let m=g.attributes.position.count*D,S=1;m>n.maxTextureSize&&(S=Math.ceil(m/n.maxTextureSize),m=n.maxTextureSize);const h=new Float32Array(m*S*4*y),C=new Or(h,m,S,y);C.type=Gt,C.needsUpdate=!0;const c=D*4;for(let P=0;P<y;P++){const O=f[P],W=s[P],$=U[P],A=m*S*4*P;for(let q=0;q<O.count;q++){const Z=q*c;M===!0&&(l.fromBufferAttribute(O,q),h[A+Z+0]=l.x,h[A+Z+1]=l.y,h[A+Z+2]=l.z,h[A+Z+3]=0),N===!0&&(l.fromBufferAttribute(W,q),h[A+Z+4]=l.x,h[A+Z+5]=l.y,h[A+Z+6]=l.z,h[A+Z+7]=0),z===!0&&(l.fromBufferAttribute($,q),h[A+Z+8]=l.x,h[A+Z+9]=l.y,h[A+Z+10]=l.z,h[A+Z+11]=$.itemSize===4?l.w:1)}}p={count:y,texture:C,size:new gt(m,S)},i.set(g,p),g.addEventListener("dispose",_)}if(d.isInstancedMesh===!0&&d.morphTexture!==null)b.getUniforms().setValue(e,"morphTexture",d.morphTexture,t);else{let M=0;for(let z=0;z<T.length;z++)M+=T[z];const N=g.morphTargetsRelative?1:1-M;b.getUniforms().setValue(e,"morphTargetBaseInfluence",N),b.getUniforms().setValue(e,"morphTargetInfluences",T)}b.getUniforms().setValue(e,"morphTargetsTexture",p.texture,t),b.getUniforms().setValue(e,"morphTargetsTextureSize",p.size)}return{update:o}}function Hl(e,n,t,i,l){let o=new WeakMap;function d(T){const G=l.render.frame,y=T.geometry,p=n.get(T,y);if(o.get(p)!==G&&(n.update(p),o.set(p,G)),T.isInstancedMesh&&(T.hasEventListener("dispose",b)===!1&&T.addEventListener("dispose",b),o.get(T)!==G&&(t.update(T.instanceMatrix,e.ARRAY_BUFFER),T.instanceColor!==null&&t.update(T.instanceColor,e.ARRAY_BUFFER),o.set(T,G))),T.isSkinnedMesh){const M=T.skeleton;o.get(M)!==G&&(M.update(),o.set(M,G))}return p}function g(){o=new WeakMap}function b(T){const G=T.target;G.removeEventListener("dispose",b),i.releaseStatesOfObject(G),t.remove(G.instanceMatrix),G.instanceColor!==null&&t.remove(G.instanceColor)}return{update:d,dispose:g}}const Vl={[zr]:"LINEAR_TONE_MAPPING",[kr]:"REINHARD_TONE_MAPPING",[Wr]:"CINEON_TONE_MAPPING",[ii]:"ACES_FILMIC_TONE_MAPPING",[Vr]:"AGX_TONE_MAPPING",[Hr]:"NEUTRAL_TONE_MAPPING",[Gr]:"CUSTOM_TONE_MAPPING"};function Wl(e,n,t,i,l,o){const d=new At(n,t,{type:e,depthBuffer:l,stencilBuffer:o,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let g=null,b=null;const T=new en;T.setAttribute("position",new Rn([-1,3,0,-1,-1,0,3,-1,0],3)),T.setAttribute("uv",new Rn([0,2,0,0,2,0],2));const G=new Va({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),y=new pt(T,G),p=new br(-1,1,1,-1,0,1);let M=null,N=null,z=!1,f,s=null,U=[],D=!1;this.setSize=function(m,S){d.setSize(m,S),g!==null&&g.setSize(m,S),b!==null&&b.setSize(m,S);for(let h=0;h<U.length;h++){const C=U[h];C.setSize&&C.setSize(m,S)}},this.setEffects=function(m){U=m,D=U.length>0&&U[0].isRenderPass===!0;const S=d.width,h=d.height;U.length>0&&g===null&&(g=new At(S,h,{type:yt,depthBuffer:!1,stencilBuffer:!1}),b=new At(S,h,{type:yt,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<U.length;C++){const c=U[C];c.setSize&&c.setSize(S,h)}},this.begin=function(m,S){if(z||m.toneMapping===Ut&&U.length===0)return!1;if(s=S,S!==null){const h=S.width,C=S.height;(d.width!==h||d.height!==C)&&this.setSize(h,C)}return D===!1&&m.setRenderTarget(d),f=m.toneMapping,m.toneMapping=Ut,!0},this.hasRenderPass=function(){return D},this.end=function(m,S){m.toneMapping=f,z=!0;let h=d,C=g;for(let c=0;c<U.length;c++){const _=U[c];_.enabled!==!1&&(_.render(m,C,h,S),_.needsSwap!==!1&&(h=C,C=C===g?b:g))}if(M!==m.outputColorSpace||N!==m.toneMapping){M=m.outputColorSpace,N=m.toneMapping,G.defines={},rt.getTransfer(M)===Je&&(G.defines.SRGB_TRANSFER="");const c=Vl[N];c&&(G.defines[c]=""),G.needsUpdate=!0}G.uniforms.tDiffuse.value=h.texture,m.setRenderTarget(s),m.render(y,p),s=null,z=!1},this.isCompositing=function(){return z},this.dispose=function(){d.dispose(),g!==null&&g.dispose(),b!==null&&b.dispose(),T.dispose(),G.dispose()}}const Zr=new To,Jn=new An(1,1),$r=new Or,Qr=new Mo,Jr=new Nr,cr=[],lr=[],fr=new Float32Array(16),dr=new Float32Array(9),ur=new Float32Array(4);function an(e,n,t){const i=e[0];if(i<=0||i>0)return e;const l=n*t;let o=cr[l];if(o===void 0&&(o=new Float32Array(l),cr[l]=o),n!==0){i.toArray(o,0);for(let d=1,g=0;d!==n;++d)g+=t,e[d].toArray(o,g)}return o}function dt(e,n){if(e.length!==n.length)return!1;for(let t=0,i=e.length;t<i;t++)if(e[t]!==n[t])return!1;return!0}function ut(e,n){for(let t=0,i=n.length;t<i;t++)e[t]=n[t]}function Ln(e,n){let t=lr[n];t===void 0&&(t=new Int32Array(n),lr[n]=t);for(let i=0;i!==n;++i)t[i]=e.allocateTextureUnit();return t}function kl(e,n){const t=this.cache;t[0]!==n&&(e.uniform1f(this.addr,n),t[0]=n)}function zl(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2f(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(dt(t,n))return;e.uniform2fv(this.addr,n),ut(t,n)}}function Xl(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3f(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else if(n.r!==void 0)(t[0]!==n.r||t[1]!==n.g||t[2]!==n.b)&&(e.uniform3f(this.addr,n.r,n.g,n.b),t[0]=n.r,t[1]=n.g,t[2]=n.b);else{if(dt(t,n))return;e.uniform3fv(this.addr,n),ut(t,n)}}function Yl(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4f(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(dt(t,n))return;e.uniform4fv(this.addr,n),ut(t,n)}}function Kl(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(dt(t,n))return;e.uniformMatrix2fv(this.addr,!1,n),ut(t,n)}else{if(dt(t,i))return;ur.set(i),e.uniformMatrix2fv(this.addr,!1,ur),ut(t,i)}}function ql(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(dt(t,n))return;e.uniformMatrix3fv(this.addr,!1,n),ut(t,n)}else{if(dt(t,i))return;dr.set(i),e.uniformMatrix3fv(this.addr,!1,dr),ut(t,i)}}function Zl(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(dt(t,n))return;e.uniformMatrix4fv(this.addr,!1,n),ut(t,n)}else{if(dt(t,i))return;fr.set(i),e.uniformMatrix4fv(this.addr,!1,fr),ut(t,i)}}function $l(e,n){const t=this.cache;t[0]!==n&&(e.uniform1i(this.addr,n),t[0]=n)}function Ql(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2i(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(dt(t,n))return;e.uniform2iv(this.addr,n),ut(t,n)}}function Jl(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3i(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(dt(t,n))return;e.uniform3iv(this.addr,n),ut(t,n)}}function jl(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4i(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(dt(t,n))return;e.uniform4iv(this.addr,n),ut(t,n)}}function ef(e,n){const t=this.cache;t[0]!==n&&(e.uniform1ui(this.addr,n),t[0]=n)}function tf(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2ui(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(dt(t,n))return;e.uniform2uiv(this.addr,n),ut(t,n)}}function nf(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3ui(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(dt(t,n))return;e.uniform3uiv(this.addr,n),ut(t,n)}}function rf(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4ui(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(dt(t,n))return;e.uniform4uiv(this.addr,n),ut(t,n)}}function af(e,n,t){const i=this.cache,l=t.allocateTextureUnit();i[0]!==l&&(e.uniform1i(this.addr,l),i[0]=l);let o;this.type===e.SAMPLER_2D_SHADOW?(Jn.compareFunction=t.isReversedDepthBuffer()?ei:ti,o=Jn):o=Zr,t.setTexture2D(n||o,l)}function of(e,n,t){const i=this.cache,l=t.allocateTextureUnit();i[0]!==l&&(e.uniform1i(this.addr,l),i[0]=l),t.setTexture3D(n||Qr,l)}function sf(e,n,t){const i=this.cache,l=t.allocateTextureUnit();i[0]!==l&&(e.uniform1i(this.addr,l),i[0]=l),t.setTextureCube(n||Jr,l)}function cf(e,n,t){const i=this.cache,l=t.allocateTextureUnit();i[0]!==l&&(e.uniform1i(this.addr,l),i[0]=l),t.setTexture2DArray(n||$r,l)}function lf(e){switch(e){case 5126:return kl;case 35664:return zl;case 35665:return Xl;case 35666:return Yl;case 35674:return Kl;case 35675:return ql;case 35676:return Zl;case 5124:case 35670:return $l;case 35667:case 35671:return Ql;case 35668:case 35672:return Jl;case 35669:case 35673:return jl;case 5125:return ef;case 36294:return tf;case 36295:return nf;case 36296:return rf;case 35678:case 36198:case 36298:case 36306:case 35682:return af;case 35679:case 36299:case 36307:return of;case 35680:case 36300:case 36308:case 36293:return sf;case 36289:case 36303:case 36311:case 36292:return cf}}function ff(e,n){e.uniform1fv(this.addr,n)}function df(e,n){const t=an(n,this.size,2);e.uniform2fv(this.addr,t)}function uf(e,n){const t=an(n,this.size,3);e.uniform3fv(this.addr,t)}function pf(e,n){const t=an(n,this.size,4);e.uniform4fv(this.addr,t)}function hf(e,n){const t=an(n,this.size,4);e.uniformMatrix2fv(this.addr,!1,t)}function mf(e,n){const t=an(n,this.size,9);e.uniformMatrix3fv(this.addr,!1,t)}function _f(e,n){const t=an(n,this.size,16);e.uniformMatrix4fv(this.addr,!1,t)}function gf(e,n){e.uniform1iv(this.addr,n)}function vf(e,n){e.uniform2iv(this.addr,n)}function Sf(e,n){e.uniform3iv(this.addr,n)}function Ef(e,n){e.uniform4iv(this.addr,n)}function xf(e,n){e.uniform1uiv(this.addr,n)}function Mf(e,n){e.uniform2uiv(this.addr,n)}function Tf(e,n){e.uniform3uiv(this.addr,n)}function Af(e,n){e.uniform4uiv(this.addr,n)}function Rf(e,n,t){const i=this.cache,l=n.length,o=Ln(t,l);dt(i,o)||(e.uniform1iv(this.addr,o),ut(i,o));let d;this.type===e.SAMPLER_2D_SHADOW?d=Jn:d=Zr;for(let g=0;g!==l;++g)t.setTexture2D(n[g]||d,o[g])}function bf(e,n,t){const i=this.cache,l=n.length,o=Ln(t,l);dt(i,o)||(e.uniform1iv(this.addr,o),ut(i,o));for(let d=0;d!==l;++d)t.setTexture3D(n[d]||Qr,o[d])}function Cf(e,n,t){const i=this.cache,l=n.length,o=Ln(t,l);dt(i,o)||(e.uniform1iv(this.addr,o),ut(i,o));for(let d=0;d!==l;++d)t.setTextureCube(n[d]||Jr,o[d])}function Pf(e,n,t){const i=this.cache,l=n.length,o=Ln(t,l);dt(i,o)||(e.uniform1iv(this.addr,o),ut(i,o));for(let d=0;d!==l;++d)t.setTexture2DArray(n[d]||$r,o[d])}function Lf(e){switch(e){case 5126:return ff;case 35664:return df;case 35665:return uf;case 35666:return pf;case 35674:return hf;case 35675:return mf;case 35676:return _f;case 5124:case 35670:return gf;case 35667:case 35671:return vf;case 35668:case 35672:return Sf;case 35669:case 35673:return Ef;case 5125:return xf;case 36294:return Mf;case 36295:return Tf;case 36296:return Af;case 35678:case 36198:case 36298:case 36306:case 35682:return Rf;case 35679:case 36299:case 36307:return bf;case 35680:case 36300:case 36308:case 36293:return Cf;case 36289:case 36303:case 36311:case 36292:return Pf}}class wf{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.setValue=lf(t.type)}}class Uf{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Lf(t.type)}}class Df{constructor(n){this.id=n,this.seq=[],this.map={}}setValue(n,t,i){const l=this.seq;for(let o=0,d=l.length;o!==d;++o){const g=l[o];g.setValue(n,t[g.id],i)}}}const Xn=/(\w+)(\])?(\[|\.)?/g;function pr(e,n){e.seq.push(n),e.map[n.id]=n}function If(e,n,t){const i=e.name,l=i.length;for(Xn.lastIndex=0;;){const o=Xn.exec(i),d=Xn.lastIndex;let g=o[1];const b=o[2]==="]",T=o[3];if(b&&(g=g|0),T===void 0||T==="["&&d+2===l){pr(t,T===void 0?new wf(g,e,n):new Uf(g,e,n));break}else{let y=t.map[g];y===void 0&&(y=new Df(g),pr(t,y)),t=y}}}class Tn{constructor(n,t){this.seq=[],this.map={};const i=n.getProgramParameter(t,n.ACTIVE_UNIFORMS);for(let d=0;d<i;++d){const g=n.getActiveUniform(t,d),b=n.getUniformLocation(t,g.name);If(g,b,this)}const l=[],o=[];for(const d of this.seq)d.type===n.SAMPLER_2D_SHADOW||d.type===n.SAMPLER_CUBE_SHADOW||d.type===n.SAMPLER_2D_ARRAY_SHADOW?l.push(d):o.push(d);l.length>0&&(this.seq=l.concat(o))}setValue(n,t,i,l){const o=this.map[t];o!==void 0&&o.setValue(n,i,l)}setOptional(n,t,i){const l=t[i];l!==void 0&&this.setValue(n,i,l)}static upload(n,t,i,l){for(let o=0,d=t.length;o!==d;++o){const g=t[o],b=i[g.id];b.needsUpdate!==!1&&g.setValue(n,b.value,l)}}static seqWithValue(n,t){const i=[];for(let l=0,o=n.length;l!==o;++l){const d=n[l];d.id in t&&i.push(d)}return i}}function hr(e,n,t){const i=e.createShader(n);return e.shaderSource(i,t),e.compileShader(i),i}const Nf=37297;let yf=0;function Ff(e,n){const t=e.split(`
`),i=[],l=Math.max(n-6,0),o=Math.min(n+6,t.length);for(let d=l;d<o;d++){const g=d+1;i.push(`${g===n?">":" "} ${g}: ${t[d]}`)}return i.join(`
`)}const mr=new Oe;function Of(e){rt._getMatrix(mr,rt.workingColorSpace,e);const n=`mat3( ${mr.elements.map(t=>t.toFixed(4))} )`;switch(rt.getTransfer(e)){case Br:return[n,"LinearTransferOETF"];case Je:return[n,"sRGBTransferOETF"];default:return Xe("WebGLProgram: Unsupported color space: ",e),[n,"LinearTransferOETF"]}}function _r(e,n,t){const i=e.getShaderParameter(n,e.COMPILE_STATUS),o=(e.getShaderInfoLog(n)||"").trim();if(i&&o==="")return"";const d=/ERROR: 0:(\d+)/.exec(o);if(d){const g=parseInt(d[1]);return t.toUpperCase()+`

`+o+`

`+Ff(e.getShaderSource(n),g)}else return o}function Bf(e,n){const t=Of(n);return[`vec4 ${e}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Gf={[zr]:"Linear",[kr]:"Reinhard",[Wr]:"Cineon",[ii]:"ACESFilmic",[Vr]:"AgX",[Hr]:"Neutral",[Gr]:"Custom"};function Hf(e,n){const t=Gf[n];return t===void 0?(Xe("WebGLProgram: Unsupported toneMapping:",n),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+e+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const En=new Ne;function Vf(){rt.getLuminanceCoefficients(En);const e=En.x.toFixed(4),n=En.y.toFixed(4),t=En.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${n}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Wf(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(dn).join(`
`)}function kf(e){const n=[];for(const t in e){const i=e[t];i!==!1&&n.push("#define "+t+" "+i)}return n.join(`
`)}function zf(e,n){const t={},i=e.getProgramParameter(n,e.ACTIVE_ATTRIBUTES);for(let l=0;l<i;l++){const o=e.getActiveAttrib(n,l),d=o.name;let g=1;o.type===e.FLOAT_MAT2&&(g=2),o.type===e.FLOAT_MAT3&&(g=3),o.type===e.FLOAT_MAT4&&(g=4),t[d]={type:o.type,location:e.getAttribLocation(n,d),locationSize:g}}return t}function dn(e){return e!==""}function gr(e,n){const t=n.numSpotLightShadows+n.numSpotLightMaps-n.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,n.numSunLights).replace(/NUM_DIR_LIGHTS/g,n.numDirLights).replace(/NUM_SPOT_LIGHTS/g,n.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,n.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,n.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,n.numPointLights).replace(/NUM_HEMI_LIGHTS/g,n.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,n.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,n.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,n.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,n.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,n.numPointLightShadows)}function vr(e,n){return e.replace(/NUM_CLIPPING_PLANES/g,n.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,n.numClippingPlanes-n.numClipIntersection)}const Xf=/^[ \t]*#include +<([\w\d./]+)>/gm;function jn(e){return e.replace(Xf,Kf)}const Yf=new Map;function Kf(e,n){let t=Ue[n];if(t===void 0){const i=Yf.get(n);if(i!==void 0)t=Ue[i],Xe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',n,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+n+">")}return jn(t)}const qf=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sr(e){return e.replace(qf,Zf)}function Zf(e,n,t,i){let l="";for(let o=parseInt(n);o<parseInt(t);o++)l+=i.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return l}function Er(e){let n=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?n+=`
#define HIGH_PRECISION`:e.precision==="mediump"?n+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(n+=`
#define LOW_PRECISION`),n}const $f={[xn]:"SHADOWMAP_TYPE_PCF",[fn]:"SHADOWMAP_TYPE_VSM"};function Qf(e){return $f[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Jf={[mn]:"ENVMAP_TYPE_CUBE",[rn]:"ENVMAP_TYPE_CUBE",[Cn]:"ENVMAP_TYPE_CUBE_UV"};function jf(e){return e.envMap===!1?"ENVMAP_TYPE_CUBE":Jf[e.envMapMode]||"ENVMAP_TYPE_CUBE"}const ed={[rn]:"ENVMAP_MODE_REFRACTION"};function td(e){return e.envMap===!1?"ENVMAP_MODE_REFLECTION":ed[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}const nd={[xo]:"ENVMAP_BLENDING_MULTIPLY",[Eo]:"ENVMAP_BLENDING_MIX",[So]:"ENVMAP_BLENDING_ADD"};function id(e){return e.envMap===!1?"ENVMAP_BLENDING_NONE":nd[e.combine]||"ENVMAP_BLENDING_NONE"}function rd(e){const n=e.envMapCubeUVHeight;if(n===null)return null;const t=Math.log2(n)-2,i=1/n;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function ad(e,n,t,i){const l=e.getContext(),o=t.defines;let d=t.vertexShader,g=t.fragmentShader;const b=Qf(t),T=jf(t),G=td(t),y=id(t),p=rd(t),M=Wf(t),N=kf(o),z=l.createProgram();let f,s,U=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,N].filter(dn).join(`
`),f.length>0&&(f+=`
`),s=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,N].filter(dn).join(`
`),s.length>0&&(s+=`
`)):(f=[Er(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,N,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+G:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+b:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(dn).join(`
`),s=[Er(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,N,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+T:"",t.envMap?"#define "+G:"",t.envMap?"#define "+y:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+b:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ut?"#define TONE_MAPPING":"",t.toneMapping!==Ut?Ue.tonemapping_pars_fragment:"",t.toneMapping!==Ut?Hf("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ue.colorspace_pars_fragment,Bf("linearToOutputTexel",t.outputColorSpace),Vf(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(dn).join(`
`)),d=jn(d),d=gr(d,t),d=vr(d,t),g=jn(g),g=gr(g,t),g=vr(g,t),d=Sr(d),g=Sr(g),t.isRawShaderMaterial!==!0&&(U=`#version 300 es
`,f=[M,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,s=["#define varying in",t.glslVersion===Ji?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ji?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+s);const D=U+f+d,m=U+s+g,S=hr(l,l.VERTEX_SHADER,D),h=hr(l,l.FRAGMENT_SHADER,m);l.attachShader(z,S),l.attachShader(z,h),t.index0AttributeName!==void 0?l.bindAttribLocation(z,0,t.index0AttributeName):t.hasPositionAttribute===!0&&l.bindAttribLocation(z,0,"position"),l.linkProgram(z);function C(O){if(e.debug.checkShaderErrors){const W=l.getProgramInfoLog(z)||"",$=l.getShaderInfoLog(S)||"",A=l.getShaderInfoLog(h)||"",q=W.trim(),Z=$.trim(),X=A.trim();let ne=!0,Q=!0;if(l.getProgramParameter(z,l.LINK_STATUS)===!1)if(ne=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(l,z,S,h);else{const ie=_r(l,S,"vertex"),re=_r(l,h,"fragment");tt("WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(z,l.VALIDATE_STATUS)+`

Material Name: `+O.name+`
Material Type: `+O.type+`

Program Info Log: `+q+`
`+ie+`
`+re)}else q!==""?Xe("WebGLProgram: Program Info Log:",q):(Z===""||X==="")&&(Q=!1);Q&&(O.diagnostics={runnable:ne,programLog:q,vertexShader:{log:Z,prefix:f},fragmentShader:{log:X,prefix:s}})}l.deleteShader(S),l.deleteShader(h),c=new Tn(l,z),_=zf(l,z)}let c;this.getUniforms=function(){return c===void 0&&C(this),c};let _;this.getAttributes=function(){return _===void 0&&C(this),_};let P=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=l.getProgramParameter(z,Nf)),P},this.destroy=function(){i.releaseStatesOfProgram(this),l.deleteProgram(z),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=yf++,this.cacheKey=n,this.usedTimes=1,this.program=z,this.vertexShader=S,this.fragmentShader=h,this}let od=0;class sd{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(n,t,i){const l=this._getShaderCacheForMaterial(n);return l.has(t)===!1&&(l.add(t),t.usedTimes++),l.has(i)===!1&&(l.add(i),i.usedTimes++),this}remove(n){const t=this.materialCache.get(n);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(n),this}getVertexShaderStage(n){return this._getShaderStage(n.vertexShader)}getFragmentShaderStage(n){return this._getShaderStage(n.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(n){const t=this.materialCache;let i=t.get(n);return i===void 0&&(i=new Set,t.set(n,i)),i}_getShaderStage(n){const t=this.shaderCache;let i=t.get(n);return i===void 0&&(i=new cd(n),t.set(n,i)),i}}class cd{constructor(n){this.id=od++,this.code=n,this.usedTimes=0}}function ld(e){return e===tn||e===$n||e===Qn}function fd(e,n,t,i,l,o){const d=new mo,g=new sd,b=new Set,T=[],G=new Map,y=i.logarithmicDepthBuffer;let p=i.precision;const M={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function N(c){return b.add(c),c===0?"uv":`uv${c}`}function z(c,_,P,O,W,$){const A=O.fog,q=W.geometry,Z=c.isMeshStandardMaterial||c.isMeshLambertMaterial||c.isMeshPhongMaterial?O.environment:null,X=c.isMeshStandardMaterial||c.isMeshLambertMaterial&&!c.envMap||c.isMeshPhongMaterial&&!c.envMap,ne=n.get(c.envMap||Z,X),Q=ne&&ne.mapping===Cn?ne.image.height:null,ie=M[c.type];c.precision!==null&&(p=i.getMaxPrecision(c.precision),p!==c.precision&&Xe("WebGLProgram.getParameters:",c.precision,"not supported, using",p,"instead."));const re=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,Ce=re!==void 0?re.length:0;let be=0;q.morphAttributes.position!==void 0&&(be=1),q.morphAttributes.normal!==void 0&&(be=2),q.morphAttributes.color!==void 0&&(be=3);let nt,He,Ve,k;if(ie){const $e=Pt[ie];nt=$e.vertexShader,He=$e.fragmentShader}else{nt=c.vertexShader,He=c.fragmentShader;const $e=g.getVertexShaderStage(c),ke=g.getFragmentShaderStage(c);g.update(c,$e,ke),Ve=$e.id,k=ke.id}const J=e.getRenderTarget(),xe=e.state.buffers.depth.getReversed(),Pe=W.isInstancedMesh===!0,ve=W.isBatchedMesh===!0,ye=!!c.map,at=!!c.matcap,Le=!!ne,Fe=!!c.aoMap,We=!!c.lightMap,De=!!c.bumpMap&&c.wireframe===!1,Ke=!!c.normalMap,ot=!!c.displacementMap,lt=!!c.emissiveMap,Ze=!!c.metalnessMap,it=!!c.roughnessMap,x=c.anisotropy>0,ft=c.clearcoat>0,Ge=c.dispersion>0,u=c.retroreflectivity>0,r=c.iridescence>0,R=c.sheen>0,I=c.transmission>0,B=x&&!!c.anisotropyMap,ae=ft&&!!c.clearcoatMap,ce=ft&&!!c.clearcoatNormalMap,V=ft&&!!c.clearcoatRoughnessMap,Y=r&&!!c.iridescenceMap,le=r&&!!c.iridescenceThicknessMap,j=R&&!!c.sheenColorMap,K=R&&!!c.sheenRoughnessMap,te=!!c.specularMap,ue=!!c.specularColorMap,me=!!c.specularIntensityMap,Re=I&&!!c.transmissionMap,v=I&&!!c.thicknessMap,oe=!!c.gradientMap,H=!!c.alphaMap,se=c.alphaTest>0,fe=!!c.alphaHash,ee=!!c.extensions;let Ae=Ut;c.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Ae=e.toneMapping);const Me={shaderID:ie,shaderType:c.type,shaderName:c.name,vertexShader:nt,fragmentShader:He,defines:c.defines,customVertexShaderID:Ve,customFragmentShaderID:k,isRawShaderMaterial:c.isRawShaderMaterial===!0,glslVersion:c.glslVersion,precision:p,batching:ve,batchingColor:ve&&W._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&W.instanceColor!==null,instancingMorph:Pe&&W.morphTexture!==null,outputColorSpace:J===null?e.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:rt.workingColorSpace,alphaToCoverage:!!c.alphaToCoverage,map:ye,matcap:at,envMap:Le,envMapMode:Le&&ne.mapping,envMapCubeUVHeight:Q,aoMap:Fe,lightMap:We,bumpMap:De,normalMap:Ke,displacementMap:ot,emissiveMap:lt,normalMapObjectSpace:Ke&&c.normalMapType===ao,normalMapTangentSpace:Ke&&c.normalMapType===Ei,packedNormalMap:Ke&&c.normalMapType===Ei&&ld(c.normalMap.format),metalnessMap:Ze,roughnessMap:it,anisotropy:x,anisotropyMap:B,clearcoat:ft,clearcoatMap:ae,clearcoatNormalMap:ce,clearcoatRoughnessMap:V,dispersion:Ge,retroreflection:u,iridescence:r,iridescenceMap:Y,iridescenceThicknessMap:le,sheen:R,sheenColorMap:j,sheenRoughnessMap:K,specularMap:te,specularColorMap:ue,specularIntensityMap:me,transmission:I,transmissionMap:Re,thicknessMap:v,gradientMap:oe,opaque:c.transparent===!1&&c.blending===Mn&&c.alphaToCoverage===!1,alphaMap:H,alphaTest:se,alphaHash:fe,combine:c.combine,mapUv:ye&&N(c.map.channel),aoMapUv:Fe&&N(c.aoMap.channel),lightMapUv:We&&N(c.lightMap.channel),bumpMapUv:De&&N(c.bumpMap.channel),normalMapUv:Ke&&N(c.normalMap.channel),displacementMapUv:ot&&N(c.displacementMap.channel),emissiveMapUv:lt&&N(c.emissiveMap.channel),metalnessMapUv:Ze&&N(c.metalnessMap.channel),roughnessMapUv:it&&N(c.roughnessMap.channel),anisotropyMapUv:B&&N(c.anisotropyMap.channel),clearcoatMapUv:ae&&N(c.clearcoatMap.channel),clearcoatNormalMapUv:ce&&N(c.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:V&&N(c.clearcoatRoughnessMap.channel),iridescenceMapUv:Y&&N(c.iridescenceMap.channel),iridescenceThicknessMapUv:le&&N(c.iridescenceThicknessMap.channel),sheenColorMapUv:j&&N(c.sheenColorMap.channel),sheenRoughnessMapUv:K&&N(c.sheenRoughnessMap.channel),specularMapUv:te&&N(c.specularMap.channel),specularColorMapUv:ue&&N(c.specularColorMap.channel),specularIntensityMapUv:me&&N(c.specularIntensityMap.channel),transmissionMapUv:Re&&N(c.transmissionMap.channel),thicknessMapUv:v&&N(c.thicknessMap.channel),alphaMapUv:H&&N(c.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(Ke||x),vertexNormals:!!q.attributes.normal,vertexColors:c.vertexColors,vertexAlphas:c.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:W.isPoints===!0&&!!q.attributes.uv&&(ye||H),fog:!!A,useFog:c.fog===!0,fogExp2:!!A&&A.isFogExp2,flatShading:c.wireframe===!1&&(c.flatShading===!0||q.attributes.normal===void 0&&Ke===!1&&(c.isMeshLambertMaterial||c.isMeshPhongMaterial||c.isMeshStandardMaterial||c.isMeshPhysicalMaterial)),sizeAttenuation:c.sizeAttenuation===!0,logarithmicDepthBuffer:y,reversedDepthBuffer:xe,skinning:W.isSkinnedMesh===!0,hasPositionAttribute:q.attributes.position!==void 0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:Ce,morphTextureStride:be,numSunLights:_.sun.length,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numSunLightShadows:_.sunShadowMap.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numLightProbeGrids:$.length,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:c.dithering,shadowMapEnabled:e.shadowMap.enabled&&P.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ae,decodeVideoTexture:ye&&c.map.isVideoTexture===!0&&rt.getTransfer(c.map.colorSpace)===Je,decodeVideoTextureEmissive:lt&&c.emissiveMap.isVideoTexture===!0&&rt.getTransfer(c.emissiveMap.colorSpace)===Je,premultipliedAlpha:c.premultipliedAlpha,doubleSided:c.side===wt,flipSided:c.side===Et,useDepthPacking:c.depthPacking>=0,depthPacking:c.depthPacking||0,index0AttributeName:c.index0AttributeName,extensionClipCullDistance:ee&&c.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ee&&c.extensions.multiDraw===!0||ve)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:c.customProgramCacheKey()};return Me.vertexUv1s=b.has(1),Me.vertexUv2s=b.has(2),Me.vertexUv3s=b.has(3),b.clear(),Me}function f(c){const _=[];if(c.shaderID?_.push(c.shaderID):(_.push(c.customVertexShaderID),_.push(c.customFragmentShaderID)),c.defines!==void 0)for(const P in c.defines)_.push(P),_.push(c.defines[P]);return c.isRawShaderMaterial===!1&&(s(_,c),U(_,c),_.push(e.outputColorSpace)),_.push(c.customProgramCacheKey),_.join()}function s(c,_){c.push(_.precision),c.push(_.outputColorSpace),c.push(_.envMapMode),c.push(_.envMapCubeUVHeight),c.push(_.mapUv),c.push(_.alphaMapUv),c.push(_.lightMapUv),c.push(_.aoMapUv),c.push(_.bumpMapUv),c.push(_.normalMapUv),c.push(_.displacementMapUv),c.push(_.emissiveMapUv),c.push(_.metalnessMapUv),c.push(_.roughnessMapUv),c.push(_.anisotropyMapUv),c.push(_.clearcoatMapUv),c.push(_.clearcoatNormalMapUv),c.push(_.clearcoatRoughnessMapUv),c.push(_.iridescenceMapUv),c.push(_.iridescenceThicknessMapUv),c.push(_.sheenColorMapUv),c.push(_.sheenRoughnessMapUv),c.push(_.specularMapUv),c.push(_.specularColorMapUv),c.push(_.specularIntensityMapUv),c.push(_.transmissionMapUv),c.push(_.thicknessMapUv),c.push(_.combine),c.push(_.fogExp2),c.push(_.sizeAttenuation),c.push(_.morphTargetsCount),c.push(_.morphAttributeCount),c.push(_.numSunLights),c.push(_.numDirLights),c.push(_.numPointLights),c.push(_.numSpotLights),c.push(_.numSpotLightMaps),c.push(_.numHemiLights),c.push(_.numRectAreaLights),c.push(_.numSunLightShadows),c.push(_.numDirLightShadows),c.push(_.numPointLightShadows),c.push(_.numSpotLightShadows),c.push(_.numSpotLightShadowsWithMaps),c.push(_.numLightProbes),c.push(_.shadowMapType),c.push(_.toneMapping),c.push(_.numClippingPlanes),c.push(_.numClipIntersection),c.push(_.depthPacking)}function U(c,_){d.disableAll(),_.instancing&&d.enable(0),_.instancingColor&&d.enable(1),_.instancingMorph&&d.enable(2),_.matcap&&d.enable(3),_.envMap&&d.enable(4),_.normalMapObjectSpace&&d.enable(5),_.normalMapTangentSpace&&d.enable(6),_.clearcoat&&d.enable(7),_.iridescence&&d.enable(8),_.alphaTest&&d.enable(9),_.vertexColors&&d.enable(10),_.vertexAlphas&&d.enable(11),_.vertexUv1s&&d.enable(12),_.vertexUv2s&&d.enable(13),_.vertexUv3s&&d.enable(14),_.vertexTangents&&d.enable(15),_.anisotropy&&d.enable(16),_.alphaHash&&d.enable(17),_.batching&&d.enable(18),_.dispersion&&d.enable(19),_.retroreflection&&d.enable(24),_.batchingColor&&d.enable(20),_.gradientMap&&d.enable(21),_.packedNormalMap&&d.enable(22),_.vertexNormals&&d.enable(23),c.push(d.mask),d.disableAll(),_.fog&&d.enable(0),_.useFog&&d.enable(1),_.flatShading&&d.enable(2),_.logarithmicDepthBuffer&&d.enable(3),_.reversedDepthBuffer&&d.enable(4),_.skinning&&d.enable(5),_.morphTargets&&d.enable(6),_.morphNormals&&d.enable(7),_.morphColors&&d.enable(8),_.premultipliedAlpha&&d.enable(9),_.shadowMapEnabled&&d.enable(10),_.doubleSided&&d.enable(11),_.flipSided&&d.enable(12),_.useDepthPacking&&d.enable(13),_.dithering&&d.enable(14),_.transmission&&d.enable(15),_.sheen&&d.enable(16),_.opaque&&d.enable(17),_.pointsUvs&&d.enable(18),_.decodeVideoTexture&&d.enable(19),_.decodeVideoTextureEmissive&&d.enable(20),_.alphaToCoverage&&d.enable(21),_.numLightProbeGrids>0&&d.enable(22),_.hasPositionAttribute&&d.enable(23),c.push(d.mask)}function D(c){const _=M[c.type];let P;if(_){const O=Pt[_];P=ro.clone(O.uniforms)}else P=c.uniforms;return P}function m(c,_){let P=G.get(_);return P!==void 0?++P.usedTimes:(P=new ad(e,_,c,l),T.push(P),G.set(_,P)),P}function S(c){if(--c.usedTimes===0){const _=T.indexOf(c);T[_]=T[T.length-1],T.pop(),G.delete(c.cacheKey),c.destroy()}}function h(c){g.remove(c)}function C(){g.dispose()}return{getParameters:z,getProgramCacheKey:f,getUniforms:D,acquireProgram:m,releaseProgram:S,releaseShaderCache:h,programs:T,dispose:C}}function dd(){let e=new WeakMap;function n(d){return e.has(d)}function t(d){let g=e.get(d);return g===void 0&&(g={},e.set(d,g)),g}function i(d){e.delete(d)}function l(d,g,b){e.get(d)[g]=b}function o(){e=new WeakMap}return{has:n,get:t,remove:i,update:l,dispose:o}}function ud(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.material.id!==n.material.id?e.material.id-n.material.id:e.materialVariant!==n.materialVariant?e.materialVariant-n.materialVariant:e.z!==n.z?e.z-n.z:e.id-n.id}function xr(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.z!==n.z?n.z-e.z:e.id-n.id}function Mr(){const e=[];let n=0;const t=[],i=[],l=[];function o(){n=0,t.length=0,i.length=0,l.length=0}function d(p){let M=0;return p.isInstancedMesh&&(M+=2),p.isSkinnedMesh&&(M+=1),M}function g(p,M,N,z,f,s){let U=e[n];return U===void 0?(U={id:p.id,object:p,geometry:M,material:N,materialVariant:d(p),groupOrder:z,renderOrder:p.renderOrder,z:f,group:s},e[n]=U):(U.id=p.id,U.object=p,U.geometry=M,U.material=N,U.materialVariant=d(p),U.groupOrder=z,U.renderOrder=p.renderOrder,U.z=f,U.group=s),n++,U}function b(p,M,N,z,f,s,U){U.reversedDepth===!0&&(f=-f);const D=g(p,M,N,z,f,s);N.transmission>0?i.push(D):N.transparent===!0?l.push(D):t.push(D)}function T(p,M,N,z,f,s){const U=g(p,M,N,z,f,s);N.transmission>0?i.unshift(U):N.transparent===!0?l.unshift(U):t.unshift(U)}function G(p,M){t.length>1&&t.sort(p||ud),i.length>1&&i.sort(M||xr),l.length>1&&l.sort(M||xr)}function y(){for(let p=n,M=e.length;p<M;p++){const N=e[p];if(N.id===null)break;N.id=null,N.object=null,N.geometry=null,N.material=null,N.group=null}}return{opaque:t,transmissive:i,transparent:l,init:o,push:b,unshift:T,finish:y,sort:G}}function pd(){let e=new WeakMap;function n(i,l){const o=e.get(i);let d;return o===void 0?(d=new Mr,e.set(i,[d])):l>=o.length?(d=new Mr,o.push(d)):d=o[l],d}function t(){e=new WeakMap}return{get:n,dispose:t}}function hd(){const e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"SunLight":case"DirectionalLight":t={direction:new Ne,color:new je};break;case"SpotLight":t={position:new Ne,direction:new Ne,color:new je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Ne,color:new je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Ne,skyColor:new je,groundColor:new je};break;case"RectAreaLight":t={color:new je,position:new Ne,halfWidth:new Ne,halfHeight:new Ne};break}return e[n.id]=t,t}}}function md(){const e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new gt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new gt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new gt,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[n.id]=t,t}}}let _d=0;function gd(e,n){return(n.castShadow?2:0)-(e.castShadow?2:0)+(n.map?1:0)-(e.map?1:0)}function vd(e){const n=new hd,t=md(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let T=0;T<9;T++)i.probe.push(new Ne);const l=new Ne,o=new jt,d=new jt;function g(T){let G=0,y=0,p=0;for(let W=0;W<9;W++)i.probe[W].set(0,0,0);let M=0,N=0,z=0,f=0,s=0,U=0,D=0,m=0,S=0,h=0,C=0,c=0,_=0,P=0;T.sort(gd);for(let W=0,$=T.length;W<$;W++){const A=T[W],q=A.color,Z=A.intensity,X=A.distance;let ne=null;if(A.shadow&&A.shadow.map&&(A.shadow.map.texture.format===tn?ne=A.shadow.map.texture:ne=A.shadow.map.depthTexture||A.shadow.map.texture),A.isAmbientLight)G+=q.r*Z,y+=q.g*Z,p+=q.b*Z;else if(A.isLightProbe){for(let Q=0;Q<9;Q++)i.probe[Q].addScaledVector(A.sh.coefficients[Q],Z);P++}else if(A.isSunLight){const Q=n.get(A);if(Q.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const ie=A.shadow,re=t.get(A);re.shadowIntensity=ie.intensity,re.shadowBias=ie.bias,re.shadowNormalBias=ie.normalBias,re.shadowRadius=ie.radius,re.shadowMapSize.copy(ie.mapSize).multiply(ie.getFrameExtents()),i.sunShadow[N]=re,i.sunShadowMap[N]=ne;const Ce=ie.getViewportCount();for(let be=0;be<Ce;be++)i.sunShadowMatrix[z+be]=ie.getMatrix(be),i.sunShadowCascade[z+be]=ie._cascadeData[be];z+=Ce,N++}i.sun[M]=Q,M++}else if(A.isDirectionalLight){const Q=n.get(A);if(Q.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const ie=A.shadow,re=t.get(A);re.shadowIntensity=ie.intensity,re.shadowBias=ie.bias,re.shadowNormalBias=ie.normalBias,re.shadowRadius=ie.radius,re.shadowMapSize=ie.mapSize,i.directionalShadow[f]=re,i.directionalShadowMap[f]=ne,i.directionalShadowMatrix[f]=A.shadow.matrix,S++}i.directional[f]=Q,f++}else if(A.isSpotLight){const Q=n.get(A);Q.position.setFromMatrixPosition(A.matrixWorld),Q.color.copy(q).multiplyScalar(Z),Q.distance=X,Q.coneCos=Math.cos(A.angle),Q.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),Q.decay=A.decay,i.spot[U]=Q;const ie=A.shadow;if(A.map&&(i.spotLightMap[c]=A.map,c++,ie.updateMatrices(A),A.castShadow&&_++),i.spotLightMatrix[U]=ie.matrix,A.castShadow){const re=t.get(A);re.shadowIntensity=ie.intensity,re.shadowBias=ie.bias,re.shadowNormalBias=ie.normalBias,re.shadowRadius=ie.radius,re.shadowMapSize=ie.mapSize,i.spotShadow[U]=re,i.spotShadowMap[U]=ne,C++}U++}else if(A.isRectAreaLight){const Q=n.get(A);Q.color.copy(q).multiplyScalar(Z),Q.halfWidth.set(A.width*.5,0,0),Q.halfHeight.set(0,A.height*.5,0),i.rectArea[D]=Q,D++}else if(A.isPointLight){const Q=n.get(A);if(Q.color.copy(A.color).multiplyScalar(A.intensity),Q.distance=A.distance,Q.decay=A.decay,A.castShadow){const ie=A.shadow,re=t.get(A);re.shadowIntensity=ie.intensity,re.shadowBias=ie.bias,re.shadowNormalBias=ie.normalBias,re.shadowRadius=ie.radius,re.shadowMapSize=ie.mapSize,re.shadowCameraNear=ie.camera.near,re.shadowCameraFar=ie.camera.far,i.pointShadow[s]=re,i.pointShadowMap[s]=ne,i.pointShadowMatrix[s]=A.shadow.matrix,h++}i.point[s]=Q,s++}else if(A.isHemisphereLight){const Q=n.get(A);Q.skyColor.copy(A.color).multiplyScalar(Z),Q.groundColor.copy(A.groundColor).multiplyScalar(Z),i.hemi[m]=Q,m++}}D>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=de.LTC_FLOAT_1,i.rectAreaLTC2=de.LTC_FLOAT_2):(i.rectAreaLTC1=de.LTC_HALF_1,i.rectAreaLTC2=de.LTC_HALF_2)),i.ambient[0]=G,i.ambient[1]=y,i.ambient[2]=p;const O=i.hash;(O.sunLength!==M||O.directionalLength!==f||O.pointLength!==s||O.spotLength!==U||O.rectAreaLength!==D||O.hemiLength!==m||O.numSunShadows!==N||O.numDirectionalShadows!==S||O.numPointShadows!==h||O.numSpotShadows!==C||O.numSpotMaps!==c||O.numLightProbes!==P)&&(i.sun.length=M,i.directional.length=f,i.spot.length=U,i.rectArea.length=D,i.point.length=s,i.hemi.length=m,i.sunShadow.length=N,i.sunShadowMap.length=N,i.sunShadowMatrix.length=z,i.sunShadowCascade.length=z,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.directionalShadowMatrix.length=S,i.pointShadow.length=h,i.pointShadowMap.length=h,i.pointShadowMatrix.length=h,i.spotShadow.length=C,i.spotShadowMap.length=C,i.spotLightMatrix.length=C+c-_,i.spotLightMap.length=c,i.numSpotLightShadowsWithMaps=_,i.numLightProbes=P,O.sunLength=M,O.directionalLength=f,O.pointLength=s,O.spotLength=U,O.rectAreaLength=D,O.hemiLength=m,O.numSunShadows=N,O.numDirectionalShadows=S,O.numPointShadows=h,O.numSpotShadows=C,O.numSpotMaps=c,O.numLightProbes=P,i.version=_d++)}function b(T,G){let y=0,p=0,M=0,N=0,z=0,f=0;const s=G.matrixWorldInverse;for(let U=0,D=T.length;U<D;U++){const m=T[U];if(m.isSunLight){const S=i.sun[y];S.direction.setFromMatrixPosition(m.matrixWorld),S.direction.transformDirection(s),y++}else if(m.isDirectionalLight){const S=i.directional[p];S.direction.setFromMatrixPosition(m.matrixWorld),l.setFromMatrixPosition(m.target.matrixWorld),S.direction.sub(l),S.direction.transformDirection(s),p++}else if(m.isSpotLight){const S=i.spot[N];S.position.setFromMatrixPosition(m.matrixWorld),S.position.applyMatrix4(s),S.direction.setFromMatrixPosition(m.matrixWorld),l.setFromMatrixPosition(m.target.matrixWorld),S.direction.sub(l),S.direction.transformDirection(s),N++}else if(m.isRectAreaLight){const S=i.rectArea[z];S.position.setFromMatrixPosition(m.matrixWorld),S.position.applyMatrix4(s),d.identity(),o.copy(m.matrixWorld),o.premultiply(s),d.extractRotation(o),S.halfWidth.set(m.width*.5,0,0),S.halfHeight.set(0,m.height*.5,0),S.halfWidth.applyMatrix4(d),S.halfHeight.applyMatrix4(d),z++}else if(m.isPointLight){const S=i.point[M];S.position.setFromMatrixPosition(m.matrixWorld),S.position.applyMatrix4(s),M++}else if(m.isHemisphereLight){const S=i.hemi[f];S.direction.setFromMatrixPosition(m.matrixWorld),S.direction.transformDirection(s),f++}}}return{setup:g,setupView:b,state:i}}function Tr(e){const n=new vd(e),t=[],i=[],l=[];function o(p){y.camera=p,t.length=0,i.length=0,l.length=0}function d(p){t.push(p)}function g(p){i.push(p)}function b(p){l.push(p)}function T(){n.setup(t)}function G(p){n.setupView(t,p)}const y={lightsArray:t,shadowsArray:i,lightProbeGridArray:l,camera:null,lights:n,transmissionRenderTarget:{},textureUnits:0};return{init:o,state:y,setupLights:T,setupLightsView:G,pushLight:d,pushShadow:g,pushLightProbeGrid:b}}function Sd(e){let n=new WeakMap;function t(l,o=0){const d=n.get(l);let g;return d===void 0?(g=new Tr(e),n.set(l,[g])):o>=d.length?(g=new Tr(e),d.push(g)):g=d[o],g}function i(){n=new WeakMap}return{get:t,dispose:i}}const Ed=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,xd=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Md=[new Ne(1,0,0),new Ne(-1,0,0),new Ne(0,1,0),new Ne(0,-1,0),new Ne(0,0,1),new Ne(0,0,-1)],Td=[new Ne(0,-1,0),new Ne(0,-1,0),new Ne(0,0,1),new Ne(0,0,-1),new Ne(0,-1,0),new Ne(0,-1,0)],Ar=new jt,ln=new Ne,Yn=new Ne;function Ad(e,n,t){let i=new Rr;const l=new gt,o=new gt,d=new St,g=new Oa,b=new Ba,T={},G=t.maxTextureSize,y={[pn]:Et,[Et]:pn,[wt]:wt},p=new Dt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new gt},radius:{value:4}},vertexShader:Ed,fragmentShader:xd}),M=p.clone();M.defines.HORIZONTAL_PASS=1;const N=new en;N.setAttribute("position",new qn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const z=new pt(N,p),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=xn;let s=this.type;this.render=function(h,C,c){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||h.length===0)return;this.type===Ga&&(Xe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=xn);const _=e.getRenderTarget(),P=e.getActiveCubeFace(),O=e.getActiveMipmapLevel(),W=e.state;W.setBlending(Nt),W.buffers.depth.getReversed()===!0?W.buffers.color.setClear(0,0,0,0):W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const $=s!==this.type;$&&C.traverse(function(A){A.material&&(Array.isArray(A.material)?A.material.forEach(q=>q.needsUpdate=!0):A.material.needsUpdate=!0)});for(let A=0,q=h.length;A<q;A++){const Z=h[A],X=Z.shadow;if(X===void 0){Xe("WebGLShadowMap:",Z,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;l.copy(X.mapSize);const ne=X.getFrameExtents();l.multiply(ne),o.copy(X.mapSize),(l.x>G||l.y>G)&&(l.x>G&&(o.x=Math.floor(G/ne.x),l.x=o.x*ne.x,X.mapSize.x=o.x),l.y>G&&(o.y=Math.floor(G/ne.y),l.y=o.y*ne.y,X.mapSize.y=o.y));const Q=e.state.buffers.depth.getReversed();if(X.camera._reversedDepth=Q,X.map===null||$===!0){if(X.map!==null&&(X.map.depthTexture!==null&&(X.map.depthTexture.dispose(),X.map.depthTexture=null),X.map.dispose()),this.type===fn){if(Z.isPointLight){Xe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}X.map=new At(l.x,l.y,{format:tn,type:yt,minFilter:xt,magFilter:xt,generateMipmaps:!1}),X.map.texture.name=Z.name+".shadowMap",X.map.depthTexture=new An(l.x,l.y,Gt),X.map.depthTexture.name=Z.name+".shadowMapDepth",X.map.depthTexture.format=nn,X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=Wt,X.map.depthTexture.magFilter=Wt}else Z.isPointLight?(X.map=new qr(l.x),X.map.depthTexture=new Ha(l.x,kt)):(X.map=new At(l.x,l.y),X.map.depthTexture=new An(l.x,l.y,kt)),X.map.depthTexture.name=Z.name+".shadowMap",X.map.depthTexture.format=nn,this.type===xn?(X.map.depthTexture.compareFunction=Q?ei:ti,X.map.depthTexture.minFilter=xt,X.map.depthTexture.magFilter=xt):(X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=Wt,X.map.depthTexture.magFilter=Wt);X.camera.updateProjectionMatrix()}X.map.isWebGLCubeRenderTarget!==!0&&(X.map.width!==l.x||X.map.height!==l.y)&&X.map.setSize(l.x,l.y);const ie=X.map.isWebGLCubeRenderTarget?6:X.getViewportCount();Z.isPointLight!==!0&&X.updateMatrices(Z,c);for(let re=0;re<ie;re++){const Ce=X.getCamera(re);if(Z.isPointLight){const be=X.camera,nt=X.matrix,He=Z.distance||be.far;He!==be.far&&(be.far=He,be.updateProjectionMatrix()),ln.setFromMatrixPosition(Z.matrixWorld),be.position.copy(ln),Yn.copy(be.position),Yn.add(Md[re]),be.up.copy(Td[re]),be.lookAt(Yn),be.updateMatrixWorld(),nt.makeTranslation(-ln.x,-ln.y,-ln.z),Ar.multiplyMatrices(be.projectionMatrix,be.matrixWorldInverse),X._frustum.setFromProjectionMatrix(Ar,be.coordinateSystem,be.reversedDepth)}if(X.map.isWebGLCubeRenderTarget)e.setRenderTarget(X.map,re),e.clear();else{re===0&&(e.setRenderTarget(X.map),e.clear());const be=X.getViewport(re);d.set(o.x*be.x,o.y*be.y,o.x*be.z,o.y*be.w),W.viewport(d)}i=X.getFrustum(re),m(C,c,Ce,Z,this.type)}X.isPointLightShadow!==!0&&this.type===fn&&U(X,c),X.needsUpdate=!1}s=this.type,f.needsUpdate=!1,e.setRenderTarget(_,P,O)};function U(h,C){const c=n.update(z);p.defines.VSM_SAMPLES!==h.blurSamples&&(p.defines.VSM_SAMPLES=h.blurSamples,M.defines.VSM_SAMPLES=h.blurSamples,p.needsUpdate=!0,M.needsUpdate=!0),h.mapPass===null?h.mapPass=new At(l.x,l.y,{format:tn,type:yt}):(h.mapPass.width!==h.map.width||h.mapPass.height!==h.map.height)&&h.mapPass.setSize(h.map.width,h.map.height),p.uniforms.shadow_pass.value=h.map.depthTexture,p.uniforms.resolution.value.set(h.map.width,h.map.height),p.uniforms.radius.value=h.radius,e.setRenderTarget(h.mapPass),e.clear(),e.renderBufferDirect(C,null,c,p,z,null),M.uniforms.shadow_pass.value=h.mapPass.texture,M.uniforms.resolution.value.set(h.map.width,h.map.height),M.uniforms.radius.value=h.radius,e.setRenderTarget(h.map),e.clear(),e.renderBufferDirect(C,null,c,M,z,null)}function D(h,C,c,_){let P=null;const O=c.isPointLight===!0?h.customDistanceMaterial:h.customDepthMaterial;if(O!==void 0)P=O;else if(P=c.isPointLight===!0?b:g,e.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const W=P.uuid,$=C.uuid;let A=T[W];A===void 0&&(A={},T[W]=A);let q=A[$];q===void 0&&(q=P.clone(),A[$]=q,C.addEventListener("dispose",S)),P=q}if(P.visible=C.visible,P.wireframe=C.wireframe,_===fn?P.side=C.shadowSide!==null?C.shadowSide:C.side:P.side=C.shadowSide!==null?C.shadowSide:y[C.side],P.alphaMap=C.alphaMap,P.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,P.map=C.map,P.clipShadows=C.clipShadows,P.clippingPlanes=C.clippingPlanes,P.clipIntersection=C.clipIntersection,P.displacementMap=C.displacementMap,P.displacementScale=C.displacementScale,P.displacementBias=C.displacementBias,P.wireframeLinewidth=C.wireframeLinewidth,P.linewidth=C.linewidth,c.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const W=e.properties.get(P);W.light=c}return P}function m(h,C,c,_,P){if(h.visible===!1)return;if(h.layers.test(C.layers)&&(h.isMesh||h.isLine||h.isPoints)&&(h.castShadow||h.receiveShadow&&P===fn)&&(!h.frustumCulled||h.intersectsFrustum(i))){h.modelViewMatrix.multiplyMatrices(c.matrixWorldInverse,h.matrixWorld);const $=n.update(h),A=h.material;if(Array.isArray(A)){const q=$.groups;for(let Z=0,X=q.length;Z<X;Z++){const ne=q[Z],Q=A[ne.materialIndex];if(Q&&Q.visible){const ie=D(h,Q,_,P);h.onBeforeShadow(e,h,C,c,$,ie,ne),e.renderBufferDirect(c,null,$,ie,h,ne),h.onAfterShadow(e,h,C,c,$,ie,ne)}}}else if(A.visible){const q=D(h,A,_,P);h.onBeforeShadow(e,h,C,c,$,q,null),e.renderBufferDirect(c,null,$,q,h,null),h.onAfterShadow(e,h,C,c,$,q,null)}}const W=h.children;for(let $=0,A=W.length;$<A;$++)m(W[$],C,c,_,P)}function S(h){h.target.removeEventListener("dispose",S);for(const c in T){const _=T[c],P=h.target.uuid;P in _&&(_[P].dispose(),delete _[P])}}}function Rd(e,n){function t(){let v=!1;const oe=new St;let H=null;const se=new St(0,0,0,0);return{setMask:function(fe){H!==fe&&!v&&(e.colorMask(fe,fe,fe,fe),H=fe)},setLocked:function(fe){v=fe},setClear:function(fe,ee,Ae,Me,$e){$e===!0&&(fe*=Me,ee*=Me,Ae*=Me),oe.set(fe,ee,Ae,Me),se.equals(oe)===!1&&(e.clearColor(fe,ee,Ae,Me),se.copy(oe))},reset:function(){v=!1,H=null,se.set(-1,0,0,0)}}}function i(){let v=!1,oe=!1,H=null,se=null,fe=null;return{setReversed:function(ee){if(oe!==ee){const Ae=n.get("EXT_clip_control");ee?Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.ZERO_TO_ONE_EXT):Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.NEGATIVE_ONE_TO_ONE_EXT),oe=ee;const Me=fe;fe=null,this.setClear(Me)}},getReversed:function(){return oe},setTest:function(ee){ee?J(e.DEPTH_TEST):xe(e.DEPTH_TEST)},setMask:function(ee){H!==ee&&!v&&(e.depthMask(ee),H=ee)},setFunc:function(ee){if(oe&&(ee=Ao[ee]),se!==ee){switch(ee){case eo:e.depthFunc(e.NEVER);break;case ja:e.depthFunc(e.ALWAYS);break;case Ja:e.depthFunc(e.LESS);break;case _i:e.depthFunc(e.LEQUAL);break;case Qa:e.depthFunc(e.EQUAL);break;case $a:e.depthFunc(e.GEQUAL);break;case Za:e.depthFunc(e.GREATER);break;case qa:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}se=ee}},setLocked:function(ee){v=ee},setClear:function(ee){fe!==ee&&(fe=ee,oe&&(ee=1-ee),e.clearDepth(ee))},reset:function(){v=!1,H=null,se=null,fe=null,oe=!1}}}function l(){let v=!1,oe=null,H=null,se=null,fe=null,ee=null,Ae=null,Me=null,$e=null;return{setTest:function(ke){v||(ke?J(e.STENCIL_TEST):xe(e.STENCIL_TEST))},setMask:function(ke){oe!==ke&&!v&&(e.stencilMask(ke),oe=ke)},setFunc:function(ke,Tt,Rt){(H!==ke||se!==Tt||fe!==Rt)&&(e.stencilFunc(ke,Tt,Rt),H=ke,se=Tt,fe=Rt)},setOp:function(ke,Tt,Rt){(ee!==ke||Ae!==Tt||Me!==Rt)&&(e.stencilOp(ke,Tt,Rt),ee=ke,Ae=Tt,Me=Rt)},setLocked:function(ke){v=ke},setClear:function(ke){$e!==ke&&(e.clearStencil(ke),$e=ke)},reset:function(){v=!1,oe=null,H=null,se=null,fe=null,ee=null,Ae=null,Me=null,$e=null}}}const o=new t,d=new i,g=new l,b=new WeakMap,T=new WeakMap;let G={},y={},p={},M=new WeakMap,N=[],z=null,f=!1,s=null,U=null,D=null,m=null,S=null,h=null,C=null,c=new je(0,0,0),_=0,P=!1,O=null,W=null,$=null,A=null,q=null;const Z=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,ne=0;const Q=e.getParameter(e.VERSION);Q.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(Q)[1]),X=ne>=1):Q.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),X=ne>=2);let ie=null,re={};const Ce=e.getParameter(e.SCISSOR_BOX),be=e.getParameter(e.VIEWPORT),nt=new St().fromArray(Ce),He=new St().fromArray(be);function Ve(v,oe,H,se){const fe=new Uint8Array(4),ee=e.createTexture();e.bindTexture(v,ee),e.texParameteri(v,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(v,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let Ae=0;Ae<H;Ae++)v===e.TEXTURE_3D||v===e.TEXTURE_2D_ARRAY?e.texImage3D(oe,0,e.RGBA,1,1,se,0,e.RGBA,e.UNSIGNED_BYTE,fe):e.texImage2D(oe+Ae,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,fe);return ee}const k={};k[e.TEXTURE_2D]=Ve(e.TEXTURE_2D,e.TEXTURE_2D,1),k[e.TEXTURE_CUBE_MAP]=Ve(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),k[e.TEXTURE_2D_ARRAY]=Ve(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),k[e.TEXTURE_3D]=Ve(e.TEXTURE_3D,e.TEXTURE_3D,1,1),o.setClear(0,0,0,1),d.setClear(1),g.setClear(0),J(e.DEPTH_TEST),d.setFunc(_i),De(!1),Ke(gi),J(e.CULL_FACE),Fe(Nt);function J(v){G[v]!==!0&&(e.enable(v),G[v]=!0)}function xe(v){G[v]!==!1&&(e.disable(v),G[v]=!1)}function Pe(v,oe){return p[v]!==oe?(e.bindFramebuffer(v,oe),p[v]=oe,v===e.DRAW_FRAMEBUFFER&&(p[e.FRAMEBUFFER]=oe),v===e.FRAMEBUFFER&&(p[e.DRAW_FRAMEBUFFER]=oe),!0):!1}function ve(v,oe){let H=N,se=!1;if(v){H=M.get(oe),H===void 0&&(H=[],M.set(oe,H));const fe=v.textures;if(H.length!==fe.length||H[0]!==e.COLOR_ATTACHMENT0){for(let ee=0,Ae=fe.length;ee<Ae;ee++)H[ee]=e.COLOR_ATTACHMENT0+ee;H.length=fe.length,se=!0}}else H[0]!==e.BACK&&(H[0]=e.BACK,se=!0);se&&e.drawBuffers(H)}function ye(v){return z!==v?(e.useProgram(v),z=v,!0):!1}const at={[on]:e.FUNC_ADD,[ua]:e.FUNC_SUBTRACT,[da]:e.FUNC_REVERSE_SUBTRACT};at[Ro]=e.MIN,at[bo]=e.MAX;const Le={[Ca]:e.ZERO,[ba]:e.ONE,[Ra]:e.SRC_COLOR,[Aa]:e.SRC_ALPHA,[Ta]:e.SRC_ALPHA_SATURATE,[Ma]:e.DST_COLOR,[xa]:e.DST_ALPHA,[Ea]:e.ONE_MINUS_SRC_COLOR,[Sa]:e.ONE_MINUS_SRC_ALPHA,[va]:e.ONE_MINUS_DST_COLOR,[ga]:e.ONE_MINUS_DST_ALPHA,[_a]:e.CONSTANT_COLOR,[ma]:e.ONE_MINUS_CONSTANT_COLOR,[ha]:e.CONSTANT_ALPHA,[pa]:e.ONE_MINUS_CONSTANT_ALPHA};function Fe(v,oe,H,se,fe,ee,Ae,Me,$e,ke){if(v===Nt){f===!0&&(xe(e.BLEND),f=!1);return}if(f===!1&&(J(e.BLEND),f=!0),v!==io){if(v!==s||ke!==P){if((U!==on||S!==on)&&(e.blendEquation(e.FUNC_ADD),U=on,S=on),ke)switch(v){case Mn:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Qt:e.blendFunc(e.ONE,e.ONE);break;case Si:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case vi:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:tt("WebGLState: Invalid blending: ",v);break}else switch(v){case Mn:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Qt:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case Si:tt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case vi:tt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:tt("WebGLState: Invalid blending: ",v);break}D=null,m=null,h=null,C=null,c.set(0,0,0),_=0,s=v,P=ke}return}fe=fe||oe,ee=ee||H,Ae=Ae||se,(oe!==U||fe!==S)&&(e.blendEquationSeparate(at[oe],at[fe]),U=oe,S=fe),(H!==D||se!==m||ee!==h||Ae!==C)&&(e.blendFuncSeparate(Le[H],Le[se],Le[ee],Le[Ae]),D=H,m=se,h=ee,C=Ae),(Me.equals(c)===!1||$e!==_)&&(e.blendColor(Me.r,Me.g,Me.b,$e),c.copy(Me),_=$e),s=v,P=!1}function We(v,oe){v.side===wt?xe(e.CULL_FACE):J(e.CULL_FACE);let H=v.side===Et;oe&&(H=!H),De(H),v.blending===Mn&&v.transparent===!1?Fe(Nt):Fe(v.blending,v.blendEquation,v.blendSrc,v.blendDst,v.blendEquationAlpha,v.blendSrcAlpha,v.blendDstAlpha,v.blendColor,v.blendAlpha,v.premultipliedAlpha),d.setFunc(v.depthFunc),d.setTest(v.depthTest),d.setMask(v.depthWrite),o.setMask(v.colorWrite);const se=v.stencilWrite;g.setTest(se),se&&(g.setMask(v.stencilWriteMask),g.setFunc(v.stencilFunc,v.stencilRef,v.stencilFuncMask),g.setOp(v.stencilFail,v.stencilZFail,v.stencilZPass)),lt(v.polygonOffset,v.polygonOffsetFactor,v.polygonOffsetUnits),v.alphaToCoverage===!0?J(e.SAMPLE_ALPHA_TO_COVERAGE):xe(e.SAMPLE_ALPHA_TO_COVERAGE)}function De(v){O!==v&&(v?e.frontFace(e.CW):e.frontFace(e.CCW),O=v)}function Ke(v){v!==to?(J(e.CULL_FACE),v!==W&&(v===gi?e.cullFace(e.BACK):v===no?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):xe(e.CULL_FACE),W=v}function ot(v){v!==$&&(X&&e.lineWidth(v),$=v)}function lt(v,oe,H){v?(J(e.POLYGON_OFFSET_FILL),(A!==oe||q!==H)&&(A=oe,q=H,d.getReversed()&&(oe=-oe),e.polygonOffset(oe,H))):xe(e.POLYGON_OFFSET_FILL)}function Ze(v){v?J(e.SCISSOR_TEST):xe(e.SCISSOR_TEST)}function it(v){v===void 0&&(v=e.TEXTURE0+Z-1),ie!==v&&(e.activeTexture(v),ie=v)}function x(v,oe,H){H===void 0&&(ie===null?H=e.TEXTURE0+Z-1:H=ie);let se=re[H];se===void 0&&(se={type:void 0,texture:void 0},re[H]=se),(se.type!==v||se.texture!==oe)&&(ie!==H&&(e.activeTexture(H),ie=H),e.bindTexture(v,oe||k[v]),se.type=v,se.texture=oe)}function ft(){const v=re[ie];v!==void 0&&v.type!==void 0&&(e.bindTexture(v.type,null),v.type=void 0,v.texture=void 0)}function Ge(){try{e.compressedTexImage2D(...arguments)}catch(v){tt("WebGLState:",v)}}function u(){try{e.compressedTexImage3D(...arguments)}catch(v){tt("WebGLState:",v)}}function r(){try{e.texSubImage2D(...arguments)}catch(v){tt("WebGLState:",v)}}function R(){try{e.texSubImage3D(...arguments)}catch(v){tt("WebGLState:",v)}}function I(){try{e.compressedTexSubImage2D(...arguments)}catch(v){tt("WebGLState:",v)}}function B(){try{e.compressedTexSubImage3D(...arguments)}catch(v){tt("WebGLState:",v)}}function ae(){try{e.texStorage2D(...arguments)}catch(v){tt("WebGLState:",v)}}function ce(){try{e.texStorage3D(...arguments)}catch(v){tt("WebGLState:",v)}}function V(){try{e.texImage2D(...arguments)}catch(v){tt("WebGLState:",v)}}function Y(){try{e.texImage3D(...arguments)}catch(v){tt("WebGLState:",v)}}function le(v){return y[v]!==void 0?y[v]:e.getParameter(v)}function j(v,oe){y[v]!==oe&&(e.pixelStorei(v,oe),y[v]=oe)}function K(v){nt.equals(v)===!1&&(e.scissor(v.x,v.y,v.z,v.w),nt.copy(v))}function te(v){He.equals(v)===!1&&(e.viewport(v.x,v.y,v.z,v.w),He.copy(v))}function ue(v,oe){let H=T.get(oe);H===void 0&&(H=new WeakMap,T.set(oe,H));let se=H.get(v);se===void 0&&(se=e.getUniformBlockIndex(oe,v.name),H.set(v,se))}function me(v,oe){const se=T.get(oe).get(v);b.get(oe)!==se&&(e.uniformBlockBinding(oe,se,v.__bindingPointIndex),b.set(oe,se))}function Re(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),d.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),G={},y={},ie=null,re={},p={},M=new WeakMap,N=[],z=null,f=!1,s=null,U=null,D=null,m=null,S=null,h=null,C=null,c=new je(0,0,0),_=0,P=!1,O=null,W=null,$=null,A=null,q=null,nt.set(0,0,e.canvas.width,e.canvas.height),He.set(0,0,e.canvas.width,e.canvas.height),o.reset(),d.reset(),g.reset()}return{buffers:{color:o,depth:d,stencil:g},enable:J,disable:xe,bindFramebuffer:Pe,drawBuffers:ve,useProgram:ye,setBlending:Fe,setMaterial:We,setFlipSided:De,setCullFace:Ke,setLineWidth:ot,setPolygonOffset:lt,setScissorTest:Ze,activeTexture:it,bindTexture:x,unbindTexture:ft,compressedTexImage2D:Ge,compressedTexImage3D:u,texImage2D:V,texImage3D:Y,pixelStorei:j,getParameter:le,updateUBOMapping:ue,uniformBlockBinding:me,texStorage2D:ae,texStorage3D:ce,texSubImage2D:r,texSubImage3D:R,compressedTexSubImage2D:I,compressedTexSubImage3D:B,scissor:K,viewport:te,reset:Re}}function bd(e,n,t,i,l,o,d){const g=n.has("WEBGL_multisampled_render_to_texture")?n.get("WEBGL_multisampled_render_to_texture"):null,b=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),T=new gt,G=new WeakMap,y=new Set;let p;const M=new WeakMap;let N=!1;try{N=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function z(u,r){return N?new OffscreenCanvas(u,r):vo("canvas")}function f(u,r,R){let I=1;const B=Ge(u);if((B.width>R||B.height>R)&&(I=R/Math.max(B.width,B.height)),I<1)if(typeof HTMLImageElement<"u"&&u instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&u instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&u instanceof ImageBitmap||typeof VideoFrame<"u"&&u instanceof VideoFrame){const ae=Math.floor(I*B.width),ce=Math.floor(I*B.height);p===void 0&&(p=z(ae,ce));const V=r?z(ae,ce):p;return V.width=ae,V.height=ce,V.getContext("2d").drawImage(u,0,0,ae,ce),Xe("WebGLRenderer: Texture has been resized from ("+B.width+"x"+B.height+") to ("+ae+"x"+ce+")."),V}else return"data"in u&&Xe("WebGLRenderer: Image in DataTexture is too big ("+B.width+"x"+B.height+")."),u;return u}function s(u){return u.generateMipmaps}function U(u){e.generateMipmap(u)}function D(u){return u.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:u.isWebGL3DRenderTarget?e.TEXTURE_3D:u.isWebGLArrayRenderTarget||u.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function m(u,r,R,I,B,ae=!1){if(u!==null){if(e[u]!==void 0)return e[u];Xe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+u+"'")}let ce;I&&(ce=n.get("EXT_texture_norm16"),ce||Xe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let V=r;if(r===e.RED&&(R===e.FLOAT&&(V=e.R32F),R===e.HALF_FLOAT&&(V=e.R16F),R===e.UNSIGNED_BYTE&&(V=e.R8),R===e.UNSIGNED_SHORT&&ce&&(V=ce.R16_EXT),R===e.SHORT&&ce&&(V=ce.R16_SNORM_EXT)),r===e.RED_INTEGER&&(R===e.UNSIGNED_BYTE&&(V=e.R8UI),R===e.UNSIGNED_SHORT&&(V=e.R16UI),R===e.UNSIGNED_INT&&(V=e.R32UI),R===e.BYTE&&(V=e.R8I),R===e.SHORT&&(V=e.R16I),R===e.INT&&(V=e.R32I)),r===e.RG&&(R===e.FLOAT&&(V=e.RG32F),R===e.HALF_FLOAT&&(V=e.RG16F),R===e.UNSIGNED_BYTE&&(V=e.RG8),R===e.UNSIGNED_SHORT&&ce&&(V=ce.RG16_EXT),R===e.SHORT&&ce&&(V=ce.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(R===e.UNSIGNED_BYTE&&(V=e.RG8UI),R===e.UNSIGNED_SHORT&&(V=e.RG16UI),R===e.UNSIGNED_INT&&(V=e.RG32UI),R===e.BYTE&&(V=e.RG8I),R===e.SHORT&&(V=e.RG16I),R===e.INT&&(V=e.RG32I)),r===e.RGB_INTEGER&&(R===e.UNSIGNED_BYTE&&(V=e.RGB8UI),R===e.UNSIGNED_SHORT&&(V=e.RGB16UI),R===e.UNSIGNED_INT&&(V=e.RGB32UI),R===e.BYTE&&(V=e.RGB8I),R===e.SHORT&&(V=e.RGB16I),R===e.INT&&(V=e.RGB32I)),r===e.RGBA_INTEGER&&(R===e.UNSIGNED_BYTE&&(V=e.RGBA8UI),R===e.UNSIGNED_SHORT&&(V=e.RGBA16UI),R===e.UNSIGNED_INT&&(V=e.RGBA32UI),R===e.BYTE&&(V=e.RGBA8I),R===e.SHORT&&(V=e.RGBA16I),R===e.INT&&(V=e.RGBA32I)),r===e.RGB&&(R===e.UNSIGNED_SHORT&&ce&&(V=ce.RGB16_EXT),R===e.SHORT&&ce&&(V=ce.RGB16_SNORM_EXT),R===e.UNSIGNED_INT_5_9_9_9_REV&&(V=e.RGB9_E5),R===e.UNSIGNED_INT_10F_11F_11F_REV&&(V=e.R11F_G11F_B10F)),r===e.RGBA){const Y=ae?Br:rt.getTransfer(B);R===e.FLOAT&&(V=e.RGBA32F),R===e.HALF_FLOAT&&(V=e.RGBA16F),R===e.UNSIGNED_BYTE&&(V=Y===Je?e.SRGB8_ALPHA8:e.RGBA8),R===e.UNSIGNED_SHORT&&ce&&(V=ce.RGBA16_EXT),R===e.SHORT&&ce&&(V=ce.RGBA16_SNORM_EXT),R===e.UNSIGNED_SHORT_4_4_4_4&&(V=e.RGBA4),R===e.UNSIGNED_SHORT_5_5_5_1&&(V=e.RGB5_A1)}return(V===e.R16F||V===e.R32F||V===e.RG16F||V===e.RG32F||V===e.RGBA16F||V===e.RGBA32F)&&n.get("EXT_color_buffer_float"),V}function S(u,r){let R;return u?r===null||r===kt||r===hn?R=e.DEPTH24_STENCIL8:r===Gt?R=e.DEPTH32F_STENCIL8:r===bn&&(R=e.DEPTH24_STENCIL8,Xe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):r===null||r===kt||r===hn?R=e.DEPTH_COMPONENT24:r===Gt?R=e.DEPTH_COMPONENT32F:r===bn&&(R=e.DEPTH_COMPONENT16),R}function h(u,r){return s(u)===!0||u.isFramebufferTexture&&u.minFilter!==Wt&&u.minFilter!==xt?Math.log2(Math.max(r.width,r.height))+1:u.mipmaps!==void 0&&u.mipmaps.length>0?u.mipmaps.length:u.isCompressedTexture&&Array.isArray(u.image)?r.mipmaps.length:1}function C(u){const r=u.target;r.removeEventListener("dispose",C),_(r),r.isVideoTexture&&G.delete(r),r.isHTMLTexture&&y.delete(r)}function c(u){const r=u.target;r.removeEventListener("dispose",c),O(r)}function _(u){const r=i.get(u);if(r.__webglInit===void 0)return;const R=u.source,I=M.get(R);if(I){const B=I[r.__cacheKey];B.usedTimes--,B.usedTimes===0&&P(u),Object.keys(I).length===0&&M.delete(R)}i.remove(u)}function P(u){const r=i.get(u);e.deleteTexture(r.__webglTexture);const R=u.source,I=M.get(R);delete I[r.__cacheKey],d.memory.textures--}function O(u){const r=i.get(u);if(u.depthTexture&&(u.depthTexture.dispose(),i.remove(u.depthTexture)),u.isWebGLCubeRenderTarget)for(let I=0;I<6;I++){if(Array.isArray(r.__webglFramebuffer[I]))for(let B=0;B<r.__webglFramebuffer[I].length;B++)e.deleteFramebuffer(r.__webglFramebuffer[I][B]);else e.deleteFramebuffer(r.__webglFramebuffer[I]);r.__webglDepthbuffer&&e.deleteRenderbuffer(r.__webglDepthbuffer[I])}else{if(Array.isArray(r.__webglFramebuffer))for(let I=0;I<r.__webglFramebuffer.length;I++)e.deleteFramebuffer(r.__webglFramebuffer[I]);else e.deleteFramebuffer(r.__webglFramebuffer);if(r.__webglDepthbuffer&&e.deleteRenderbuffer(r.__webglDepthbuffer),r.__webglMultisampledFramebuffer&&e.deleteFramebuffer(r.__webglMultisampledFramebuffer),r.__webglColorRenderbuffer)for(let I=0;I<r.__webglColorRenderbuffer.length;I++)r.__webglColorRenderbuffer[I]&&e.deleteRenderbuffer(r.__webglColorRenderbuffer[I]);r.__webglDepthRenderbuffer&&e.deleteRenderbuffer(r.__webglDepthRenderbuffer)}const R=u.textures;for(let I=0,B=R.length;I<B;I++){const ae=i.get(R[I]);ae.__webglTexture&&(e.deleteTexture(ae.__webglTexture),d.memory.textures--),i.remove(R[I])}i.remove(u)}let W=0;function $(){W=0}function A(){return W}function q(u){W=u}function Z(){const u=W;return u>=l.maxTextures&&Xe("WebGLTextures: Trying to use "+(u+1)+" texture units while this GPU supports only "+l.maxTextures),W+=1,u}function X(u){const r=[];return r.push(u.wrapS),r.push(u.wrapT),r.push(u.wrapR||0),r.push(u.magFilter),r.push(u.minFilter),r.push(u.anisotropy),r.push(u.internalFormat),r.push(u.format),r.push(u.type),r.push(u.generateMipmaps),r.push(u.premultiplyAlpha),r.push(u.flipY),r.push(u.unpackAlignment),r.push(u.colorSpace),r.join()}function ne(u,r){const R=i.get(u);if(u.isVideoTexture&&x(u),u.isRenderTargetTexture===!1&&u.isExternalTexture!==!0&&u.version>0&&R.__version!==u.version){const I=u.image;if(I===null)Xe("WebGLRenderer: Texture marked for update but no image data found.");else if(I.complete===!1)Xe("WebGLRenderer: Texture marked for update but image is incomplete");else{xe(R,u,r);return}}else u.isExternalTexture&&(R.__webglTexture=u.sourceTexture?u.sourceTexture:null);t.bindTexture(e.TEXTURE_2D,R.__webglTexture,e.TEXTURE0+r)}function Q(u,r){const R=i.get(u);if(u.isRenderTargetTexture===!1&&u.version>0&&R.__version!==u.version){xe(R,u,r);return}else u.isExternalTexture&&(R.__webglTexture=u.sourceTexture?u.sourceTexture:null);t.bindTexture(e.TEXTURE_2D_ARRAY,R.__webglTexture,e.TEXTURE0+r)}function ie(u,r){const R=i.get(u);if(u.isRenderTargetTexture===!1&&u.version>0&&R.__version!==u.version){xe(R,u,r);return}t.bindTexture(e.TEXTURE_3D,R.__webglTexture,e.TEXTURE0+r)}function re(u,r){const R=i.get(u);if(u.isCubeDepthTexture!==!0&&u.version>0&&R.__version!==u.version){Pe(R,u,r);return}t.bindTexture(e.TEXTURE_CUBE_MAP,R.__webglTexture,e.TEXTURE0+r)}const Ce={[La]:e.REPEAT,[Kn]:e.CLAMP_TO_EDGE,[Pa]:e.MIRRORED_REPEAT},be={[Wt]:e.NEAREST,[wa]:e.NEAREST_MIPMAP_NEAREST,[vn]:e.NEAREST_MIPMAP_LINEAR,[xt]:e.LINEAR,[Dn]:e.LINEAR_MIPMAP_NEAREST,[Zt]:e.LINEAR_MIPMAP_LINEAR},nt={[Fa]:e.NEVER,[ya]:e.ALWAYS,[Na]:e.LESS,[ti]:e.LEQUAL,[Ia]:e.EQUAL,[ei]:e.GEQUAL,[Da]:e.GREATER,[Ua]:e.NOTEQUAL};function He(u,r){if(r.type===Gt&&n.has("OES_texture_float_linear")===!1&&(r.magFilter===xt||r.magFilter===Dn||r.magFilter===vn||r.magFilter===Zt||r.minFilter===xt||r.minFilter===Dn||r.minFilter===vn||r.minFilter===Zt)&&Xe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(u,e.TEXTURE_WRAP_S,Ce[r.wrapS]),e.texParameteri(u,e.TEXTURE_WRAP_T,Ce[r.wrapT]),(u===e.TEXTURE_3D||u===e.TEXTURE_2D_ARRAY)&&e.texParameteri(u,e.TEXTURE_WRAP_R,Ce[r.wrapR]),e.texParameteri(u,e.TEXTURE_MAG_FILTER,be[r.magFilter]),e.texParameteri(u,e.TEXTURE_MIN_FILTER,be[r.minFilter]),r.compareFunction&&(e.texParameteri(u,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(u,e.TEXTURE_COMPARE_FUNC,nt[r.compareFunction])),n.has("EXT_texture_filter_anisotropic")===!0){if(r.magFilter===Wt||r.minFilter!==vn&&r.minFilter!==Zt||r.type===Gt&&n.has("OES_texture_float_linear")===!1)return;if(r.anisotropy>1||i.get(r).__currentAnisotropy){const R=n.get("EXT_texture_filter_anisotropic");e.texParameterf(u,R.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(r.anisotropy,l.getMaxAnisotropy())),i.get(r).__currentAnisotropy=r.anisotropy}}}function Ve(u,r){let R=!1;u.__webglInit===void 0&&(u.__webglInit=!0,r.addEventListener("dispose",C));const I=r.source;let B=M.get(I);B===void 0&&(B={},M.set(I,B));const ae=X(r);if(ae!==u.__cacheKey){B[ae]===void 0&&(B[ae]={texture:e.createTexture(),usedTimes:0},d.memory.textures++,R=!0),B[ae].usedTimes++;const ce=B[u.__cacheKey];ce!==void 0&&(B[u.__cacheKey].usedTimes--,ce.usedTimes===0&&P(r)),u.__cacheKey=ae,u.__webglTexture=B[ae].texture}return R}function k(u,r,R){return Math.floor(Math.floor(u/R)/r)}function J(u,r,R,I){const ae=u.updateRanges;if(ae.length===0)t.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,R,I,r.data);else{ae.sort((j,K)=>j.start-K.start);let ce=0;for(let j=1;j<ae.length;j++){const K=ae[ce],te=ae[j],ue=K.start+K.count,me=k(te.start,r.width,4),Re=k(K.start,r.width,4);te.start<=ue+1&&me===Re&&k(te.start+te.count-1,r.width,4)===me?K.count=Math.max(K.count,te.start+te.count-K.start):(++ce,ae[ce]=te)}ae.length=ce+1;const V=t.getParameter(e.UNPACK_ROW_LENGTH),Y=t.getParameter(e.UNPACK_SKIP_PIXELS),le=t.getParameter(e.UNPACK_SKIP_ROWS);t.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let j=0,K=ae.length;j<K;j++){const te=ae[j],ue=Math.floor(te.start/4),me=Math.ceil(te.count/4),Re=ue%r.width,v=Math.floor(ue/r.width),oe=me,H=1;t.pixelStorei(e.UNPACK_SKIP_PIXELS,Re),t.pixelStorei(e.UNPACK_SKIP_ROWS,v),t.texSubImage2D(e.TEXTURE_2D,0,Re,v,oe,H,R,I,r.data)}u.clearUpdateRanges(),t.pixelStorei(e.UNPACK_ROW_LENGTH,V),t.pixelStorei(e.UNPACK_SKIP_PIXELS,Y),t.pixelStorei(e.UNPACK_SKIP_ROWS,le)}}function xe(u,r,R){let I=e.TEXTURE_2D;(r.isDataArrayTexture||r.isCompressedArrayTexture)&&(I=e.TEXTURE_2D_ARRAY),r.isData3DTexture&&(I=e.TEXTURE_3D);const B=Ve(u,r),ae=r.source;t.bindTexture(I,u.__webglTexture,e.TEXTURE0+R);const ce=i.get(ae);if(ae.version!==ce.__version||B===!0){if(t.activeTexture(e.TEXTURE0+R),(typeof ImageBitmap<"u"&&r.image instanceof ImageBitmap)===!1){const H=rt.getPrimaries(rt.workingColorSpace),se=r.colorSpace===Kt?null:rt.getPrimaries(r.colorSpace),fe=r.colorSpace===Kt||H===se?e.NONE:e.BROWSER_DEFAULT_WEBGL;t.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,r.flipY),t.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),t.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,fe)}t.pixelStorei(e.UNPACK_ALIGNMENT,r.unpackAlignment);let Y=f(r.image,!1,l.maxTextureSize);Y=ft(r,Y);const le=o.convert(r.format,r.colorSpace),j=o.convert(r.type);let K=m(r.internalFormat,le,j,r.normalized,r.colorSpace,r.isVideoTexture);He(I,r);let te;const ue=r.mipmaps,me=r.isVideoTexture!==!0,Re=ce.__version===void 0||B===!0,v=ae.dataReady,oe=h(r,Y);if(r.isDepthTexture)K=S(r.format===$t,r.type),Re&&(me?t.texStorage2D(e.TEXTURE_2D,1,K,Y.width,Y.height):t.texImage2D(e.TEXTURE_2D,0,K,Y.width,Y.height,0,le,j,null));else if(r.isDataTexture)if(ue.length>0){me&&Re&&t.texStorage2D(e.TEXTURE_2D,oe,K,ue[0].width,ue[0].height);for(let H=0,se=ue.length;H<se;H++)te=ue[H],me?v&&t.texSubImage2D(e.TEXTURE_2D,H,0,0,te.width,te.height,le,j,te.data):t.texImage2D(e.TEXTURE_2D,H,K,te.width,te.height,0,le,j,te.data);r.generateMipmaps=!1}else me?(Re&&t.texStorage2D(e.TEXTURE_2D,oe,K,Y.width,Y.height),v&&J(r,Y,le,j)):t.texImage2D(e.TEXTURE_2D,0,K,Y.width,Y.height,0,le,j,Y.data);else if(r.isCompressedTexture)if(r.isCompressedArrayTexture){me&&Re&&t.texStorage3D(e.TEXTURE_2D_ARRAY,oe,K,ue[0].width,ue[0].height,Y.depth);for(let H=0,se=ue.length;H<se;H++)if(te=ue[H],r.format!==It)if(le!==null)if(me){if(v)if(r.layerUpdates.size>0){const fe=Qi(te.width,te.height,r.format,r.type);for(const ee of r.layerUpdates){const Ae=te.data.subarray(ee*fe/te.data.BYTES_PER_ELEMENT,(ee+1)*fe/te.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,H,0,0,ee,te.width,te.height,1,le,Ae)}}else t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,H,0,0,0,te.width,te.height,Y.depth,le,te.data)}else t.compressedTexImage3D(e.TEXTURE_2D_ARRAY,H,K,te.width,te.height,Y.depth,0,te.data,0,0);else Xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else me?v&&t.texSubImage3D(e.TEXTURE_2D_ARRAY,H,0,0,0,te.width,te.height,Y.depth,le,j,te.data):t.texImage3D(e.TEXTURE_2D_ARRAY,H,K,te.width,te.height,Y.depth,0,le,j,te.data);r.layerUpdates.size>0&&r.clearLayerUpdates()}else{me&&Re&&t.texStorage2D(e.TEXTURE_2D,oe,K,ue[0].width,ue[0].height);for(let H=0,se=ue.length;H<se;H++)te=ue[H],r.format!==It?le!==null?me?v&&t.compressedTexSubImage2D(e.TEXTURE_2D,H,0,0,te.width,te.height,le,te.data):t.compressedTexImage2D(e.TEXTURE_2D,H,K,te.width,te.height,0,te.data):Xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):me?v&&t.texSubImage2D(e.TEXTURE_2D,H,0,0,te.width,te.height,le,j,te.data):t.texImage2D(e.TEXTURE_2D,H,K,te.width,te.height,0,le,j,te.data)}else if(r.isDataArrayTexture)if(me){if(Re&&t.texStorage3D(e.TEXTURE_2D_ARRAY,oe,K,Y.width,Y.height,Y.depth),v)if(r.layerUpdates.size>0){const H=Qi(Y.width,Y.height,r.format,r.type);for(const se of r.layerUpdates){const fe=Y.data.subarray(se*H/Y.data.BYTES_PER_ELEMENT,(se+1)*H/Y.data.BYTES_PER_ELEMENT);t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,se,Y.width,Y.height,1,le,j,fe)}r.clearLayerUpdates()}else t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,Y.width,Y.height,Y.depth,le,j,Y.data)}else t.texImage3D(e.TEXTURE_2D_ARRAY,0,K,Y.width,Y.height,Y.depth,0,le,j,Y.data);else if(r.isData3DTexture)me?(Re&&t.texStorage3D(e.TEXTURE_3D,oe,K,Y.width,Y.height,Y.depth),v&&t.texSubImage3D(e.TEXTURE_3D,0,0,0,0,Y.width,Y.height,Y.depth,le,j,Y.data)):t.texImage3D(e.TEXTURE_3D,0,K,Y.width,Y.height,Y.depth,0,le,j,Y.data);else if(r.isFramebufferTexture){if(Re)if(me)t.texStorage2D(e.TEXTURE_2D,oe,K,Y.width,Y.height);else{let H=Y.width,se=Y.height;for(let fe=0;fe<oe;fe++)t.texImage2D(e.TEXTURE_2D,fe,K,H,se,0,le,j,null),H>>=1,se>>=1}}else if(r.isHTMLTexture){if("texElementImage2D"in e){const H=e.canvas;if(H.hasAttribute("layoutsubtree")||H.setAttribute("layoutsubtree","true"),Y.parentNode!==H){H.appendChild(Y),y.add(r),H.onpaint=se=>{const fe=se.changedElements;for(const ee of y)fe.includes(ee.image)&&(ee.needsUpdate=!0)},H.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,Y);else{const fe=e.RGBA,ee=e.RGBA,Ae=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,fe,ee,Ae,Y)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(ue.length>0){if(me&&Re){const H=Ge(ue[0]);t.texStorage2D(e.TEXTURE_2D,oe,K,H.width,H.height)}for(let H=0,se=ue.length;H<se;H++)te=ue[H],me?v&&t.texSubImage2D(e.TEXTURE_2D,H,0,0,le,j,te):t.texImage2D(e.TEXTURE_2D,H,K,le,j,te);r.generateMipmaps=!1}else if(me){if(Re){const H=Ge(Y);t.texStorage2D(e.TEXTURE_2D,oe,K,H.width,H.height)}v&&t.texSubImage2D(e.TEXTURE_2D,0,0,0,le,j,Y)}else t.texImage2D(e.TEXTURE_2D,0,K,le,j,Y);s(r)&&U(I),ce.__version=ae.version,r.onUpdate&&r.onUpdate(r)}u.__version=r.version}function Pe(u,r,R){if(r.image.length!==6)return;const I=Ve(u,r),B=r.source;t.bindTexture(e.TEXTURE_CUBE_MAP,u.__webglTexture,e.TEXTURE0+R);const ae=i.get(B);if(B.version!==ae.__version||I===!0){t.activeTexture(e.TEXTURE0+R);const ce=rt.getPrimaries(rt.workingColorSpace),V=r.colorSpace===Kt?null:rt.getPrimaries(r.colorSpace),Y=r.colorSpace===Kt||ce===V?e.NONE:e.BROWSER_DEFAULT_WEBGL;t.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,r.flipY),t.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),t.pixelStorei(e.UNPACK_ALIGNMENT,r.unpackAlignment),t.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,Y);const le=r.isCompressedTexture||r.image[0].isCompressedTexture,j=r.image[0]&&r.image[0].isDataTexture,K=[];for(let ee=0;ee<6;ee++)!le&&!j?K[ee]=f(r.image[ee],!0,l.maxCubemapSize):K[ee]=j?r.image[ee].image:r.image[ee],K[ee]=ft(r,K[ee]);const te=K[0],ue=o.convert(r.format,r.colorSpace),me=o.convert(r.type),Re=m(r.internalFormat,ue,me,r.normalized,r.colorSpace),v=r.isVideoTexture!==!0,oe=ae.__version===void 0||I===!0,H=B.dataReady;let se=h(r,te);He(e.TEXTURE_CUBE_MAP,r);let fe;if(le){v&&oe&&t.texStorage2D(e.TEXTURE_CUBE_MAP,se,Re,te.width,te.height);for(let ee=0;ee<6;ee++){fe=K[ee].mipmaps;for(let Ae=0;Ae<fe.length;Ae++){const Me=fe[Ae];r.format!==It?ue!==null?v?H&&t.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae,0,0,Me.width,Me.height,ue,Me.data):t.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae,Re,Me.width,Me.height,0,Me.data):Xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):v?H&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae,0,0,Me.width,Me.height,ue,me,Me.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae,Re,Me.width,Me.height,0,ue,me,Me.data)}}}else{if(fe=r.mipmaps,v&&oe){fe.length>0&&se++;const ee=Ge(K[0]);t.texStorage2D(e.TEXTURE_CUBE_MAP,se,Re,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(j){v?H&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,K[ee].width,K[ee].height,ue,me,K[ee].data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Re,K[ee].width,K[ee].height,0,ue,me,K[ee].data);for(let Ae=0;Ae<fe.length;Ae++){const $e=fe[Ae].image[ee].image;v?H&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae+1,0,0,$e.width,$e.height,ue,me,$e.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae+1,Re,$e.width,$e.height,0,ue,me,$e.data)}}else{v?H&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,ue,me,K[ee]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Re,ue,me,K[ee]);for(let Ae=0;Ae<fe.length;Ae++){const Me=fe[Ae];v?H&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae+1,0,0,ue,me,Me.image[ee]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae+1,Re,ue,me,Me.image[ee])}}}s(r)&&U(e.TEXTURE_CUBE_MAP),ae.__version=B.version,r.onUpdate&&r.onUpdate(r)}u.__version=r.version}function ve(u,r,R,I,B,ae){const ce=o.convert(R.format,R.colorSpace),V=o.convert(R.type),Y=m(R.internalFormat,ce,V,R.normalized,R.colorSpace),le=i.get(r),j=i.get(R);if(j.__renderTarget=r,!le.__hasExternalTextures){const K=Math.max(1,r.width>>ae),te=Math.max(1,r.height>>ae);B===e.TEXTURE_3D||B===e.TEXTURE_2D_ARRAY?t.texImage3D(B,ae,Y,K,te,r.depth,0,ce,V,null):t.texImage2D(B,ae,Y,K,te,0,ce,V,null)}t.bindFramebuffer(e.FRAMEBUFFER,u),it(r)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,I,B,j.__webglTexture,0,Ze(r)):(B===e.TEXTURE_2D||B>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&B<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,I,B,j.__webglTexture,ae),t.bindFramebuffer(e.FRAMEBUFFER,null)}function ye(u,r,R){if(e.bindRenderbuffer(e.RENDERBUFFER,u),r.depthBuffer){const I=r.depthTexture,B=I&&I.isDepthTexture?I.type:null,ae=S(r.stencilBuffer,B),ce=r.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;it(r)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ze(r),ae,r.width,r.height):R?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ze(r),ae,r.width,r.height):e.renderbufferStorage(e.RENDERBUFFER,ae,r.width,r.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,ce,e.RENDERBUFFER,u)}else{const I=r.textures;for(let B=0;B<I.length;B++){const ae=I[B],ce=o.convert(ae.format,ae.colorSpace),V=o.convert(ae.type),Y=m(ae.internalFormat,ce,V,ae.normalized,ae.colorSpace);it(r)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ze(r),Y,r.width,r.height):R?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ze(r),Y,r.width,r.height):e.renderbufferStorage(e.RENDERBUFFER,Y,r.width,r.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function at(u,r,R){const I=r.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(e.FRAMEBUFFER,u),!(r.depthTexture&&r.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const B=i.get(r.depthTexture);if(B.__renderTarget=r,(!B.__webglTexture||r.depthTexture.image.width!==r.width||r.depthTexture.image.height!==r.height)&&(r.depthTexture.image.width=r.width,r.depthTexture.image.height=r.height,r.depthTexture.needsUpdate=!0),I){if(B.__webglInit===void 0&&(B.__webglInit=!0,r.depthTexture.addEventListener("dispose",C)),B.__webglTexture===void 0){B.__webglTexture=e.createTexture(),t.bindTexture(e.TEXTURE_CUBE_MAP,B.__webglTexture),He(e.TEXTURE_CUBE_MAP,r.depthTexture);const le=o.convert(r.depthTexture.format),j=o.convert(r.depthTexture.type);let K;r.depthTexture.format===nn?K=e.DEPTH_COMPONENT24:r.depthTexture.format===$t&&(K=e.DEPTH24_STENCIL8);for(let te=0;te<6;te++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,K,r.width,r.height,0,le,j,null)}}else ne(r.depthTexture,0);const ae=B.__webglTexture,ce=Ze(r),V=I?e.TEXTURE_CUBE_MAP_POSITIVE_X+R:e.TEXTURE_2D,Y=r.depthTexture.format===$t?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(r.depthTexture.format===nn)it(r)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,Y,V,ae,0,ce):e.framebufferTexture2D(e.FRAMEBUFFER,Y,V,ae,0);else if(r.depthTexture.format===$t)it(r)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,Y,V,ae,0,ce):e.framebufferTexture2D(e.FRAMEBUFFER,Y,V,ae,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Le(u){const r=i.get(u),R=u.isWebGLCubeRenderTarget===!0;if(r.__boundDepthTexture!==u.depthTexture){const I=u.depthTexture;if(r.__depthDisposeCallback&&r.__depthDisposeCallback(),I){const B=()=>{delete r.__boundDepthTexture,delete r.__depthDisposeCallback,I.removeEventListener("dispose",B)};I.addEventListener("dispose",B),r.__depthDisposeCallback=B}r.__boundDepthTexture=I}if(u.depthTexture&&!r.__autoAllocateDepthBuffer)if(R)for(let I=0;I<6;I++)at(r.__webglFramebuffer[I],u,I);else{const I=u.texture.mipmaps;I&&I.length>0?at(r.__webglFramebuffer[0],u,0):at(r.__webglFramebuffer,u,0)}else if(R){r.__webglDepthbuffer=[];for(let I=0;I<6;I++)if(t.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer[I]),r.__webglDepthbuffer[I]===void 0)r.__webglDepthbuffer[I]=e.createRenderbuffer(),ye(r.__webglDepthbuffer[I],u,!1);else{const B=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ae=r.__webglDepthbuffer[I];e.bindRenderbuffer(e.RENDERBUFFER,ae),e.framebufferRenderbuffer(e.FRAMEBUFFER,B,e.RENDERBUFFER,ae)}}else{const I=u.texture.mipmaps;if(I&&I.length>0?t.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer[0]):t.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer),r.__webglDepthbuffer===void 0)r.__webglDepthbuffer=e.createRenderbuffer(),ye(r.__webglDepthbuffer,u,!1);else{const B=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ae=r.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,ae),e.framebufferRenderbuffer(e.FRAMEBUFFER,B,e.RENDERBUFFER,ae)}}t.bindFramebuffer(e.FRAMEBUFFER,null)}function Fe(u,r,R){const I=i.get(u);r!==void 0&&ve(I.__webglFramebuffer,u,u.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),R!==void 0&&Le(u)}function We(u){const r=u.texture,R=i.get(u),I=i.get(r);u.addEventListener("dispose",c);const B=u.textures,ae=u.isWebGLCubeRenderTarget===!0,ce=B.length>1;if(ce||(I.__webglTexture===void 0&&(I.__webglTexture=e.createTexture()),I.__version=r.version,d.memory.textures++),ae){R.__webglFramebuffer=[];for(let V=0;V<6;V++)if(r.mipmaps&&r.mipmaps.length>0){R.__webglFramebuffer[V]=[];for(let Y=0;Y<r.mipmaps.length;Y++)R.__webglFramebuffer[V][Y]=e.createFramebuffer()}else R.__webglFramebuffer[V]=e.createFramebuffer()}else{if(r.mipmaps&&r.mipmaps.length>0){R.__webglFramebuffer=[];for(let V=0;V<r.mipmaps.length;V++)R.__webglFramebuffer[V]=e.createFramebuffer()}else R.__webglFramebuffer=e.createFramebuffer();if(ce)for(let V=0,Y=B.length;V<Y;V++){const le=i.get(B[V]);le.__webglTexture===void 0&&(le.__webglTexture=e.createTexture(),d.memory.textures++)}if(u.samples>0&&it(u)===!1){R.__webglMultisampledFramebuffer=e.createFramebuffer(),R.__webglColorRenderbuffer=[],t.bindFramebuffer(e.FRAMEBUFFER,R.__webglMultisampledFramebuffer);for(let V=0;V<B.length;V++){const Y=B[V];R.__webglColorRenderbuffer[V]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,R.__webglColorRenderbuffer[V]);const le=o.convert(Y.format,Y.colorSpace),j=o.convert(Y.type),K=m(Y.internalFormat,le,j,Y.normalized,Y.colorSpace,u.isXRRenderTarget===!0),te=Ze(u);e.renderbufferStorageMultisample(e.RENDERBUFFER,te,K,u.width,u.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+V,e.RENDERBUFFER,R.__webglColorRenderbuffer[V])}e.bindRenderbuffer(e.RENDERBUFFER,null),u.depthBuffer&&(R.__webglDepthRenderbuffer=e.createRenderbuffer(),ye(R.__webglDepthRenderbuffer,u,!0)),t.bindFramebuffer(e.FRAMEBUFFER,null)}}if(ae){t.bindTexture(e.TEXTURE_CUBE_MAP,I.__webglTexture),He(e.TEXTURE_CUBE_MAP,r);for(let V=0;V<6;V++)if(r.mipmaps&&r.mipmaps.length>0)for(let Y=0;Y<r.mipmaps.length;Y++)ve(R.__webglFramebuffer[V][Y],u,r,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+V,Y);else ve(R.__webglFramebuffer[V],u,r,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+V,0);s(r)&&U(e.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ce){for(let V=0,Y=B.length;V<Y;V++){const le=B[V],j=i.get(le);let K=e.TEXTURE_2D;(u.isWebGL3DRenderTarget||u.isWebGLArrayRenderTarget)&&(K=u.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(K,j.__webglTexture),He(K,le),ve(R.__webglFramebuffer,u,le,e.COLOR_ATTACHMENT0+V,K,0),s(le)&&U(K)}t.unbindTexture()}else{let V=e.TEXTURE_2D;if((u.isWebGL3DRenderTarget||u.isWebGLArrayRenderTarget)&&(V=u.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(V,I.__webglTexture),He(V,r),r.mipmaps&&r.mipmaps.length>0)for(let Y=0;Y<r.mipmaps.length;Y++)ve(R.__webglFramebuffer[Y],u,r,e.COLOR_ATTACHMENT0,V,Y);else ve(R.__webglFramebuffer,u,r,e.COLOR_ATTACHMENT0,V,0);s(r)&&U(V),t.unbindTexture()}u.depthBuffer&&Le(u)}function De(u){const r=u.textures;for(let R=0,I=r.length;R<I;R++){const B=r[R];if(s(B)){const ae=D(u),ce=i.get(B).__webglTexture;t.bindTexture(ae,ce),U(ae),t.unbindTexture()}}}const Ke=[],ot=[];function lt(u){if(u.samples>0){if(it(u)===!1){const r=u.textures,R=u.width,I=u.height;let B=e.COLOR_BUFFER_BIT;const ae=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ce=i.get(u),V=r.length>1;if(V)for(let le=0;le<r.length;le++)t.bindFramebuffer(e.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+le,e.RENDERBUFFER,null),t.bindFramebuffer(e.FRAMEBUFFER,ce.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+le,e.TEXTURE_2D,null,0);t.bindFramebuffer(e.READ_FRAMEBUFFER,ce.__webglMultisampledFramebuffer);const Y=u.texture.mipmaps;Y&&Y.length>0?t.bindFramebuffer(e.DRAW_FRAMEBUFFER,ce.__webglFramebuffer[0]):t.bindFramebuffer(e.DRAW_FRAMEBUFFER,ce.__webglFramebuffer);for(let le=0;le<r.length;le++){if(u.resolveDepthBuffer&&(u.depthBuffer&&(B|=e.DEPTH_BUFFER_BIT),u.stencilBuffer&&u.resolveStencilBuffer&&(B|=e.STENCIL_BUFFER_BIT)),V){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,ce.__webglColorRenderbuffer[le]);const j=i.get(r[le]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,j,0)}e.blitFramebuffer(0,0,R,I,0,0,R,I,B,e.NEAREST),b===!0&&(Ke.length=0,ot.length=0,Ke.push(e.COLOR_ATTACHMENT0+le),u.depthBuffer&&u.storeMultisampledDepthBuffer===!1&&(Ke.push(ae),ot.push(ae),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,ot)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ke))}if(t.bindFramebuffer(e.READ_FRAMEBUFFER,null),t.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),V)for(let le=0;le<r.length;le++){t.bindFramebuffer(e.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+le,e.RENDERBUFFER,ce.__webglColorRenderbuffer[le]);const j=i.get(r[le]).__webglTexture;t.bindFramebuffer(e.FRAMEBUFFER,ce.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+le,e.TEXTURE_2D,j,0)}t.bindFramebuffer(e.DRAW_FRAMEBUFFER,ce.__webglMultisampledFramebuffer)}else if(u.depthBuffer&&u.storeMultisampledDepthBuffer===!1&&b){const r=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[r])}}}function Ze(u){return Math.min(l.maxSamples,u.samples)}function it(u){const r=i.get(u);return u.samples>0&&n.has("WEBGL_multisampled_render_to_texture")===!0&&r.__useRenderToTexture!==!1}function x(u){const r=d.render.frame;G.get(u)!==r&&(G.set(u,r),u.update())}function ft(u,r){const R=u.colorSpace,I=u.format,B=u.type;return u.isCompressedTexture===!0||u.isVideoTexture===!0||R!==Xr&&R!==Kt&&(rt.getTransfer(R)===Je?(I!==It||B!==Lt)&&Xe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):tt("WebGLTextures: Unsupported texture color space:",R)),r}function Ge(u){return typeof HTMLImageElement<"u"&&u instanceof HTMLImageElement?(T.width=u.naturalWidth||u.width,T.height=u.naturalHeight||u.height):typeof VideoFrame<"u"&&u instanceof VideoFrame?(T.width=u.displayWidth,T.height=u.displayHeight):(T.width=u.width,T.height=u.height),T}this.allocateTextureUnit=Z,this.resetTextureUnits=$,this.getTextureUnits=A,this.setTextureUnits=q,this.setTexture2D=ne,this.setTexture2DArray=Q,this.setTexture3D=ie,this.setTextureCube=re,this.rebindTextures=Fe,this.setupRenderTarget=We,this.updateRenderTargetMipmap=De,this.updateMultisampleRenderTarget=lt,this.setupDepthRenderbuffer=Le,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=it,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Cd(e,n){function t(i,l=Kt){let o;const d=rt.getTransfer(l);if(i===Lt)return e.UNSIGNED_BYTE;if(i===wr)return e.UNSIGNED_SHORT_4_4_4_4;if(i===Ur)return e.UNSIGNED_SHORT_5_5_5_1;if(i===so)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===co)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===lo)return e.BYTE;if(i===fo)return e.SHORT;if(i===bn)return e.UNSIGNED_SHORT;if(i===Fr)return e.INT;if(i===kt)return e.UNSIGNED_INT;if(i===Gt)return e.FLOAT;if(i===yt)return e.HALF_FLOAT;if(i===uo)return e.ALPHA;if(i===po)return e.RGB;if(i===It)return e.RGBA;if(i===nn)return e.DEPTH_COMPONENT;if(i===$t)return e.DEPTH_STENCIL;if(i===ho)return e.RED;if(i===Lr)return e.RED_INTEGER;if(i===tn)return e.RG;if(i===Pr)return e.RG_INTEGER;if(i===Cr)return e.RGBA_INTEGER;if(i===Nn||i===yn||i===Fn||i===On)if(d===Je)if(o=n.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(i===Nn)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===yn)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Fn)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===On)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=n.get("WEBGL_compressed_texture_s3tc"),o!==null){if(i===Nn)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===yn)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Fn)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===On)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===xi||i===Mi||i===Ti||i===Ai)if(o=n.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(i===xi)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Mi)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ti)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ai)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ri||i===bi||i===Ci||i===Pi||i===Li||i===$n||i===wi)if(o=n.get("WEBGL_compressed_texture_etc"),o!==null){if(i===Ri||i===bi)return d===Je?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(i===Ci)return d===Je?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC;if(i===Pi)return o.COMPRESSED_R11_EAC;if(i===Li)return o.COMPRESSED_SIGNED_R11_EAC;if(i===$n)return o.COMPRESSED_RG11_EAC;if(i===wi)return o.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Ui||i===Di||i===Ii||i===Ni||i===yi||i===Fi||i===Oi||i===Bi||i===Gi||i===Hi||i===Vi||i===Wi||i===ki||i===zi)if(o=n.get("WEBGL_compressed_texture_astc"),o!==null){if(i===Ui)return d===Je?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Di)return d===Je?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ii)return d===Je?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ni)return d===Je?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===yi)return d===Je?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Fi)return d===Je?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Oi)return d===Je?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Bi)return d===Je?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Gi)return d===Je?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Hi)return d===Je?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Vi)return d===Je?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Wi)return d===Je?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ki)return d===Je?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===zi)return d===Je?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Xi||i===Yi||i===Ki)if(o=n.get("EXT_texture_compression_bptc"),o!==null){if(i===Xi)return d===Je?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Yi)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ki)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===qi||i===Zi||i===Qn||i===$i)if(o=n.get("EXT_texture_compression_rgtc"),o!==null){if(i===qi)return o.COMPRESSED_RED_RGTC1_EXT;if(i===Zi)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Qn)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===$i)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===hn?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:t}}const Pd=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ld=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class wd{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(n,t){if(this.texture===null){const i=new yr(n.texture);(n.depthNear!==t.depthNear||n.depthFar!==t.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=i}}getMesh(n){if(this.texture!==null&&this.mesh===null){const t=n.cameras[0].viewport,i=new Dt({vertexShader:Pd,fragmentShader:Ld,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new pt(new Dr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ud extends Wa{constructor(n,t){super();const i=this;let l=null,o=1,d=null,g="local-floor",b=1,T=null,G=null,y=null,p=null,M=null,N=null;const z=typeof XRWebGLBinding<"u",f=new wd,s={},U=t.getContextAttributes();let D=null,m=null;const S=[],h=[],C=new gt;let c=null,_=null;const P=new un;P.viewport=new St;const O=new un;O.viewport=new St;const W=[P,O],$=new ka;let A=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(k){let J=S[k];return J===void 0&&(J=new In,S[k]=J),J.getTargetRaySpace()},this.getControllerGrip=function(k){let J=S[k];return J===void 0&&(J=new In,S[k]=J),J.getGripSpace()},this.getHand=function(k){let J=S[k];return J===void 0&&(J=new In,S[k]=J),J.getHandSpace()};function Z(k){const J=h.indexOf(k.inputSource);if(J===-1)return;const xe=S[J];xe!==void 0&&(xe.update(k.inputSource,k.frame,T||d),xe.dispatchEvent({type:k.type,data:k.inputSource}))}function X(){l.removeEventListener("select",Z),l.removeEventListener("selectstart",Z),l.removeEventListener("selectend",Z),l.removeEventListener("squeeze",Z),l.removeEventListener("squeezestart",Z),l.removeEventListener("squeezeend",Z),l.removeEventListener("end",X),l.removeEventListener("inputsourceschange",ne);for(let k=0;k<S.length;k++){const J=h[k];J!==null&&(h[k]=null,S[k].disconnect(J))}A=null,q=null,f.reset();for(const k in s)delete s[k];if(n.setRenderTarget(D),M=null,p=null,y=null,l=null,m=null,Ve.stop(),i.isPresenting=!1,n.setPixelRatio(c),n.setSize(C.width,C.height,!1),_!==null){const k=_.camera;k.fov=_.fov,k.zoom=_.zoom,k.updateProjectionMatrix(),_=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(k){o=k,i.isPresenting===!0&&Xe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(k){g=k,i.isPresenting===!0&&Xe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return T||d},this.setReferenceSpace=function(k){T=k},this.getBaseLayer=function(){return p!==null?p:M},this.getBinding=function(){return y===null&&z&&(y=new XRWebGLBinding(l,t)),y},this.getFrame=function(){return N},this.getSession=function(){return l},this.setSession=async function(k){if(l=k,l!==null){if(D=n.getRenderTarget(),l.addEventListener("select",Z),l.addEventListener("selectstart",Z),l.addEventListener("selectend",Z),l.addEventListener("squeeze",Z),l.addEventListener("squeezestart",Z),l.addEventListener("squeezeend",Z),l.addEventListener("end",X),l.addEventListener("inputsourceschange",ne),U.xrCompatible!==!0&&await t.makeXRCompatible(),c=n.getPixelRatio(),n.getSize(C),z&&"createProjectionLayer"in XRWebGLBinding.prototype){let xe=null,Pe=null,ve=null;U.depth&&(ve=U.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,xe=U.stencil?$t:nn,Pe=U.stencil?hn:kt);const ye={colorFormat:t.RGBA8,depthFormat:ve,scaleFactor:o};y=this.getBinding(),p=y.createProjectionLayer(ye),l.updateRenderState({layers:[p]}),n.setPixelRatio(1),n.setSize(p.textureWidth,p.textureHeight,!1),m=new At(p.textureWidth,p.textureHeight,{format:It,type:Lt,depthTexture:new An(p.textureWidth,p.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,xe),stencilBuffer:U.stencil,colorSpace:n.outputColorSpace,samples:U.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}else{const xe={antialias:U.antialias,alpha:!0,depth:U.depth,stencil:U.stencil,framebufferScaleFactor:o};M=new XRWebGLLayer(l,t,xe),l.updateRenderState({baseLayer:M}),n.setPixelRatio(1),n.setSize(M.framebufferWidth,M.framebufferHeight,!1),m=new At(M.framebufferWidth,M.framebufferHeight,{format:It,type:Lt,colorSpace:n.outputColorSpace,stencilBuffer:U.stencil,resolveDepthBuffer:M.ignoreDepthValues===!1,resolveStencilBuffer:M.ignoreDepthValues===!1,storeMultisampledDepthBuffer:M.ignoreDepthValues===!1,storeMultisampledStencilBuffer:M.ignoreDepthValues===!1})}m.isXRRenderTarget=!0,this.setFoveation(b),T=null,d=await l.requestReferenceSpace(g),Ve.setContext(l),Ve.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function ne(k){for(let J=0;J<k.removed.length;J++){const xe=k.removed[J],Pe=h.indexOf(xe);Pe>=0&&(h[Pe]=null,S[Pe].disconnect(xe))}for(let J=0;J<k.added.length;J++){const xe=k.added[J];let Pe=h.indexOf(xe);if(Pe===-1){for(let ye=0;ye<S.length;ye++)if(ye>=h.length){h.push(xe),Pe=ye;break}else if(h[ye]===null){h[ye]=xe,Pe=ye;break}if(Pe===-1)break}const ve=S[Pe];ve&&ve.connect(xe)}}const Q=new Ne,ie=new Ne;function re(k,J,xe){Q.setFromMatrixPosition(J.matrixWorld),ie.setFromMatrixPosition(xe.matrixWorld);const Pe=Q.distanceTo(ie),ve=J.projectionMatrix.elements,ye=xe.projectionMatrix.elements,at=ve[14]/(ve[10]-1),Le=ve[14]/(ve[10]+1),Fe=(ve[9]+1)/ve[5],We=(ve[9]-1)/ve[5],De=(ve[8]-1)/ve[0],Ke=(ye[8]+1)/ye[0],ot=at*De,lt=at*Ke,Ze=Pe/(-De+Ke),it=Ze*-De;if(J.matrixWorld.decompose(k.position,k.quaternion,k.scale),k.translateX(it),k.translateZ(Ze),k.matrixWorld.compose(k.position,k.quaternion,k.scale),k.matrixWorldInverse.copy(k.matrixWorld).invert(),ve[10]===-1)k.projectionMatrix.copy(J.projectionMatrix),k.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const x=at+Ze,ft=Le+Ze,Ge=ot-it,u=lt+(Pe-it),r=Fe*Le/ft*x,R=We*Le/ft*x;k.projectionMatrix.makePerspective(Ge,u,r,R,x,ft),k.projectionMatrixInverse.copy(k.projectionMatrix).invert()}}function Ce(k,J){J===null?k.matrixWorld.copy(k.matrix):k.matrixWorld.multiplyMatrices(J.matrixWorld,k.matrix),k.matrixWorldInverse.copy(k.matrixWorld).invert()}this.updateCamera=function(k){if(l===null)return;let J=k.near,xe=k.far;f.texture!==null&&(f.depthNear>0&&(J=f.depthNear),f.depthFar>0&&(xe=f.depthFar)),$.near=O.near=P.near=J,$.far=O.far=P.far=xe,(A!==$.near||q!==$.far)&&(l.updateRenderState({depthNear:$.near,depthFar:$.far}),A=$.near,q=$.far),$.layers.mask=k.layers.mask|6,P.layers.mask=$.layers.mask&-5,O.layers.mask=$.layers.mask&-3;const Pe=k.parent,ve=$.cameras;Ce($,Pe);for(let ye=0;ye<ve.length;ye++)Ce(ve[ye],Pe);ve.length===2?re($,P,O):$.projectionMatrix.copy(P.projectionMatrix),_===null&&k.isPerspectiveCamera&&(_={camera:k,fov:k.fov,zoom:k.zoom}),be(k,$,Pe)};function be(k,J,xe){xe===null?k.matrix.copy(J.matrixWorld):(k.matrix.copy(xe.matrixWorld),k.matrix.invert(),k.matrix.multiply(J.matrixWorld)),k.matrix.decompose(k.position,k.quaternion,k.scale),k.updateMatrixWorld(!0),k.projectionMatrix.copy(J.projectionMatrix),k.projectionMatrixInverse.copy(J.projectionMatrixInverse),k.isPerspectiveCamera&&(k.fov=za*2*Math.atan(1/k.projectionMatrix.elements[5]),k.zoom=1)}this.getCamera=function(){return $},this.getFoveation=function(){if(!(p===null&&M===null))return b},this.setFoveation=function(k){b=k,p!==null&&(p.fixedFoveation=k),M!==null&&M.fixedFoveation!==void 0&&(M.fixedFoveation=k)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh($)},this.getCameraTexture=function(k){return s[k]};let nt=null;function He(k,J){if(G=J.getViewerPose(T||d),N=J,G!==null){const xe=G.views;M!==null&&(n.setRenderTargetFramebuffer(m,M.framebuffer),n.setRenderTarget(m));let Pe=!1;xe.length!==$.cameras.length&&($.cameras.length=0,Pe=!0);for(let Le=0;Le<xe.length;Le++){const Fe=xe[Le];let We=null;if(M!==null)We=M.getViewport(Fe);else{const Ke=y.getViewSubImage(p,Fe);We=Ke.viewport,Le===0&&(n.setRenderTargetTextures(m,Ke.colorTexture,Ke.depthStencilTexture),n.setRenderTarget(m))}let De=W[Le];De===void 0&&(De=new un,De.layers.enable(Le),De.viewport=new St,W[Le]=De),De.matrix.fromArray(Fe.transform.matrix),De.matrix.decompose(De.position,De.quaternion,De.scale),De.projectionMatrix.fromArray(Fe.projectionMatrix),De.projectionMatrixInverse.copy(De.projectionMatrix).invert(),De.viewport.set(We.x,We.y,We.width,We.height),Le===0&&($.matrix.copy(De.matrix),$.matrix.decompose($.position,$.quaternion,$.scale)),Pe===!0&&$.cameras.push(De)}const ve=l.enabledFeatures;if(ve&&ve.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&z){y=i.getBinding();const Le=y.getDepthInformation(xe[0]);Le&&Le.isValid&&Le.texture&&f.init(Le,l.renderState)}if(ve&&ve.includes("camera-access")&&z){n.state.unbindTexture(),y=i.getBinding();for(let Le=0;Le<xe.length;Le++){const Fe=xe[Le].camera;if(Fe){let We=s[Fe];We||(We=new yr,s[Fe]=We);const De=y.getCameraImage(Fe);We.sourceTexture=De}}}}for(let xe=0;xe<S.length;xe++){const Pe=h[xe],ve=S[xe];Pe!==null&&ve!==void 0&&ve.update(Pe,J,T||d)}nt&&nt(k,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),N=null}const Ve=new Yr;Ve.setAnimationLoop(He),this.setAnimationLoop=function(k){nt=k},this.dispose=function(){}}}const Dd=new jt,jr=new Oe;jr.set(-1,0,0,0,1,0,0,0,1);function Id(e,n){function t(f,s){f.matrixAutoUpdate===!0&&f.updateMatrix(),s.value.copy(f.matrix)}function i(f,s){s.color.getRGB(f.fogColor.value,Ir(e)),s.isFog?(f.fogNear.value=s.near,f.fogFar.value=s.far):s.isFogExp2&&(f.fogDensity.value=s.density)}function l(f,s,U,D,m){s.isNodeMaterial?s.uniformsNeedUpdate=!1:s.isMeshBasicMaterial?o(f,s):s.isMeshLambertMaterial?(o(f,s),s.envMap&&(f.envMapIntensity.value=s.envMapIntensity)):s.isMeshToonMaterial?(o(f,s),y(f,s)):s.isMeshPhongMaterial?(o(f,s),G(f,s),s.envMap&&(f.envMapIntensity.value=s.envMapIntensity)):s.isMeshStandardMaterial?(o(f,s),p(f,s),s.isMeshPhysicalMaterial&&M(f,s,m)):s.isMeshMatcapMaterial?(o(f,s),N(f,s)):s.isMeshDepthMaterial?o(f,s):s.isMeshDistanceMaterial?(o(f,s),z(f,s)):s.isMeshNormalMaterial?o(f,s):s.isLineBasicMaterial?(d(f,s),s.isLineDashedMaterial&&g(f,s)):s.isPointsMaterial?b(f,s,U,D):s.isSpriteMaterial?T(f,s):s.isShadowMaterial?(f.color.value.copy(s.color),f.opacity.value=s.opacity):s.isShaderMaterial&&(s.uniformsNeedUpdate=!1)}function o(f,s){f.opacity.value=s.opacity,s.color&&f.diffuse.value.copy(s.color),s.emissive&&f.emissive.value.copy(s.emissive).multiplyScalar(s.emissiveIntensity),s.map&&(f.map.value=s.map,t(s.map,f.mapTransform)),s.alphaMap&&(f.alphaMap.value=s.alphaMap,t(s.alphaMap,f.alphaMapTransform)),s.bumpMap&&(f.bumpMap.value=s.bumpMap,t(s.bumpMap,f.bumpMapTransform),f.bumpScale.value=s.bumpScale,s.side===Et&&(f.bumpScale.value*=-1)),s.normalMap&&(f.normalMap.value=s.normalMap,t(s.normalMap,f.normalMapTransform),f.normalScale.value.copy(s.normalScale),s.side===Et&&f.normalScale.value.negate()),s.displacementMap&&(f.displacementMap.value=s.displacementMap,t(s.displacementMap,f.displacementMapTransform),f.displacementScale.value=s.displacementScale,f.displacementBias.value=s.displacementBias),s.emissiveMap&&(f.emissiveMap.value=s.emissiveMap,t(s.emissiveMap,f.emissiveMapTransform)),s.specularMap&&(f.specularMap.value=s.specularMap,t(s.specularMap,f.specularMapTransform)),s.alphaTest>0&&(f.alphaTest.value=s.alphaTest);const U=n.get(s),D=U.envMap,m=U.envMapRotation;D&&(f.envMap.value=D,f.envMapRotation.value.setFromMatrix4(Dd.makeRotationFromEuler(m)).transpose(),D.isCubeTexture&&D.isRenderTargetTexture===!1&&f.envMapRotation.value.premultiply(jr),f.reflectivity.value=s.reflectivity,f.ior.value=s.ior,f.refractionRatio.value=s.refractionRatio),s.lightMap&&(f.lightMap.value=s.lightMap,f.lightMapIntensity.value=s.lightMapIntensity,t(s.lightMap,f.lightMapTransform)),s.aoMap&&(f.aoMap.value=s.aoMap,f.aoMapIntensity.value=s.aoMapIntensity,t(s.aoMap,f.aoMapTransform))}function d(f,s){f.diffuse.value.copy(s.color),f.opacity.value=s.opacity,s.map&&(f.map.value=s.map,t(s.map,f.mapTransform))}function g(f,s){f.dashSize.value=s.dashSize,f.totalSize.value=s.dashSize+s.gapSize,f.scale.value=s.scale}function b(f,s,U,D){f.diffuse.value.copy(s.color),f.opacity.value=s.opacity,f.size.value=s.size*U,f.scale.value=D*.5,s.map&&(f.map.value=s.map,t(s.map,f.uvTransform)),s.alphaMap&&(f.alphaMap.value=s.alphaMap,t(s.alphaMap,f.alphaMapTransform)),s.alphaTest>0&&(f.alphaTest.value=s.alphaTest)}function T(f,s){f.diffuse.value.copy(s.color),f.opacity.value=s.opacity,f.rotation.value=s.rotation,s.map&&(f.map.value=s.map,t(s.map,f.mapTransform)),s.alphaMap&&(f.alphaMap.value=s.alphaMap,t(s.alphaMap,f.alphaMapTransform)),s.alphaTest>0&&(f.alphaTest.value=s.alphaTest)}function G(f,s){f.specular.value.copy(s.specular),f.shininess.value=Math.max(s.shininess,1e-4)}function y(f,s){s.gradientMap&&(f.gradientMap.value=s.gradientMap)}function p(f,s){f.metalness.value=s.metalness,s.metalnessMap&&(f.metalnessMap.value=s.metalnessMap,t(s.metalnessMap,f.metalnessMapTransform)),f.roughness.value=s.roughness,s.roughnessMap&&(f.roughnessMap.value=s.roughnessMap,t(s.roughnessMap,f.roughnessMapTransform)),s.envMap&&(f.envMapIntensity.value=s.envMapIntensity)}function M(f,s,U){f.ior.value=s.ior,s.sheen>0&&(f.sheenColor.value.copy(s.sheenColor).multiplyScalar(s.sheen),f.sheenRoughness.value=s.sheenRoughness,s.sheenColorMap&&(f.sheenColorMap.value=s.sheenColorMap,t(s.sheenColorMap,f.sheenColorMapTransform)),s.sheenRoughnessMap&&(f.sheenRoughnessMap.value=s.sheenRoughnessMap,t(s.sheenRoughnessMap,f.sheenRoughnessMapTransform))),s.clearcoat>0&&(f.clearcoat.value=s.clearcoat,f.clearcoatRoughness.value=s.clearcoatRoughness,s.clearcoatMap&&(f.clearcoatMap.value=s.clearcoatMap,t(s.clearcoatMap,f.clearcoatMapTransform)),s.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=s.clearcoatRoughnessMap,t(s.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),s.clearcoatNormalMap&&(f.clearcoatNormalMap.value=s.clearcoatNormalMap,t(s.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(s.clearcoatNormalScale),s.side===Et&&f.clearcoatNormalScale.value.negate())),s.dispersion>0&&(f.dispersion.value=s.dispersion),s.retroreflectivity>0&&(f.retroreflectivity.value=s.retroreflectivity),s.iridescence>0&&(f.iridescence.value=s.iridescence,f.iridescenceIOR.value=s.iridescenceIOR,f.iridescenceThicknessMinimum.value=s.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=s.iridescenceThicknessRange[1],s.iridescenceMap&&(f.iridescenceMap.value=s.iridescenceMap,t(s.iridescenceMap,f.iridescenceMapTransform)),s.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=s.iridescenceThicknessMap,t(s.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),s.transmission>0&&(f.transmission.value=s.transmission,f.transmissionSamplerMap.value=U.texture,f.transmissionSamplerSize.value.set(U.width,U.height),s.transmissionMap&&(f.transmissionMap.value=s.transmissionMap,t(s.transmissionMap,f.transmissionMapTransform)),f.thickness.value=s.thickness,s.thicknessMap&&(f.thicknessMap.value=s.thicknessMap,t(s.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=s.attenuationDistance,f.attenuationColor.value.copy(s.attenuationColor)),s.anisotropy>0&&(f.anisotropyVector.value.set(s.anisotropy*Math.cos(s.anisotropyRotation),s.anisotropy*Math.sin(s.anisotropyRotation)),s.anisotropyMap&&(f.anisotropyMap.value=s.anisotropyMap,t(s.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=s.specularIntensity,f.specularColor.value.copy(s.specularColor),s.specularColorMap&&(f.specularColorMap.value=s.specularColorMap,t(s.specularColorMap,f.specularColorMapTransform)),s.specularIntensityMap&&(f.specularIntensityMap.value=s.specularIntensityMap,t(s.specularIntensityMap,f.specularIntensityMapTransform))}function N(f,s){s.matcap&&(f.matcap.value=s.matcap)}function z(f,s){const U=n.get(s).light;f.referencePosition.value.setFromMatrixPosition(U.matrixWorld),f.nearDistance.value=U.shadow.camera.near,f.farDistance.value=U.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:l}}function Nd(e,n,t,i){let l={},o={},d=[];const g=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function b(m,S){const h=S.program;i.uniformBlockBinding(m,h)}function T(m,S){let h=l[m.id];h===void 0&&(f(m),h=G(m),l[m.id]=h,m.addEventListener("dispose",U));const C=S.program;i.updateUBOMapping(m,C);const c=n.render.frame;o[m.id]!==c&&(p(m),o[m.id]=c)}function G(m){const S=y();m.__bindingPointIndex=S;const h=e.createBuffer(),C=m.__size,c=m.usage;return e.bindBuffer(e.UNIFORM_BUFFER,h),e.bufferData(e.UNIFORM_BUFFER,C,c),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,S,h),h}function y(){for(let m=0;m<g;m++)if(d.indexOf(m)===-1)return d.push(m),m;return tt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(m){const S=l[m.id],h=m.uniforms,C=m.__cache;e.bindBuffer(e.UNIFORM_BUFFER,S);for(let c=0,_=h.length;c<_;c++){const P=h[c];if(Array.isArray(P))for(let O=0,W=P.length;O<W;O++)M(P[O],c,O,C);else M(P,c,0,C)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function M(m,S,h,C){if(z(m,S,h,C)===!0){const c=m.__offset,_=m.value;if(Array.isArray(_)){let P=0;for(let O=0;O<_.length;O++){const W=_[O],$=s(W);N(W,m.__data,P),typeof W!="number"&&typeof W!="boolean"&&!W.isMatrix3&&!ArrayBuffer.isView(W)&&(P+=$.storage/Float32Array.BYTES_PER_ELEMENT)}}else N(_,m.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,c,m.__data)}}function N(m,S,h){typeof m=="number"||typeof m=="boolean"?S[0]=m:m.isMatrix3?(S[0]=m.elements[0],S[1]=m.elements[1],S[2]=m.elements[2],S[3]=0,S[4]=m.elements[3],S[5]=m.elements[4],S[6]=m.elements[5],S[7]=0,S[8]=m.elements[6],S[9]=m.elements[7],S[10]=m.elements[8],S[11]=0):ArrayBuffer.isView(m)?S.set(new m.constructor(m.buffer,m.byteOffset,S.length)):m.toArray(S,h)}function z(m,S,h,C){const c=m.value,_=S+"_"+h;if(C[_]===void 0)return typeof c=="number"||typeof c=="boolean"?C[_]=c:ArrayBuffer.isView(c)?C[_]=c.slice():C[_]=c.clone(),!0;{const P=C[_];if(typeof c=="number"||typeof c=="boolean"){if(P!==c)return C[_]=c,!0}else{if(ArrayBuffer.isView(c))return!0;if(P.equals(c)===!1)return P.copy(c),!0}}return!1}function f(m){const S=m.uniforms;let h=0;const C=16;for(let _=0,P=S.length;_<P;_++){const O=Array.isArray(S[_])?S[_]:[S[_]];for(let W=0,$=O.length;W<$;W++){const A=O[W],q=Array.isArray(A.value)?A.value:[A.value];for(let Z=0,X=q.length;Z<X;Z++){const ne=q[Z],Q=s(ne),ie=h%C,re=ie%Q.boundary,Ce=ie+re;h+=re,Ce!==0&&C-Ce<Q.storage&&(h+=C-Ce),A.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),A.__offset=h,h+=Q.storage}}}const c=h%C;return c>0&&(h+=C-c),m.__size=h,m.__cache={},this}function s(m){const S={boundary:0,storage:0};return typeof m=="number"||typeof m=="boolean"?(S.boundary=4,S.storage=4):m.isVector2?(S.boundary=8,S.storage=8):m.isVector3||m.isColor?(S.boundary=16,S.storage=12):m.isVector4?(S.boundary=16,S.storage=16):m.isMatrix3?(S.boundary=48,S.storage=48):m.isMatrix4?(S.boundary=64,S.storage=64):m.isTexture?Xe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(m)?(S.boundary=16,S.storage=m.byteLength):Xe("WebGLRenderer: Unsupported uniform value type.",m),S}function U(m){const S=m.target;S.removeEventListener("dispose",U);const h=d.indexOf(S.__bindingPointIndex);d.splice(h,1),e.deleteBuffer(l[S.id]),delete l[S.id],delete o[S.id]}function D(){for(const m in l)e.deleteBuffer(l[m]);d=[],l={},o={}}return{bind:b,update:T,dispose:D}}const yd=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Ct=null;function Fd(){return Ct===null&&(Ct=new Xa(yd,16,16,tn,yt),Ct.name="DFG_LUT",Ct.minFilter=xt,Ct.magFilter=xt,Ct.wrapS=Kn,Ct.wrapT=Kn,Ct.generateMipmaps=!1,Ct.needsUpdate=!0),Ct}class Od{constructor(n={}){const{canvas:t=sa(),context:i=null,depth:l=!0,stencil:o=!1,alpha:d=!1,antialias:g=!1,premultipliedAlpha:b=!0,preserveDrawingBuffer:T=!1,powerPreference:G="default",failIfMajorPerformanceCaveat:y=!1,reversedDepthBuffer:p=!1,outputBufferType:M=Lt}=n;this.isWebGLRenderer=!0;let N;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");N=i.getContextAttributes().alpha}else N=d;const z=M,f=new Set([Cr,Pr,Lr]),s=new Set([Lt,kt,bn,hn,wr,Ur]),U=new Uint32Array(4),D=new Int32Array(4),m=new Ne;let S=null,h=null;const C=[],c=[];let _=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ut,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let O=!1,W=null,$=null,A=null,q=null;this._outputColorSpace=ca;let Z=0,X=0,ne=null,Q=-1,ie=null;const re=new St,Ce=new St;let be=null;const nt=new je(0);let He=0,Ve=t.width,k=t.height,J=1,xe=null,Pe=null;const ve=new St(0,0,Ve,k),ye=new St(0,0,Ve,k);let at=!1;const Le=new Rr;let Fe=!1,We=!1;const De=new jt,Ke=new Ne,ot=new St,lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ze=!1;function it(){return ne===null?J:1}let x=i;function ft(a,E){return t.getContext(a,E)}let Ge,u,r,R,I,B,ae,ce,V,Y,le,j,K,te,ue,me,Re,v,oe,H,se,fe,ee;try{const a={alpha:!0,depth:l,stencil:o,antialias:g,premultipliedAlpha:b,preserveDrawingBuffer:T,powerPreference:G,failIfMajorPerformanceCaveat:y};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${la}`),t.addEventListener("webglcontextlost",$e,!1),t.addEventListener("webglcontextrestored",ke,!1),t.addEventListener("webglcontextcreationerror",Tt,!1),x===null){const E="webgl2";if(x=ft(E,a),x===null)throw ft(E)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ae()}catch(a){throw t.removeEventListener("webglcontextlost",$e,!1),t.removeEventListener("webglcontextrestored",ke,!1),t.removeEventListener("webglcontextcreationerror",Tt,!1),tt("WebGLRenderer: "+a.message),a}function Ae(){Ge=new yl(x),Ge.init(),se=new Cd(x,Ge),u=new Rl(x,Ge,n,se),r=new Rd(x,Ge),u.reversedDepthBuffer&&p&&r.buffers.depth.setReversed(!0),$=x.createFramebuffer(),A=x.createFramebuffer(),q=x.createFramebuffer(),R=new Bl(x),I=new dd,B=new bd(x,Ge,r,I,u,se,R),ae=new Nl(P),ce=new Ho(x),fe=new Tl(x,ce),V=new Fl(x,ce,R,fe),Y=new Hl(x,V,ce,fe,R),v=new Gl(x,u,B),ue=new bl(I),le=new fd(P,ae,Ge,u,fe,ue),j=new Id(P,I),K=new pd,te=new Sd(Ge),Re=new Ml(P,ae,r,Y,N,b),me=new Ad(P,Y,u),ee=new Nd(x,R,u,r),oe=new Al(x,Ge,R),H=new Ol(x,Ge,R),R.programs=le.programs,P.capabilities=u,P.extensions=Ge,P.properties=I,P.renderLists=K,P.shadowMap=me,P.state=r,P.info=R}z!==Lt&&(_=new Wl(z,t.width,t.height,g,l,o));const Me=new Ud(P,x);this.xr=Me,this.getContext=function(){return x},this.getContextAttributes=function(){return x.getContextAttributes()},this.forceContextLoss=function(){const a=Ge.get("WEBGL_lose_context");a&&a.loseContext()},this.forceContextRestore=function(){const a=Ge.get("WEBGL_lose_context");a&&a.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(a){a!==void 0&&(J=a,this.setSize(Ve,k,!1))},this.getSize=function(a){return a.set(Ve,k)},this.setSize=function(a,E,F=!0){if(Me.isPresenting){Xe("WebGLRenderer: Can't change size while VR device is presenting.");return}Ve=a,k=E,t.width=Math.floor(a*J),t.height=Math.floor(E*J),F===!0&&(t.style.width=a+"px",t.style.height=E+"px"),_!==null&&_.setSize(t.width,t.height),this.setViewport(0,0,a,E)},this.getDrawingBufferSize=function(a){return a.set(Ve*J,k*J).floor()},this.setDrawingBufferSize=function(a,E,F){Ve=a,k=E,J=F,t.width=Math.floor(a*F),t.height=Math.floor(E*F),this.setViewport(0,0,a,E)},this.setEffects=function(a){if(z===Lt){tt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(a){for(let E=0;E<a.length;E++)if(a[E].isOutputPass===!0){Xe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}_.setEffects(a||[])},this.getCurrentViewport=function(a){return a.copy(re)},this.getViewport=function(a){return a.copy(ve)},this.setViewport=function(a,E,F,L){a.isVector4?ve.set(a.x,a.y,a.z,a.w):ve.set(a,E,F,L),r.viewport(re.copy(ve).multiplyScalar(J).round())},this.getScissor=function(a){return a.copy(ye)},this.setScissor=function(a,E,F,L){a.isVector4?ye.set(a.x,a.y,a.z,a.w):ye.set(a,E,F,L),r.scissor(Ce.copy(ye).multiplyScalar(J).round())},this.getScissorTest=function(){return at},this.setScissorTest=function(a){r.setScissorTest(at=a)},this.setOpaqueSort=function(a){xe=a},this.setTransparentSort=function(a){Pe=a},this.getClearColor=function(a){return a.copy(Re.getClearColor())},this.setClearColor=function(){Re.setClearColor(...arguments)},this.getClearAlpha=function(){return Re.getClearAlpha()},this.setClearAlpha=function(){Re.setClearAlpha(...arguments)},this.clear=function(a=!0,E=!0,F=!0){let L=0;if(a){let w=!1;if(ne!==null){const he=ne.texture.format;w=f.has(he)}if(w){const he=ne.texture.type,ge=s.has(he),pe=Re.getClearColor(),Se=Re.getClearAlpha(),Te=pe.r,we=pe.g,Ie=pe.b;ge?(U[0]=Te,U[1]=we,U[2]=Ie,U[3]=Se,x.clearBufferuiv(x.COLOR,0,U)):(D[0]=Te,D[1]=we,D[2]=Ie,D[3]=Se,x.clearBufferiv(x.COLOR,0,D))}else L|=x.COLOR_BUFFER_BIT}E&&(L|=x.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),F&&(L|=x.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L!==0&&x.clear(L)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(a){a.setRenderer(this),W=a},this.dispose=function(){t.removeEventListener("webglcontextlost",$e,!1),t.removeEventListener("webglcontextrestored",ke,!1),t.removeEventListener("webglcontextcreationerror",Tt,!1),Re.dispose(),K.dispose(),te.dispose(),I.dispose(),ae.dispose(),Y.dispose(),fe.dispose(),ee.dispose(),le.dispose(),Me.dispose(),Me.removeEventListener("sessionstart",ai),Me.removeEventListener("sessionend",oi),Ht.stop()};function $e(a){a.preventDefault(),hi("WebGLRenderer: Context Lost."),O=!0}function ke(){hi("WebGLRenderer: Context Restored."),O=!1;const a=R.autoReset,E=me.enabled,F=me.autoUpdate,L=me.needsUpdate,w=me.type;Ae(),R.autoReset=a,me.enabled=E,me.autoUpdate=F,me.needsUpdate=L,me.type=w}function Tt(a){tt("WebGLRenderer: A WebGL context could not be created. Reason: ",a.statusMessage)}function Rt(a){const E=a.target;E.removeEventListener("dispose",Rt),ea(E)}function ea(a){ta(a),I.remove(a)}function ta(a){const E=I.get(a).programs;E!==void 0&&(E.forEach(function(F){le.releaseProgram(F)}),a.isShaderMaterial&&le.releaseShaderCache(a))}this.renderBufferDirect=function(a,E,F,L,w,he){E===null&&(E=lt);const ge=w.isMesh&&w.matrixWorld.determinantAffine()<0,pe=ra(a,E,F,L,w);r.setMaterial(L,ge);let Se=F.index,Te=1;if(L.wireframe===!0){if(Se=V.getWireframeAttribute(F),Se===void 0)return;Te=2}const we=F.drawRange,Ie=F.attributes.position;let Ee=we.start*Te,ze=(we.start+we.count)*Te;he!==null&&(Ee=Math.max(Ee,he.start*Te),ze=Math.min(ze,(he.start+he.count)*Te)),Se!==null?(Ee=Math.max(Ee,0),ze=Math.min(ze,Se.count)):Ie!=null&&(Ee=Math.max(Ee,0),ze=Math.min(ze,Ie.count));const ct=ze-Ee;if(ct<0||ct===1/0)return;fe.setup(w,L,pe,F,Se);let et,qe=oe;if(Se!==null&&(et=ce.get(Se),qe=H,qe.setIndex(et)),w.isMesh)L.wireframe===!0?(r.setLineWidth(L.wireframeLinewidth*it()),qe.setMode(x.LINES)):qe.setMode(x.TRIANGLES);else if(w.isLine){let ht=L.linewidth;ht===void 0&&(ht=1),r.setLineWidth(ht*it()),w.isLineSegments?qe.setMode(x.LINES):w.isLineLoop?qe.setMode(x.LINE_LOOP):qe.setMode(x.LINE_STRIP)}else w.isPoints?qe.setMode(x.POINTS):w.isSprite&&qe.setMode(x.TRIANGLES);if(w.isBatchedMesh)if(Ge.get("WEBGL_multi_draw"))qe.renderMultiDraw(w._multiDrawStarts,w._multiDrawCounts,w._multiDrawCount);else{const ht=w._multiDrawStarts,_e=w._multiDrawCounts,_t=w._multiDrawCount,Be=Se?ce.get(Se).bytesPerElement:1,Mt=I.get(L).currentProgram.getUniforms();for(let bt=0;bt<_t;bt++)Mt.setValue(x,"_gl_DrawID",bt),qe.render(ht[bt]/Be,_e[bt])}else if(w.isInstancedMesh)qe.renderInstances(Ee,ct,w.count);else if(F.isInstancedBufferGeometry){const ht=F._maxInstanceCount!==void 0?F._maxInstanceCount:1/0,_e=Math.min(F.instanceCount,ht);qe.renderInstances(Ee,ct,_e)}else qe.render(Ee,ct)};function ri(a,E,F,L){W!==null&&a.isNodeMaterial&&W.setObject(L,a),Fe===!0&&ue.setState(a,F,!1),a.transparent===!0&&a.side===wt&&a.forceSinglePass===!1?(a.side=Et,a.needsUpdate=!0,gn(a,E,L),a.side=pn,a.needsUpdate=!0,gn(a,E,L),a.side=wt):gn(a,E,L)}this.compile=function(a,E,F=null){F===null&&(F=a),W!==null&&W.renderStart(a,E,F),h=te.get(F),h.init(E),c.push(h),F.traverseVisible(function(w){w.isLight&&w.layers.test(E.layers)&&(h.pushLight(w),w.castShadow&&h.pushShadow(w))}),a!==F&&a.traverseVisible(function(w){w.isLight&&w.layers.test(E.layers)&&(h.pushLight(w),w.castShadow&&h.pushShadow(w))}),h.setupLights(),W!==null&&W.updateLights(h.state.lightsArray),We=this.localClippingEnabled,Fe=ue.init(this.clippingPlanes,We),Fe===!0&&ue.setGlobalState(this.clippingPlanes,E),W!==null&&me.render(h.state.shadowsArray,F,E);const L=new Set;return a.traverse(function(w){if(!(w.isMesh||w.isPoints||w.isLine||w.isSprite))return;const he=w.material;if(he)if(Array.isArray(he))for(let ge=0;ge<he.length;ge++){const pe=he[ge];ri(pe,F,E,w),L.add(pe)}else ri(he,F,E,w),L.add(he)}),h=c.pop(),W!==null&&W.renderEnd(),L},this.compileAsync=function(a,E,F=null){const L=this.compile(a,E,F);return new Promise(w=>{function he(){if(L.forEach(function(ge){const Se=I.get(ge).currentProgram;(Se===void 0||Se.isReady())&&L.delete(ge)}),L.size===0){w(a);return}setTimeout(he,10)}Ge.get("KHR_parallel_shader_compile")!==null?he():setTimeout(he,10)})};let wn=null;function na(a){wn&&wn(a)}function ai(){Ht.stop()}function oi(){Ht.start()}const Ht=new Yr;Ht.setAnimationLoop(na),typeof self<"u"&&Ht.setContext(self),this.setAnimationLoop=function(a){wn=a,Me.setAnimationLoop(a),a===null?Ht.stop():Ht.start()},Me.addEventListener("sessionstart",ai),Me.addEventListener("sessionend",oi),this.render=function(a,E){if(E!==void 0&&E.isCamera!==!0){tt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(O===!0)return;W!==null&&W.renderStart(a,E);const F=Me.enabled===!0&&Me.isPresenting===!0,L=_!==null&&(ne===null||F)&&_.begin(P,ne);if(a.matrixWorldAutoUpdate===!0&&a.updateMatrixWorld(),E.parent===null&&E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),Me.enabled===!0&&Me.isPresenting===!0&&(_===null||_.isCompositing()===!1)&&(Me.cameraAutoUpdate===!0&&Me.updateCamera(E),E=Me.getCamera()),a.isScene===!0&&a.onBeforeRender(P,a,E,ne),h=te.get(a,c.length),h.init(E),h.state.textureUnits=B.getTextureUnits(),c.push(h),De.multiplyMatrices(E.projectionMatrix,E.matrixWorldInverse),Le.setFromProjectionMatrix(De,mi,E.reversedDepth),We=this.localClippingEnabled,Fe=ue.init(this.clippingPlanes,We),S=K.get(a,C.length),S.init(),C.push(S),Me.enabled===!0&&Me.isPresenting===!0){const ge=P.xr.getDepthSensingMesh();ge!==null&&Un(ge,E,-1/0,P.sortObjects)}Un(a,E,0,P.sortObjects),S.finish(),W!==null&&W.updateLights(h.state.lightsArray),P.sortObjects===!0&&S.sort(xe,Pe),Ze=Me.enabled===!1||Me.isPresenting===!1||Me.hasDepthSensing()===!1,Ze&&Re.addToRenderList(S,a),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Fe===!0&&ue.beginShadows();const w=h.state.shadowsArray;if(me.render(w,a,E),Fe===!0&&ue.endShadows(),(L&&_.hasRenderPass())===!1){const ge=S.opaque,pe=S.transmissive;if(h.setupLights(),E.isArrayCamera){const Se=E.cameras;if(pe.length>0)for(let Te=0,we=Se.length;Te<we;Te++){const Ie=Se[Te];ci(ge,pe,a,Ie)}Ze&&Re.render(a);for(let Te=0,we=Se.length;Te<we;Te++){const Ie=Se[Te];si(S,a,Ie,Ie.viewport)}}else pe.length>0&&ci(ge,pe,a,E),Ze&&Re.render(a),si(S,a,E)}ne!==null&&X===0&&(B.updateMultisampleRenderTarget(ne),B.updateRenderTargetMipmap(ne)),L&&_.end(P),a.isScene===!0&&a.onAfterRender(P,a,E),fe.resetDefaultState(),Q=-1,ie=null,c.pop(),c.length>0?(h=c[c.length-1],B.setTextureUnits(h.state.textureUnits),Fe===!0&&ue.setGlobalState(P.clippingPlanes,h.state.camera)):h=null,C.pop(),C.length>0?S=C[C.length-1]:S=null,W!==null&&W.renderEnd()};function Un(a,E,F,L){if(a.visible===!1)return;if(a.layers.test(E.layers)){if(a.isGroup)F=a.renderOrder;else if(a.isLOD)a.autoUpdate===!0&&a.update(E);else if(a.isLightProbeGrid)h.pushLightProbeGrid(a);else if(a.isLight)h.pushLight(a),a.castShadow&&h.pushShadow(a);else if(a.isSprite){if(!a.frustumCulled||a.intersectsFrustum(Le)){L&&ot.setFromMatrixPosition(a.matrixWorld).applyMatrix4(De);const ge=Y.update(a),pe=a.material;pe.visible&&S.push(a,ge,pe,F,ot.z,null,E)}}else if((a.isMesh||a.isLine||a.isPoints)&&(!a.frustumCulled||a.intersectsFrustum(Le))){const ge=Y.update(a),pe=a.material;if(L&&(a.boundingSphere!==void 0?(a.boundingSphere===null&&a.computeBoundingSphere(),ot.copy(a.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),ot.copy(ge.boundingSphere.center)),ot.applyMatrix4(a.matrixWorld).applyMatrix4(De)),Array.isArray(pe)){const Se=ge.groups;for(let Te=0,we=Se.length;Te<we;Te++){const Ie=Se[Te],Ee=pe[Ie.materialIndex];Ee&&Ee.visible&&S.push(a,ge,Ee,F,ot.z,Ie,E)}}else pe.visible&&S.push(a,ge,pe,F,ot.z,null,E)}}const he=a.children;for(let ge=0,pe=he.length;ge<pe;ge++)Un(he[ge],E,F,L)}function si(a,E,F,L){const{opaque:w,transmissive:he,transparent:ge}=a;h.setupLightsView(F),Fe===!0&&ue.setGlobalState(P.clippingPlanes,F),L&&r.viewport(re.copy(L)),w.length>0&&_n(w,E,F),he.length>0&&_n(he,E,F),ge.length>0&&_n(ge,E,F),r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),r.setPolygonOffset(!1)}function ci(a,E,F,L){if((F.isScene===!0?F.overrideMaterial:null)!==null)return;if(h.state.transmissionRenderTarget[L.id]===void 0){const Ee=Ge.has("EXT_color_buffer_half_float")||Ge.has("EXT_color_buffer_float");h.state.transmissionRenderTarget[L.id]=new At(1,1,{generateMipmaps:!0,type:Ee?yt:Lt,minFilter:Zt,samples:Math.max(4,u.samples),stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:rt.workingColorSpace})}const he=h.state.transmissionRenderTarget[L.id],ge=L.viewport||re;he.setSize(ge.z*P.transmissionResolutionScale,ge.w*P.transmissionResolutionScale);const pe=P.getRenderTarget(),Se=P.getActiveCubeFace(),Te=P.getActiveMipmapLevel();P.setRenderTarget(he),P.getClearColor(nt),He=P.getClearAlpha(),He<1&&P.setClearColor(16777215,.5),P.clear(),Ze&&Re.render(F);const we=P.toneMapping;P.toneMapping=Ut;const Ie=L.viewport;if(L.viewport!==void 0&&(L.viewport=void 0),h.setupLightsView(L),Fe===!0&&ue.setGlobalState(P.clippingPlanes,L),_n(a,F,L),B.updateMultisampleRenderTarget(he),B.updateRenderTargetMipmap(he),Ge.has("WEBGL_multisampled_render_to_texture")===!1){let Ee=!1;for(let ze=0,ct=E.length;ze<ct;ze++){const et=E[ze],{object:qe,geometry:ht,material:_e,group:_t}=et;if(_e.side===wt&&qe.layers.test(L.layers)){const Be=_e.side;_e.side=Et,_e.needsUpdate=!0,li(qe,F,L,ht,_e,_t),_e.side=Be,_e.needsUpdate=!0,Ee=!0}}Ee===!0&&(B.updateMultisampleRenderTarget(he),B.updateRenderTargetMipmap(he))}P.setRenderTarget(pe,Se,Te),P.setClearColor(nt,He),Ie!==void 0&&(L.viewport=Ie),P.toneMapping=we}function _n(a,E,F){const L=E.isScene===!0?E.overrideMaterial:null;for(let w=0,he=a.length;w<he;w++){const ge=a[w],{object:pe,geometry:Se,group:Te}=ge;let we=ge.material;we.allowOverride===!0&&L!==null&&(we=L),pe.layers.test(F.layers)&&li(pe,E,F,Se,we,Te)}}function li(a,E,F,L,w,he){W!==null&&w.isNodeMaterial&&W.setObject(a,w),a.onBeforeRender(P,E,F,L,w,he),a.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,a.matrixWorld),a.normalMatrix.getNormalMatrix(a.modelViewMatrix),w.onBeforeRender(P,E,F,L,a,he),w.transparent===!0&&w.side===wt&&w.forceSinglePass===!1?(w.side=Et,w.needsUpdate=!0,P.renderBufferDirect(F,E,L,w,a,he),w.side=pn,w.needsUpdate=!0,P.renderBufferDirect(F,E,L,w,a,he),w.side=wt):P.renderBufferDirect(F,E,L,w,a,he),a.onAfterRender(P,E,F,L,w,he)}function gn(a,E,F){E.isScene!==!0&&(E=lt);const L=I.get(a),w=h.state.lights,he=h.state.shadowsArray,ge=w.state.version,pe=le.getParameters(a,w.state,he,E,F,h.state.lightProbeGridArray),Se=le.getProgramCacheKey(pe);let Te=L.programs;L.environment=a.isMeshStandardMaterial||a.isMeshLambertMaterial||a.isMeshPhongMaterial?E.environment:null,L.fog=E.fog;const we=a.isMeshStandardMaterial||a.isMeshLambertMaterial&&!a.envMap||a.isMeshPhongMaterial&&!a.envMap;L.envMap=ae.get(a.envMap||L.environment,we),L.envMapRotation=L.environment!==null&&a.envMap===null?E.environmentRotation:a.envMapRotation,Te===void 0&&(a.addEventListener("dispose",Rt),Te=new Map,L.programs=Te);let Ie=Te.get(Se);if(Ie!==void 0){if(L.currentProgram===Ie&&L.lightsStateVersion===ge)return di(a,pe),Ie}else pe.uniforms=le.getUniforms(a),W!==null&&a.isNodeMaterial&&W.build(a,F,pe),a.onBeforeCompile(pe,P),Ie=le.acquireProgram(pe,Se),Te.set(Se,Ie),L.uniforms=pe.uniforms;const Ee=L.uniforms;return(!a.isShaderMaterial&&!a.isRawShaderMaterial||a.clipping===!0)&&(Ee.clippingPlanes=ue.uniform),di(a,pe),L.needsLights=oa(a),L.lightsStateVersion=ge,L.needsLights&&(Ee.ambientLightColor.value=w.state.ambient,Ee.lightProbe.value=w.state.probe,Ee.sunLights.value=w.state.sun,Ee.sunLightShadows.value=w.state.sunShadow,Ee.directionalLights.value=w.state.directional,Ee.directionalLightShadows.value=w.state.directionalShadow,Ee.spotLights.value=w.state.spot,Ee.spotLightShadows.value=w.state.spotShadow,Ee.rectAreaLights.value=w.state.rectArea,Ee.ltc_1.value=w.state.rectAreaLTC1,Ee.ltc_2.value=w.state.rectAreaLTC2,Ee.pointLights.value=w.state.point,Ee.pointLightShadows.value=w.state.pointShadow,Ee.hemisphereLights.value=w.state.hemi,Ee.sunShadowMatrix.value=w.state.sunShadowMatrix,Ee.sunShadowCascade.value=w.state.sunShadowCascade,Ee.directionalShadowMatrix.value=w.state.directionalShadowMatrix,Ee.spotLightMatrix.value=w.state.spotLightMatrix,Ee.spotLightMap.value=w.state.spotLightMap,Ee.pointShadowMatrix.value=w.state.pointShadowMatrix),L.lightProbeGrid=h.state.lightProbeGridArray.length>0,L.currentProgram=Ie,L.uniformsList=null,Ie}function fi(a){if(a.uniformsList===null){const E=a.currentProgram.getUniforms();a.uniformsList=Tn.seqWithValue(E.seq,a.uniforms)}return a.uniformsList}function di(a,E){const F=I.get(a);F.outputColorSpace=E.outputColorSpace,F.batching=E.batching,F.batchingColor=E.batchingColor,F.instancing=E.instancing,F.instancingColor=E.instancingColor,F.instancingMorph=E.instancingMorph,F.skinning=E.skinning,F.morphTargets=E.morphTargets,F.morphNormals=E.morphNormals,F.morphColors=E.morphColors,F.morphTargetsCount=E.morphTargetsCount,F.numClippingPlanes=E.numClippingPlanes,F.numIntersection=E.numClipIntersection,F.vertexAlphas=E.vertexAlphas,F.vertexTangents=E.vertexTangents,F.toneMapping=E.toneMapping}function ia(a,E){if(a.length===0)return null;if(a.length===1)return a[0].texture!==null?a[0]:null;m.setFromMatrixPosition(E.matrixWorld);for(let F=0,L=a.length;F<L;F++){const w=a[F];if(w.texture!==null&&w.boundingBox.containsPoint(m))return w}return null}function ra(a,E,F,L,w){E.isScene!==!0&&(E=lt),B.resetTextureUnits();const he=E.fog,ge=L.isMeshStandardMaterial||L.isMeshLambertMaterial||L.isMeshPhongMaterial?E.environment:null,pe=ne===null?P.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:rt.workingColorSpace,Se=L.isMeshStandardMaterial||L.isMeshLambertMaterial&&!L.envMap||L.isMeshPhongMaterial&&!L.envMap,Te=ae.get(L.envMap||ge,Se),we=L.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,Ie=!!F.attributes.tangent&&(!!L.normalMap||L.anisotropy>0),Ee=!!F.morphAttributes.position,ze=!!F.morphAttributes.normal,ct=!!F.morphAttributes.color;let et=Ut;L.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(et=P.toneMapping);const qe=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,ht=qe!==void 0?qe.length:0,_e=I.get(L),_t=h.state.lights;if(Fe===!0&&(We===!0||a!==ie)){const Qe=a===ie&&L.id===Q;ue.setState(L,a,Qe)}let Be=!1;L.version===_e.__version?(_e.needsLights&&_e.lightsStateVersion!==_t.state.version||_e.outputColorSpace!==pe||w.isBatchedMesh&&_e.batching===!1||!w.isBatchedMesh&&_e.batching===!0||w.isBatchedMesh&&_e.batchingColor===!0&&w._colorsTexture===null||w.isBatchedMesh&&_e.batchingColor===!1&&w._colorsTexture!==null||w.isInstancedMesh&&_e.instancing===!1||!w.isInstancedMesh&&_e.instancing===!0||w.isSkinnedMesh&&_e.skinning===!1||!w.isSkinnedMesh&&_e.skinning===!0||w.isInstancedMesh&&_e.instancingColor===!0&&w.instanceColor===null||w.isInstancedMesh&&_e.instancingColor===!1&&w.instanceColor!==null||w.isInstancedMesh&&_e.instancingMorph===!0&&w.morphTexture===null||w.isInstancedMesh&&_e.instancingMorph===!1&&w.morphTexture!==null||_e.envMap!==Te||L.fog===!0&&_e.fog!==he||_e.numClippingPlanes!==void 0&&(_e.numClippingPlanes!==ue.numPlanes||_e.numIntersection!==ue.numIntersection)||_e.vertexAlphas!==we||_e.vertexTangents!==Ie||_e.morphTargets!==Ee||_e.morphNormals!==ze||_e.morphColors!==ct||_e.toneMapping!==et||_e.morphTargetsCount!==ht||!!_e.lightProbeGrid!=h.state.lightProbeGridArray.length>0)&&(Be=!0):(Be=!0,_e.__version=L.version);let Mt=_e.currentProgram;Be===!0&&(Mt=gn(L,E,w),W&&L.isNodeMaterial&&W.onUpdateProgram(L,Mt,_e));let bt=!1,Ft=!1,zt=!1;const Ye=Mt.getUniforms(),st=_e.uniforms;if(r.useProgram(Mt.program)&&(bt=!0,Ft=!0,zt=!0),L.id!==Q&&(Q=L.id,Ft=!0),_e.needsLights){const Qe=ia(h.state.lightProbeGridArray,w);_e.lightProbeGrid!==Qe&&(_e.lightProbeGrid=Qe,Ft=!0)}if(bt||ie!==a){r.buffers.depth.getReversed()&&a.reversedDepth!==!0&&(a._reversedDepth=!0,a.updateProjectionMatrix()),Ye.setValue(x,"projectionMatrix",a.projectionMatrix),Ye.setValue(x,"viewMatrix",a.matrixWorldInverse);const Bt=Ye.map.cameraPosition;Bt!==void 0&&Bt.setValue(x,Ke.setFromMatrixPosition(a.matrixWorld)),u.logarithmicDepthBuffer&&Ye.setValue(x,"logDepthBufFC",2/(Math.log(a.far+1)/Math.LN2)),(L.isMeshPhongMaterial||L.isMeshToonMaterial||L.isMeshLambertMaterial||L.isMeshBasicMaterial||L.isMeshStandardMaterial||L.isShaderMaterial)&&Ye.setValue(x,"isOrthographic",a.isOrthographicCamera===!0),ie!==a&&(ie=a,Ft=!0,zt=!0)}if(_e.needsLights&&(_t.state.sunShadowMap.length>0&&Ye.setValue(x,"sunShadowMap",_t.state.sunShadowMap,B),_t.state.directionalShadowMap.length>0&&Ye.setValue(x,"directionalShadowMap",_t.state.directionalShadowMap,B),_t.state.spotShadowMap.length>0&&Ye.setValue(x,"spotShadowMap",_t.state.spotShadowMap,B),_t.state.pointShadowMap.length>0&&Ye.setValue(x,"pointShadowMap",_t.state.pointShadowMap,B)),w.isSkinnedMesh){Ye.setOptional(x,w,"bindMatrix"),Ye.setOptional(x,w,"bindMatrixInverse");const Qe=w.skeleton;Qe&&(Qe.boneTexture===null&&Qe.computeBoneTexture(),Ye.setValue(x,"boneTexture",Qe.boneTexture,B))}w.isBatchedMesh&&(Ye.setOptional(x,w,"batchingTexture"),Ye.setValue(x,"batchingTexture",w._matricesTexture,B),Ye.setOptional(x,w,"batchingIdTexture"),Ye.setValue(x,"batchingIdTexture",w._indirectTexture,B),Ye.setOptional(x,w,"batchingColorTexture"),w._colorsTexture!==null&&Ye.setValue(x,"batchingColorTexture",w._colorsTexture,B));const Ot=F.morphAttributes;if((Ot.position!==void 0||Ot.normal!==void 0||Ot.color!==void 0)&&v.update(w,F,Mt),(Ft||_e.receiveShadow!==w.receiveShadow)&&(_e.receiveShadow=w.receiveShadow,Ye.setValue(x,"receiveShadow",w.receiveShadow)),(L.isMeshStandardMaterial||L.isMeshLambertMaterial||L.isMeshPhongMaterial)&&L.envMap===null&&E.environment!==null&&(st.envMapIntensity.value=E.environmentIntensity),st.dfgLUT!==void 0&&(st.dfgLUT.value=Fd()),Ft){if(Ye.setValue(x,"toneMappingExposure",P.toneMappingExposure),_e.needsLights&&aa(st,zt),he&&L.fog===!0&&j.refreshFogUniforms(st,he),j.refreshMaterialUniforms(st,L,J,k,h.state.transmissionRenderTarget[a.id]),_e.needsLights&&_e.lightProbeGrid){const Qe=_e.lightProbeGrid;st.probesSH.value=Qe.texture,st.probesMin.value.copy(Qe.boundingBox.min),st.probesMax.value.copy(Qe.boundingBox.max),st.probesResolution.value.copy(Qe.resolution)}Tn.upload(x,fi(_e),st,B)}if(L.isShaderMaterial&&L.uniformsNeedUpdate===!0&&(Tn.upload(x,fi(_e),st,B),L.uniformsNeedUpdate=!1),L.isSpriteMaterial&&Ye.setValue(x,"center",w.center),Ye.setValue(x,"modelViewMatrix",w.modelViewMatrix),Ye.setValue(x,"normalMatrix",w.normalMatrix),Ye.setValue(x,"modelMatrix",w.matrixWorld),L.uniformsGroups!==void 0){const Qe=L.uniformsGroups;for(let Bt=0,Xt=Qe.length;Bt<Xt;Bt++){const pi=Qe[Bt];ee.update(pi,Mt),ee.bind(pi,Mt)}}return Mt}function aa(a,E){a.ambientLightColor.needsUpdate=E,a.lightProbe.needsUpdate=E,a.sunLights.needsUpdate=E,a.sunLightShadows.needsUpdate=E,a.directionalLights.needsUpdate=E,a.directionalLightShadows.needsUpdate=E,a.pointLights.needsUpdate=E,a.pointLightShadows.needsUpdate=E,a.spotLights.needsUpdate=E,a.spotLightShadows.needsUpdate=E,a.rectAreaLights.needsUpdate=E,a.hemisphereLights.needsUpdate=E}function oa(a){return a.isMeshLambertMaterial||a.isMeshToonMaterial||a.isMeshPhongMaterial||a.isMeshStandardMaterial||a.isShadowMaterial||a.isShaderMaterial&&a.lights===!0}this.getActiveCubeFace=function(){return Z},this.getActiveMipmapLevel=function(){return X},this.getRenderTarget=function(){return ne},this.setRenderTargetTextures=function(a,E,F){const L=I.get(a);L.__autoAllocateDepthBuffer=a.resolveDepthBuffer===!1,L.__autoAllocateDepthBuffer===!1&&(L.__useRenderToTexture=!1),I.get(a.texture).__webglTexture=E,I.get(a.depthTexture).__webglTexture=L.__autoAllocateDepthBuffer?void 0:F,L.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(a,E){const F=I.get(a);F.__webglFramebuffer=E,F.__useDefaultFramebuffer=E===void 0},this.setRenderTarget=function(a,E=0,F=0){ne=a,Z=E,X=F;let L=null,w=!1,he=!1;if(a){const pe=I.get(a);if(pe.__useDefaultFramebuffer!==void 0){r.bindFramebuffer(x.FRAMEBUFFER,pe.__webglFramebuffer),re.copy(a.viewport),Ce.copy(a.scissor),be=a.scissorTest,r.viewport(re),r.scissor(Ce),r.setScissorTest(be),Q=-1;return}else if(pe.__webglFramebuffer===void 0)B.setupRenderTarget(a);else if(pe.__hasExternalTextures)B.rebindTextures(a,I.get(a.texture).__webglTexture,I.get(a.depthTexture).__webglTexture);else if(a.depthBuffer){const we=a.depthTexture;if(pe.__boundDepthTexture!==we){if(we!==null&&I.has(we)&&(a.width!==we.image.width||a.height!==we.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");B.setupDepthRenderbuffer(a)}}const Se=a.texture;(Se.isData3DTexture||Se.isDataArrayTexture||Se.isCompressedArrayTexture)&&(he=!0);const Te=I.get(a).__webglFramebuffer;a.isWebGLCubeRenderTarget?(Array.isArray(Te[E])?L=Te[E][F]:L=Te[E],w=!0):a.samples>0&&B.useMultisampledRTT(a)===!1?L=I.get(a).__webglMultisampledFramebuffer:Array.isArray(Te)?L=Te[F]:L=Te,re.copy(a.viewport),Ce.copy(a.scissor),be=a.scissorTest}else re.copy(ve).multiplyScalar(J).floor(),Ce.copy(ye).multiplyScalar(J).floor(),be=at;if(F!==0&&(L=$),r.bindFramebuffer(x.FRAMEBUFFER,L)&&r.drawBuffers(a,L),r.viewport(re),r.scissor(Ce),r.setScissorTest(be),w){const pe=I.get(a.texture);x.framebufferTexture2D(x.FRAMEBUFFER,x.COLOR_ATTACHMENT0,x.TEXTURE_CUBE_MAP_POSITIVE_X+E,pe.__webglTexture,F)}else if(he){const pe=E;for(let Se=0;Se<a.textures.length;Se++){const Te=I.get(a.textures[Se]);x.framebufferTextureLayer(x.FRAMEBUFFER,x.COLOR_ATTACHMENT0+Se,Te.__webglTexture,F,pe)}}else if(a!==null&&F!==0){const pe=I.get(a.texture);x.framebufferTexture2D(x.FRAMEBUFFER,x.COLOR_ATTACHMENT0,x.TEXTURE_2D,pe.__webglTexture,F)}Q=-1};function ui(a){const E=I.get(a);return(E.__readFormat!==a.format||E.__readType!==a.type)&&(E.__readFormat=a.format,E.__readType=a.type,E.__formatReadable=u.textureFormatReadable(a.format),E.__typeReadable=u.textureTypeReadable(a.type)),E}this.readRenderTargetPixels=function(a,E,F,L,w,he,ge,pe=0){if(!(a&&a.isWebGLRenderTarget)){tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=I.get(a).__webglFramebuffer;if(a.isWebGLCubeRenderTarget&&ge!==void 0&&(Se=Se[ge]),Se){r.bindFramebuffer(x.FRAMEBUFFER,Se);try{const Te=a.textures[pe],we=Te.format,Ie=Te.type;a.textures.length>1&&x.readBuffer(x.COLOR_ATTACHMENT0+pe);const Ee=ui(Te);if(Ee.__formatReadable===!1){tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ee.__typeReadable===!1){tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}E>=0&&E<=a.width-L&&F>=0&&F<=a.height-w&&x.readPixels(E,F,L,w,se.convert(we),se.convert(Ie),he)}finally{const Te=ne!==null?I.get(ne).__webglFramebuffer:null;r.bindFramebuffer(x.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(a,E,F,L,w,he,ge,pe=0){if(!(a&&a.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=I.get(a).__webglFramebuffer;if(a.isWebGLCubeRenderTarget&&ge!==void 0&&(Se=Se[ge]),Se)if(E>=0&&E<=a.width-L&&F>=0&&F<=a.height-w){r.bindFramebuffer(x.FRAMEBUFFER,Se);const Te=a.textures[pe],we=Te.format,Ie=Te.type;a.textures.length>1&&x.readBuffer(x.COLOR_ATTACHMENT0+pe);const Ee=ui(Te);if(Ee.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ee.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ze=x.createBuffer();x.bindBuffer(x.PIXEL_PACK_BUFFER,ze),x.bufferData(x.PIXEL_PACK_BUFFER,he.byteLength,x.STREAM_READ),x.readPixels(E,F,L,w,se.convert(we),se.convert(Ie),0),x.bindBuffer(x.PIXEL_PACK_BUFFER,null);const ct=ne!==null?I.get(ne).__webglFramebuffer:null;r.bindFramebuffer(x.FRAMEBUFFER,ct);const et=x.fenceSync(x.SYNC_GPU_COMMANDS_COMPLETE,0);return x.flush(),await fa(x,et,4),x.bindBuffer(x.PIXEL_PACK_BUFFER,ze),x.getBufferSubData(x.PIXEL_PACK_BUFFER,0,he),x.bindBuffer(x.PIXEL_PACK_BUFFER,null),x.deleteBuffer(ze),x.deleteSync(et),he}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(a,E=null,F=0){const L=Math.pow(2,-F),w=Math.floor(a.image.width*L),he=Math.floor(a.image.height*L),ge=E!==null?E.x:0,pe=E!==null?E.y:0;B.setTexture2D(a,0),x.copyTexSubImage2D(x.TEXTURE_2D,F,0,0,ge,pe,w,he),r.unbindTexture()},this.copyTextureToTexture=function(a,E,F=null,L=null,w=0,he=0){let ge,pe,Se,Te,we,Ie,Ee,ze,ct;const et=a.isCompressedTexture?a.mipmaps[he]:a.image;if(F!==null)ge=F.max.x-F.min.x,pe=F.max.y-F.min.y,Se=F.isBox3?F.max.z-F.min.z:1,Te=F.min.x,we=F.min.y,Ie=F.isBox3?F.min.z:0;else{const st=Math.pow(2,-w);ge=Math.floor(et.width*st),pe=Math.floor(et.height*st),a.isDataArrayTexture?Se=et.depth:a.isData3DTexture?Se=Math.floor(et.depth*st):Se=1,Te=0,we=0,Ie=0}L!==null?(Ee=L.x,ze=L.y,ct=L.z):(Ee=0,ze=0,ct=0);const qe=se.convert(E.format),ht=se.convert(E.type);let _e;E.isData3DTexture?(B.setTexture3D(E,0),_e=x.TEXTURE_3D):E.isDataArrayTexture||E.isCompressedArrayTexture?(B.setTexture2DArray(E,0),_e=x.TEXTURE_2D_ARRAY):(B.setTexture2D(E,0),_e=x.TEXTURE_2D),r.activeTexture(x.TEXTURE0),r.pixelStorei(x.UNPACK_FLIP_Y_WEBGL,E.flipY),r.pixelStorei(x.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),r.pixelStorei(x.UNPACK_ALIGNMENT,E.unpackAlignment);const _t=r.getParameter(x.UNPACK_ROW_LENGTH),Be=r.getParameter(x.UNPACK_IMAGE_HEIGHT),Mt=r.getParameter(x.UNPACK_SKIP_PIXELS),bt=r.getParameter(x.UNPACK_SKIP_ROWS),Ft=r.getParameter(x.UNPACK_SKIP_IMAGES);r.pixelStorei(x.UNPACK_ROW_LENGTH,et.width),r.pixelStorei(x.UNPACK_IMAGE_HEIGHT,et.height),r.pixelStorei(x.UNPACK_SKIP_PIXELS,Te),r.pixelStorei(x.UNPACK_SKIP_ROWS,we),r.pixelStorei(x.UNPACK_SKIP_IMAGES,Ie);const zt=a.isDataArrayTexture||a.isData3DTexture,Ye=E.isDataArrayTexture||E.isData3DTexture;if(a.isDepthTexture){const st=I.get(a),Ot=I.get(E),Qe=I.get(st.__renderTarget),Bt=I.get(Ot.__renderTarget);r.bindFramebuffer(x.READ_FRAMEBUFFER,Qe.__webglFramebuffer),r.bindFramebuffer(x.DRAW_FRAMEBUFFER,Bt.__webglFramebuffer);for(let Xt=0;Xt<Se;Xt++)zt&&(x.framebufferTextureLayer(x.READ_FRAMEBUFFER,x.COLOR_ATTACHMENT0,I.get(a).__webglTexture,w,Ie+Xt),x.framebufferTextureLayer(x.DRAW_FRAMEBUFFER,x.COLOR_ATTACHMENT0,I.get(E).__webglTexture,he,ct+Xt)),x.blitFramebuffer(Te,we,ge,pe,Ee,ze,ge,pe,x.DEPTH_BUFFER_BIT,x.NEAREST);r.bindFramebuffer(x.READ_FRAMEBUFFER,null),r.bindFramebuffer(x.DRAW_FRAMEBUFFER,null)}else if(w!==0||a.isRenderTargetTexture||I.has(a)){const st=I.get(a),Ot=I.get(E);r.bindFramebuffer(x.READ_FRAMEBUFFER,A),r.bindFramebuffer(x.DRAW_FRAMEBUFFER,q);for(let Qe=0;Qe<Se;Qe++)zt?x.framebufferTextureLayer(x.READ_FRAMEBUFFER,x.COLOR_ATTACHMENT0,st.__webglTexture,w,Ie+Qe):x.framebufferTexture2D(x.READ_FRAMEBUFFER,x.COLOR_ATTACHMENT0,x.TEXTURE_2D,st.__webglTexture,w),Ye?x.framebufferTextureLayer(x.DRAW_FRAMEBUFFER,x.COLOR_ATTACHMENT0,Ot.__webglTexture,he,ct+Qe):x.framebufferTexture2D(x.DRAW_FRAMEBUFFER,x.COLOR_ATTACHMENT0,x.TEXTURE_2D,Ot.__webglTexture,he),w!==0?x.blitFramebuffer(Te,we,ge,pe,Ee,ze,ge,pe,x.COLOR_BUFFER_BIT,x.NEAREST):Ye?x.copyTexSubImage3D(_e,he,Ee,ze,ct+Qe,Te,we,ge,pe):x.copyTexSubImage2D(_e,he,Ee,ze,Te,we,ge,pe);r.bindFramebuffer(x.READ_FRAMEBUFFER,null),r.bindFramebuffer(x.DRAW_FRAMEBUFFER,null)}else Ye?a.isDataTexture||a.isData3DTexture?x.texSubImage3D(_e,he,Ee,ze,ct,ge,pe,Se,qe,ht,et.data):E.isCompressedArrayTexture?x.compressedTexSubImage3D(_e,he,Ee,ze,ct,ge,pe,Se,qe,et.data):x.texSubImage3D(_e,he,Ee,ze,ct,ge,pe,Se,qe,ht,et):a.isDataTexture?x.texSubImage2D(x.TEXTURE_2D,he,Ee,ze,ge,pe,qe,ht,et.data):a.isCompressedTexture?x.compressedTexSubImage2D(x.TEXTURE_2D,he,Ee,ze,et.width,et.height,qe,et.data):x.texSubImage2D(x.TEXTURE_2D,he,Ee,ze,ge,pe,qe,ht,et);r.pixelStorei(x.UNPACK_ROW_LENGTH,_t),r.pixelStorei(x.UNPACK_IMAGE_HEIGHT,Be),r.pixelStorei(x.UNPACK_SKIP_PIXELS,Mt),r.pixelStorei(x.UNPACK_SKIP_ROWS,bt),r.pixelStorei(x.UNPACK_SKIP_IMAGES,Ft),he===0&&E.generateMipmaps&&x.generateMipmap(_e),r.unbindTexture()},this.initRenderTarget=function(a){I.get(a).__webglFramebuffer===void 0&&B.setupRenderTarget(a)},this.initTexture=function(a){a.isCubeTexture?B.setTextureCube(a,0):a.isData3DTexture?B.setTexture3D(a,0):a.isDataArrayTexture||a.isCompressedArrayTexture?B.setTexture2DArray(a,0):B.setTexture2D(a,0),r.unbindTexture()},this.resetState=function(){Z=0,X=0,ne=null,r.reset(),fe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return mi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(n){this._outputColorSpace=n;const t=this.getContext();t.drawingBufferColorSpace=rt._getDrawingBufferColorSpace(n),t.unpackColorSpace=rt._getUnpackColorSpace()}}const Gd=mt.memo(({activeRoleFilter:e="all",selectedHub:n,setSelectedHub:t,hoveredHub:i,setHoveredHub:l,setToolTipPosition:o,className:d=""})=>{const g=mt.useRef(null),b=mt.useRef(null),T=mt.useRef([]),G=mt.useRef([]),y=mt.useRef(!1),p=mt.useRef({x:0,y:0}),M=mt.useRef({x:0,y:0}),N=mt.useRef(!0),z=mt.useRef(null),f=mt.useRef(l);f.current=l;const s=mt.useRef(t);s.current=t;const U=mt.useRef(o);return U.current=o,mt.useEffect(()=>{const D=g.current;if(!D)return;const m=D.clientWidth||window.innerWidth,S=D.clientHeight||window.innerHeight,h=window.innerWidth<768,C=new Co,c=new un(45,m/S,.1,1e3),_=h?38:34;c.position.set(0,4,_),c.lookAt(0,0,0);const P=new Od({antialias:!h,alpha:!0,powerPreference:"high-performance"});P.setSize(m,S),P.setPixelRatio(Math.min(window.devicePixelRatio,h?1.25:1.75)),P.toneMapping=ii,P.toneMappingExposure=1.2,D.appendChild(P.domElement);const O=new Po(988970,2.5);C.add(O);const W=new ji(3718648,3);W.position.set(20,30,20),C.add(W);const $=new ji(8490232,2);$.position.set(-20,-10,-20),C.add($);const A=new Hn;C.add(A);const q=()=>{window.innerWidth>=1024?A.position.set(6,-1,0):A.position.set(0,-2,0)};q();const Z=12,X=[],ne=[],Q=new sn(Z-.1,48,48);X.push(Q);const ie=new Lo({color:330004,roughness:.85,metalness:.5,transparent:!0,opacity:.95});ne.push(ie);const re=new pt(Q,ie);A.add(re);const Ce=h?1800:4500,be=[],nt=[],He=new je(1976635),Ve=new je(165063);for(let j=0;j<Ce;j++){const K=(Math.random()-.5)*180,te=(Math.random()-.5)*360;if(Math.sin(K*Math.PI/180)>.85&&Math.random()>.3)continue;const ue=tr(K,te,Z);be.push(ue.x,ue.y,ue.z);const me=Math.random()>.75?Ve:He;nt.push(me.r,me.g,me.b)}const k=new en;X.push(k),k.setAttribute("position",new Rn(be,3)),k.setAttribute("color",new Rn(nt,3));const J=new wo({size:h?.22:.18,vertexColors:!0,transparent:!0,opacity:.85,blending:Qt});ne.push(J);const xe=new er(k,J);A.add(xe);const Pe=new sn(Z,28,28);X.push(Pe);const ve=new qt({color:959977,wireframe:!0,transparent:!0,opacity:.08});ne.push(ve);const ye=new pt(Pe,ve);A.add(ye);const at=new sn(Z+1.2,48,48);X.push(at);const Le=new Dt({vertexShader:`
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
          gl_FragColor = vec4(0.06, 0.72, 0.98, 1.0) * intensity * 0.8;
        }
      `,blending:Qt,side:Et,transparent:!0});ne.push(Le);const Fe=new pt(at,Le);A.add(Fe);const We=new Map;G.current=[];const De=new sn(.35,16,16),Ke=new Uo(.45,.65,24),ot=new Do(.04,.12,1.8,12);ot.translate(0,.9,0),X.push(De,Ke,ot),Io.forEach(j=>{const K=tr(j.lat,j.lng,Z,.15),te=new Hn;te.position.copy(K),te.quaternion.setFromUnitVectors(new Ne(0,1,0),K.clone().normalize());const ue=new qt({color:3718648});ne.push(ue);const me=new pt(De,ue);te.add(me);const Re=new qt({color:62206,side:wt,transparent:!0,opacity:.8});ne.push(Re);const v=new pt(Ke,Re);v.rotation.x=Math.PI/2,te.add(v);const oe=new qt({color:3718648,transparent:!0,opacity:.45,blending:Qt});ne.push(oe);const H=new pt(ot,oe);te.add(H),te.userData={hubData:j,coreMat:ue,ringMat:Re,beamMesh:H},A.add(te),We.set(j.id,K),G.current.push(te)});const lt=new Hn;b.current=lt,A.add(lt),T.current=[];const Ze=new sn(.18,10,10);X.push(Ze),No.forEach(j=>{const K=We.get(j.from),te=We.get(j.to);if(!K||!te)return;const ue=K.distanceTo(te),me=K.clone().add(te).multiplyScalar(.5);me.normalize(),me.multiplyScalar(Z+ue*.28);const Re=new yo(K,me,te),v=Re.getPoints(h?36:64),oe=new en().setFromPoints(v);X.push(oe);const H=new Fo({color:165063,transparent:!0,opacity:.4,linewidth:1.5});ne.push(H);const se=new nr(oe,H);se.userData={routeData:j},lt.add(se);const fe=new qt({color:3718648,transparent:!0,opacity:.9,blending:Qt});ne.push(fe);const ee=new pt(Ze,fe);lt.add(ee),T.current.push({mesh:ee,curve:Re,progress:Math.random(),speed:.003+Math.random()*.004,role:j.role})});const it=new Oo;it.params.Points={threshold:.5};const x=new gt,ft=()=>{z.current&&window.clearTimeout(z.current),z.current=window.setTimeout(()=>{N.current=!0},2500)},Ge=j=>{var ue,me,Re;const K=D.getBoundingClientRect();if(x.x=(j.clientX-K.left)/K.width*2-1,x.y=-((j.clientY-K.top)/K.height)*2+1,y.current){const v=j.clientX-M.current.x,oe=j.clientY-M.current.y;A.rotation.y+=v*.005,A.rotation.x+=oe*.005,A.rotation.x=Math.max(-1,Math.min(1,A.rotation.x)),M.current={x:j.clientX,y:j.clientY},N.current=!1;return}if(h)return;it.setFromCamera(x,c);const te=it.intersectObjects(G.current,!0);if(te.length>0){let v=te[0].object;for(;v&&v.parent&&v.parent!==A;)v=v.parent;if(v&&v.userData&&v.userData.hubData){const oe=v.userData.hubData;(ue=f.current)==null||ue.call(f,oe);const H=new Ne;v.getWorldPosition(H),H.project(c);const se=(H.x+1)*K.width/2,fe=(-H.y+1)*K.height/2;(me=U.current)==null||me.call(U,{x:se,y:fe}),D.style.cursor="pointer";return}}(Re=f.current)==null||Re.call(f,null),D.style.cursor="grab"},u=j=>{y.current=!0,N.current=!1,M.current={x:j.clientX,y:j.clientY},D.style.cursor="grabbing"},r=()=>{y.current=!1,D.style.cursor="grab",ft()},R=()=>{i&&s.current&&s.current(i)},I=j=>{j.touches.length===1&&(p.current={x:j.touches[0].clientX,y:j.touches[0].clientY},M.current={x:j.touches[0].clientX,y:j.touches[0].clientY},N.current=!1)},B=j=>{if(j.touches.length===1){const K=j.touches[0],te=K.clientX-M.current.x,ue=K.clientY-M.current.y;Math.abs(te)>Math.abs(ue)*.8&&(A.rotation.y+=te*.006,A.rotation.x+=ue*.003,A.rotation.x=Math.max(-1,Math.min(1,A.rotation.x))),M.current={x:K.clientX,y:K.clientY}}},ae=()=>{ft()};D.addEventListener("mousemove",Ge),D.addEventListener("mousedown",u),window.addEventListener("mouseup",r),D.addEventListener("click",R),D.addEventListener("touchstart",I,{passive:!0}),D.addEventListener("touchmove",B,{passive:!0}),D.addEventListener("touchend",ae,{passive:!0});const ce=()=>{if(!D)return;const j=D.clientWidth,K=D.clientHeight;c.aspect=j/K,c.updateProjectionMatrix(),P.setSize(j,K),q()};window.addEventListener("resize",ce);let V;const Y=new Bo,le=()=>{V=requestAnimationFrame(le);const j=Y.getElapsedTime();N.current&&(A.rotation.y+=.0015),T.current.forEach(K=>{K.progress+=K.speed,K.progress>1&&(K.progress=0);const te=K.curve.getPoint(K.progress);K.mesh.position.copy(te)}),G.current.forEach((K,te)=>{if(K.userData.ringMat){const me=1+Math.sin(j*3+te)*.15;K.scale.set(me,me,me)}}),P.render(C,c)};return le(),()=>{cancelAnimationFrame(V),z.current&&clearTimeout(z.current),D.removeEventListener("mousemove",Ge),D.removeEventListener("mousedown",u),window.removeEventListener("mouseup",r),D.removeEventListener("click",R),window.removeEventListener("resize",ce),D.removeEventListener("touchstart",I),D.removeEventListener("touchmove",B),D.removeEventListener("touchend",ae),X.forEach(j=>{try{j.dispose()}catch{}}),ne.forEach(j=>{try{j.dispose()}catch{}}),C.traverse(j=>{if(j instanceof pt||j instanceof er||j instanceof nr){if(j.geometry)try{j.geometry.dispose()}catch{}if(j.material)if(Array.isArray(j.material))j.material.forEach(K=>{try{K.dispose()}catch{}});else try{j.material.dispose()}catch{}}}),D.contains(P.domElement)&&D.removeChild(P.domElement),P.dispose(),P.forceContextLoss()}},[]),mt.useEffect(()=>{b.current&&(b.current.children.forEach(D=>{if(D.userData&&D.userData.routeData){const m=D.userData.routeData,S=D.material;e==="all"||m.role===e?(S.opacity=.55,S.color.setHex(3718648)):(S.opacity=.1,S.color.setHex(3359061))}}),T.current.forEach(D=>{e==="all"||D.role===e?D.mesh.visible=!0:D.mesh.visible=!1}))},[e]),mt.useEffect(()=>{!G.current||!n||G.current.forEach(D=>{var C,c,_;const m=(C=D.userData)==null?void 0:C.hubData,S=(c=D.userData)==null?void 0:c.coreMat,h=(_=D.userData)==null?void 0:_.ringMat;m&&S&&h&&(m.id===n.id?(S.color.setHex(62206),h.color.setHex(3718648),h.opacity=1):(S.color.setHex(165063),h.color.setHex(223649),h.opacity=.6))})},[n]),Go.jsx("div",{ref:g,className:`w-full h-full absolute inset-0 bg-transparent select-none cursor-grab active:cursor-grabbing ${d}`,"aria-label":"Interactive 3D Logistics Globe"})});export{Io as GLOBAL_HUBS,No as LOGISTICS_ROUTES,Gd as LogisticsGlobe3D,Gd as default,tr as latLongToVector3};
