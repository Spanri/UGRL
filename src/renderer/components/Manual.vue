<template>
	<div id="manual">
        <menu>
            <div></div>
            <div class="button" @click="show1m()" :class="{ active : active_el == 1 }">Начало</div>
            <div class="button" @click="show2m()" :class="{ active : active_el == 2 }">Ввести ключ</div>
            <div class="button" @click="show3m()" :class="{ active : active_el == 3 }">Автоматическая обработка</div>
            <div class="button" @click="show4m()" :class="{ active : active_el == 4 }">Ручная обработка</div>
            <div></div>
        </menu>
        <div style="overflow: auto; max-height: calc(100vh - 150px);">
            <div v-show="show1">
                <p>Шапка должна быть в первой строке.</p>
                <p><strong>Обязательные поля в шапке.</strong> Они должны называться именно так.</p>
                <p>ИНН</p>
                <p>КПП</p>
                <p>Наименование подразделения</p>
                <p>Найденное наименование подразделения</p>
                <p>Наименование субъекта РФ</p>
                <p>Наименование муниципального образования</p>
                <p>Наименование населенного пункта</p>
                <p>Индекс (при наличии)</p>
                <p>Тип населенного пункта (при наличии)</p>
                <p>Улица (переулок, проспект, шоссе и пр.)</p>
                <p>Номер дома (включая дробь, корпус и пр.)</p>
                <p><strong>Заметки.</strong></p>
                <p>Если тыкать на разные вкладки, процесс в других не прекратится.</p>
            </div>
            <div v-show="show2">
                <p>Ключ находится на сайте 
                    <a @click="link('https://dadata.ru')">https://dadata.ru</a> 
                    в вашей учетной записи. Чтобы зарегестрироваться там, нужна любая 
                    почта и доступ к ней.
                </p>
                <!-- <img src="../assets/key.jpg" width='80%'> -->
                <p>Можно ввести другой ключ в любой момент. Эта программа, к сожалению, 
                    не может проверить, закончились ли запросы. Если все строки для 
                    обрабатывания идут в "Плохо", лучше проверить статистику запросов. 
                    Это можно сделать, зайдя на сайт dadata.ru, в личный профиль и нажав 
                    вкладку "Статистика". В последней колонке будет указана информация по 
                    запросам - они там называются подсказки.
                </p>
                <!-- <img src="../assets/stat.jpg" width='80%'> -->
                <p>Подарок: можете попробовать эти ключи. Но тут вы не сможете проследить, 
                    закончились ли там запросы, только если все строки будут плохо 
                    обрабатываться. Я сгенерировала эти ключи с разных почт, но не 
                    пользуюсь ими.
                </p>
                <p>42bc7aea20e070f2ede333449665c27aff4a77da</p>
                <p>38b1c7230e768209a7d2620dfe3ca00ed60d71fd</p>
                <p>Совет: если на вашем аккаунте закончились запросы, 
                    можно зарегистрировать нового пользователя с помощью 
                    временной почты, например, с сайта 
                    <a @click="link('https://10minutemail.net/')">https://10minutemail.net/</a>.
                </p> 
                
            </div>
            <div v-show="show3">
                <p>Введите диапазон и нажмите начать обработку.</p>
                <img src="../assets/diapazon.1.jpg" width='70px'>
                <p>После этого можно нажать кнопку "Начать обработку". 
                    Успешно обработанные строки будут показываться в "Последнее 
                    обработанное". Значения, которые не обработались, 
                    показываются в колонке "Не обработалось". Их можно обработать в ручном 
                    режиме. Кроме того, если их слишком много на экране, можно стереть записи 
                    о не обработанных строках.
                </p>
                <p>Можно прервать обработку. Прерывание сохранит 
                    все строки, которые уже обработались. 
                </p>
                <p>
                    Не забудьте сохранить файл, когда захотите закончить обработку. 
                    Для сохранения есть кнопка "Сохранить файл". Нужно выбрать существующий 
                    файл или написать имя нового. А потом немного подождать. Файл на выходе 
                    будет большой и без стилей, но, думаю, это не такая проблема.
                </p>
            </div>
            <div v-show="show4">
                <p>Нажмите эту кнопку, если хотите обработать пустые строки вручную. 
                    Пустые строки - те, у которых нет ИНН. Сначала нужно ввести диапазон 
                    и нажать кнопку "Начать обработку". Покажется некоторая информация 
                    о строке, нужная (на мой взгляд) для формирования запроса. В поле для 
                    ввода начните вводить запрос. Если запрос будет успешным, в выпадающем 
                    меню будут показываться варианты. Если нажать на один из них, он пометится, 
                    как выбранный и произойдет переход на следующий запрос (вернуться нельзя, 
                    не тыкайте на варианты просто так!). Если хотите пропустить строку, 
                    нажмите на кнопку "Пропустить".
                </p>
            </div>
        </div>
	</div>
</template>

<script>
    var open = require("open");
	export default {
        name: 'manual',
        data: () => ({
            show1: true,
            show2: false,
            show3: false,
            show4: false,
            w: '50%',
            active_el: 1
        }),
		methods: {
            show1m(){
                this.show1 = true;
                this.show2 = false;
                this.show3 = false;
                this.show4 = false;
                this.active_el = 1;
            },
            show2m(){
                this.show1 = false;
                this.show2 = true;
                this.show3 = false;
                this.show4 = false;
                this.active_el = 2;
            },
            show3m(){
                this.show1 = false;
                this.show2 = false;
                this.show3 = true;
                this.show4 = false;
                this.active_el = 3;
            },
            show4m(){
                this.show1 = false;
                this.show2 = false;
                this.show3 = false;
                this.show4 = true;
                this.active_el = 4;
            },
            link(link){
                open(link);
            }
        }
	}
</script>

<style>
	#manual {
	}

    #manual .button{
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

	#manual .button:hover{
		cursor: pointer;
		color: #db6a68;
		background-color: white;
		border: 2px solid #db6a68;
		transition: all ease-out 0.25s;
	}

    #manual menu{
        display: grid;
		grid-template-columns: auto repeat(4, max-content) auto;
    }

    #manual p{
        padding-bottom: 0px;
        padding-top: 5px;
    }

    #manual a{
        text-decoration: #db6a68 underline;
    }

    #manual a:hover{
        color: #db6a68;
        cursor: pointer;
    }

    #manual img{
        margin: 10px;
    }

    #manual .active{
        background-color: #a13836;
    }

    #manual .active:hover{
        background-color: #a13836;
		color: white;
        border: 2px solid white;
        cursor: default;
    }
</style>