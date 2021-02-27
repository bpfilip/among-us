<template>
	<div class="Task">
		<img
			class="close"
			src="img/closeButton.png"
			alt=""
			v-on:click="closeTask"
		/>
		<Electricity v-if="type === 0" :onDone="onDone" />
		<DivertPower1 v-if="type === 1" :onDone="onDone" />
		<DivertPower2 v-if="type === 2" :onDone="onDone" />
		<EmergencyButton v-if="type === 3" :onDone="onDone" />
		<DownloadData v-if="type === 4 || type === 14" :onDone="onDone" />
		<AdminSwipe v-if="type === 5" :onDone="onDone" />
		<StartReactor v-if="type === 6" :onDone="onDone" />
		<Fuel1 v-if="type === 7" :onDone="onDone" />
		<Fuel2 v-if="type === 8" :onDone="onDone" />
		<IdCode v-if="type === 9" :onDone="onDone" />
		<UnlockManifold v-if="type === 10" :onDone="onDone" />
		<O2 v-if="type === 11" :onDone="onDone" />
		<DownloadData v-if="type === 12" :onDone="onDone" />
		<Sabotage v-if="type === 13" :onDone="onDone" />
	</div>
</template>

<script>
	import Electricity from "@/components/tasks/Electricity";
	import DivertPower1 from "@/components/tasks/DivertPower1";
	import DivertPower2 from "@/components/tasks/DivertPower2";
	import EmergencyButton from "@/components/tasks/EmergencyButton";
	import DownloadData from "@/components/tasks/DownloadData";
	import AdminSwipe from "@/components/tasks/AdminSwipe";
	import StartReactor from "@/components/tasks/StartReactor";
	import Fuel1 from "@/components/tasks/Fuel1";
	import Fuel2 from "@/components/tasks/Fuel2";
	import IdCode from "@/components/tasks/IdCode";
	import UnlockManifold from "@/components/tasks/UnlockManifold";
	import O2 from "@/components/tasks/O2";
	import Sabotage from "@/components/tasks/Sabotage";
	export default {
		name: "Task",
		data() {
			return {
			};
		},
		computed: {},
		components: {
			Electricity,
			DivertPower1,
			DivertPower2,
			EmergencyButton,
			DownloadData,
			AdminSwipe,
			StartReactor,
			Fuel1,
			Fuel2,
			IdCode,
			UnlockManifold,
			O2,
			Sabotage
		},
		props: {
			closeTask: {
				required: true
			},
			type: {
				required: true
			},
			taskComplete: {
				required: true
			}
		},
		methods: {
			onDone() {
				navigator.vibrate(250);
				this.taskComplete(this.type)
			}
		}
	};
</script>

<style scoped>
	.Task {
		position: absolute;
		top: 0;
		right: 0;
		width: 100vw;
		height: 100vh;
		background-color: #444b;
		z-index: 100;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.close {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 101;
		margin: 8px;
		width: 70px;
		height: 70px;
	}
</style>
