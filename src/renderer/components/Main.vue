<template>
	<div id="wrapper">
		<div v-show="!manual">
			<!-- Это не совсем меню, поэтому не стала ставить тег menu -->
			<div class="menu">
				<div></div>
				<div class="button" @click="manual = true;"> <strong>Инструкция</strong> </div>
				<div class="button" @click="openFile()"> <strong>Открыть файл</strong> </div>
				<div class="button" @click="saveFile('data')"> <strong>Сохранить файл</strong> </div>
				<div></div>
			</div>
			<p>Выбранный файл: {{fileName}}</p>
			<p>{{message}}</p>
			<div class="keys" v-show="isKey">
				<div></div>
				<p>Ключ: </p>
				<input v-model="key" style="min-width:300px; margin-top: 8px; margin-bottom: 8px">
				<div class="button" @click="inputKey()" style="width: max-content; padding-top: 3px; padding-bottom: 3px">Отправить</div>
				<div></div>
			</div>
			<div class="menu">
				<div></div>
				<div 
					class="button" 
					v-show="isFile" 
					@click="auto = 1"
					:class="{ active : auto == 1 }"> 
					<strong>Автоматическая обработка</strong> 
				</div>
				<div 
					class="button" 
					v-show="isFile" 
					@click="auto = 2"
					:class="{ active : auto == 2 }"> 
					<strong>Ручная обработка</strong> 
				</div>
				<div></div>
			</div>
			<auto v-show="auto == 1 && isFile"></auto>
			<handle v-show="auto == 2 && isFile"></handle>
		</div>
		<div v-show="manual">
			<div class="button manual" @click="manual = false">Назад</div>
			<manual></manual>
		</div>
	</div>
</template>

<script>
	var app = require('electron').remote; 
	var dialog = app.dialog;
	var fs = require('fs');
	var XLSX = require('xlsx');
	import Auto from "./Auto.vue";
	import Handle from "./Handle.vue";
	import Manual from "./Manual.vue";

	export default {
		name: 'main-page',
		components: { Auto, Handle, Manual },
		data: () => ({
            fileName: '',
			isFile: false,
			auto: 0,
			manual: false,
			key: '',
			isKey: false
        }),
		created(){
			if(this.$store.getters.name != ''){
				this.fileName = this.$store.getters.name;
				this.$store.commit('message', 'Файл открыт. Можно что-то сделать.');
				this.isFile = true;
			}
		},
		computed: {
			message() {
				return this.$store.getters.message;
			}
		},
		methods: {
			openFile () {
				let self = this;
				dialog.showOpenDialog({ 
					filters: [{ name: 'excel', extensions: ['xlsx'] }]}, 
					async (fileNames) => {
						if (fileNames === undefined) return;
						this.isKey = false;
						this.isFile = false;
						self.$store.commit('message', 'Открываю файл...');
						var fileName = fileNames[0];
						var workbook = XLSX.readFile(fileName);
						self.$store.commit('message', 'Делаю еще немного умных вещей...');
						var name = workbook.SheetNames;
						var worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[name[0]], {header: 1});
						let res = await this.columns(worksheet[0]);
						if(res) {
							self.$store.commit('worksheet', worksheet);
							self.$store.commit('name', fileName);
							console.log(self.$store.getters.worksheet);
							self.fileName = fileName;
							self.$store.commit('message', 'Файл открыт. Можно что-то сделать.');
							self.isKey = true;
						}
				});
			},
			saveFile (data) {
				let self = this;
				dialog.showSaveDialog(
					{filters: [{ name: 'excel', extensions: ['xlsx'] }]},
					function (fileName) {
						if (fileName === undefined) return;
						self.$store.commit('message', 'Сохраняю...');
						let w = self.$store.getters.worksheet;
						var ws = {SheetNames:["SheetJS"], Sheets:{SheetJS: XLSX.utils.aoa_to_sheet(w)}};
						console.log(ws);
						XLSX.writeFile(ws, fileName);
						self.$store.commit('message', 'Файл сохранен.');
				}); 
			},
			columns(data){
				let mas = [
					`Наименование подразделения`,
					`ИНН`,
					`КПП`,
					`Наименование субъекта РФ`,
					`Наименование муниципального образования`,
					`Наименование населенного пункта`,
					`Индекс (при наличии)`,
					`Тип населенного пункта (при наличии)`,
					`Улица (переулок, проспект, шоссе и пр.)`,
					`Номер дома (включая дробь, корпус и пр.)`,
					`Найденное наименование подразделения`,
				];
				let columns = {};
				console.log(data);
				data.forEach((key, i) => {
					mas.forEach((key2, j) => {
						if(key == key2) {
							mas.splice(j, 1);
							columns[key2] = i;
						}
					});
				});
				console.log(columns);
				if(mas.length == 0) {
					this.$store.commit('columns', columns);
					return true;
				} else {
					let p = 'Нет названий: \n';
					for(let i = 0; i < mas.length; i++) {
						p += mas[i] + ' \n';
					}
					this.$store.commit('message', p);
					return false;
				}
			},
			inputKey(){
				this.$store.commit('key', this.key);
				this.isFile = true;
			}
		}
	}
</script>

<style>
	#wrapper {
		max-height: calc(100vh - 50px);
		/* background-color: aqua; */
	}

	#wrapper p{
		padding-bottom: 0px;
	}

	#wrapper .menu{
		display: grid;
		grid-template-columns: auto max-content max-content max-content auto;
	}

	#wrapper .button{
		padding: 8px;
		padding-left: 10px;
		padding-right: 10px;
		margin: 8px;
		margin-left: 4px;
		margin-right: 4px;
		background-color: #db6a68;
		border-radius: 20px;
		border: 2px solid white;
		color: white;
		transition: all ease-out 0.5s;
	}

	#wrapper .button:hover{
		cursor: pointer;
		color: #db6a68;
		background-color: white;
		border: 2px solid #db6a68;
		transition: all ease-out 0.25s;
	}

	#wrapper .manual{
		margin: 5px auto;
		width: max-content;
	}

	#wrapper .active{
        background-color: #a13836;
    }

    #wrapper .active:hover{
        background-color: #a13836;
		color: white;
        border: 2px solid white;
        cursor: default;
    }

	#wrapper .keys{
		display: grid;
		grid-template-columns: auto max-content max-content max-content auto;
	}
</style>
