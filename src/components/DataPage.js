import React, {useState} from 'react';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Window from "./Window";
import {DataFetch} from "./Data";
import {Button, Stack, TextField} from "@mui/material";
import Dislike from "./Dislike";
import {Like} from "./Like";
import {MyModal} from "./MyModal";
import {useForm} from "react-hook-form";
import {getStorage, setStorageOnly} from "../store/localStorage";
import {triggerEvent, useAddEvent} from "../hooks";

const Image = ({url}) => {
    return (<img src={url} onClick={() => triggerEvent('images:viewer', {images:[url]})} alt=""/>)
}

export const HelpModal = () => {
    const [show, setShow] = useState(false);
    useAddEvent('help', () => setShow(true));
    return (
        <MyModal title={'Помощь'} show={show}
                 onHide={() => setShow(false)}>
            <div className={'data-page'}>
                <p>Данное приложение предназначено для удобного и
                    быстрого просмотра объявлений с разных площадок (в данный момент доступен только Авито).
                </p>
                <br/>
                <h3>Общая информация</h3>
                <p>Для начала работы вы должны зайти на сайт Авито (с мобильного устройства через браузер),
                    заполнить фильтры для поиска и скопировать URL на получившуюся страницу с результатами.</p>
                <Image url={'./filters.png'}></Image>
                <Image url={'./url.png'}></Image>
                <p>Затем вставить полученную ссылку в поле <b>Ссылка из Авито</b> на вкладке <b>ДАННЫЕ</b> и нажать кнопку <b>начать</b>.
                Вы можете задать параметр <b>лимит страниц</b> (на странице 50 объявлений до применения фильтров).</p>
                <br/>
                <p>
                    Вкладка <b>EXCEL</b> - это таблица с данными об объявлениях.
                    Вы можете фильтровать,
                    сортировать строки в этой таблце, затем выделить нужные строки (или весь столбец)
                    с объявлениями, и они отобразятся на главной странице. Сохранить таблицу в формате xlsx, csv
                    можно в левом верхнем углу: Файл -> Сохранить как
                </p>
                <br/>
                <p>В верхней части приложения карта с метками - адресами, которые указаны в соответствующих
                    объявлениях. При нажатии
                    на метку на главном экране появится соответствующее объявление. Вы можете перемещать
                    разделительную полосу для
                    уменьшения и увеличения размеров карты</p>
                <hr/>
                <h3>Интеграция с Авито</h3>
                <p>При нажатии кнопки <b>отправить</b> в меню <b>связаться</b> под объявлением, сообщение будет
                    автоматически отправлено продавцу. При нажатии на кнопку <b>перейти в чат</b> - откроется
                    чат с
                    продавцом на сайте.</p>
                <br/>
                <p>Для того, чтобы отправлять сообщения из этого приложения:</p>
                <ol>
                    <li><b>С компьютерной версии браузера</b> перейти по <a target={'_blank'}
                                                                            href="https://www.avito.ru/professionals/tariff/configure?from=professional_tools">ссылке</a> и
                        получить бесплатный avito pro аккаунт.
                    </li>
                    <li>Перейти по <a target={'_blank'}
                                      href="https://www.avito.ru/professionals/api">ссылке</a> и нажать
                        кнопку <b>получить ключи</b>.
                    </li>
                    <li>Скопировать <b>Client_id</b> и <b>Client_secret</b>.</li>
                    <li>Перейти по <a href="https://www.avito.ru/profile/basic">ссылке</a> и скопировать <b>номер
                        профиля</b> (9 цифр, например
                        328 145 761)
                    </li>
                </ol>
                <Credentials></Credentials>
                <hr/>
                <h3>Действия</h3>
                <Dislike></Dislike> - убрать объявление из выдачи. (можно вернуть обратно в выпадающем меню <b>Удалённые
                объявления</b>).
                <br/>
                <Like></Like> - добавить объявление в избранные.
                <hr/>
                <b>!ВАЖНО</b> история, фильтры, удалённые объявления хранятся в кэше браузера, поэтому, при его
                переустановке или очистке
                кэша произойдет удаление этих данных.
                <p>Вкладка <b>История запросов</b> - история последних работ по сбору объявлений.</p>
                <p>Вкладка <b>Фильтры</b> - ваши слова-фильтры для исключения объявлений из поиска, которые
                    содержат
                    эти слова.
                    Например: трейд-ин, магазин, скупка, Pavilion262 (название магазина).</p>
            </div>
        </MyModal>
    )
}

export const HelpButton = ({pos, id='helpbtn'}) => {
    return (
        <Button id={id} className={'h'} variant="contained" startIcon={<HelpOutlineIcon/>}
                sx={{zIndex: 10, position: 'absolute', height: 30, ...pos}}
                onClick={() => triggerEvent('help')}>Помощь</Button>
    )
}

const DataPage = () => {
    return (
        <>
            <Window min title={'ДАННЫЕ'}><DataFetch></DataFetch></Window>
        </>
    );
};

export default DataPage;

function getCookie(text) {
    const d = JSON.parse(text);
    let s = "";
    for (const cookie of d) {
        s += cookie.name + "=" + cookie.value + "&"
    }
    return s;
}

const Credentials = () => {
    const {
        register, handleSubmit,
    } = useForm();

    function submit(data) {
        data.id = +data.id.replaceAll(' ', '');
        data.cookie = getCookie(data.cookie);
        setStorageOnly('avito', data);
    }

    const cred = getStorage('avito', '{"client_id": "", "client_secret": "", "id": "", "cookie": ""}');
    const fields = ['client_id', 'client_secret', 'id', 'cookie'];
    const labels = ['Client_id', 'Client_secret', 'Номер профиля', 'Cookie'];

    return (<Stack direction={'column'}>
        <form onSubmit={handleSubmit((data) => submit(data))}>
            {fields.map((f, i) =>
                <TextField key={f} {...register(f, {required: true, value: cred[f]})} fullWidth
                           size={'small'} label={labels[i]} variant="standard"/>)}
            <Button variant={'outlined'} type={'submit'}>Подтвердить</Button>
        </form>
    </Stack>)
}