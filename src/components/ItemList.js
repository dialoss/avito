import {ItemPreview} from "./ItemPreview";
import {useSelector} from "react-redux";
import {Map} from "./Map";
import "./ItemList.scss"

export const ItemList = () => {
    const {items} = useSelector(state => state);
    return (
        <div className={'item-list'}>
            <Map></Map>
            {
                Object.values(items).map((it, i) => <ItemPreview key={it.id} data={it} index={i + 1}></ItemPreview>)
            }
        </div>
    )
}
