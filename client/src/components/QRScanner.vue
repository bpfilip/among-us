<template>
	<div class="QRScanner">
		<QrcodeStream @decode="onDecode" @init="onInit">
			<img
				class="close"
				src="img/button/closeButton.png"
				alt=""
				v-on:click="closeScanner"
			/>
		</QrcodeStream>
		<div v-show="!loaded" class="behind">
			<p>Loading scanner...</p>
		</div>
	</div>
</template>

<script>
	import { QrcodeStream } from "vue-qrcode-reader";
	export default {
		name: "QRScanner",
		data() {
			return { 
				loaded: false
			}
		},
		components: {
			QrcodeStream
		},
		props: {
			onDecode: {
				required: true
			},
			closeScanner: {
				required: true
			}
		},
		methods: {
			async onInit(promise) {
				try {
					await promise;
				} catch (error) {
					console.log(error);
					if (error.name === "NotAllowedError") {
						this.error =
							"ERROR: you need to grant camera access permisson";
					} else if (error.name === "NotFoundError") {
						this.error = "ERROR: no camera on this device";
					} else if (error.name === "NotSupportedError") {
						this.error =
							"ERROR: secure context required (HTTPS, localhost)";
					} else if (error.name === "NotReadableError") {
						this.error = "ERROR: is the camera already in use?";
					} else if (error.name === "OverconstrainedError") {
						this.error =
							"ERROR: installed cameras are not suitable";
					} else if (error.name === "StreamApiNotSupportedError") {
						this.error =
							"ERROR: Stream API is not supported in this browser";
					}
				}
				this.loaded = true;
			}
		}
	};
</script>

<style scoped>
	.close {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 100;
		margin: 5px;
		width: 70px;
	}
	.behind {
		position: absolute;
		top: 0;
		right: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: space-around;
		align-items: center;
		color: white;
	}
</style>
