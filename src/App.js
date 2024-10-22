import "./main.scss";
import React, {useState} from "react";
import Userfront, {LoginForm} from "@userfront/toolkit/react";
import {MyModal} from "./components/MyModal";
import DataPage, {HelpModal} from "./components/DataPage";
import {Alerts} from "./components/Data";
import {ItemList} from "./components/ItemList";
import Images, {SimpleViewer} from "./components/Photos";
import {Button, Typography} from "@mui/material";

Userfront.init("6nz5yrvb");

export function Login() {
    const [show, setShow] = useState(false);
    window.login = () => setShow(true);
    return <>
        {!Userfront.user.userUuid ? <Button variant={'contained'} onClick={() => setShow(true)}>Вход</Button> :
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography>{Userfront.user.name}</Typography> <Button
                onClick={() => Userfront.logout()}>Выход</Button></div>}
        <MyModal title={'Вход'} show={show}
                 onHide={() => setShow(false)}>
            <LoginForm theme={{
                "colors": {
                    "light": "#ffffff",
                    "dark": "#5e72e4",
                    "accent": "#13a0ff",
                    "lightBackground": "#fdfdfd",
                    "darkBackground": "#2d2d2d"
                },
                "colorScheme": "light",
                "size": "compact",
                "extras": {"rounded": true, "hideSecuredMessage": true}
            }}/>

        </MyModal></>
}

function App() {
    return (
        <div className="app">
            <div style={{display: 'none'}}><LoginForm></LoginForm></div>
            <HelpModal></HelpModal>
            <Alerts></Alerts>
            <DataPage></DataPage>
            <ItemList></ItemList>
            <Images></Images>
            <SimpleViewer></SimpleViewer>
        </div>
    );
}

export default App;
