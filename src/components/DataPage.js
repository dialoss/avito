import React, {useState} from 'react';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Window from "./Window";
import {DataFetch} from "./Data";
import Modal from 'react-bootstrap/Modal';
import {Button} from "@mui/material";
import 'bootstrap/dist/css/bootstrap.min.css';
import Dislike from "./Dislike";
import {Like} from "./Like";


function MyModal({children, title, ...props}) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
}

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
                    <p>Для начала работы вы должны зайти на сайт Авито (с мобильного устройства через браузер),
                        заполнить фильтры для поиска и скопировать URL на получившуюся страницу с результатами.</p>
                    <p>
                        В нижней части экрана есть вкладка <b>EXCEL</b> - это таблица с данными об объявлениях. Вы можете фильтровать,
                        сортировать строки в этой таблце, затем выделить нужные строки (или весь столбец)
                        с объявлениями, и они отобразятся на главной странице.
                    </p>
                    <p>При нажатии кнопки <b>отправить</b> в меню <b>звязаться</b> под объявлением, сообщение будет скопировано
                    в буфер обмена и автоматически откроется окно с объявлением, откуда вы сможете отправить сообщение.</p>
                    <p>В верхней части приложения карта с метками - адресами, которые указаны в соответсвующих объявлениях</p>
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