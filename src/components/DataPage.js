import React, {useState} from 'react';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Window from "./Window";
import {DataFetch} from "./Data";
import {Button, Stack, TextField} from "@mui/material";
import Dislike from "./Dislike";
import {Like} from "./Like";
import {MyModal} from "./MyModal";
import {useForm} from "react-hook-form";
import {getStorage, setStorage, setStorageOnly, storagePush} from "../store/localStorage";

const DataPage = () => {
    const [opened, setOpened] = useState(false);
    const [show, setShow] = useState(false);
    return (
        <>
            {opened && <Button className={'h'} variant="contained" startIcon={<HelpOutlineIcon/>}
                               sx={{zIndex: 1000, position: 'fixed', bottom: 10, right: 10, height: 30}}
                               onClick={() => setShow(true)}>Помощь</Button>}
            <MyModal title={'Помощь'} show={show}
                     onHide={() => setShow(false)}>
                <div>
                    <p>Данное приложение предназначено для более удобного и
                        быстрого просмотра объявлений с разных площадок (в данный момент доступен только Авито).
                    </p>
                    <br/>
                    <h3>Общая информация</h3>
                    <p>Для начала работы вы должны зайти на сайт Авито (с мобильного устройства через браузер),
                        заполнить фильтры для поиска и скопировать URL на получившуюся страницу с результатами.</p>
                    <br/>
                    <p>
                        В нижней части приложения есть вкладка <b>EXCEL</b> - это таблица с данными об объявлениях. Вы
                        можете фильтровать,
                        сортировать строки в этой таблце, затем выделить нужные строки (или весь столбец)
                        с объявлениями, и они отобразятся на главной странице. Сохранить таблицу в формате xlsx, csv можно в правом верхнем углу: Файл -> Сохранить как
                    </p>
                    <br/>
                    <p>При нажатии кнопки <b>отправить</b> в меню <b>связаться</b> под объявлением, сообщение будет
                        автоматически отправлено продавцу. При нажатии на кнопку <b>перейти в чат</b> - откроется чат с
                        продавцом на сайте.</p>
                    <br/>
                    <p>В верхней части приложения карта с метками - адресами, которые указаны в соответствующих
                        объявлениях. При нажатии
                        на метку на главном экране появится соответствующее объявление. Вы можете перемещать
                        разделительную полосу для
                        уменьшения и увеличения размеров карты</p>
                    <hr/>
                    <h3>Интеграция с Авито</h3>
                    <p>Для того, чтобы отправлять сообщения из этого приложения:
                        <ol>
                            <li><b>С компьютерной версии браузера</b> перейти по <a target={'_blank'}
                                                                                    href="https://www.avito.ru/professionals/tariff/configure?from=professional_tools">ссылке</a> и
                                получить бесплатный avito pro аккаунт.
                            </li>
                            <li>Перейти по <a target={'_blank'}
                                              href="https://www.avito.ru/professionals/api">ссылке</a> и нажать
                                кнопку <b>получить ключи</b>.</li>
                            <li>Скопировать <b>Client_id</b> и <b>Client_secret</b>.</li>
                            <li>Перейти по <a href="https://www.avito.ru/profile/basic">ссылке</a> и скопировать <b>номер профиля</b> (9 цифр, например
                                328 145 761)</li>
                        </ol>
                    </p>
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
                    кэша произойдет удаленые этих данных.
                    <p>Вкладка <b>История</b> - история последних работ по сбору объявлений.</p>
                    <p>Вкладка <b>Фильтры</b> - ваши слова-фильтры для исключения объявлений из поиска, которые содержат
                        эти слова.
                        Например: трейд-ин, магазин, скупка, Pavilion262 (название магазина).</p>
                </div>
            </MyModal>
            <Window min title={'ДАННЫЕ'} callback={setOpened}><DataFetch></DataFetch></Window>
        </>
    );
};

export default DataPage;

const Credentials = () => {
    const {
        register,
        handleSubmit,
    } = useForm();

    function submit(data) {
        data.id = +data.id.replaceAll(' ', '');
        setStorageOnly('avito', data);
    }
    const cred = getStorage('avito', '{client_id: "", client_secret:"",id:""}');

    return (
        <Stack direction={'column'}>
            <form onSubmit={handleSubmit((data) => submit(data))}>
                <TextField {...register('client_id', {required: true, value:cred.client_id})} fullWidth
                           size={'small'} label={'Client_id'} variant="standard"/>
                <TextField {...register('client_secret', {required: true, value:cred.client_secret})} fullWidth
                           size={'small'} label={'Client_secret'} variant="standard"/>
                <TextField {...register('id', {required: true, value:cred.id})} fullWidth
                           size={'small'} label={'Номер профиля'} variant="standard"/>
                <Button variant={'outlined'} type={'submit'}>Подтвердить</Button>
            </form>
        </Stack>
    )
}