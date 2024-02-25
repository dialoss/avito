import "./User.scss"

export const User = ({user}) => {
    return (
        <div className={'user'}>
            <p>{user.name}</p>
            <div className="rating">
                <p className={'stars'}>{user.score_ratings}<img
                    src="https://www.avito.ru/dstatic/build/assets/65d72b98834d715d.svg" alt=""/></p>
                <p>{user.all_ratings} отзыв</p>
            </div>
            <p>{user.all_ads} объявлений</p>
            {!!user.type && <p><b>{user.type}</b></p>}
            {!!user.date && <p>На Авито с {user.date}</p>}
            {!!user.reply && <p>{user.reply}</p>}
        </div>
    )
}