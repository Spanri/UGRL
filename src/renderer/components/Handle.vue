<template>
	<div id="handle">
        <div class="input">
            <div></div>
            <label>Обработать от </label>
            <input v-model="from" style="margin-top: 10px; margin-bottom: 10px;">
            <label> до </label>
            <input v-model="to" style="margin-top: 10px; margin-bottom: 10px;">
            <div 
                class="button" 
                @click="start()"
                style="margin-top: 2px; margin-bottom: 2px;">
                Начать обработку
            </div>
            <div></div>
        </div>
        <div class="info-box">
            <p>Номер строки: <strong>{{row}}</strong></p>
            <p>Наименование подразделения: <strong>{{podrazd}}</strong></p>
            <p>Наименование субъекта РФ: <strong>{{region}}</strong></p>
            <p>Наименование муниципального образования: <strong>{{rayon}}</strong></p>
            <p>Наименование населенного пункта: <strong>{{nasPunkt}}</strong></p> 
            <div style="display: grid; grid-template-columns: auto max-content;">
                <input v-model="zapros" v-on:input="handle()" style="margin: 5px; margin-left: 15px;">
                <div class="button" @click="skip()" style="padding-top: 6px; padding-bottom: 6px; margin-right: 15px">Пропустить</div>
            </div>
            <div style="max-height: calc(100vh - 550px); overflow: auto;">
                <div 
                    v-for="(item, i) in sugg" 
                    :key="i"
                    @click="changeData(item)"
                    class="query">
                    <p>{{item.value}}</p>
                    <p>{{item.data.address.unrestricted_value}}</p>
                </div>
            </div>           
        </div>
	</div>
</template>

<script>
    const Dadata = require('dadata-suggestions');

	export default {
        name: 'manual',
        data: () => ({
            show1: true,
            show2: false,
            show3: false,
            show4: false,
            from: '',
            to: '',
            row: -1,
            zapros: '',
            dadata: '',
            sugg: []
        }),
        created(){
            this.dadata = new Dadata(this.key);
        },
        computed: {
            key(){
                return this.$store.getters.key;
            },
            podrazd(){
                let w = this.$store.getters.worksheet;
                let col = this.$store.getters.columns;
                if(this.row == -1) return '';
                else return w[this.row - 1][col['Наименование подразделения']];
            },
            region(){
                let w = this.$store.getters.worksheet;
                let col = this.$store.getters.columns;
                if(this.row == -1) return '';
                else return w[this.row][col['Наименование субъекта РФ']];
            },
            rayon(){
                let w = this.$store.getters.worksheet;
                let col = this.$store.getters.columns;
                if(this.row == -1) return '';
                else return w[this.row - 1][col['Наименование муниципального образования']];
            },
            nasPunkt(){
                let w = this.$store.getters.worksheet;
                let col = this.$store.getters.columns;
                if(this.row == -1) return '';
                else return w[this.row - 1][col['Наименование населенного пункта']];
            },
        },
		methods: {
            show1m(){
                this.show1 = true;
                this.show2 = false;
                this.show3 = false;
                this.show4 = false;
            },
            show2m(){
                this.show1 = false;
                this.show2 = true;
                this.show3 = false;
                this.show4 = false;
            },
            show3m(){
                this.show1 = false;
                this.show2 = false;
                this.show3 = true;
                this.show4 = false;
            },
            show4m(){
                this.show1 = false;
                this.show2 = false;
                this.show3 = false;
                this.show4 = true;
            },
            handle(){
                this.dadata.party({ query: this.zapros, count: 5 })
                    .then((data) => {
                        this.sugg = data.suggestions;
                    })
                    .catch(console.error);
            },
            changeData(item){
                let w = this.$store.getters.worksheet;
                let col = this.$store.getters.columns;
                let row = this.row - 1;
                w[row][col['Найденное наименование подразделения']] = item.value;
                item = item.data;
                w[row][col['ИНН']] = item.inn;
                w[row][col['КПП']] = item.kpp;
                w[row][col['Индекс (при наличии)']] = item.address.data.postal_code;
                w[row][col['Тип населенного пункта (при наличии)']] = item.address.data.settlement_type_full;
                w[row][col['Улица (переулок, проспект, шоссе и пр.)']] = item.address.data.street_with_type;
                w[row][col['Номер дома (включая дробь, корпус и пр.)']] = item.address.data.house;
                this.$store.commit('worksheet', w);
                if(this.row < this.to) {
                    this.row = Number(this.row) + 1;
                } else {
                    this.row = '-1';
                }
                this.zapros = '';
                this.sugg = [];
            },
            start(){
                this.row = this.from;
            },
            skip(){
                if(this.row < this.to) {
                    this.row = Number(this.row) + 1;
                } else {
                    this.row = '-1';
                }
                this.zapros = '';
                this.sugg = [];
            }
        }
	}
</script>

<style>
	#handle {

	}

    #handle .button{
        width: max-content;
		padding: 8px;
		padding-left: 10px;
		padding-right: 10px;
		margin-bottom: 8px;
        margin-top: 0px;
		margin-left: 4px;
		margin-right: 4px;
		background-color: #db6a68;
		border-radius: 20px;
		border: 2px solid white;
		color: white;
		transition: all ease-out 0.5s;
	}

	#handle .button:hover{
		cursor: pointer;
		color: #db6a68;
		background-color: white;
		border: 2px solid #db6a68;
		transition: all ease-out 0.25s;
	}

    #handle .info-box p{
        padding-top: 3px; 
        padding-bottom: 3px;
    }

    #handle .query{
        border: #db6a68 solid 1px;
        margin: 7px;
        margin-left: 15px;
        margin-right: 15px;
    }

    #handle .query:hover{
        background-color: #db6a68;
        cursor: pointer;
    }
</style>