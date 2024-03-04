import React, {useState} from 'react';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Window from "./Window";
import {DataFetch} from "./Data";
import {Button} from "@mui/material";
import Dislike from "./Dislike";
import {Like} from "./Like";
import {MyModal} from "./MyModal";

const DataPage = () => {
    const [opened, setOpened] = useState(false);
    const [show, setShow] = useState(false);
    return (
        <>
            {opened && <Button className={'h'} variant="contained" startIcon={<HelpOutlineIcon />}
                sx={{zIndex: 1000, position: 'fixed', bottom: 20, right: 10, height:30  }}
                                   onClick={() => setShow(true)}>Помощь</Button>}
            <MyModal title={'Помощь'} show={show}
                         onHide={() => setShow(false)}>
                <div>
                    <p>Данное приложение предназначено для более удобного и
                        быстрого просмотра объявлений с разных площадок (в данный момент доступен только Авито).
                    </p>
                    <br/>
                    <p>Для начала работы вы должны зайти на сайт Авито (с мобильного устройства через браузер),
                        заполнить фильтры для поиска и скопировать URL на получившуюся страницу с результатами.</p>
                    <br/>
                    <p>
                        В нижней части приложения есть вкладка <b>EXCEL</b> - это таблица с данными об объявлениях. Вы можете фильтровать,
                        сортировать строки в этой таблце, затем выделить нужные строки (или весь столбец)
                        с объявлениями, и они отобразятся на главной странице.
                    </p>
                    <br/>
                    <p>При нажатии кнопки <b>отправить</b> в меню <b>звязаться</b> под объявлением, сообщение будет
                        автоматически отправлено продавцу. На вкладке <b>СООБЩЕНИЯ</b> - ваши сообщения с продавцами.</p>
                    <br/>
                    <p>В верхней части приложения карта с метками - адресами, которые указаны в соответствующих объявлениях. При нажатии
                    на метку на главном экране появится соответствующее объявление.</p>
                    <hr/>
                    <Dislike></Dislike> - убрать объявление из выдачи. (можно вернуть обратно в выпадающем меню <b>Удалённые объявления</b>).
                    <br/>
                    <Like></Like> - добавить объявление в избранные.
                    <hr/>
                    <p>Вкладка <b>История</b> - история последних работ по сбору объявлений.</p>
                    <p>Вкладка <b>Фильтры</b> - ваши слова-фильтры для исключения объявлений из поиска, которые содержат эти слова.
                    Например: трейд-ин, магазин, скупка, Pavilion262 (название магазина).</p>
                </div>
            </MyModal>
            <Window min title={'ОБЪЯВЛЕНИЯ'} callback={setOpened}><DataFetch></DataFetch></Window>
        </>
    );
};

export default DataPage;