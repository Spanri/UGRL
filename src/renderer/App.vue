<template>
  <div id="app">
    <div id="title-bar">
		<!-- Чтобы название было посередине -->
		<div class="button hide"> <strong>—</strong> </div>
		<div class="button hide"> <strong>❏</strong> </div>
		<div class="button hide"> <strong>✕</strong> </div>
		<p>ОМСУ</p>
		<div class="button" @click="w.minimize()"> <strong>—</strong> </div>
		<div class="button" @click="maxWindow()"> <strong>❏</strong> </div>
		<div class="button" @click="w.close()"> <strong>✕</strong> </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
	const electron = require('electron');

	export default {
		name: 'electron',
		data () {
			return {
				w: electron.remote.getCurrentWindow()
			}
		},
		methods: {
			maxWindow(){
				if(this.w.isMaximized()) {
					this.w.unmaximize();
				} else {
					this.w.maximize();
				}
			}
		}
	}
</script>

<style>
	@import url('https://fonts.googleapis.com/css?family=Neucha');

	#app{
		max-height: 110vh;
		width: 100vw;
	}

	*{
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		font-family: 'Neucha', cursive;
		font-size: 17px;
		overflow: hidden;
	}

	p{
        padding: 20px;
    }

	#title-bar{
		display: grid;
		grid-template-columns: repeat(3,max-content) auto repeat(3,max-content);
		background-color:#db6a68;
		-webkit-app-region: drag;
	}

	#title-bar .button{
		padding: 5px;
		padding-left: 9px;
		padding-right: 9px;
		-webkit-app-region: no-drag;
		border: 0;
		background: 0;
		color: white;
	}

	#title-bar .button:hover{
		cursor: pointer;
		background-color: white;
		color:#db6a68;
	}

	#title-bar p{
		padding: 6px; 
		color: white;
		text-align: center;
	}

	.hide{
		visibility: hidden;
	}
</style>
