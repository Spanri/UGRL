<template>
	<div id="auto">
        <div class="input">
            <div></div>
            <label>Обработать от </label>
            <input v-model="from">
            <label> до </label>
            <input v-model="to">
            <div></div>
        </div>
        <div class="but">
            <div></div>
            <div 
                class="button" 
                @click="check()"
                v-show="proc">
                Начать обработку
            </div>
            <div 
                class="button" 
                @click="stop()">
                Прекратить обработку
            </div>
            <div></div>
        </div>
        <p>Последнее обработанное: {{now}}</p>
        <div>
            <p style="display: inline-block; padding-right: 5px;">Не обработалось:</p>
            <div class="clear button" @click="clear()">Очистить</div>
        </div>
        <div style="margin: 15px; max-height: calc(100vh - 510px); overflow: auto">
            <p
                v-for="(item, index) in errors" 
                :key="index"
                style="display: inline-block; padding: 5px;">
                {{item}}
            </p>
        </div>
	</div>
</template>

<script>
//var DaData = require('dadata');

export default {
    name: 'auto',
    data: () => ({
        from: '',
        to: '',
        proc: true,
        now: '',
        errors: [],
    }),
    computed: {
        columns(){
            return this.$store.getters.columns;
        },
        key(){
            return this.$store.getters.key;
        }
    },
    methods: {
        async check(){
            this.from = Number(this.from);
            this.to = Number(this.to);
            if(this.from == '' || this.to == ''){
                this.$store.commit('message', 'Вы, кажется, не всё ввели.');
            } else if(isNaN(this.from) || isNaN(this.to) ){
                this.$store.commit('message', 'Вы, кажется, не числа ввели.');
            } else {
                this.$store.commit('message', 'Обрабатываю...');
                this.proc = false;
                await this.proccessing();
                this.$store.commit('message', 'Обработка закончилась. Можно сохранить файл или продолжить обработку.');
                this.proc = true;
            }
        },
        stop(){
            this.to = 0;
        },
        async proccessing(){
            for(let i = this.from; i <= this.to; i++){
                await this.row(i - 1);
                this.now = i;
            }
        },
        clear(){
            while(this.errors.length > 0) {
                this.errors.pop();
            }
        },
        async row(row){
            var self = this;
            let w = this.$store.getters.worksheet;
            const Dadata = require('dadata-suggestions');
            const dadata = new Dadata(this.key);
            let podrazd = w[row][self.columns['Наименование подразделения']],
                INN = w[row][self.columns['ИНН']],
                KPP = w[row][self.columns['КПП']],
                region = w[row][self.columns['Наименование субъекта РФ']],
                rayon = w[row][self.columns['Наименование муниципального образования']],
                nasPunkt = w[row][self.columns['Наименование населенного пункта']],
                index = w[row][self.columns['Индекс (при наличии)']],
                typeOfNasPunkt = w[row][self.columns['Тип населенного пункта (при наличии)']],
                street = w[row][self.columns['Улица (переулок, проспект, шоссе и пр.)']],
                house = w[row][self.columns['Номер дома (включая дробь, корпус и пр.)']],
                newName = w[row][self.columns['Найденное наименование подразделения']];
            //console.log(podrazd);
            let zapros = '',
                result = {success: false, limit: false, empty: false},
                common = false,
                rayonTrue = false,
                b9 = false;
            let podrazd2 = podrazd;
            podrazd = podrazd.split(' ');

            if(region.split(' ')[0] == "Республика") region = region.split(' ')[1];
            else if (region == "город Санкт-Петербург") region = "";
            else region = region.split(' ')[0];
            if(rayon.split(' ')[0] == "Городской") rayon = '';
            let pos = nasPunkt.indexOf('свх ');
            if(pos == 0) {
                nasPunkt = nasPunkt.slice(4);
            }
            pos = nasPunkt.indexOf('свх "');
            if(pos == 0) {
                nasPunkt = nasPunkt.slice(5, -1);
            }
            pos = nasPunkt.indexOf('совхоза ');
            if(pos != -1) {
                if(nasPunkt.indexOf('"') != -1) nasPunkt = nasPunkt.split('"')[1];
                else nasPunkt = nasPunkt.split(' ')[1];
                //console.log(nasPunkt);
            }
            pos = podrazd.indexOf('район');
            let pos2 = podrazd.indexOf('района');
            if(pos != -1 && pos2 == -1) {
                //console.log('ppdrazd '+podrazd);
                rayonTrue = true;
            }

            if(INN == null) {
                // 4548 4554
                if (rayon.split(' ')[0] == "Муниципальный" || rayon.split(' ')[0] == "Сортавальский") rayon = "";
                else rayon = rayon.split(' ')[0];

                // управа москва сокольники - муниципальный округ москва
                if (podrazd[0] == "муниципальный" && podrazd[1] == "округ" && nasPunkt == "Москва"){
                    zapros = "управа москва " + podrazd[2].slice(0, -3);
                }

                // администрация санкт-петербург адмиралтейский - муниципальный округ питер
                else if (podrazd[0] == "муниципальный" && podrazd[1] == "округ" && nasPunkt == "Санкт-Петербург"){
                    zapros = "администрация санкт-петербург " + podrazd[2];
                }

                // администрация севастополь балаклавский орлиное - муниципальный округ севастополь
                else if (podrazd[0] == "муниципальный" && podrazd[1] == "округ" && nasPunkt == "Севастополь"){
                    zapros = "администрация севастополь " + rayon + " " + nasPunkt;
                }

                // администрация кемеровская калтан - городской округ
                else if ((podrazd[0] == "Городской" || podrazd[0] == "городской") && podrazd[1] == "округ"){
                    zapros = "администрация " + region + " " + nasPunkt;
                }

                // администрация москва роговское - поселение Роговское
                else if (podrazd[0] == "поселение"){
                    zapros = "администрация " + nasPunkt + " " + podrazd[1];
                }

                else if (region == "Татарстан"){
                    let nas = nasPunkt.split(' ');
                    if(nas[nas.length - 1] != 'свх' && nas[nas.length - 1].length <= 4) nas = nasPunkt.slice(0, -1);
                    else if(nas[nas.length - 1] != 'свх' && nas[nas.length - 1].length < 4) nas = nasPunkt;
                    else nas = nasPunkt.slice(0, -2);
                    zapros = "совет " + region  + " " + rayon + " " + nas;
                }

                // администрация /регион/ /район/ /город/
                else {
                    let nas = nasPunkt.split(' ');
                    if(nas[nas.length - 1] != 'свх' && nas[nas.length - 1].length == 4) nas = nasPunkt.slice(0, -1);
                    else if(nas[nas.length - 1] != 'свх' && nas[nas.length - 1].length < 4) nas = nasPunkt;
                    else nas = nasPunkt.slice(0, -2);
                    zapros = "администрация " + region  + " " + rayon + " " + nas;
                    common = true;
                }
                
                console.log(zapros);
                await obrabotka(zapros);
            }

            async function obrabotka(zapros){
                var res = false;
                try{
                    await dadata.party({ 
                        query: zapros,
                    })
                    .then(async (data) => {
                        data = data.suggestions;
                        console.log(data.length);
                        if(data.length == 0){
                            if(common != true) self.errors.push(row + 1);
                            else {
                                console.log('data');
                                zapros = "администрация " + region + " " + nasPunkt;
                                await dadata.party({ 
                                    query: zapros,
                                })
                                .then(async (data) => {
                                    console.log(data);
                                    data = data.suggestions;
                                    if(data.length != 0) {
                                        await inTable(data);
                                        console.log(res);
                                        if(res == false) self.errors.push(row + 1);
                                    } else {
                                        console.log('res');
                                        self.errors.push(row + 1);
                                    }
                                })
                                .catch(function(err){
                                    console.log(err);
                                });
                            }
                        }
                        else {
                            await inTable(data);
                            console.log(res);
                            if(res == false) self.errors.push(row + 1);
                        }
                    })
                    .catch(function(err){
                        console.log(err);
                    });
                } catch (err) {
                    console.log(err);
                }
            
                async function inTable(data){
                    //let podrazd2 = podrazd.split(' ');
            
                    for (let i = 0; i < data.length; i++) {
                        let b = data[i].value.indexOf('РАЙОНА');
                        let b2 = data[i].value.indexOf('МР');
                        let b3 = data[i].value.indexOf('РАЙОН');
                        let b4 = data[i].value.indexOf('КОЖУУНА');
                        let b5 = data[i].value.indexOf('ПОСЕЛЕНИЯ');
                        let b6 = data[i].value.indexOf('ПОСЕЛКА');
                        let b7 = data[i].value.indexOf('СЕЛЬСОВЕТА');
                        let b8 = data[i].value.indexOf('ГОРОДА');

                        b9 = false;
                        if(rayon.indexOf( nasPunkt.slice(0, -2) ) != -1) {
                            b9 = true;
                        }

                        let w2;
                        if(b5 == -1 && b6 == -1 && b7 == -1 && b8 == -1) w2 = true;
                        else w2 = false;
                        let c1 = 36 + nasPunkt.length;

                        if (data[i].data.address.data == null || 
                            (rayonTrue == false) ||
                            (rayonTrue == true && w2 == true &&
                                (
                                    (b != -1 && 
                                        ((data[i].value.length - 6 - b) <= 1 && (data[i].value.length - 6 - b) >= 0) || 
                                        ((data[i].value.length - 6 - region.length - b) <= 5 && (data[i].value.length - 6 - region.length - b) >= 0)) || 
                                    (b2 != -1 && 
                                        ((data[i].value.length - 2 - b2) <= 1 && (data[i].value.length - 2 - b2) >= 0) || 
                                        ((data[i].value.length - 2 - region.length - b2) <= 5 && (data[i].value.length - 6 - region.length - b2) >= 0)) ||  
                                    (b3 != -1 && 
                                        ((data[i].value.length - 5 - b3) <= 1 && (data[i].value.length - 5 - b3) >= 0) || 
                                        ((data[i].value.length - 5 - region.length - b3) <= 5 && (data[i].value.length - 6 - region.length - b3) >= 0)) || 
                                    (b4 != -1 && 
                                        ((data[i].value.length - 7 - b4) <= 1 && (data[i].value.length - 7 - b4) >= 0) || 
                                        ((data[i].value.length - 7 - region.length - b4) <= 5 && (data[i].value.length - 6 - region.length - b4) >= 0)) 
                                )
                            )
                        ) {
                            console.log('da');
                            newName = data[i].value;
                            data = data[i].data;
                            res = true;
                            // сохраняем данные в таблицу
                            INN = data.inn;
                            KPP = data.kpp;
                            let st = false;
                            if(data.address.data == null) {
                                let d = data.address.value.split(', ');
                                d = d.map(k => k.toLowerCase());
                                // индекс
                                index = d[0];
                                d.forEach((key,i) => {
                                    let a = key.split(' ');
                                    a.forEach(key2 => {
                                        if(key2 == 'улица' || key2 == 'переулок' || key2 == 'бульвар' || 
                                            key2 == 'набережная' || key2 == 'площадь' || key2 == 'проезд' || 
                                            key2 == 'просека' || key2 == 'проспект' || key2 == 'тупик' || 
                                            key2 == 'шоссе' || key2 == 'аллея') {
                                            street = key;
                                            //если нашлась улица, значит следующее a - дом
                                            house = d[i+1];
                                            st = true;
                                        }
                                        if(key2 == 'корпус') {
                                            house = 'к ' + d[i+1];
                                            st = true;
                                        }
                                    });
                                });
                            } else {
                                index = data.address.data.postal_code;
                                typeOfNasPunkt = data.address.data.settlement_type_full;
                                street = data.address.data.street_with_type;
                                house = data.address.data.house;
                            }
                            w[row][self.columns['ИНН']] = INN;
                            w[row][self.columns['КПП']] = KPP;
                            w[row][self.columns['Индекс (при наличии)']] = index;
                            w[row][self.columns['Тип населенного пункта (при наличии)']] = typeOfNasPunkt;
                            w[row][self.columns['Улица (переулок, проспект, шоссе и пр.)']] = street;
                            w[row][self.columns['Номер дома (включая дробь, корпус и пр.)']] = house;
                            w[row][self.columns['Найденное наименование подразделения']] = newName;
                            self.$store.commit('worksheet', w);
                            //console.log(w);
                            break;
                        } else {
                            console.log('эта подсказка не подошла');
                        }
                    }
                }
            }
        },
    }
}
</script>

<style>
	#auto {
        display: grid;
		grid-template-rows: repeat(5, max-content) auto;
	}

    #auto .button{
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

	#auto .button:hover{
		cursor: pointer;
		color: #db6a68;
		background-color: white;
		border: 2px solid #db6a68;
		transition: all ease-out 0.25s;
	}

    .input{
        display: grid;
		grid-template-columns: auto repeat(4, max-content) auto;
        margin: 7px;
    }

    .input label{
        padding: 5px;
    }

    .input input{
        max-width: 80px;
    }

    .but{
        display: grid;
		grid-template-columns: auto repeat(2, max-content) auto;
    }

    #auto .clear{
        width: max-content;
        display: inline-block;
        margin: 0;
        padding: 5px;
        padding-left: 7px;
        padding-right: 7px;
    }
</style>