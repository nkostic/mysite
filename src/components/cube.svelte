<script>
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';

	function render(element) {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			45,
			element.clientWidth / element.clientHeight,
			0.1,
			2000
		);

		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(element.clientWidth / element.clientHeight);
		element.appendChild(renderer.domElement);

		const geometry = new THREE.BoxGeometry();
		const material = new THREE.MeshNormalMaterial();
		const box = new THREE.Mesh(geometry, material);
		scene.add(box);

		camera.position.x = 2;
		camera.position.y = 2;
		camera.position.z = 5;

		camera.lookAt(new THREE.Vector3(0, 0, 0));

		renderer.render(scene, camera);
	}
</script>

+<SC.Canvas antialias background={new THREE.Color('papayawhip')}>
	<SC.Mesh geometry={new THREE.BoxGeometry()} />
	<SC.PerspectiveCamera position={[1, 1, 3]} />
	<SC.OrbitControls enableZoom={false} />
</SC.Canvas>
